# Phase 06: CommunityManager — Stations & Audio Streaming

This phase builds the CommunityManager feature's core: station management with full CRUD, the media player for live radio streaming, and audio recording with automatic segmentation and MP3 encoding. This transforms the placeholder page into a functional radio station management dashboard.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Previous phases:** Phase 01-05 built the complete News Verification feature with AI integration.
- **API endpoints:**
  - Station/segment CRUD: `/api/stations`, `/api/stations/[id]`, `/api/stations/[id]/segments`, `/api/segments/[id]` (created in Phase 02)
  - Audio transcription: `POST https://dev-genie.001.gs/smart-api/text_podcast` — accepts FormData with an `audio` field (file), returns `{ text, category, content }`
- **Default stations** (seeded in Phase 02): Kiss 92 (AAC stream), 98.3 FM, 91.3 FM, Money FM 89.3 (MP3)
- **TanStack Query hooks:** `useStations()`, `useCreateStation()`, `useUpdateStation()`, `useDeleteStation()`, `useSegments()`, `useCreateSegment()` — from `src/hooks/use-stations.ts` and `src/hooks/use-segments.ts`
- **Design direction:** Professional, modern. Use `frontend-design` skill.
- **Key reference:** Original implementation at `src/pages/media/community-manager.jsx` (3066 lines) in the parent repo — port the logic but split into clean components with shadcn/ui.

## Tasks

- [ ] Create the CommunityManager Zustand store at `src/store/community-manager-store.ts`:
  - **State:**
    - `activeStationId: number | null` — currently selected station
    - `stationStates: Record<number, StationPlaybackState>` — per-station playback/recording state
    - `selectedSegmentIds: number[]` — selected rows in segment table
    - `page: number` — current table page (0-indexed)
    - `rowsPerPage: number` — default 10
  - **Types** (define in the store file or `src/types/community-manager.ts`):
    ```typescript
    interface StationPlaybackState {
      isPlaying: boolean;
      isRecording: boolean;
      status: string; // 'Ready' | 'Playing' | 'Paused' | 'Recording...' | 'Processing...'
      downloadUrl: string | null;
      isProcessing: boolean;
    }
    ```
  - **Actions:**
    - `setActiveStationId(id: number | null)` — set active station
    - `getStationState(id: number): StationPlaybackState` — returns state for station, defaults to `{ isPlaying: false, isRecording: false, status: 'Ready', downloadUrl: null, isProcessing: false }` if not found
    - `updateStationState(id: number, updates: Partial<StationPlaybackState>)` — merge updates into station state
    - `setSelectedSegmentIds(ids: number[])`, `toggleSegmentSelected(id: number)`, `clearSegmentSelection()`
    - `setPage(page: number)`, `setRowsPerPage(rows: number)` (resets page to 0)

- [ ] Build the station management UI. Invoke the `frontend-design` skill. Replace the placeholder in `src/app/(dashboard)/community-manager/page.tsx` with a `"use client"` component. For now, build the station selector and modals — the media player and table will be added in subsequent tasks:
  - **Station selector** — Horizontal scrollable row of station cards at the top of the page:
    - Use a flex row with `overflow-x-auto` and `gap-3`
    - Each station card (shadcn Card, ~120px wide): station name text centered, radio icon above the name. If station has a `logo` URL, show the logo image instead of the icon.
    - Active station: ring border with primary color, slightly elevated shadow
    - Clicking a card sets `activeStationId` in the Zustand store
    - **"+" add card**: dashed border, Plus icon, "Add Station" text — clicking opens Add Station dialog
    - Each station card has a kebab menu (MoreVertical icon, shadcn DropdownMenu) with "Edit" and "Delete" options
  - **Add Station dialog** (shadcn Dialog):
    - Fields:
      - Station Name (text input, required)
      - Stream URL (text input, placeholder: "https://...")
      - Segment Duration (number input, default 60, in seconds)
      - Logo URL (text input, optional — for simplicity, use URL input rather than file upload)
    - **Schedule section**: A small table/list where user can add program schedules:
      - Each row: Day of Week (Select: Monday-Sunday), Start Time (time input), End Time (time input), Program Name (text input)
      - "Add Schedule" button to add rows
      - Delete button per row to remove
    - "Cancel" and "Create Station" buttons
    - On submit: call `useCreateStation()` with station data + schedules array
    - On success: close dialog, show toast, station list refreshes, auto-select the new station
  - **Edit Station dialog**: Same layout as Add, pre-filled with existing station data and schedules. Uses `useUpdateStation()`.
  - **Delete confirmation dialog**: "Are you sure you want to delete '{station name}'? All segments for this station will also be deleted." Uses `useDeleteStation()`.
  - Stations fetched via `useStations()` hook. Auto-select the first station with a non-empty `url` on initial load.

