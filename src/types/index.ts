import type {
  NewsArticleSelect,
  NewsArticleInsert,
  StationSelect,
  StationInsert,
  SegmentSelect,
  SegmentInsert,
  StationScheduleSelect,
  StationScheduleInsert,
  ApplicationSelect,
  ApplicationInsert,
} from "@/lib/schema";

// Friendly type names
export type NewsArticle = NewsArticleSelect;
export type NewNewsArticle = NewsArticleInsert;

export type Station = StationSelect;
export type NewStation = StationInsert;

export type Segment = SegmentSelect;
export type NewSegment = SegmentInsert;

export type StationSchedule = StationScheduleSelect;
export type NewStationSchedule = StationScheduleInsert;

export type Application = ApplicationSelect;
export type NewApplication = ApplicationInsert;

// Additional types for JSON fields
export interface Attachment {
  id: string;
  type: string;
  name: string;
  url: string;
  description?: string;
  source?: string;
}

export interface Link {
  id: string;
  url: string;
  description?: string;
  verified?: boolean;
}

export interface EditorialNote {
  role: string;
  action: string;
  timestamp: string;
  content: string;
}

export interface PublishingDetails {
  publishedDateTime: string;
  selectedChannels: string[];
  publisherNotes?: string;
}

export interface PerformanceMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
}

// Station with schedules (for API responses)
export interface StationWithSchedules extends Station {
  schedules: StationSchedule[];
}

// Station with schedules and segments
export interface StationWithDetails extends StationWithSchedules {
  segments: Segment[];
}

// Station creation data (includes schedules for API)
export interface CreateStationData extends NewStation {
  schedules?: Omit<NewStationSchedule, "stationId">[];
}
