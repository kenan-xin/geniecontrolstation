# Phase 02: Database Schema & API Layer

This phase establishes the complete data persistence layer using Drizzle ORM with Turso (cloud-hosted libSQL). It defines the database schema for all entities, creates Next.js API routes for full CRUD operations, seeds the database with realistic sample data, and builds TanStack Query hooks — providing the data backbone that both features depend on.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Database:** Turso (libSQL) via `@libsql/client`, credentials in `.env.local`
- **ORM:** Drizzle ORM with `drizzle-kit` for schema management
- **Previous phase:** Phase 01 created the project scaffold with layout, navigation, and placeholder pages
- **Turso credentials:** `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` must be set in `.env.local`. The Turso database URL is: `libsql://database-apricot-compass-vercel-icfg-a7hbwxnzt7qx0nl0pl81bezi.aws-us-east-1.turso.io`

## Tasks

- [x] Set up the Drizzle ORM connection and configuration:
  - Create `src/lib/db.ts`:
    ```typescript
    import { drizzle } from 'drizzle-orm/libsql';
    import { createClient } from '@libsql/client';
    import * as schema from './schema';

    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    export const db = drizzle(client, { schema });
    ```
  - Create `drizzle.config.ts` at the project root (`genie-dashboard/`):
    ```typescript
    import { defineConfig } from 'drizzle-kit';

    export default defineConfig({
      schema: './src/lib/schema.ts',
      out: './drizzle',
      dialect: 'turso',
      dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
    });
    ```
  - Add these scripts to `package.json`:
    - `"db:push": "npx drizzle-kit push"`
    - `"db:studio": "npx drizzle-kit studio"`

- [x] Define the complete database schema in `src/lib/schema.ts`. Use Drizzle ORM's SQLite column types. The schema must support both News Verification and Community Manager features:
  - **`newsArticles`** table:
    - `id` — integer, primary key, autoincrement
    - `title` — text, not null
    - `submissionDate` — text, not null (YYYY-MM-DD format)
    - `currentStatus` — text, not null, default `'Unverified'` (values: Unverified, Approval, Schedule, Published, Rejected)
    - `statusColor` — text, not null, default `'error'` (values: error, warning, info, success, default)
    - `sources` — text (Social Media, Blog News, Reporter, Other Media Outlet, TikTok)
    - `assignedTo` — text
    - `submitterFullName` — text
    - `submitterIc` — text
    - `submitterAddress` — text
    - `submitterPhone` — text
    - `submitterEmail` — text
    - `storyTitle` — text
    - `storyDescription` — text
    - `storyCategory` — text (Finance, Demographics, Weather, Community, Health, Politics, Business, Sports)
    - `storyUrgency` — text (Low, Medium, High, Critical)
    - `storyEstimatedImpact` — text (Minor, Moderate, High, Major)
    - `attachments` — text (JSON string: array of `{id, type, name, url, description, source}`)
    - `links` — text (JSON string: array of `{id, url, description, verified}`)
    - `editorialNotes` — text (JSON string: array of `{role, action, timestamp, content}`)
    - `juniorEditorialNotes` — text
    - `seniorEditorialNotes` — text
    - `publishedDate` — text
    - `publishingDetails` — text (JSON string: `{publishedDateTime, selectedChannels, publisherNotes}`)
    - `performanceMetrics` — text (JSON string: `{views, likes, shares, comments, engagementRate}`)
    - `createdAt` — text, not null, default `sql\`(CURRENT_TIMESTAMP)\``
    - `updatedAt` — text, not null, default `sql\`(CURRENT_TIMESTAMP)\``
  - **`stations`** table:
    - `id` — integer, primary key, autoincrement
    - `name` — text, not null
    - `active` — integer, not null, default `1` (boolean: 0 or 1)
    - `url` — text (stream URL)
    - `segmentDuration` — integer, not null, default `60`
    - `logo` — text (logo URL or base64)
    - `createdAt` — text, not null, default `sql\`(CURRENT_TIMESTAMP)\``
    - `updatedAt` — text, not null, default `sql\`(CURRENT_TIMESTAMP)\``
  - **`segments`** table:
    - `id` — integer, primary key, autoincrement
    - `stationId` — integer, not null (references `stations.id`)
    - `fromTime` — text, not null (ISO format: YYYY-MM-DD HH:mm:ss)
    - `toTime` — text, not null
    - `srt` — text (transcription)
    - `segmentCategory` — text (Community, Traffic, Interview, Music, News, Entertainment, Sports, Weather)
    - `agentResponse` — text (AI-generated social media post)
    - `clipUrl` — text (audio clip URL or blob reference)
    - `shared` — integer, not null, default `0` (boolean)
    - `sharedPlatforms` — text (JSON string array: e.g., `["whatsapp","telegram"]`)
    - `createdAt` — text, not null, default `sql\`(CURRENT_TIMESTAMP)\``
  - **`stationSchedules`** table:
    - `id` — integer, primary key, autoincrement
    - `stationId` — integer, not null (references `stations.id`)
    - `dayOfWeek` — text, not null
    - `startTime` — text, not null (HH:MM)
    - `endTime` — text, not null (HH:MM)
    - `programName` — text, not null
  - Export all table definitions and inferred TypeScript types using Drizzle's `InferSelectModel` and `InferInsertModel`
  - Create a `src/types/index.ts` file re-exporting these types with friendly names (e.g., `NewsArticle`, `Station`, `Segment`, `StationSchedule`)

