"use client";

import { CalendarClock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PublishingDetails } from "@/types";

const channelColors: Record<string, string> = {
  website: "bg-blue-500/10 text-blue-600 border-blue-200",
  facebook: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  twitter: "bg-sky-500/10 text-sky-600 border-sky-200",
  instagram: "bg-pink-500/10 text-pink-600 border-pink-200",
  linkedin: "bg-blue-600/10 text-blue-700 border-blue-300",
  youtube: "bg-red-500/10 text-red-600 border-red-200",
  email: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  telegram: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  newspaper: "bg-slate-500/10 text-slate-600 border-slate-200",
  rss: "bg-orange-500/10 text-orange-600 border-orange-200",
};

const channelLabels: Record<string, string> = {
  website: "Website",
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  email: "Email Newsletter",
  telegram: "Telegram",
  newspaper: "Newspaper",
  rss: "RSS Feed",
};

interface PublishingDetailsSectionProps {
  details: PublishingDetails | null;
}

export function PublishingDetailsSection({
  details,
}: PublishingDetailsSectionProps) {
  if (!details) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            Publishing Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No publishing details available
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = details.publishedDateTime
    ? new Date(details.publishedDateTime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Not scheduled";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          Publishing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Published Date & Time
          </span>
          <p className="text-sm font-medium text-foreground">{formattedDate}</p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">
            Distribution Channels
          </span>
          <div className="flex flex-wrap gap-2">
            {details.selectedChannels?.length > 0 ? (
              details.selectedChannels.map((channel) => (
                <Badge
                  key={channel}
                  variant="outline"
                  className={`font-normal ${
                    channelColors[channel] || "bg-muted"
                  }`}
                >
                  <Check className="size-3 mr-1" />
                  {channelLabels[channel] || channel}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">
                No channels selected
              </span>
            )}
          </div>
        </div>

        {details.publisherNotes && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Publisher Notes
            </span>
            <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-md p-3">
              {details.publisherNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
