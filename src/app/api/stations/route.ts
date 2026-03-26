import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stations, stationSchedules } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET /api/stations - List all stations with schedules
export async function GET() {
  try {
    const allStations = await db.select().from(stations);

    // Fetch schedules for each station
    const stationsWithSchedules = await Promise.all(
      allStations.map(async (station) => {
        const schedules = await db
          .select()
          .from(stationSchedules)
          .where(eq(stationSchedules.stationId, station.id));
        return { ...station, schedules };
      })
    );

    return NextResponse.json(stationsWithSchedules);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}

// POST /api/stations - Create a new station
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedules, ...stationData } = body;

    // Insert station
    const [station] = await db.insert(stations).values(stationData).returning();

    // Insert schedules if provided
    let insertedSchedules: typeof stationSchedules.$inferSelect[] = [];
    if (schedules && schedules.length > 0) {
      const schedulesWithStationId = schedules.map(
        (schedule: { dayOfWeek: string; startTime: string; endTime: string; programName: string }) => ({
          ...schedule,
          stationId: station.id,
        })
      );
      insertedSchedules = await db
        .insert(stationSchedules)
        .values(schedulesWithStationId)
        .returning();
    }

    return NextResponse.json(
      { ...station, schedules: insertedSchedules },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating station:", error);
    return NextResponse.json(
      { error: "Failed to create station" },
      { status: 500 }
    );
  }
}
