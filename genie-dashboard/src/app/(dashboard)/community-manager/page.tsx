"use client";

import { Radio } from "lucide-react";
import { useStations } from "@/hooks/use-stations";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import { StationSelector } from "@/components/community-manager/station-selector";
import { MediaPlayer } from "@/components/community-manager/media-player";
import { SegmentsTable } from "@/components/community-manager/segments-table";

export default function CommunityManagerPage() {
  const { data: stations = [] } = useStations();
  const { activeStationId } = useCommunityManagerStore();

  const activeStation = stations.find((s) => s.id === activeStationId);

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
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
          Recorded Segments
        </h2>
        <SegmentsTable station={activeStation ?? null} />
      </section>
    </div>
  );
}
