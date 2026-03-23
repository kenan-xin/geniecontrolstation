import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsArticles } from "@/lib/schema";
import { eq } from "drizzle-orm";

// JSON field names that need parsing
const JSON_FIELDS = [
  "attachments",
  "links",
  "editorialNotes",
  "publishingDetails",
  "performanceMetrics",
] as const;

// Helper to parse JSON fields
function parseJsonFields(article: Record<string, unknown>) {
  const parsed = { ...article };
  for (const field of JSON_FIELDS) {
    const value = parsed[field];
    if (typeof value === "string" && value) {
      try {
        parsed[field] = JSON.parse(value);
      } catch {
        // Keep original value if parse fails
      }
    }
  }
  return parsed;
}

// Helper to stringify JSON fields
function stringifyJsonFields(data: Record<string, unknown>) {
  const result = { ...data };
  for (const field of JSON_FIELDS) {
    const value = result[field];
    if (value !== undefined && value !== null && typeof value !== "string") {
      result[field] = JSON.stringify(value);
    }
  }
  return result;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/news-articles/[id] - Get single article
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, articleId));

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(parseJsonFields(article));
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      { error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}

// PUT /api/news-articles/[id] - Update article (partial update)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if article exists
    const [existing] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, articleId));

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const body = await request.json();

    // Merge with existing data and stringify JSON fields
    const updateData = stringifyJsonFields({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    const [updated] = await db
      .update(newsArticles)
      .set(updateData)
      .where(eq(newsArticles.id, articleId))
      .returning();

    return NextResponse.json(parseJsonFields(updated));
  } catch (error) {
    console.error("Error updating news article:", error);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

// DELETE /api/news-articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if article exists
    const [existing] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, articleId));

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.delete(newsArticles).where(eq(newsArticles.id, articleId));

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting news article:", error);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}
