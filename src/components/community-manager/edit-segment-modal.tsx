"use client";

import { useState, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateSegment } from "@/hooks/use-segments";
import type { Segment } from "@/types";
import { toast } from "sonner";

// Segment categories
const SEGMENT_CATEGORIES = [
  "Community",
  "Traffic",
  "Interview",
  "Music",
  "News",
  "Entertainment",
  "Sports",
  "Weather",
];

interface EditSegmentModalProps {
  segment: Segment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: number;
}

export function EditSegmentModal({
  segment,
  open,
  onOpenChange,
  stationId,
}: EditSegmentModalProps) {
  const updateSegment = useUpdateSegment();
  const [formData, setFormData] = useState({
    srt: "",
    segmentCategory: "",
    agentResponse: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when segment changes
  useEffect(() => {
    if (segment) {
      setFormData({
        srt: segment.srt ?? "",
        segmentCategory: segment.segmentCategory ?? "",
        agentResponse: segment.agentResponse ?? "",
      });
    }
  }, [segment]);

  const handleSubmit = async () => {
    if (!segment) return;

    setIsSubmitting(true);
    try {
      await updateSegment.mutateAsync({
        id: segment.id,
        stationId,
        data: {
          srt: formData.srt,
          segmentCategory: formData.segmentCategory || null,
          agentResponse: formData.agentResponse || null,
        },
      });
      toast.success("Segment updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update segment:", error);
      toast.error("Failed to update segment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-primary" />
            Edit Segment
          </DialogTitle>
          <DialogDescription>
            Modify the transcription, category, and AI post for this segment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Transcription */}
          <div className="grid gap-2">
            <Label htmlFor="transcription">Transcription</Label>
            <Textarea
              id="transcription"
              value={formData.srt}
              onChange={(e) => setFormData({ ...formData, srt: e.target.value })}
              rows={6}
              placeholder="Segment transcription..."
              className="resize-none"
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.segmentCategory}
              onValueChange={(v) =>
                setFormData({ ...formData, segmentCategory: v ?? "" })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post / Agent Response */}
          <div className="grid gap-2">
            <Label htmlFor="post">Post / Agent Response</Label>
            <Textarea
              id="post"
              value={formData.agentResponse}
              onChange={(e) =>
                setFormData({ ...formData, agentResponse: e.target.value })
              }
              rows={4}
              placeholder="AI-generated social media post..."
              className="resize-none"
            />
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