- [ ] Build the media player component. Create `src/components/community-manager/media-player.tsx`:
  - Props: `station: Station | null` (the active station object)
  - **Layout**: A Card with horizontal flex — station logo/icon on the left (square, ~100px), controls on the right
  - **Station display**: Large radio icon or logo image. Station name below. If no station selected, show "Select a station" message.
  - **Controls row**:
    - **Play/Pause button**: Large circular button
      - Play icon when stopped/paused, Pause icon when playing
      - Disabled if station has no `url`
      - On play: create `new Audio(station.url)`, set `crossOrigin = 'anonymous'`, call `audio.play()`, update stationState to `{ isPlaying: true, status: 'Playing' }`
      - On pause: call `audio.pause()`, update to `{ isPlaying: false, status: 'Paused' }`
    - **Record button**: Red circular button with FiberManualRecord-style circle icon
      - Disabled if station has no `url`
      - When not recording: clicking starts recording (see recording logic below)
      - When recording: pulsing red animation, clicking stops recording
      - Status text updates: "Recording..." with elapsed time
    - **Status text**: Shows current state ('Ready', 'Playing', 'Paused', 'Recording...', etc.)
    - **Download button**: Appears only when `downloadUrl` exists in stationState — downloads the last recorded audio segment
  - **Audio refs management**: Use `useRef` for:
    - `audioRef` — the playback audio element
    - `recordingAudioRef` — separate muted audio element used for recording (prevents double-audio)
    - `mediaRecorderRef` — the MediaRecorder instance
    - `chunksRef` — collected audio data chunks
  - **Playback implementation**:
    - Create audio element on play, destroy on stop or station switch
    - Handle audio errors gracefully (toast "Failed to play stream")
    - On station switch: stop playback, destroy audio element, reset state
  - Use Zustand store's `getStationState()` and `updateStationState()` for state

