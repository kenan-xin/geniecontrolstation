import {
  Radio,
  Play,
  Mic,
  Plus,
  AudioLines,
  ListMusic,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stations = [
  { name: "Kiss 92", freq: "92.0 FM" },
  { name: "98.3 FM", freq: "98.3 FM" },
  { name: "91.3 FM", freq: "91.3 FM" },
  { name: "Money FM 89.3", freq: "89.3 FM" },
];

export default function CommunityManagerPage() {
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

      {/* Station Cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
          Stations
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {stations.map((station) => (
            <Card
              key={station.name}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-blue-500/30 hover:ring-2"
            >
              <CardContent className="flex flex-col items-center gap-2 py-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors duration-200">
                  <Radio className="size-5.5 text-blue-500" />
                </div>
                <div className="text-center min-w-0 w-full">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {station.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {station.freq}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Station Card */}
          <Card className="cursor-pointer border-dashed transition-all duration-200 hover:shadow-md hover:border-solid hover:border-blue-500/30">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Plus className="size-5.5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Add Station
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Media Player Placeholder */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Media Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-5 py-8">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <AudioLines className="size-9 text-muted-foreground/40" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/15 animate-[spin_20s_linear_infinite]" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a station to begin
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" disabled className="gap-2">
                <Play className="size-4" data-icon="inline-start" />
                Play
              </Button>
              <Button variant="outline" size="lg" disabled className="gap-2">
                <Mic className="size-4" data-icon="inline-start" />
                Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segments Table Placeholder */}
      <Card className="border-dashed">
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <ListMusic className="size-8 text-muted-foreground/60" />
          </div>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            No segments recorded yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
            Start recording to capture audio segments. Transcriptions and social
            media sharing options will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
