'use client';

import { useState, useRef } from 'react';
import { Radio } from 'lucide-react';
import { useStations } from '@/hooks/use-stations';
import { useSegments } from '@/hooks/use-segments';
import { useCommunityManagerStore } from '@/store/community-manager-store';
import { StationSelector } from '@/components/community-manager/station-selector';
import { MediaPlayer } from '@/components/community-manager/media-player';
import { SegmentsTable } from '@/components/community-manager/segments-table';
import { EditSegmentModal } from '@/components/community-manager/edit-segment-modal';
import { RegenerateModal } from '@/components/community-manager/regenerate-modal';
import { DeleteSegmentDialog } from '@/components/community-manager/delete-segment-dialog';
import { ShareModal } from '@/components/community-manager/share-modal';
import { QuickSharePopover } from '@/components/community-manager/quick-share-popover';
import { PageHeader, SectionLabel } from '@/components/shared';
import type { Segment } from '@/types';

export default function CommunityManagerPage() {
  const { data: stations = [] } = useStations();
  const { activeStationId, setActiveStationId, clearSegmentSelection, setPage } = useCommunityManagerStore();

  const activeStation = stations.find((s) => s.id === activeStationId);
  const { data: segments = [] } = useSegments(activeStationId ?? undefined);

  const segmentStats = {
    total: segments.length,
    shared: segments.filter((s) => s.shared).length,
    categories: [...new Set(segments.map((s) => s.segmentCategory).filter(Boolean))].length
  };

  // Refs for cleanup on station switch
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Modal states
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [regeneratingSegment, setRegeneratingSegment] = useState<Segment | null>(null);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [deletingSegment, setDeletingSegment] = useState<Segment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sharingSegment, setSharingSegment] = useState<Segment | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Handle station switching with cleanup
  const handleStationSwitch = (newStationId: number) => {
    if (newStationId === activeStationId) return;

    // Stop any active playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    // Stop any active recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Update station and reset state
    setActiveStationId(newStationId);
    clearSegmentSelection();
    setPage(0);
  };

  // Handler functions for segment actions
  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setEditModalOpen(true);
  };

  const handleRegenerateSegment = (segment: Segment) => {
    setRegeneratingSegment(segment);
    setRegenerateModalOpen(true);
  };

  const handleDeleteSegment = (segment: Segment) => {
    setDeletingSegment(segment);
    setDeleteDialogOpen(true);
  };

  const handleShareSegment = (segment: Segment) => {
    setSharingSegment(segment);
    setShareModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={Radio}
        title="Community Manager"
        description="Radio station management with live streaming, recording, and AI transcription"
      />

      {/* Station Selector */}
      <section>
        <SectionLabel className="mb-3">Stations</SectionLabel>
        <StationSelector />
      </section>

      {/* Media Player */}
      <section>
        <SectionLabel className="mb-3">Media Player</SectionLabel>
        <MediaPlayer station={activeStation ?? null} />
      </section>

      {/* Segments Table */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Recorded Segments</SectionLabel>
          <div className="flex items-center gap-3">
            {activeStationId && <QuickSharePopover segments={segments} stationId={activeStationId} />}
            <span className="text-sm text-muted-foreground">
              {segments.length} segment{segments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {/* Inline Segment Stats with Engagement Preview */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{segmentStats.total}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{segmentStats.shared}</span>
              <span className="text-muted-foreground">Shared</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{segmentStats.categories}</span>
              <span className="text-muted-foreground">Categories</span>
            </div>
          </div>
          {/* Engagement Preview - Mini Sparkline */}
          {segmentStats.total > 0 && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">Share rate:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-status-success rounded-full transition-all"
                    style={{ width: `${Math.round((segmentStats.shared / segmentStats.total) * 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground tabular-nums">{Math.round((segmentStats.shared / segmentStats.total) * 100)}%</span>
              </div>
            </div>
          )}
        </div>
        {/* Category Distribution Preview */}
        {segmentStats.total > 0 && segmentStats.categories > 1 && (
          <div className="mb-4 pb-4 border-b border-border">
            <span className="text-xs text-muted-foreground mb-2 block">Category Distribution</span>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const categoryCounts: Record<string, number> = {};
                segments.forEach((s) => {
                  if (s.segmentCategory) {
                    categoryCounts[s.segmentCategory] = (categoryCounts[s.segmentCategory] || 0) + 1;
                  }
                });
                const maxCount = Math.max(...Object.values(categoryCounts), 1);
                return Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-status-info rounded-full" style={{ width: `${Math.round((count / maxCount) * 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{category}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
        <SegmentsTable
          station={activeStation ?? null}
          onEditSegment={handleEditSegment}
          onRegenerateSegment={handleRegenerateSegment}
          onDeleteSegment={handleDeleteSegment}
          onShareSegment={handleShareSegment}
        />
      </section>

      {/* Modals */}
      {activeStation && (
        <>
          <EditSegmentModal segment={editingSegment} open={editModalOpen} onOpenChange={setEditModalOpen} stationId={activeStation.id} />
          <RegenerateModal
            segment={regeneratingSegment}
            open={regenerateModalOpen}
            onOpenChange={setRegenerateModalOpen}
            stationId={activeStation.id}
          />
          <DeleteSegmentDialog
            segment={deletingSegment}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            stationId={activeStation.id}
          />
          <ShareModal segment={sharingSegment} open={shareModalOpen} onOpenChange={setShareModalOpen} stationId={activeStation.id} />
        </>
      )}
    </div>
  );
}
