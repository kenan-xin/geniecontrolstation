"use client";

import { useState, useRef } from "react";
import { Radio } from "lucide-react";
import { useStations } from "@/hooks/use-stations";
import { useSegments } from "@/hooks/use-segments";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import { StationSelector } from "@/components/community-manager/station-selector";
import { MediaPlayer } from "@/components/community-manager/media-player";
import { SegmentsTable } from "@/components/community-manager/segments-table";
import { EditSegmentModal } from "@/components/community-manager/edit-segment-modal";
import { RegenerateModal } from "@/components/community-manager/regenerate-modal";
import { DeleteSegmentDialog } from "@/components/community-manager/delete-segment-dialog";
import { ShareModal } from "@/components/community-manager/share-modal";
import { QuickSharePopover } from "@/components/community-manager/quick-share-popover";
import { ErrorState } from "@/components/shared";
import type { Segment } from "@/types";

export default function CommunityManagerPage() {
  const { data: stations = [] } = useStations();
  const {
    activeStationId,
    setActiveStationId,
    clearSegmentSelection,
    setPage,
  } = useCommunityManagerStore();

  const activeStation = stations.find((s) => s.id === activeStationId);
  const { data: segments = [] } = useSegments(activeStationId ?? undefined);

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
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // Stop any active recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
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
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md shadow-blue-500/20">
            <Radio className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Community Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Radio station management with live streaming, recording, and AI
              transcription
            </p>
          </div>
        </div>
      </div>

      {/* Station Selector */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
          Stations
        </h2>
        <StationSelector />
      </section>

      {/* Media Player */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
          Media Player
        </h2>
        <MediaPlayer station={activeStation ?? null} />
      </section>

      {/* Segments Table */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Recorded Segments
          </h2>
          <div className="flex items-center gap-3">
            {activeStationId && (
              <QuickSharePopover
                segments={segments}
                stationId={activeStationId}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {segments.length} segment{segments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
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
          <EditSegmentModal
            segment={editingSegment}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            stationId={activeStation.id}
          />
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
          <ShareModal
            segment={sharingSegment}
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            stationId={activeStation.id}
          />
        </>
      )}
    </div>
  );
}
