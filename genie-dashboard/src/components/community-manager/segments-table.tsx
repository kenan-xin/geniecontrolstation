'use client';

import { useState, useRef, useCallback, useMemo, createElement } from 'react';
import { ListMusic, Play, PlayCircle, Pencil, RefreshCw, Trash2, Loader2, Volume2, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCommunityManagerStore } from '@/store/community-manager-store';
import { useSegments, useDeleteSegment, useUpdateSegment } from '@/hooks/use-segments';
import type { Station, Segment } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Segment categories with color mapping
const CATEGORY_COLORS: Record<string, string> = {
  Community: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Traffic: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Interview: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Music: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20',
  News: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
  Entertainment: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20',
  Sports: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Weather: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
};

// Platform icons with colors
const PLATFORM_CONFIG: Record<string, { color: string; label: string }> = {
  whatsapp: { color: 'bg-green-500', label: 'WhatsApp' },
  telegram: { color: 'bg-blue-500', label: 'Telegram' },
  wechat: { color: 'bg-green-600', label: 'WeChat' },
  facebook: { color: 'bg-blue-600', label: 'Facebook' },
  instagram: { color: 'bg-instagram', label: 'Instagram' }
};

// Truncate text helper
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Check if segment is processing
const isProcessing = (segment: Segment): boolean => {
  return segment.srt === 'Processing...';
};

