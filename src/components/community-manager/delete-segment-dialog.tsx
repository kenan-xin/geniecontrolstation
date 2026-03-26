"use client";

import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteSegment } from "@/hooks/use-segments";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import type { Segment } from "@/types";
import { toast } from "sonner";

interface DeleteSegmentDialogProps {
  segment: Segment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: number;
}

export function DeleteSegmentDialog({
  segment,
  open,
  onOpenChange,
  stationId,
}: DeleteSegmentDialogProps) {
  const deleteSegment = useDeleteSegment();
  const { selectedSegmentIds, clearSegmentSelection } = useCommunityManagerStore();

  const handleDelete = async () => {
    if (!segment) return;

    try {
      await deleteSegment.mutateAsync({ id: segment.id, stationId });
      toast.success("Segment deleted successfully");

      // Clear selection if deleted segment was selected
      if (selectedSegmentIds.includes(segment.id)) {
        clearSegmentSelection();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete segment:", error);
      toast.error("Failed to delete segment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            Delete Segment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this segment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {segment && (
          <div className="py-2 px-3 rounded-lg bg-muted/50 border text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">From:</span>{" "}
              {new Date(segment.fromTime).toLocaleString()}
            </p>
            {segment.segmentCategory && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Category:</span>{" "}
                {segment.segmentCategory}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteSegment.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSegment.isPending}
          >
            {deleteSegment.isPending && (
              <Loader2 className="size-4 animate-spin mr-2" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
