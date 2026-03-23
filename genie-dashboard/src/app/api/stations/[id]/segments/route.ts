import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { segments } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import type { NewSegment } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to parse sharedPlatforms JSON field
function parseSegment<T extends { sharedPlatforms: unknown }>(segment: T): T {
  if (typeof segment.sharedPlatforms === "string" && segment.sharedPlatforms) {
    try {
      return { ...segment, sharedPlatforms: JSON.parse(segment.sharedPlatforms) };
    } catch {
      // Keep original value if parse fails
    }
  }
  return segment;
}

// GET /api/stations/[id]/segments - List segments for a station
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json({ error: "Invalid station ID" }, { status: 400 });
    }

    const stationSegments = await db
      .select()
      .from(segments)
      .where(eq(segments.stationId, stationId))
      .orderBy(desc(segments.fromTime));

    // Parse sharedPlatforms JSON field
    const parsedSegments = stationSegments.map(parseSegment);

    return NextResponse.json(parsedSegments);
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

// POST /api/stations/[id]/segments - Create a new segment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json({ error: "Invalid station ID" }, { status: 400 });
    }

    const body: NewSegment = await request.json();
    const data: NewSegment = {
      ...body,
      stationId,
      sharedPlatforms: body.sharedPlatforms
        ? typeof body.sharedPlatforms === "string"
          ? body.sharedPlatforms
          : JSON.stringify(body.sharedPlatforms)
        : null,
    };

    const [segment] = await db.insert(segments).values(data).returning();

    return NextResponse.json(parseSegment(segment), { status: 201 });
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json(
      { error: "Failed to create segment" },
      { status: 500 }
    );
  }
}
