import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import type { NewApplication } from "@/types";

// GET /api/applications - List all applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let result;
    if (status) {
      result = await db
        .select()
        .from(applications)
        .where(eq(applications.currentStatus, status))
        .orderBy(desc(applications.id));
    } else {
      result = await db
        .select()
        .from(applications)
        .orderBy(desc(applications.id));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/applications - Create a new application
export async function POST(request: NextRequest) {
  try {
    const body: NewApplication = await request.json();

    // Generate applicationId if not provided
    const today = new Date().toISOString().split("T")[0];
    const year = new Date().getFullYear();
    const count = await db.select().from(applications);
    const appNumber = String(count.length + 1).padStart(3, "0");

    const data: NewApplication = {
      ...body,
      applicationId: body.applicationId || `APP-${year}-${appNumber}`,
      currentStatus: body.currentStatus || "Document Assessment",
      statusColor: body.statusColor || "warning",
      submissionDate: body.submissionDate || today,
      overallProgress: body.overallProgress ?? 0,
    };

    const [application] = await db.insert(applications).values(data).returning();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