// Parse shared platforms from JSON
const parseSharedPlatforms = (platformsJson: string | null): string[] => {
  if (!platformsJson) return [];
  try {
    const parsed = JSON.parse(platformsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface SegmentsTableProps {
  station: Station | null;
  onEditSegment: (segment: Segment) => void;
  onRegenerateSegment: (segment: Segment) => void;
  onDeleteSegment: (segment: Segment) => void;
  onShareSegment: (segment: Segment) => void;
}

export function SegmentsTable({ station, onEditSegment, onRegenerateSegment, onDeleteSegment, onShareSegment }: SegmentsTableProps) {
  const { data: segments = [], isLoading } = useSegments(station?.id);
  const deleteSegment = useDeleteSegment();
  const updateSegment = useUpdateSegment();

  const {
    selectedSegmentIds,
    toggleSegmentSelected,
    setSelectedSegmentIds,
    clearSegmentSelection,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage
  } = useCommunityManagerStore();

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingSegmentId, setPlayingSegmentId] = useState<number | null>(null);

  // Handle clip playback
  const handlePlayClip = useCallback(
    (segment: Segment) => {
      if (!segment.clipUrl) {
        toast.error('No audio clip available');
        return;
      }

      // If same segment is playing, stop it
      if (playingSegmentId === segment.id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setPlayingSegmentId(null);
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create and play new audio
      const audio = new Audio(segment.clipUrl);
      audio.onended = () => {
        setPlayingSegmentId(null);
        audioRef.current = null;
      };
      audio.onerror = () => {
        toast.error('Failed to play audio clip');
        setPlayingSegmentId(null);
        audioRef.current = null;
      };

      audio.play();
      audioRef.current = audio;
      setPlayingSegmentId(segment.id);
    },
    [playingSegmentId]
  );

  // Cleanup audio on unmount
  useState(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  });

  // Sort segments: unshared first (by fromTime desc), then shared
  const sortedSegments = useMemo(() => {
    return [...segments].sort((a, b) => {
      // Unshared segments come first
      if (a.shared !== b.shared) {
        return a.shared ? 1 : -1;
      }
      // Within same shared status, sort by fromTime desc
      return new Date(b.fromTime).getTime() - new Date(a.fromTime).getTime();
    });
  }, [segments]);

  // Pagination
  const totalPages = Math.ceil(sortedSegments.length / rowsPerPage);
  const paginatedSegments = sortedSegments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Select all handler
  const handleSelectAll = () => {
    if (selectedSegmentIds.length === paginatedSegments.length && paginatedSegments.length > 0) {
      clearSegmentSelection();
    } else {
      setSelectedSegmentIds(paginatedSegments.map((s) => s.id));
    }
  };

  // No station selected state
  if (!station) {
    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <ListMusic className="size-8 text-muted-foreground/60" />
          </div>
          <CardTitle className="text-lg font-semibold text-muted-foreground">No station selected</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">Select a station to view recorded segments.</p>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (segments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <ListMusic className="size-8 text-muted-foreground/60" />
          </div>
          <CardTitle className="text-lg font-semibold text-muted-foreground">No segments recorded yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
            Start recording to capture audio segments. Transcriptions and social media sharing options will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recorded Segments ({segments.length})</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={selectedSegmentIds.length === paginatedSegments.length && paginatedSegments.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="px-3 font-medium">From</TableHead>
                <TableHead className="px-3 font-medium">To</TableHead>
                <TableHead className="px-3 font-medium w-12">Clip</TableHead>
                <TableHead className="px-3 font-medium min-w-[200px]">Transcription</TableHead>
                <TableHead className="px-3 font-medium">Category</TableHead>
                <TableHead className="px-3 font-medium min-w-[150px]">Post</TableHead>
                <TableHead className="px-3 font-medium">Shared</TableHead>
                <TableHead className="px-3 font-medium w-36">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSegments.map((segment) => {
                const processing = isProcessing(segment);
                const isPlaying = playingSegmentId === segment.id;
                const sharedPlatforms = parseSharedPlatforms(segment.sharedPlatforms);
                const isSharedRow = segment.shared;

                return (
                  <TableRow key={segment.id} className={`${isSharedRow ? 'bg-green-500/5' : ''} ${isPlaying ? 'bg-primary/5' : ''}`}>
                    {/* Checkbox */}
                    <TableCell className="px-3">
                      <div className="flex items-center gap-2">
                        {processing && <span className="size-2 rounded-full bg-amber-500 animate-pulse" />}
                        <Checkbox
                          checked={selectedSegmentIds.includes(segment.id)}
                          onCheckedChange={() => toggleSegmentSelected(segment.id)}
                          aria-label={`Select segment ${segment.id}`}
                        />
                      </div>
                    </TableCell>

                    {/* From Time */}
                    <TableCell className="px-3">
                      <span className="text-sm">{format(new Date(segment.fromTime), 'MMM dd, yyyy HH:mm')}</span>
                    </TableCell>

                    {/* To Time */}
                    <TableCell className="px-3">
                      <span className="text-sm">{format(new Date(segment.toTime), 'MMM dd, yyyy HH:mm')}</span>
                    </TableCell>

                    {/* Clip Play Button */}
                    <TableCell className="px-3">
                      {segment.clipUrl ? (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handlePlayClip(segment)}
                          className={isPlaying ? 'bg-primary/10 text-primary' : ''}
                        >
                          {isPlaying ? <Volume2 className="size-3.5" /> : <Play className="size-3.5" />}
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button variant="ghost" size="icon-xs" disabled>
                                <Play className="size-3.5 text-muted-foreground/40" />
                              </Button>
                            }
                          />
                          <TooltipContent>No clip</TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* Transcription */}
                    <TableCell className="px-3 max-w-[200px]">
                      {processing ? (
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      ) : segment.srt && !segment.srt.startsWith('Transcription failed') ? (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <span className="text-sm text-muted-foreground cursor-help line-clamp-2">
                                {truncateText(segment.srt, 80)}
                              </span>
                            }
                          />
                          <TooltipContent className="max-w-sm whitespace-pre-wrap">{segment.srt}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-sm text-destructive">
                          {segment.srt?.startsWith('Transcription failed') ? 'Transcription failed' : '-'}
                        </span>
                      )}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-3">
                      {processing ? (
                        <Skeleton className="h-5 w-16 rounded-full" />
                      ) : segment.segmentCategory ? (
                        <Badge variant="outline" className={CATEGORY_COLORS[segment.segmentCategory] || ''}>
                          {segment.segmentCategory}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Post / Agent Response */}
                    <TableCell className="px-3 max-w-[150px]">
                      {processing ? (
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      ) : segment.agentResponse ? (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <span className="text-sm text-muted-foreground cursor-help line-clamp-2">
                                {truncateText(segment.agentResponse, 60)}
                              </span>
                            }
                          />
                          <TooltipContent className="max-w-sm whitespace-pre-wrap">{segment.agentResponse}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Shared Platforms */}
                    <TableCell className="px-3">
                      {isSharedRow && sharedPlatforms.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {sharedPlatforms.map((platform) => {
                            const config = PLATFORM_CONFIG[platform];
                            if (!config) return null;
                            return (
                              <Tooltip key={platform}>
                                <TooltipTrigger render={<div className={`size-3 rounded-full ${config.color} cursor-help`} />} />
                                <TooltipContent>{config.label}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-3">
                      <div className="flex items-center gap-0.5">
                        {/* Play Clip */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button variant="ghost" size="icon-xs" onClick={() => handlePlayClip(segment)} disabled={!segment.clipUrl}>
                                <PlayCircle className="size-3.5" />
                              </Button>
                            }
                          />
                          <TooltipContent>{segment.clipUrl ? 'Play clip' : 'No clip available'}</TooltipContent>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button variant="ghost" size="icon-xs" onClick={() => onEditSegment(segment)} disabled={processing}>
                                <Pencil className="size-3.5" />
                              </Button>
                            }
                          />
                          <TooltipContent>Edit segment</TooltipContent>
                        </Tooltip>

                        {/* Regenerate */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onRegenerateSegment(segment)}
                                disabled={!segment.clipUrl || processing}
                              >
                                <RefreshCw className="size-3.5" />
                              </Button>
                            }
                          />
                          <TooltipContent>{segment.clipUrl ? 'Regenerate AI analysis' : 'No clip to regenerate'}</TooltipContent>
                        </Tooltip>

                        {/* Share */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onShareSegment(segment)}
                                disabled={!segment.agentResponse || processing}
                              >
                                <Share2 className="size-3.5" />
                              </Button>
                            }
                          />
                          <TooltipContent>{segment.agentResponse ? 'Share to platforms' : 'No post to share'}</TooltipContent>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onDeleteSegment(segment)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            }
                          />
                          <TooltipContent>Delete segment</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, sortedSegments.length)} of {sortedSegments.length}{' '}
              segments
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select value={rowsPerPage.toString()} onValueChange={(v) => setRowsPerPage(parseInt(v ?? '10', 10))}>
                <SelectTrigger className="h-7 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="xs" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="xs" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
