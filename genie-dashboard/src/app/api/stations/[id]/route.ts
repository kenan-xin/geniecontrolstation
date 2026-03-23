import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stations, stationSchedules, segments } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/stations/[id] - Get single station with schedules
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [station] = await db
      .select()
      .from(stations)
      .where(eq(stations.id, stationId));

    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Fetch schedules
    const schedules = await db
      .select()
      .from(stationSchedules)
      .where(eq(stationSchedules.stationId, stationId));

    return NextResponse.json({ ...station, schedules });
  } catch (error) {
    console.error("Error fetching station:", error);
    return NextResponse.json(
      { error: "Failed to fetch station" },
      { status: 500 }
    );
  }
}

// PUT /api/stations/[id] - Update station
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if station exists
    const [existing] = await db
      .select()
      .from(stations)
      .where(eq(stations.id, stationId));

    if (!existing) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    const body = await request.json();
    const { schedules, ...stationData } = body;

    // Update station
    const [updated] = await db
      .update(stations)
      .set({
        ...stationData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(stations.id, stationId))
      .returning();

    // If schedules provided, delete existing and re-insert
    let updatedSchedules: typeof stationSchedules.$inferSelect[] = [];
    if (schedules !== undefined) {
      // Delete existing schedules
      await db
        .delete(stationSchedules)
        .where(eq(stationSchedules.stationId, stationId));

      // Insert new schedules
      if (schedules && schedules.length > 0) {
        const schedulesWithStationId = schedules.map(
          (schedule: { dayOfWeek: string; startTime: string; endTime: string; programName: string }) => ({
            ...schedule,
            stationId,
          })
        );
        updatedSchedules = await db
          .insert(stationSchedules)
          .values(schedulesWithStationId)
          .returning();
      }
    } else {
      // Fetch existing schedules if not updating
      updatedSchedules = await db
        .select()
        .from(stationSchedules)
        .where(eq(stationSchedules.stationId, stationId));
    }

    return NextResponse.json({ ...updated, schedules: updatedSchedules });
  } catch (error) {
    console.error("Error updating station:", error);
    return NextResponse.json(
      { error: "Failed to update station" },
      { status: 500 }
    );
  }
}

// DELETE /api/stations/[id] - Delete station with cascade
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if station exists
    const [existing] = await db
      .select()
      .from(stations)
      .where(eq(stations.id, stationId));

    if (!existing) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Delete schedules (cascade manually)
    await db
      .delete(stationSchedules)
      .where(eq(stationSchedules.stationId, stationId));

    // Delete segments (cascade manually)
    await db.delete(segments).where(eq(segments.stationId, stationId));

    // Delete station
    await db.delete(stations).where(eq(stations.id, stationId));

    return NextResponse.json({ message: "Station deleted successfully" });
  } catch (error) {
    console.error("Error deleting station:", error);
    return NextResponse.json(
      { error: "Failed to delete station" },
      { status: 500 }
    );
  }
}
