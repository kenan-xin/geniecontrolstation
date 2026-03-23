"use client";

import { StickyNote, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle, EditorialNote } from "@/types";

const roleColors: Record<string, string> = {
  "Junior Editorial": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "Senior Editorial": "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
  Publisher: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
};

const actionColors: Record<string, string> = {
  "Submitted for Approval": "text-blue-600",
  Approved: "text-emerald-600",
  Rejected: "text-red-600",
  "Pushed Back": "text-amber-600",
  Reverted: "text-orange-600",
  Published: "text-emerald-600",
  Submitted: "text-slate-600",
};

interface EditorialNotesSectionProps {
  article: NewsArticle;
  highlightedNote?: string;
}

export function EditorialNotesSection({
  article,
  highlightedNote,
}: EditorialNotesSectionProps) {
  const notes: EditorialNote[] = article.editorialNotes
    ? JSON.parse(article.editorialNotes)
    : [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <StickyNote className="size-4 text-primary" />
          Editorial Notes
          {notes.length > 0 && (
            <Badge variant="secondary" className="ml-auto font-normal">
              {notes.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Highlighted note (e.g., Junior Editorial notes in Approval stage) */}
        {highlightedNote && (
          <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={roleColors["Junior Editorial"]}
              >
                Junior Editorial
              </Badge>
              <span className="text-xs text-muted-foreground">
                Latest Review
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {highlightedNote}
            </p>
          </div>
        )}

        {notes.length === 0 && !highlightedNote ? (
          <p className="text-sm text-muted-foreground italic">
            No editorial notes yet
          </p>
        ) : (
          <div className="space-y-4">
            {[...notes].reverse().map((note, index) => (
              <div
                key={index}
                className="relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-border"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge
                    variant="outline"
                    className={roleColors[note.role] || "bg-muted"}
                  >
                    {note.role}
                  </Badge>
                  <span
                    className={`text-xs font-medium ${
                      actionColors[note.action] || "text-muted-foreground"
                    }`}
                  >
                    {note.action}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Clock className="size-3" />
                  {note.timestamp}
                </div>
                {note.content && (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-md p-3">
                    {note.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
