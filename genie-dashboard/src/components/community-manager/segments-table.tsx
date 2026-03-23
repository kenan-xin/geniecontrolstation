"use client";

import { useState } from "react";
import {
  ListMusic,
  Clock,
  Calendar,
  Share2,
  MoreVertical,
  Trash2,
  FileText,
  Tag,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import { useSegments, useDeleteSegment } from "@/hooks/use-segments";
import type { Station, Segment } from "@/types";
import { format } from "date-fns";

interface SegmentsTableProps {
  station: Station | null;
}

export function SegmentsTable({ station }: SegmentsTableProps) {
  const { data: segments = [], isLoading } = useSegments(station?.id);
  const deleteSegment = useDeleteSegment();

  const {
    selectedSegmentIds,
    toggleSegmentSelected,
    setSelectedSegmentIds,
    clearSegmentSelection,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  } = useCommunityManagerStore();

  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  const handleSelectAll = () => {
    if (selectedSegmentIds.length === segments.length) {
      clearSegmentSelection();
    } else {
      setSelectedSegmentIds(segments.map((s) => s.id));
    }
  };

  const handleDelete = async (segment: Segment) => {
    if (!station) return;
    try {
      await deleteSegment.mutateAsync({ id: segment.id, stationId: station.id });
    } catch (error) {
      console.error("Failed to delete segment:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!station) return;
    for (const id of selectedSegmentIds) {
      try {
        await deleteSegment.mutateAsync({ id, stationId: station.id });
      } catch (error) {
        console.error("Failed to delete segment:", error);
      }
    }
    clearSegmentSelection();
  };

  // Pagination
  const paginatedSegments = segments.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const totalPages = Math.ceil(segments.length / rowsPerPage);

  if (!station) {
    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <ListMusic className="size-8 text-muted-foreground/60" />
          </div>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            No station selected
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
            Select a station to view recorded segments.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (segments.length === 0) {
    return (
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
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Recorded Segments ({segments.length})
        </CardTitle>
        {selectedSegmentIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="size-4 mr-2" />
            Delete Selected ({selectedSegmentIds.length})
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-3 py-2">
                  <Checkbox
                    checked={
                      selectedSegmentIds.length === segments.length &&
                      segments.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left px-3 py-2 font-medium">Time</th>
                <th className="text-left px-3 py-2 font-medium">Duration</th>
                <th className="text-left px-3 py-2 font-medium">Category</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="w-10 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedSegments.map((segment) => (
                <tr
                  key={segment.id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() =>
                    setExpandedSegment(
                      expandedSegment === segment.id ? null : segment.id
                    )
                  }
                >
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedSegmentIds.includes(segment.id)}
                      onCheckedChange={() => toggleSegmentSelected(segment.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {format(new Date(segment.fromTime), "MMM d, HH:mm")}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-muted-foreground" />
                      {Math.round(
                        (new Date(segment.toTime).getTime() -
                          new Date(segment.fromTime).getTime()) /
                          1000
                      )}
                      s
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {segment.segmentCategory ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        <Tag className="size-3" />
                        {segment.segmentCategory}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {segment.srt === "Processing..." ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                        <Loader2 className="size-3.5 animate-spin" />
                        Processing
                      </span>
                    ) : segment.srt?.startsWith("Transcription failed") ? (
                      <span className="text-destructive">Error</span>
                    ) : (
                      <span className="text-green-600 dark:text-green-500">
                        Complete
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex size-7 items-center justify-center rounded-md hover:bg-accent"
                      >
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {segment.clipUrl && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(segment.clipUrl!, "_blank")
                            }
                          >
                            <ExternalLink className="size-4 mr-2" />
                            Open Clip
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            setExpandedSegment(
                              expandedSegment === segment.id ? null : segment.id
                            )
                          }
                        >
                          <FileText className="size-4 mr-2" />
                          View Transcription
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(segment)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded transcription view */}
        {expandedSegment && (
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border">
            {(() => {
              const segment = segments.find((s) => s.id === expandedSegment);
              if (!segment) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Transcription</h4>
                    {segment.segmentCategory && (
                      <span className="text-xs text-muted-foreground">
                        Category: {segment.segmentCategory}
                      </span>
                    )}
                  </div>
                  {segment.srt && segment.srt !== "Processing..." ? (
                    <p className="text-sm whitespace-pre-wrap">
                      {segment.srt.startsWith("Transcription failed")
                        ? segment.srt
                        : segment.srt}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Processing transcription...
                    </p>
                  )}
                  {segment.agentResponse && (
                    <div className="pt-3 border-t">
                      <h4 className="font-medium mb-2">AI Response</h4>
                      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {segment.agentResponse}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {page * rowsPerPage + 1} -{" "}
              {Math.min((page + 1) * rowsPerPage, segments.length)} of{" "}
              {segments.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
