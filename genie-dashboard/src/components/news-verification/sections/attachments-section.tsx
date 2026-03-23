"use client";

import { Paperclip, Image, Video, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle, Attachment } from "@/types";

// Helper to safely parse JSON that may already be an object
function safeJsonParse<T>(value: T | string | null): T | null {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

interface AttachmentsSectionProps {
  article: NewsArticle;
}

function getAttachmentIcon(type: string) {
  const lower = type.toLowerCase();
  if (lower.startsWith("image/") || lower === "image") return Image;
  if (lower.startsWith("video/") || lower === "video") return Video;
  return FileText;
}

export function AttachmentsSection({ article }: AttachmentsSectionProps) {
  const attachments: Attachment[] = safeJsonParse<Attachment[]>(article.attachments) || [];

  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Paperclip className="size-4 text-primary" />
            Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No attachments provided
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          Attachments
          <Badge variant="secondary" className="ml-auto font-normal">
            {attachments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment) => {
            const Icon = getAttachmentIcon(attachment.type);
            const isImage = attachment.type.toLowerCase().startsWith("image/");

            return (
              <div
                key={attachment.id}
                className="group relative flex gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {/* Preview/Icon */}
                <div className="shrink-0 size-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {isImage ? (
                    <div className="size-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                      <Image className="size-6 text-primary/40" />
                    </div>
                  ) : (
                    <Icon className="size-6 text-muted-foreground" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {attachment.name}
                    </p>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="size-3.5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>
                  {attachment.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {attachment.description}
                    </p>
                  )}
                  {attachment.source && (
                    <Badge variant="outline" className="mt-1.5 font-normal text-xs">
                      {attachment.source}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
