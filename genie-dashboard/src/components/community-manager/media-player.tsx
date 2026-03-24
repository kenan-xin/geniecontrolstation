'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Mic, Square, Download, AudioLines, Radio, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCommunityManagerStore } from '@/store/community-manager-store';
import { useSegments, useCreateSegment, useUpdateSegment } from '@/hooks/use-segments';
import { callTextPodcastAPI, formatRecordingTime } from '@/lib/audio-utils';
import type { Station } from '@/types';

// Extended HTMLAudioElement type for captureStream
interface HTMLAudioElementWithCapture extends HTMLAudioElement {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
}

interface MediaPlayerProps {
  station: Station | null;
}

export function MediaPlayer({ station }: MediaPlayerProps) {
  // Refs for audio management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<boolean>(false);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const segmentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording state
  const [recordingTime, setRecordingTime] = useState(0);
  const [isStartingRecording, setIsStartingRecording] = useState(false);

  const { getStationState, updateStationState } = useCommunityManagerStore();

  const stationState = station ? getStationState(station.id) : null;
  const { data: segments = [] } = useSegments(station?.id);
  const createSegment = useCreateSegment();
  const updateSegment = useUpdateSegment();

  // Cleanup on unmount or station change
  useEffect(() => {
    return () => {
      cleanupPlayback();
      cleanupRecording();
    };
  }, [station?.id]);

  const cleanupPlayback = useCallback(() => {
    activeAudioRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const cleanupRecording = useCallback(() => {
    if (segmentIntervalRef.current) {
      clearInterval(segmentIntervalRef.current);
      segmentIntervalRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.src = '';
      recordingAudioRef.current = null;
    }
    chunksRef.current = [];
    setRecordingTime(0);
  }, []);

  const handlePlay = async () => {
    if (!station?.url) {
      toast.error('No stream URL configured for this station');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = station.url;
    activeAudioRef.current = true;

    try {
      await audio.play();
    } catch {
      return;
    }

    if (!activeAudioRef.current) return;

    updateStationState(station.id, {
      isPlaying: true,
      status: 'Playing'
    });
  };

  const handlePause = () => {
    if (!station) return;

    cleanupPlayback();

    updateStationState(station.id, {
      isPlaying: false,
      status: 'Paused'
    });
  };

  const processSegment = async (blob: Blob, startTime: Date, endTime: Date) => {
    if (!station) return;

    // Create segment entry
    const segment = await createSegment.mutateAsync({
      stationId: station.id,
      data: {
        stationId: station.id,
        fromTime: startTime.toISOString(),
        toTime: endTime.toISOString(),
        srt: 'Processing...',
        segmentCategory: null,
        agentResponse: null,
        clipUrl: null,
        shared: false,
        sharedPlatforms: null
      }
    });

    // Set download URL
    const downloadUrl = URL.createObjectURL(blob);
    updateStationState(station.id, { downloadUrl });

    // Call transcription API in background
    try {
      const result = await callTextPodcastAPI(blob);
      await updateSegment.mutateAsync({
        id: segment.id,
        stationId: station.id,
        data: {
          srt: result.text,
          segmentCategory: result.category,
          agentResponse: result.content
        }
      });
    } catch (error) {
      console.error('Transcription error:', error);
      await updateSegment.mutateAsync({
        id: segment.id,
        stationId: station.id,
        data: {
          srt: `Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      });
      toast.error('Transcription failed for segment');
    }
  };

  const startRecording = async () => {
    if (!station?.url) {
      toast.error('No stream URL configured for this station');
      return;
    }

    setIsStartingRecording(true);

    try {
      // Stop any playback first
      if (stationState?.isPlaying) {
        handlePause();
      }

      // Create muted audio element for recording
      const recordingAudio = new Audio() as HTMLAudioElementWithCapture;
      recordingAudio.crossOrigin = 'anonymous';
      recordingAudio.muted = true;
      recordingAudio.src = station.url;

      await recordingAudio.play();
      recordingAudioRef.current = recordingAudio;

      // Get MediaStream
      const stream = recordingAudio.captureStream?.() ?? recordingAudio.mozCaptureStream?.();

      if (!stream) {
        throw new Error('Could not capture audio stream');
      }

      // Determine best supported codec
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      const segmentStartTime = new Date();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const segmentEndTime = new Date();
        const blob = new Blob(chunksRef.current, { type: selectedMimeType || 'audio/webm' });
        chunksRef.current = [];

        // Process segment
        await processSegment(blob, segmentStartTime, segmentEndTime);
      };

      mediaRecorder.start();
      updateStationState(station.id, {
        isRecording: true,
        status: 'Recording...',
        recordingStartTime: Date.now()
      });

      // Start recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      // Set up segment rotation interval
      const segmentDuration = (station.segmentDuration ?? 60) * 1000;
      segmentIntervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          // Stop current recording (triggers onstop)
          mediaRecorderRef.current.stop();

          // Start new recording for next segment
          chunksRef.current = [];
          const newRecorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);

          newRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunksRef.current.push(e.data);
            }
          };

          const nextSegmentStart = new Date();
          newRecorder.onstop = async () => {
            const nextSegmentEnd = new Date();
            const blob = new Blob(chunksRef.current, { type: selectedMimeType || 'audio/webm' });
            chunksRef.current = [];
            await processSegment(blob, nextSegmentStart, nextSegmentEnd);
          };

          newRecorder.start();
          mediaRecorderRef.current = newRecorder;
        }
      }, segmentDuration);
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
      cleanupRecording();
      updateStationState(station.id, {
        isRecording: false,
        status: 'Ready'
      });
    } finally {
      setIsStartingRecording(false);
    }
  };

  const stopRecording = () => {
    if (!station) return;

    cleanupRecording();

    updateStationState(station.id, {
      isRecording: false,
      status: 'Ready'
    });

    toast.success('Recording stopped');
  };

  const handleDownload = () => {
    if (!stationState?.downloadUrl) return;

    const a = document.createElement('a');
    a.href = stationState.downloadUrl;
    a.download = `${station?.name ?? 'recording'}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const hasUrl = Boolean(station?.url);
  const isPlaying = stationState?.isPlaying ?? false;
  const isRecording = stationState?.isRecording ?? false;
  const status = stationState?.status ?? 'Ready';
  const downloadUrl = stationState?.downloadUrl;

  return (
    <Card>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onError={() => {
          if (activeAudioRef.current) {
            toast.error('Failed to play stream');
            updateStationState(station?.id, {
              isPlaying: false,
              status: 'Ready'
            });
          }
        }}
      />
      <CardContent className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Station Icon/Logo */}
          <div className="shrink-0 mx-auto sm:mx-0">
            {station ? (
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-xl bg-primary shadow-lg">
                {station.logo ? (
                  <img src={station.logo} alt={station.name} className="size-14 sm:size-16 rounded-lg object-cover" />
                ) : (
                  <Radio className="size-8 sm:size-10 text-white" />
                )}
              </div>
            ) : (
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-xl bg-muted">
                <AudioLines className="size-8 sm:size-10 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            {/* Station Name */}
            <div>
              {station ? (
                <>
                  <h3 className="text-lg font-semibold">{station.name}</h3>
                  {station.url && <p className="text-sm text-muted-foreground truncate max-w-md mx-auto sm:mx-0">{station.url}</p>}
                </>
              ) : (
                <p className="text-muted-foreground">Select a station to begin</p>
              )}
            </div>

            {/* Buttons Row - stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {/* Play/Pause Button */}
              <Button
                variant={isPlaying ? 'default' : 'outline'}
                size="lg"
                disabled={!hasUrl || isRecording}
                onClick={isPlaying ? handlePause : handlePlay}
                className="gap-2 w-full sm:w-auto"
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-4" data-icon="inline-start" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="size-4" data-icon="inline-start" />
                    Play
                  </>
                )}
              </Button>

              {/* Record Button */}
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="lg"
                disabled={!hasUrl || isPlaying || isStartingRecording}
                onClick={isRecording ? stopRecording : startRecording}
                className={`gap-2 w-full sm:w-auto ${isRecording ? 'animate-pulse' : ''}`}
              >
                {isStartingRecording ? (
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                ) : isRecording ? (
                  <Square className="size-4" data-icon="inline-start" />
                ) : (
                  <Mic className="size-4" data-icon="inline-start" />
                )}
                {isRecording ? `Stop (${formatRecordingTime(recordingTime)})` : 'Record'}
              </Button>

              {/* Download Button */}
              {downloadUrl && (
                <Button variant="outline" size="lg" onClick={handleDownload} className="gap-2 w-full sm:w-auto">
                  <Download className="size-4" data-icon="inline-start" />
                  Download
                </Button>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div
                className={`size-2 rounded-full ${
                  isRecording ? 'bg-red-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-muted-foreground/40'
                }`}
              />
              <span className="text-sm text-muted-foreground">{status}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
