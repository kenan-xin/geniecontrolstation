# Phase 05: NewsVerification — AI Integration & Editorial Assistant

This phase integrates the AI-powered features that make the verification workflow intelligent: fact-checking via the external API, the AI Insights drawer with detailed analysis breakdowns, and AI-generated editorial notes for each workflow stage. These features transform manual editorial review into AI-assisted journalism with pre-filled recommendations.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Previous phases:** Phase 01-04 built the complete UI with detail pages and workflow transitions.
- **Fact-check API:** `POST https://dev-genie.001.gs/smart-api/news_fact_check`
  - Request: `{ "title": "string", "description": "string" }` (JSON, Content-Type: application/json)
  - Response: `{ factualAccuracy, newsworthyRelevance, contentIntegrity, references, report }` (see types below)
  - No authentication required
  - Timeout: 120 seconds, retry up to 3 times with 4s delay
- **Design direction:** Professional, modern. Use `frontend-design` skill for the AI drawer design.
- **Key reference:** Original fact-check hook at `src/hooks/queries/useNewsFactCheck.js` in the parent repo — port the logic but use TypeScript and adapt for the new architecture.

## Tasks

- [x] Create the `useNewsFactCheck` hook at `src/hooks/use-news-fact-check.ts`:
  - Define TypeScript types in `src/types/fact-check.ts`:
    ```typescript
    export interface FactCheckItem {
      key: string;
      status: 'ok' | 'warning' | 'error';
      message: string;
    }

    export interface RelevanceItem {
      key: string;
      score: number;
      message: string;
    }

    export interface Reference {
      url: string;
      title: string;
      confidence: 'High' | 'Medium' | 'Low';
      reason: string;
      snippet: string;
    }

    export interface FactCheckResponse {
      factualAccuracy: { items: FactCheckItem[] };
      newsworthyRelevance: { overallScore: number; items: RelevanceItem[] };
      contentIntegrity: { items: FactCheckItem[] };
      references: Reference[];
      report: string;
    }
    ```
  - Implement the hook using custom state management (not TanStack Query, since this needs manual trigger + retry logic):
    - Parameters: `title: string`, `description: string`
    - Returns: `{ data: FactCheckResponse | null, isLoading: boolean, isFetching: boolean, isError: boolean, error: Error | null, refetch: () => Promise<FactCheckResponse | null> }`
    - Core fetch function: `POST` to `${API_BASE_URL}/news_fact_check` with JSON body
    - **Timeout handling**: AbortController with 120s timeout. On timeout, throw error with `code: 'TIMEOUT'`
    - **Error handling**: Check response.ok (throw `HTTP_ERROR`), check response body for `code === 400` (throw `API_CODE_400`), handle AbortError (distinguish timeout vs manual abort)
    - **Auto-fetch on mount**: When title and description are both non-empty, auto-fetch on mount and when inputs change
    - **Retry logic**: On error (except ABORT), retry up to 3 times with 4s delay between attempts
    - **Refetch function**: Manually re-triggers the fetch, cancels any in-flight request first
    - **Cleanup**: Cancel requests and clear retry timers on unmount or when inputs change
    - Use `useRef` for AbortController, retry timeouts, and tracking successful fetches
    - `isLoading` is true on first fetch, `isFetching` is true on refetch after initial success

- [x] Build the AI Insights drawer component. Invoke the `frontend-design` skill. Create `src/components/news-verification/ai-insights-drawer.tsx`:
  - **Floating Action Button (FAB)** positioned in the bottom-right corner of the detail page:
    - Circular button with Sparkles icon (from lucide-react)
    - Visually distinctive: gradient background or accent color that stands out
    - Badge overlay showing count of warnings/errors from fact-check results (if data exists)
    - When fact-check is loading: show a small spinning indicator on the badge
    - Tooltip: "AI Newsworthy Insights"
    - Clicking opens the Sheet/Drawer
  - **Drawer** using shadcn Sheet (side="right", width ~450px):
    - **Header**: Sparkles icon + "AI Newsworthy Insights" title, close button (X), "Regenerate" button (RefreshCw icon, calls `refetch()`)
    - **Loading state**: 4 Skeleton accordion groups mimicking the content sections
    - **Error state**: AlertCircle icon, error message, "Retry" button that calls `refetch()`
    - **Content sections** using shadcn Accordion (all expanded by default, collapsible):
      1. **Factual Accuracy** (Shield icon):
        - Each item shows: status icon (CheckCircle green for 'ok', AlertTriangle amber for 'warning', XCircle red for 'error'), key text bolded, message text below
        - Visual separators between items
      2. **Newsworthy Relevance** (TrendingUp icon):
        - Overall score display: large number (0-10) with a color-coded progress bar (red < 4, amber 4-6, green > 6)
        - Individual factors: each with key, score (as small badge), and message
      3. **Content Integrity** (FileCheck icon):
        - Same layout as Factual Accuracy — items with status icons and messages
      4. **References & Sources** (BookOpen icon):
        - Each reference as a Card: title as external link (opens in new tab), confidence badge (green for High, amber for Medium, red for Low), reason text, snippet in italic/muted
  - Props: `factCheckData: FactCheckResponse | null`, `isLoading: boolean`, `isFetching: boolean`, `isError: boolean`, `error: Error | null`, `onRegenerate: () => void`, `open: boolean`, `onOpenChange: (open: boolean) => void`

