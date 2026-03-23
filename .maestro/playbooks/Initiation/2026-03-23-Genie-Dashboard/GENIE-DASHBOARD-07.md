# Phase 07: CommunityManager — Segments, Modals & Social Sharing

This phase completes the CommunityManager feature with the segments data table, edit/regenerate/share modals, social sharing platform selector, and clip playback. By the end, the full CommunityManager workflow is functional: stream -> record -> transcribe -> edit -> share.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Previous phases:** Phase 06 built station management, media player, and recording logic.
- **Data hooks:** `useSegments(stationId)`, `useCreateSegment()`, `useUpdateSegment()`, `useDeleteSegment()` — from `src/hooks/use-segments.ts`
- **Segment data model:** `{ id, stationId, fromTime, toTime, srt (transcription), segmentCategory, agentResponse (AI post), clipUrl, shared, sharedPlatforms }`
- **Segment categories:** Community, Traffic, Interview, Music, News, Entertainment, Sports, Weather
- **Social platforms:** WhatsApp, Telegram, WeChat, Facebook, Instagram (placeholder functionality — marks as shared in DB, no actual API posting)
- **API:** `POST https://dev-genie.001.gs/smart-api/text_podcast` for re-transcription/regeneration
- **Design direction:** Professional, modern. Use `frontend-design` skill.

## Tasks

- [x] Build the segments data table component. Invoke the `frontend-design` skill. Create `src/components/community-manager/segments-table.tsx`:
  - Props: `stationId: number` (active station), `segments: Segment[]` (from useSegments hook)
  - Uses shadcn Table with the following columns:
    - **Checkbox** — header checkbox for select-all (current page), row checkboxes for individual selection. Selection state from Zustand store (`selectedSegmentIds`).
    - **From** — `fromTime` formatted as "MMM DD, YYYY HH:mm" using date-fns
    - **To** — `toTime` formatted the same way
    - **Clip** — Play button icon (small, circular). Clicking plays the audio clip inline. Only shown if `clipUrl` exists. Disabled with "No clip" tooltip if empty.
    - **Transcription** — `srt` text, truncated to ~80 chars with ellipsis. Full text shown in a shadcn Tooltip on hover. If segment is processing, show a Skeleton text bar with "Processing..." label.
    - **Category** — `segmentCategory` as a colored Badge. Color mapping: Community=blue, Traffic=orange, Interview=purple, Music=pink, News=red, Entertainment=green, Sports=amber, Weather=cyan. Show Skeleton if processing.
    - **Post** — `agentResponse` text, truncated to ~60 chars. Tooltip for full text. Skeleton if processing.
    - **Shared** — If `shared` is true, show small colored icons for each platform in `sharedPlatforms` (WhatsApp=green circle, Telegram=blue, Facebook=blue, Instagram=gradient, WeChat=green). If not shared, show dash or empty.
    - **Actions** — Row of icon buttons:
      - Play Clip (PlayCircle icon) — same as Clip column play
      - Edit (Pencil icon) — opens Edit Modal
      - Regenerate (RefreshCw icon) — opens Regenerate Modal
      - Delete (Trash2 icon) — opens Delete confirmation
  - **Row states:**
    - Normal: all data displayed
    - Processing: pulsing indicator in first cell, Skeleton bars for transcription/category/post
    - Shared: platform icons visible in Shared column, row has subtle green-tinted background
  - **Sorting:** Unshared segments first (chronological by fromTime desc), then shared segments below
  - **Pagination** below table: "Showing X-Y of Z segments", Previous/Next buttons, rows per page selector (5, 10, 25, 50)
  - **Clip audio playback**: Use a single shared `<audio>` element. Clicking play on a clip sets its URL as the source and plays. If another clip is already playing, stop it first. Show a small playing indicator on the active clip row.

- [x] Build the Edit and Regenerate modals:
  - **Edit Segment Modal** (`src/components/community-manager/edit-segment-modal.tsx`):
    - Props: `segment: Segment | null`, `open: boolean`, `onOpenChange`, `stationId: number`
    - shadcn Dialog with title "Edit Segment"
    - Form fields:
      - Transcription (shadcn Textarea, 6 rows, shows full `srt` text)
      - Category (shadcn Select with all 8 segment categories)
      - Post / Agent Response (shadcn Textarea, 4 rows, shows `agentResponse`)
    - Footer: "Cancel" and "Save Changes" buttons
    - On save: call `useUpdateSegment()` with updated fields, show success toast, close modal
    - On error: show error toast, keep modal open
  - **Regenerate Modal** (`src/components/community-manager/regenerate-modal.tsx`):
    - Props: `segment: Segment | null`, `open: boolean`, `onOpenChange`, `stationId: number`
    - Dialog title: "Regenerate AI Analysis"
    - Shows current transcription and post in read-only preview (muted text, smaller font)
    - Optional prompt textarea: "Additional instructions for AI" (placeholder: "e.g., Focus on key news topics, make the post more engaging")
    - "Cancel" and "Regenerate" buttons
    - On regenerate:
      - If segment has `clipUrl`: fetch the audio from the URL, create a Blob, call `callTextPodcastAPI()` from `src/lib/audio-utils.ts`
      - Show loading state (spinner on the button, disable inputs)
      - On success: update segment with new srt, segmentCategory, agentResponse via `useUpdateSegment()`, show toast, close modal
      - On error: show error toast with message, keep modal open
      - If no `clipUrl`: show alert "No audio clip available for regeneration"
  - **Delete confirmation** (can be inline or a small dialog):
    - "Delete this segment? This action cannot be undone."
    - On confirm: call `useDeleteSegment()`, show toast, clear selection if deleted segment was selected

