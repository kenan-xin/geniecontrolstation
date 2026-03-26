"use client";

import { useState } from "react";
import { CalendarClock, Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const channels = [
  { id: "website", label: "Website" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "email", label: "Email Newsletter" },
  { id: "telegram", label: "Telegram" },
  { id: "newspaper", label: "Newspaper" },
  { id: "rss", label: "RSS Feed" },
];

interface PublishingScheduleSectionProps {
  scheduleData: {
    publishedDateTime: string;
    selectedChannels: string[];
    publisherNotes: string;
  };
  onChange: (data: {
    publishedDateTime: string;
    selectedChannels: string[];
    publisherNotes: string;
  }) => void;
  readOnly?: boolean;
  confirmed?: boolean;
  onRegeneratePublisherNotes?: () => void;
}

export function PublishingScheduleSection({
  scheduleData,
  onChange,
  readOnly = false,
  confirmed = false,
  onRegeneratePublisherNotes,
}: PublishingScheduleSectionProps) {
  const handleChannelToggle = (channelId: string) => {
    if (readOnly) return;
    const newChannels = scheduleData.selectedChannels.includes(channelId)
      ? scheduleData.selectedChannels.filter((c) => c !== channelId)
      : [...scheduleData.selectedChannels, channelId];
    onChange({ ...scheduleData, selectedChannels: newChannels });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          Publishing Schedule
          {confirmed && (
            <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 font-normal">
              <Check className="size-3 mr-1" />
              Scheduled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Publication Date & Time
          </Label>
          <Input
            type="datetime-local"
            value={scheduleData.publishedDateTime}
            onChange={(e) =>
              onChange({ ...scheduleData, publishedDateTime: e.target.value })
            }
            disabled={readOnly}
            className={cn(readOnly && "bg-muted/50")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Distribution Channels
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {channels.map((channel) => {
              const isSelected = scheduleData.selectedChannels.includes(
                channel.id
              );
              return (
                <label
                  key={channel.id}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-md border cursor-pointer transition-all",
                    isSelected
                      ? "bg-primary/5 border-primary/30"
                      : "bg-muted/30 border-border hover:bg-muted/50",
                    readOnly && "cursor-default"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleChannelToggle(channel.id)}
                    disabled={readOnly}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{channel.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">
              Publisher Notes
            </Label>
            {onRegeneratePublisherNotes && !readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegeneratePublisherNotes}
                className="h-7 gap-1 text-xs"
              >
                <Sparkles className="h-3 w-3" />
                Regenerate AI Notes
              </Button>
            )}
          </div>
          <Textarea
            value={scheduleData.publisherNotes}
            onChange={(e) =>
              onChange({ ...scheduleData, publisherNotes: e.target.value })
            }
            placeholder="Add notes about the publication..."
            rows={4}
            disabled={readOnly}
            className={cn(readOnly && "bg-muted/50")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
