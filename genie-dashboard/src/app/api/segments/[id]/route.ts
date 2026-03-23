import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { segments } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to parse sharedPlatforms JSON field
function parseSegment(segment: Record<string, unknown>) {
  const parsed = { ...segment };
  if (typeof parsed.sharedPlatforms === "string" && parsed.sharedPlatforms) {
    try {
      parsed.sharedPlatforms = JSON.parse(parsed.sharedPlatforms as string);
    } catch {
      // Keep original value if parse fails
    }
  }
  return parsed;
}

// Helper to stringify sharedPlatforms
function stringifySegment(data: Record<string, unknown>) {
  const result = { ...data };
  if (
    result.sharedPlatforms !== undefined &&
    result.sharedPlatforms !== null &&
    typeof result.sharedPlatforms !== "string"
  ) {
    result.sharedPlatforms = JSON.stringify(result.sharedPlatforms);
  }
  return result;
}

// PUT /api/segments/[id] - Update segment
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const segmentId = parseInt(id, 10);

    if (isNaN(segmentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if segment exists
    const [existing] = await db
      .select()
      .from(segments)
      .where(eq(segments.id, segmentId));

    if (!existing) {
      return NextResponse.json({ error: "Segment not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData = stringifySegment(body);

    const [updated] = await db
      .update(segments)
      .set(updateData)
      .where(eq(segments.id, segmentId))
      .returning();

    return NextResponse.json(parseSegment(updated));
  } catch (error) {
    console.error("Error updating segment:", error);
    return NextResponse.json(
      { error: "Failed to update segment" },
      { status: 500 }
    );
  }
}

// DELETE /api/segments/[id] - Delete segment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const segmentId = parseInt(id, 10);

    if (isNaN(segmentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if segment exists
    const [existing] = await db
      .select()
      .from(segments)
      .where(eq(segments.id, segmentId));

    if (!existing) {
      return NextResponse.json({ error: "Segment not found" }, { status: 404 });
    }

    await db.delete(segments).where(eq(segments.id, segmentId));

    return NextResponse.json({ message: "Segment deleted successfully" });
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      { error: "Failed to delete segment" },
      { status: 500 }
    );
  }
}
