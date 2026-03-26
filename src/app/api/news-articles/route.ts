import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsArticles } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import type { NewNewsArticle } from "@/types";

// JSON field names that need parsing
const JSON_FIELDS = [
  "attachments",
  "links",
  "editorialNotes",
  "publishingDetails",
  "performanceMetrics",
] as const;

// Helper to parse JSON fields
function parseJsonFields<T extends Record<string, unknown>>(article: T): T {
  const parsed = { ...article };
  for (const field of JSON_FIELDS) {
    const value = parsed[field];
    if (typeof value === "string" && value) {
      try {
        (parsed as Record<string, unknown>)[field] = JSON.parse(value);
      } catch {
        // Keep original value if parse fails
      }
    }
  }
  return parsed;
}

// Helper to stringify JSON fields
function stringifyJsonFields<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data } as Record<string, unknown>;
  for (const field of JSON_FIELDS) {
    const value = result[field];
    if (value !== undefined && value !== null && typeof value !== "string") {
      result[field] = JSON.stringify(value);
    }
  }
  return result as T;
}

// GET /api/news-articles - List all articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let articles;
    if (status) {
      articles = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.currentStatus, status))
        .orderBy(desc(newsArticles.id));
    } else {
      articles = await db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.id));
    }

    // Parse JSON fields
    const parsedArticles = articles.map(parseJsonFields);

    return NextResponse.json(parsedArticles);
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}

// POST /api/news-articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    const body: NewNewsArticle = await request.json();

    // Set defaults
    const today = new Date().toISOString().split("T")[0];
    const data: NewNewsArticle = {
      ...body,
      currentStatus: body.currentStatus || "Unverified",
      statusColor: body.statusColor || "error",
      submissionDate: body.submissionDate || today,
      attachments: body.attachments
        ? typeof body.attachments === "string"
          ? body.attachments
          : JSON.stringify(body.attachments)
        : null,
      links: body.links
        ? typeof body.links === "string"
          ? body.links
          : JSON.stringify(body.links)
        : null,
      editorialNotes: body.editorialNotes
        ? typeof body.editorialNotes === "string"
          ? body.editorialNotes
          : JSON.stringify(body.editorialNotes)
        : null,
      publishingDetails: body.publishingDetails
        ? typeof body.publishingDetails === "string"
          ? body.publishingDetails
          : JSON.stringify(body.publishingDetails)
        : null,
      performanceMetrics: body.performanceMetrics
        ? typeof body.performanceMetrics === "string"
          ? body.performanceMetrics
          : JSON.stringify(body.performanceMetrics)
        : null,
    };

    const [article] = await db.insert(newsArticles).values(data).returning();

    return NextResponse.json(parseJsonFields(article), { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}