- [x] Build the social sharing system:
  - **Quick Share Popover** (`src/components/community-manager/quick-share-popover.tsx`):
    - Trigger: "Share Selected" button in the toolbar above the table. Button is disabled when no segments are selected. Shows count: "Share (3)".
    - shadcn Popover containing:
      - Title: "Share to Platforms"
      - Platform checkboxes with colored labels:
        - WhatsApp (green-500 accent dot)
        - Telegram (blue-500 accent dot)
        - WeChat (green-600 accent dot)
        - Facebook (blue-600 accent dot)
        - Instagram (pink-500 accent dot)
      - All checked by default
      - "Share to Selected Platforms" button (primary)
      - Loading state: button shows spinner + "Sharing..." while processing
    - On share:
      - Get selected platform keys from checkboxes
      - For each selected segment ID: call `useUpdateSegment()` with `{ shared: true, sharedPlatforms: JSON.stringify(mergedPlatforms) }` — merge with any existing platforms
      - Show success toast: "Shared X segments to Y platforms"
      - Clear segment selection
      - Close popover
  - **Single Share Modal** (`src/components/community-manager/share-modal.tsx`):
    - Triggered from an Actions column share button (if desired) or from the Edit modal
    - Shows the segment's `agentResponse` text in a preview card
    - Platform checkboxes (same as Quick Share)
    - "Share" button marks that single segment as shared
  - **Shared indicators in table**: Already defined in segments-table.tsx — small colored circles/icons for each platform

- [x] Wire the complete CommunityManager page together. Update `src/app/(dashboard)/community-manager/page.tsx` to compose all components:
  - **Page layout** (top to bottom):
    1. Page header: "Community Manager" title + description
    2. Station selector cards row (from Phase 06)
    3. Media player card (from Phase 06)
    4. **Toolbar row**: "Share Selected" button (left, with count badge), segment count text (center/right, "X segments")
    5. Segments table (this phase)
    6. All modals rendered at page level (Edit, Regenerate, Share, Add/Edit/Delete Station from Phase 06)
  - **Data flow:**
    - `useStations()` fetches all stations
    - Active station ID from Zustand store
    - `useSegments(activeStationId)` fetches segments for active station
    - Pass segments data to SegmentsTable
  - **Station switching behavior:**
    - When user clicks a different station card:
      - Stop any active playback (call audio.pause(), destroy element)
      - Stop any active recording (stop MediaRecorder, finalize last chunk)
      - Update `activeStationId` in store
      - Clear segment selection
      - Reset page to 0
      - Table automatically refreshes (useSegments key changes)
  - **Recording -> table integration:**
    - When recording creates a new segment (via `useCreateSegment()`), TanStack Query's cache invalidation automatically refreshes the table
    - New/processing segments should appear at the top of the table
    - As API responses come back, segment rows update from "Processing..." to showing real data
  - Ensure the home page (`/`) quick stats are updated to reflect real data from both features (update the placeholder stats from Phase 01 to use actual API counts)

- [ ] Verify the complete CommunityManager workflow end-to-end using browser automation. Invoke the `agent-browser` skill:
  - Use `agent-browser` to navigate to `http://localhost:3000/community-manager`
  - Verify stations load from database:
    - Confirm 4 station cards are displayed
    - Take screenshot of page layout
  - Test audio streaming:
    - Select "Kiss 92" (or a station with valid stream URL)
    - Click Play button in media player
    - Verify audio streams (status shows "Playing")
  - Test recording workflow (if browser permissions allow):
    - Click Record button
    - Verify recording indicator (pulsing red) and "Recording..." status
    - Wait for one segment duration (set to 10s for testing)
    - Verify new row appears in segments table with "Processing..." status
    - Wait for API response
    - Verify transcription, category, and post columns populate with real data
    - Stop recording, verify clean stop
  - Test Edit segment:
    - Click Edit (Pencil icon) on a segment row
    - Verify Edit Segment modal opens
    - Modify transcription text in the textarea
    - Change category via dropdown
    - Click "Save Changes"
    - Verify success toast appears
    - Refresh page, verify changes persist
  - Test Regenerate segment:
    - Click Regenerate (RefreshCw icon) on a segment with clipUrl
    - Verify Regenerate modal opens
    - Optionally add instructions in the prompt textarea
    - Click "Regenerate"
    - Verify loading state, then data updates with new transcription/category/post
  - Test multi-select and share:
    - Click checkboxes on 2+ segment rows
    - Verify "Share Selected" button shows count (e.g., "Share (2)")
    - Click "Share Selected" button
    - Verify Quick Share popover opens
    - Check WhatsApp and Telegram options
    - Click "Share to Selected Platforms"
    - Verify success toast ("Shared X segments to Y platforms")
    - Verify shared segments show WhatsApp + Telegram icons in Shared column
    - Verify shared segments have subtle green-tinted background
  - Test Delete segment:
    - Click Delete (Trash2 icon) on a segment
    - Verify confirmation dialog appears
    - Confirm deletion
    - Verify segment is removed from table
  - Test station switching:
    - Select a different station from the station cards
    - Verify segments table updates to show that station's segments
    - Verify segment selection is cleared
  - Test pagination:
    - If station has many segments, verify pagination controls work
    - Click Next/Previous, verify table updates
    - Change rows per page, verify table updates
  - Test clip playback:
    - Click Play button on a segment row (in Clip column or Actions)
    - Verify audio clip plays
    - Verify playing indicator appears on active row
  - Test table sorting:
    - Verify unshared segments appear first (sorted by fromTime desc)
    - Verify shared segments appear below
  - Check browser console for errors
  - Fix any issues found during verification