- [ ] Implement AI-generated editorial notes for each workflow stage. Create `src/lib/editorial-notes.ts`:
  - **`generateJuniorEditorialNotes(factCheckData: FactCheckResponse, article: NewsArticle): string`**
    - Generates formatted notes for the Unverified -> Approval transition
    - Template structure (use plain text with section separators):
      ```
      JUNIOR EDITORIAL REVIEW — [current date/time]
      ════════════════════════════════════════════

      SOURCES VERIFICATION
      ────────────────────
      Submitter: [fullName] | Source: [sources]
      Proof links: [count] provided, [verified count] verified

      FACT-CHECKING ANALYSIS
      ──────────────────────
      [For each factualAccuracy item: status icon + key: message]

      NEWSWORTHY ASSESSMENT
      ─────────────────────
      Overall Score: [score]/10
      [For each relevance item: key (score): message]

      CONTENT INTEGRITY CHECK
      ───────────────────────
      [For each contentIntegrity item: status icon + key: message]

      EDITORIAL STANDARDS COMPLIANCE
      ──────────────────────────────
      [Summary based on overall results]

      RECOMMENDATION
      ──────────────
      [Based on overall score and error count: recommend proceed/needs revision/reject]
      ```
    - Replace status icons with text: [OK], [WARNING], [ERROR]
  - **`generateSeniorEditorialNotes(article: NewsArticle): string`**
    - Template for Approval -> Schedule transition covering: grammar assessment, tone & style review, content completeness, visual content review, editorial decision
  - **`generatePublisherNotes(article: NewsArticle): string`**
    - Template for Schedule -> Published covering: recommended timing, channel distribution strategy, audience considerations
  - Update the stage views from Phase 04:
    - **UnverifiedView**: When "Proceed to Approval" dialog opens, if fact-check data exists, pre-fill the textarea with `generateJuniorEditorialNotes()`. Add a "Regenerate AI Notes" button (Sparkles icon) that re-generates from current data.
    - **ApprovalView**: When "Approve" dialog opens, pre-fill with `generateSeniorEditorialNotes()`. Add regenerate button.
    - **ScheduleView**: Pre-fill publisher notes textarea with `generatePublisherNotes()`.

- [ ] Integrate the AI Insights drawer into the Unverified, Approval, and Schedule detail views:
  - In each stage view component, add state for drawer open/close
  - Instantiate `useNewsFactCheck(article.storyTitle, article.storyDescription)` — this will auto-fetch when the page loads
  - Render the FAB + AiInsightsDrawer at the bottom of the component (absolutely positioned FAB, Sheet overlay for drawer)
  - Pass the hook's return values as props to the drawer
  - "Regenerate" in the drawer calls the hook's `refetch()` function
  - On the **Published** view: show the FAB in a disabled/muted state with tooltip "AI analysis is read-only for published articles" — or simply don't show it (user's choice, leaning toward showing read-only if data was previously fetched, otherwise hide)
  - Make sure the drawer doesn't interfere with the existing modals (z-index management)

- [ ] Verify AI integration works end-to-end using browser automation. Invoke the `agent-browser` skill:
  - Use `agent-browser` to navigate to `/news-verification`
  - Find and click "View" on an Unverified article with title "IRS Announces New Direct Deposit Relief Payments" (suitable for fact-checking)
  - Verify fact-check API is triggered on page load:
    - Wait for the AI FAB (floating action button with Sparkles icon) to appear in bottom-right corner
    - Take screenshot showing the FAB
  - Test AI Insights drawer:
    - Click the AI FAB, verify the drawer opens from the right side
    - If API is still loading: verify skeleton loading state is displayed
    - Wait for API response (up to 120 seconds)
    - When loaded: verify all 4 accordion sections are present and populated:
      - Factual Accuracy (with status icons: checkmarks, warnings, errors)
      - Newsworthy Relevance (with overall score and progress bar)
      - Content Integrity (with status items)
      - References & Sources (with reference cards containing links)
    - Take screenshot of populated drawer
  - Test regenerate functionality:
    - Click "Regenerate" button in drawer header
    - Verify loading state shows, then new data loads
  - Test AI-generated editorial notes:
    - Close the drawer
    - Click "Proceed to Approval" button
    - Verify dialog opens with textarea pre-filled with AI-generated editorial notes
    - Verify notes contain sections: SOURCES VERIFICATION, FACT-CHECKING ANALYSIS, NEWSWORTHY ASSESSMENT, etc.
    - Take screenshot of pre-filled notes
    - Click "Regenerate AI Notes" button (Sparkles icon), verify notes regenerate
  - Complete the workflow with AI notes:
    - Edit the notes manually (add some text)
    - Click "Confirm & Proceed", verify navigation to Approval page
  - Test AI drawer on Approval page:
    - Verify AI FAB is visible and functional
    - Open drawer, verify it works correctly
    - Click "Approve" button, verify Senior Editorial notes are pre-filled
    - Confirm and proceed to Schedule
  - Test publisher notes on Schedule page:
    - Verify publisher notes textarea is pre-filled with AI-generated content
    - Verify notes contain: recommended timing, channel distribution strategy
  - Test error handling:
    - Navigate to an article with empty/minimal story description
    - Open AI drawer, verify error state shows if API fails
    - Verify "Retry" button is present and functional
  - Check browser console for errors
  - Fix any issues found during verification