- [ ] Push the schema to the Turso database and verify:
  - **BLOCKED: TURSO_AUTH_TOKEN in `.env.local` is a placeholder. Need actual token to proceed.**
  - Run `npx drizzle-kit push` from the `genie-dashboard/` directory
  - Verify all 4 tables are created successfully (check the output for confirmation)
  - If there are any errors, troubleshoot (common issues: missing env vars, network connectivity)
  - Optionally run `npx drizzle-kit studio` to visually inspect the database

- [x] Create API routes for news articles CRUD:
  - `src/app/api/news-articles/route.ts`:
    - **GET**: List all articles. Support optional `?status=` query param to filter by currentStatus. Parse JSON fields (attachments, links, editorialNotes, publishingDetails, performanceMetrics) when returning. Return JSON array sorted by id desc.
    - **POST**: Create a new article. Accept JSON body with all fields. Set default `currentStatus: 'Unverified'`, `statusColor: 'error'`, `submissionDate` to today's date if not provided. Stringify JSON fields before inserting. Return the created article.
  - `src/app/api/news-articles/[id]/route.ts`:
    - **GET**: Get single article by id. Parse JSON fields. Return 404 if not found.
    - **PUT**: Partial update — merge provided fields with existing data. Handle JSON field serialization. Update `updatedAt` timestamp. Return the updated article.
    - **DELETE**: Delete article by id. Return 404 if not found. Return success message.
  - All routes should:
    - Import `db` from `@/lib/db` and schema from `@/lib/schema`
    - Use proper error handling with try/catch and appropriate HTTP status codes (200, 201, 400, 404, 500)
    - Return `NextResponse.json()` responses

- [x] Create API routes for stations and segments CRUD:
  - `src/app/api/stations/route.ts`:
    - **GET**: List all stations. For each station, also fetch its schedules from `stationSchedules` table and include them as a `schedules` array. Return JSON array.
    - **POST**: Create a new station. Accept JSON body with `name`, `url`, `segmentDuration`, `logo`, and optional `schedules` array. Insert station first, then insert schedules if provided. Return the created station with schedules.
  - `src/app/api/stations/[id]/route.ts`:
    - **GET**: Get single station with its schedules. Return 404 if not found.
    - **PUT**: Update station fields. If `schedules` array is provided, delete existing schedules and re-insert. Update `updatedAt`. Return updated station.
    - **DELETE**: Delete station, its schedules, and all its segments (cascade). Return success.
  - `src/app/api/stations/[id]/segments/route.ts`:
    - **GET**: List all segments for a station. Parse `sharedPlatforms` JSON field. Return sorted by `fromTime` desc.
    - **POST**: Create a new segment for a station. Stringify `sharedPlatforms` if array. Return the created segment.
  - `src/app/api/segments/[id]/route.ts`:
    - **PUT**: Update segment fields. Handle `sharedPlatforms` serialization. Return updated segment.
    - **DELETE**: Delete segment by id. Return success.
  - All routes: proper error handling, JSON responses, appropriate status codes.

