"use client";

import { useState, useMemo } from "react";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUpdateSegment } from "@/hooks/use-segments";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import type { Segment } from "@/types";
import { toast } from "sonner";

// Platform configuration
const PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", color: "bg-green-500" },
  { id: "telegram", label: "Telegram", color: "bg-blue-500" },
  { id: "wechat", label: "WeChat", color: "bg-green-600" },
  { id: "facebook", label: "Facebook", color: "bg-blue-600" },
  { id: "instagram", label: "Instagram", color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

// Parse shared platforms from JSON
const parseSharedPlatforms = (platformsJson: string | null): PlatformId[] => {
  if (!platformsJson) return [];
  try {
    const parsed = JSON.parse(platformsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface QuickSharePopoverProps {
  segments: Segment[];
  stationId: number;
}

export function QuickSharePopover({ segments, stationId }: QuickSharePopoverProps) {
  const updateSegment = useUpdateSegment();
  const { selectedSegmentIds, clearSegmentSelection } = useCommunityManagerStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(
    PLATFORMS.map((p) => p.id)
  );
  const [isSharing, setIsSharing] = useState(false);
  const [open, setOpen] = useState(false);

  // Get selected segments
  const selectedSegments = useMemo(() => {
    return segments.filter((s) => selectedSegmentIds.includes(s.id));
  }, [segments, selectedSegmentIds]);

  const selectedCount = selectedSegmentIds.length;

  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShare = async () => {
    if (selectedCount === 0 || selectedPlatforms.length === 0) return;

    setIsSharing(true);
    try {
      // Update each selected segment
      for (const segmentId of selectedSegmentIds) {
        const segment = segments.find((s) => s.id === segmentId);
        if (!segment) continue;

        // Merge with existing platforms
        const existingPlatforms = parseSharedPlatforms(segment.sharedPlatforms);
        const mergedPlatforms = [...new Set([...existingPlatforms, ...selectedPlatforms])];

        await updateSegment.mutateAsync({
          id: segmentId,
          stationId,
          data: {
            shared: true,
            sharedPlatforms: JSON.stringify(mergedPlatforms),
          },
        });
      }

      toast.success(
        `Shared ${selectedCount} segment${selectedCount > 1 ? "s" : ""} to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}`
      );
      clearSegmentSelection();
      setOpen(false);
    } catch (error) {
      console.error("Failed to share segments:", error);
      toast.error("Failed to share segments");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="default" disabled={selectedCount === 0}>
            <Share2 className="size-4 mr-2" />
            Share{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </Button>
        }
      />
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Share to Platforms</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedCount} segment{selectedCount !== 1 ? "s" : ""} selected
            </p>
          </div>

          <div className="space-y-2">
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center gap-3">
                <Checkbox
                  id={`platform-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <div className={`size-3 rounded-full ${platform.color}`} />
                <Label
                  htmlFor={`platform-${platform.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {platform.label}
                </Label>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={handleShare}
            disabled={isSharing || selectedPlatforms.length === 0}
          >
            {isSharing && <Loader2 className="size-4 animate-spin mr-2" />}
            {isSharing ? "Sharing..." : "Share to Selected Platforms"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
