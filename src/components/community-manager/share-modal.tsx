'use client';

import { useState, useEffect, useMemo } from 'react';
import { Share2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUpdateSegment } from '@/hooks/use-segments';
import type { Segment } from '@/types';
import { toast } from 'sonner';

// Platform configuration
const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500' },
  { id: 'telegram', label: 'Telegram', color: 'bg-blue-500' },
  { id: 'wechat', label: 'WeChat', color: 'bg-green-600' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { id: 'instagram', label: 'Instagram', color: 'bg-instagram' }
] as const;

type PlatformId = (typeof PLATFORMS)[number]['id'];

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

interface ShareModalProps {
  segment: Segment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: number;
}

export function ShareModal({ segment, open, onOpenChange, stationId }: ShareModalProps) {
  const updateSegment = useUpdateSegment();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  // Initialize with existing platforms when segment changes
  const existingPlatforms = useMemo(() => {
    if (!segment) return [];
    return parseSharedPlatforms(segment.sharedPlatforms);
  }, [segment]);

  useEffect(() => {
    if (open && segment) {
      // Pre-select existing platforms or all platforms if none selected
      setSelectedPlatforms(existingPlatforms.length > 0 ? existingPlatforms : PLATFORMS.map((p) => p.id));
    }
  }, [open, segment, existingPlatforms]);

  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms((prev) => (prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]));
  };

  const handleShare = async () => {
    if (!segment || selectedPlatforms.length === 0) return;

    setIsSharing(true);
    try {
      // Merge with existing platforms
      const mergedPlatforms = [...new Set([...existingPlatforms, ...selectedPlatforms])];

      await updateSegment.mutateAsync({
        id: segment.id,
        stationId,
        data: {
          shared: true,
          sharedPlatforms: JSON.stringify(mergedPlatforms)
        }
      });

      toast.success(`Shared to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to share segment:', error);
      toast.error('Failed to share segment');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            Share Segment
          </DialogTitle>
          <DialogDescription>Share this segment&apos;s AI post to social media platforms.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Post preview */}
          {segment?.agentResponse && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">AI Post Preview</p>
              <p className="text-sm whitespace-pre-wrap line-clamp-6">{segment.agentResponse}</p>
            </div>
          )}

          {/* Platform selection */}
          <div className="space-y-2">
            <Label>Select Platforms</Label>
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center gap-3">
                <Checkbox
                  id={`share-platform-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <div className={`size-3 rounded-full ${platform.color}`} />
                <Label htmlFor={`share-platform-${platform.id}`} className="text-sm cursor-pointer flex-1">
                  {platform.label}
                </Label>
                {existingPlatforms.includes(platform.id) && <span className="text-xs text-muted-foreground">Already shared</span>}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSharing}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSharing || selectedPlatforms.length === 0}>
            {isSharing && <Loader2 className="size-4 animate-spin mr-2" />}
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