- [x] Create a seed API route and populate the database with sample data:
  - Create `src/app/api/seed/route.ts` with a **POST** handler that:
    - Deletes all existing data from all 4 tables (for idempotent re-seeding)
    - **Inserts 11 news articles** matching the original app's mock data:
      - **Unverified** (3): "IRS Announces New Direct Deposit Relief Payments - $1,200 Stimulus Checks Coming This Week" (Blog News, John Doe), "Breaking news: Singapore birthrate in 2024 exceeds 2.0" (Social Media, John Doe), "Weather Alert: Storm Warning Issued" (Other Media Outlet, John Doe)
      - **Approval** (2): "Local Community Event Draws Large Crowd" (Social Media, Jane Smith), "New Study Reveals Health Benefits" (Reporter, Mike Johnson)
      - **Schedule** (2): "Government Policy Update on Healthcare" (Other Media Outlet, Mike Johnson), "Local Business Opens New Location" (Blog News, Jane Smith)
      - **Published** (2): "Sports Team Wins Championship" (Blog News, Sarah Williams), "School District Announces New Program" (Other Media Outlet, Sarah Williams)
      - **Rejected** (2): "Celebrity Spotted at Local Restaurant" (TikTok, Jane Smith), "Traffic Accident on Main Highway" (Social Media, John Doe)
    - Each article should have realistic data for: submitter info (fullName, IC, address, phone, email), story details (title matching article title, description with a 2-3 sentence summary, category, urgency, estimatedImpact)
    - Unverified articles: include 1-2 attachments (images/documents) and 1-2 proof links
    - Approval articles: include junior editorial notes in the editorialNotes array
    - Schedule articles: include both junior and senior editorial notes
    - Published articles: include full editorial trail, publishingDetails (channels, date), and performanceMetrics (views, likes, shares, etc.)
    - **Inserts 4 stations**:
      - Kiss 92 (active, url: `https://22283.live.streamtheworld.com/ONE_FM_913AAC.aac`, segmentDuration: 60)
      - 98.3 FM (inactive, url: empty, segmentDuration: 60)
      - 91.3 FM (inactive, url: empty, segmentDuration: 60)
      - Money FM 89.3 (inactive, url: `https://28123.mc.tritondigital.com/OMNY_STNEWSPRESENTEDBYMONEYFM_NEWSFROMTHESTRAITSTIMES_P/media-session/2786998d-7493-4ca3-bd02-e63cf11b2f0d/d/clips/d9486183-3dd4-4ad6-aebe-a4c1008455d5/4e188010-01ce-44a9-bf38-adcf004a366a/f42be6fd-55b0-4998-bebe-b3a2000e0dfa/audio/direct/t1764204709/MONEYFM_-_8_31am_NEWS_HEADLINES.mp3?t=1764204709&in_playlist=a86dfcac-e7b5-4438-b84b-adcf004aff3b`, segmentDuration: 60)
    - **Inserts sample segments** for 98.3 FM and 91.3 FM stations:
      - 98.3 FM: 1 segment (Music category, "Smooth jazz all morning long...", clip: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3`)
      - 91.3 FM: 1 segment (Interview category, "Rock on! We have a special guest...", clip: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3`)
    - Returns a success response with counts: `{ articles: 11, stations: 4, segments: 2 }`
  - After creating the route, call `POST http://localhost:3000/api/seed` (start dev server first if not running) to populate the database
  - Verify data was inserted by calling `GET http://localhost:3000/api/news-articles` and `GET http://localhost:3000/api/stations`

- [x] Create TanStack Query hooks for all API endpoints:
  - `src/hooks/use-news-articles.ts`:
    - Query key factory: `newsArticleKeys = { all: ['news-articles'], list: (status?) => [...all, 'list', { status }], detail: (id) => [...all, 'detail', id] }`
    - `useNewsArticles(status?: string)` — fetches `/api/news-articles` with optional `?status=` param
    - `useNewsArticle(id: number)` — fetches `/api/news-articles/${id}`, enabled only when id is truthy
    - `useCreateNewsArticle()` — POST mutation, invalidates list queries on success
    - `useUpdateNewsArticle()` — PUT mutation, invalidates both list and detail queries on success
    - `useDeleteNewsArticle()` — DELETE mutation, invalidates list queries on success
  - `src/hooks/use-stations.ts`:
    - Query key factory: `stationKeys = { all: ['stations'], list: () => [...all, 'list'], detail: (id) => [...all, 'detail', id] }`
    - `useStations()` — fetches `/api/stations`
    - `useStation(id: number)` — fetches `/api/stations/${id}`
    - `useCreateStation()` — POST mutation
    - `useUpdateStation()` — PUT mutation
    - `useDeleteStation()` — DELETE mutation
  - `src/hooks/use-segments.ts`:
    - Query key factory: `segmentKeys = { all: ['segments'], byStation: (stationId) => [...all, 'station', stationId] }`
    - `useSegments(stationId: number)` — fetches `/api/stations/${stationId}/segments`, enabled only when stationId is truthy
    - `useCreateSegment()` — POST mutation, invalidates byStation queries
    - `useUpdateSegment()` — PUT mutation to `/api/segments/${id}`, invalidates byStation queries
    - `useDeleteSegment()` — DELETE mutation, invalidates byStation queries
  - All hooks should use proper TypeScript types from `@/types`
  - All mutations should accept typed input and return typed responses
  - Test at least one hook by temporarily using it in a placeholder page and confirming data loads
