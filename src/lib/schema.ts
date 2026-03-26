import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// News Articles table
export const newsArticles = sqliteTable("news_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  submissionDate: text("submission_date").notNull(),
  currentStatus: text("current_status").notNull().default("Unverified"),
  statusColor: text("status_color").notNull().default("error"),
  sources: text("sources"),
  assignedTo: text("assigned_to"),
  submitterFullName: text("submitter_full_name"),
  submitterIc: text("submitter_ic"),
  submitterAddress: text("submitter_address"),
  submitterPhone: text("submitter_phone"),
  submitterEmail: text("submitter_email"),
  storyTitle: text("story_title"),
  storyDescription: text("story_description"),
  storyCategory: text("story_category"),
  storyUrgency: text("story_urgency"),
  storyEstimatedImpact: text("story_estimated_impact"),
  attachments: text("attachments"),
  links: text("links"),
  editorialNotes: text("editorial_notes"),
  juniorEditorialNotes: text("junior_editorial_notes"),
  seniorEditorialNotes: text("senior_editorial_notes"),
  publishedDate: text("published_date"),
  publishingDetails: text("publishing_details"),
  performanceMetrics: text("performance_metrics"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// Stations table
export const stations = sqliteTable("stations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  url: text("url"),
  segmentDuration: integer("segment_duration").notNull().default(60),
  logo: text("logo"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// Segments table
export const segments = sqliteTable("segments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stationId: integer("station_id")
    .notNull()
    .references(() => stations.id),
  fromTime: text("from_time").notNull(),
  toTime: text("to_time").notNull(),
  srt: text("srt"),
  segmentCategory: text("segment_category"),
  agentResponse: text("agent_response"),
  clipUrl: text("clip_url"),
  shared: integer("shared", { mode: "boolean" }).notNull().default(false),
  sharedPlatforms: text("shared_platforms"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// Station Schedules table
export const stationSchedules = sqliteTable("station_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stationId: integer("station_id")
    .notNull()
    .references(() => stations.id),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  programName: text("program_name").notNull(),
});

// Applications table
export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: text("application_id"),
  candidateName: text("candidate_name").notNull(),
  submissionDate: text("submission_date").notNull(),
  overallProgress: integer("overall_progress").notNull().default(0),
  currentStatus: text("current_status").notNull().default("Document Assessment"),
  statusColor: text("status_color").default("warning"),
  assignedTo: text("assigned_to"),
  trainingProvider: text("training_provider"),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// Type exports using InferSelectModel and InferInsertModel
export type NewsArticleSelect = typeof newsArticles.$inferSelect;
export type NewsArticleInsert = typeof newsArticles.$inferInsert;

export type StationSelect = typeof stations.$inferSelect;
export type StationInsert = typeof stations.$inferInsert;

export type SegmentSelect = typeof segments.$inferSelect;
export type SegmentInsert = typeof segments.$inferInsert;

export type StationScheduleSelect = typeof stationSchedules.$inferSelect;
export type StationScheduleInsert = typeof stationSchedules.$inferInsert;

export type ApplicationSelect = typeof applications.$inferSelect;
export type ApplicationInsert = typeof applications.$inferInsert;
