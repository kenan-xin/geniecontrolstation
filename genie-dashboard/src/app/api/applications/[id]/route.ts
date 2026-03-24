import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/applications/[id] - Get single application
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const appId = parseInt(id, 10);

    if (isNaN(appId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, appId));

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] - Update application (partial update)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const appId = parseInt(id, 10);

    if (isNaN(appId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if application exists
    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, appId));

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const body = await request.json();

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const [updated] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, appId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const appId = parseInt(id, 10);

    if (isNaN(appId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if application exists
    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, appId));

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await db.delete(applications).where(eq(applications.id, appId));

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
