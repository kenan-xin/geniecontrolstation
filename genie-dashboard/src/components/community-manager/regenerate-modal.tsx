"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateSegment } from "@/hooks/use-segments";
import { callTextPodcastAPI } from "@/lib/audio-utils";
import type { Segment } from "@/types";
import { toast } from "sonner";

interface RegenerateModalProps {
  segment: Segment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: number;
}

export function RegenerateModal({
  segment,
  open,
  onOpenChange,
  stationId,
}: RegenerateModalProps) {
  const updateSegment = useUpdateSegment();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset prompt when modal opens
  useEffect(() => {
    if (open) {
      setPrompt("");
    }
  }, [open]);

  const handleRegenerate = async () => {
    if (!segment) return;

    if (!segment.clipUrl) {
      toast.error("No audio clip available for regeneration");
      return;
    }

    setIsSubmitting(true);
    try {
      // Fetch the audio clip
      const response = await fetch(segment.clipUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio clip");
      }
      const audioBlob = await response.blob();

      // Call the transcription API
      const result = await callTextPodcastAPI(audioBlob);

      // Update the segment with new data
      await updateSegment.mutateAsync({
        id: segment.id,
        stationId,
        data: {
          srt: result.text,
          segmentCategory: result.category,
          agentResponse: result.content,
        },
      });

      toast.success("AI analysis regenerated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to regenerate:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to regenerate AI analysis"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasClip = segment?.clipUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="size-5 text-primary" />
            Regenerate AI Analysis
          </DialogTitle>
          <DialogDescription>
            Re-process the audio clip to generate new transcription and AI post.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current data preview */}
          {segment && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Current Transcription
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {segment.srt || "No transcription"}
                </p>
              </div>
              {segment.agentResponse && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Current Post
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {segment.agentResponse}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No clip warning */}
          {!hasClip && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                No audio clip available for regeneration. The segment must have a
                recorded audio clip to regenerate.
              </AlertDescription>
            </Alert>
          )}

          {/* Optional prompt */}
          <div className="grid gap-2">
            <Label htmlFor="prompt">Additional Instructions (Optional)</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g., Focus on key news topics, make the post more engaging"
              className="resize-none"
              disabled={isSubmitting || !hasClip}
            />
            <p className="text-xs text-muted-foreground">
              Provide specific instructions for the AI to customize the output.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegenerate}
            disabled={isSubmitting || !hasClip}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
            Regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