- [ ] Implement audio recording with automatic segmentation and MP3 encoding:
  - **Create `src/lib/audio-utils.ts`** with helper functions:
    - `audioBufferToMp3Blob(audioBuffer: AudioBuffer): Blob` — MP3 encoding using lamejs:
      - Get channel count and sample rate from AudioBuffer
      - Create `lamejs.Mp3Encoder(numChannels, sampleRate, 128)` (128 kbps)
      - Process in blocks of 1152 samples
      - Convert Float32 channel data to Int16 (multiply by 32767)
      - Encode each block, collect output buffers
      - Flush encoder, return as Blob with `type: 'audio/mpeg'`
    - `callTextPodcastAPI(audioBlob: Blob): Promise<{ text: string; category: string; content: string }>`:
      - Create FormData, append audio blob with appropriate filename based on type (recording.webm, recording.mp3, recording.wav, recording.ogg)
      - `POST` to `${API_BASE_URL}/text_podcast` with the FormData (no Content-Type header — let browser set multipart boundary)
      - Check `response.ok`, parse JSON, return data
      - On error: throw with descriptive message
  - **Recording logic** in `media-player.tsx` (or a custom hook `useAudioRecording`):
    - **Starting recording**:
      1. Create a separate muted Audio element with the station's stream URL (`recordingAudioRef`)
      2. Set `crossOrigin = 'anonymous'`, set `muted = true`
      3. Play the recording audio element
      4. Get MediaStream via `recordingAudioRef.current.captureStream()` (fallback: `mozCaptureStream()`)
      5. Create `MediaRecorder(stream)` with available codec
      6. Set up `ondataavailable` to push chunks
      7. Start recording: `mediaRecorder.start()`
      8. Set up interval timer for segment duration (station's `segmentDuration`, default 60s)
    - **Segment rotation** (when segment duration elapses):
      1. Stop current MediaRecorder (`mediaRecorder.stop()`)
      2. In the `onstop` handler: create Blob from chunks, clear chunks
      3. Create a segment entry via `useCreateSegment()` with initial data (fromTime, toTime, srt: 'Processing...', isLoading: true)
      4. Call `callTextPodcastAPI(audioBlob)` in the background
      5. On API success: update segment via `useUpdateSegment()` with transcription (text -> srt), category, agentResponse (content)
      6. On API error: update segment with error indicator, show toast
      7. If still recording: start a new MediaRecorder for the next chunk
    - **Stopping recording**:
      1. Clear the segment rotation interval
      2. Stop the MediaRecorder (triggers final onstop with remaining data)
      3. Destroy the recording audio element
      4. Update station state: `{ isRecording: false, status: 'Ready' }`
    - **Download**: Create object URL from the last recorded blob, set as `downloadUrl` in station state

- [ ] Verify station management and audio playback using browser automation. Invoke the `agent-browser` skill:
  - Ensure seed data is loaded (4 stations should exist)
  - Use `agent-browser` to navigate to `http://localhost:3000/community-manager`
  - Verify station cards:
    - Confirm 4 station cards are displayed (Kiss 92, 98.3 FM, 91.3 FM, Money FM 89.3)
    - Confirm "Add Station" card (dashed border, Plus icon) is displayed
    - Take screenshot of station selector
  - Test station selection:
    - Click on "Kiss 92" station card
    - Verify it becomes active (ring border highlight appears)
    - Verify station name is displayed in the media player
  - Test audio playback:
    - Click the Play button in the media player
    - Wait a few seconds for stream to connect
    - Verify status text changes to "Playing"
    - Verify Play icon changes to Pause icon
    - Take screenshot showing playing state
    - Click Pause button, verify audio stops and status changes
  - Test recording (note: audio recording requires user confirmation in browser):
    - Click the Record button (red circular button)
    - If browser prompts for microphone/audio permission, note this in verification
    - Verify recording indicator appears (pulsing red animation)
    - Verify status shows "Recording..."
    - Wait for segment duration (use a shorter duration like 10s for testing by editing station first)
    - Verify a new segment appears in the table area (will show "Processing..." initially)
    - Click Stop button, verify recording stops cleanly and status returns to "Ready"
  - Test Add Station:
    - Click the "Add Station" card (dashed border)
    - Verify Add Station dialog opens
    - Fill in form fields: Station Name ("Test FM"), Stream URL (any valid URL), Segment Duration (60)
    - Optionally add a schedule row
    - Click "Create Station"
    - Verify success toast appears
    - Verify "Test FM" appears in the station selector
  - Test Edit Station:
    - Click kebab menu (three dots) on "Test FM" card
    - Select "Edit" from dropdown
    - Verify Edit dialog opens with pre-filled data
    - Change station name to "Test FM Updated"
    - Click "Save"
    - Verify name change is reflected in the station card
  - Test Delete Station:
    - Click kebab menu on "Test FM Updated" card
    - Select "Delete" from dropdown
    - Verify confirmation dialog appears with warning about segment deletion
    - Confirm deletion
    - Verify station is removed from selector
  - Test station switching:
    - Select "Kiss 92", start playing audio
    - Click on a different station (e.g., "98.3 FM")
    - Verify playback stops when switching stations
    - Verify the new station becomes active
  - Check browser console for errors (ignore CORS warnings from external stream URLs)
  - Fix any issues found during verification
