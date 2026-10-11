# MindMirror AI — Code-Level Function & Architecture Reference

This document provides a comprehensive technical reference for the core functions, services, algorithms, and interfaces implemented across the MindMirror AI codebase.

---

## Table of Contents
1. [Speech Analytics & Voice Engine (`src/services/speechAnalysisService.ts`)](#1-speech-analytics--voice-engine)
2. [AI Synthesis & Safety Engine (`src/services/aiEngine.ts`)](#2-ai-synthesis--safety-engine)
3. [Analytics & Psychological Metrics (`src/services/analyticsService.ts`)](#3-analytics--psychological-metrics)
4. [Conversational Coach Service (`src/services/coachService.ts`)](#4-conversational-coach-service)
5. [State Management Context (`src/context/AppContext.tsx`)](#5-state-management-context)
6. [Backend API Routes (`server/index.ts`)](#6-backend-api-routes)
7. [AI Provider Manager (`server/ai/provider-manager.ts`)](#7-ai-provider-manager)
8. [Request Budget & Safeguards (`server/ai/budget-tracker.ts`)](#8-request-budget--safeguards)
9. [In-Flight Deduplication Lock (`server/ai/dedup-lock.ts`)](#9-in-flight-deduplication-lock)

---

## 1. Speech Analytics & Voice Engine

### `calculateSpeechMetrics`
- **Location:** `src/services/speechAnalysisService.ts`
- **Signature:**
  ```typescript
  export function calculateSpeechMetrics(
    transcript: string,
    durationSeconds: number,
    detectedPauses: number = 0,
    pauseDurationSeconds: number = 0
  ): SpeechDeliveryMetrics
  ```
- **Purpose:** Computes deterministic physical delivery metrics including word count, words per minute (WPM), filler word frequency, filler percentage, and pace classifications without relying on external AI calls.
- **Parameters:**
  - `transcript` (`string`): The transcribed text of the practice session.
  - `durationSeconds` (`number`): The elapsed audio duration in seconds.
  - `detectedPauses` (`number`, optional): Count of measured silent intervals exceeding 1.2 seconds.
  - `pauseDurationSeconds` (`number`, optional): Cumulative duration of silence intervals.
- **Return Value:**
  ```typescript
  {
    wordCount: number;
    wpm: number;
    fillerCount: number;
    fillerPercentage: number;
    fillerBreakdown: Record<string, number>;
    paceRating: 'Too Slow' | 'Optimal' | 'Too Fast';
    detectedPauses: number;
    pauseDurationSeconds: number;
    silencePercentage: number;
  }
  ```
- **Side Effects:** Pure mathematical function; no state mutations or network calls.
- **Example:**
  ```typescript
  const metrics = calculateSpeechMetrics("Um, I think, you know, we should proceed.", 10);
  // metrics.wpm: 48, metrics.fillerCount: 2, metrics.paceRating: 'Too Slow'
  ```
- **Tests:** Verified in `server/test-speech.ts` (Test 1).

---

### `generateLocalSpeechCoachingReport`
- **Location:** `src/services/speechAnalysisService.ts`
- **Signature:**
  ```typescript
  export function generateLocalSpeechCoachingReport(
    transcript: string,
    promptTopic: string,
    mode: SpeechPracticeMode,
    difficulty: SpeechDifficulty,
    durationSeconds: number,
    detectedPauses: number = 0,
    pauseDurationSeconds: number = 0,
    previousReport?: SpeechCoachingReport
  ): SpeechCoachingReport
  ```
- **Purpose:** Generates a structured, evidence-grounded coaching report conforming to the PREP framework when external AI APIs are offline or unreachable.
- **Parameters:** See signature types.
- **Return Value:** Full `SpeechCoachingReport` object featuring PREP structure evaluation, strengths with verbatim quotes, ranked weaknesses, alternative response, and micro-drills.
- **Side Effects:** None.
- **Dependencies:** `calculateSpeechMetrics`.

---

## 2. AI Synthesis & Safety Engine

### `checkSafetyTriggers`
- **Location:** `src/services/aiEngine.ts`
- **Signature:**
  ```typescript
  export function checkSafetyTriggers(content: string): boolean
  ```
- **Purpose:** Evaluates text input for acute distress and self-harm keywords, triggering immediate compassionate crisis intervention modals.
- **Parameters:** `content` (`string`): Diary reflection or query text.
- **Return Value:** `boolean` (`true` if distress language detected; `false` otherwise).
- **Side Effects:** When `true`, triggers `setSafetyAlertOpen(true)` in `AppContext.tsx`.
- **Privacy Assurance:** Executes purely client-side; distress terms are never logged or stored.

---

### `generateLocalAIReview`
- **Location:** `src/services/aiEngine.ts`
- **Signature:**
  ```typescript
  export function generateLocalAIReview(entry: DiaryEntry): AIDailyReview
  ```
- **Purpose:** Produces an 8-dimension psychological review (Dimensions A–H) for a saved diary entry using local natural language processing heuristics.
- **Parameters:** `entry` (`DiaryEntry`): Saved user reflection record.
- **Return Value:** `AIDailyReview` with cognitive distortion detection, decision quality analysis, and actionable tomorrow steps.

---

## 3. Analytics & Psychological Metrics

### `recomputeDimensionsFromUserEntries`
- **Location:** `src/services/analyticsService.ts`
- **Signature:**
  ```typescript
  export function recomputeDimensionsFromUserEntries(
    baseDimensions: PersonalDimension[],
    entries: DiaryEntry[],
    reviews: Record<string, AIDailyReview>
  ): PersonalDimension[]
  ```
- **Purpose:** Transparently updates scores across all 30 psychological growth dimensions based on empirical evidence from diary entries and AI reviews.
- **Parameters:** Base dimensions array, user entries, and review records.
- **Return Value:** Updated `PersonalDimension[]` array with recalculated scores and score delta trends.

---

### `calculateRadarData`
- **Location:** `src/services/analyticsService.ts`
- **Signature:**
  ```typescript
  export function calculateRadarData(dimensions: PersonalDimension[]): {
    data: Array<{ subject: string; score: number; fullMark: number }>;
    hasData: boolean;
  }
  ```
- **Purpose:** Formats the 30 psychological dimensions into 6 high-level domain clusters for rendering in the Recharts radar visualization on the Overview Dashboard.

---

## 4. Conversational Coach Service

### `generateCoachResponse`
- **Location:** `src/services/coachService.ts`
- **Signature:**
  ```typescript
  export function generateCoachResponse(
    query: string,
    entries: DiaryEntry[],
    reviews: Record<string, AIDailyReview>,
    dimensions: PersonalDimension[],
    goals: Goal[]
  ): { text: string; referencedDates: string[]; suggestedAction?: string }
  ```
- **Purpose:** Fallback conversational coach engine providing Socratic inquiry responses grounded in the user's recent journal history when the backend is offline.

---

## 5. State Management Context

### `useApp`
- **Location:** `src/context/AppContext.tsx`
- **Signature:**
  ```typescript
  export const useApp = (): AppContextType
  ```
- **Purpose:** React hook exposing the global application state, active navigation tab, diary entries, speech coaching reports, and mutation actions.

### `sendCoachMessage`
- **Location:** `src/context/AppContext.tsx`
- **Signature:**
  ```typescript
  sendCoachMessage: (text: string) => Promise<ChatMessage>
  ```
- **Purpose:** Dispatches user queries to `/api/ai/coach`, stores the user and assistant messages in conversation state, and returns the created `ChatMessage` to eliminate duplicate network calls in consuming views.

---

## 6. Backend API Routes

All routes are hosted on the Express backend (`http://localhost:3001`):

| Route | Method | Payload | Description |
|---|---|---|---|
| `/api/speech/analyze` | `POST` | `{ transcript, metrics, mode, difficulty }` | Generates evidence-based PREP coaching report. |
| `/api/thinking/evaluate` | `POST` | `{ premise, promptQuestion, userResponse }` | Evaluates philosophical reasoning with cognitive rubrics. |
| `/api/ai/coach` | `POST` | `{ query, entries, dimensions }` | Socratic AI coach conversational response. |
| `/api/ai/analyze` | `POST` | `{ entry }` | 8-dimension AI Daily Review synthesis. |
| `/api/ai/weekly-review` | `POST` | `{ entries, period }` | 7-day retrospective synthesis. |

---

## 7. AI Provider Manager

### `dispatchSpeechAnalysis`
- **Location:** `server/ai/provider-manager.ts`
- **Signature:**
  ```typescript
  export async function dispatchSpeechAnalysis(params: SpeechAnalysisParams): Promise<SpeechCoachingResult>
  ```
- **Purpose:** Orchestrates the multi-model waterfall cascade (Gemini &rarr; Groq &rarr; Cerebras &rarr; Ollama &rarr; Heuristic) for speech evaluation, enforcing request deduplication and budget allowances.

---

## 8. Request Budget & Safeguards

### `canMakeRequest`
- **Location:** `server/ai/budget-tracker.ts`
- **Signature:**
  ```typescript
  export function canMakeRequest(): { allowed: boolean; reason?: string }
  ```
- **Purpose:** Checks current day request count against `DAILY_REQUEST_BUDGET=100` and current month count against `MONTHLY_REQUEST_BUDGET=2500`.

---

## 9. In-Flight Deduplication Lock

### `acquireDedupLock` & `releaseDedupLock`
- **Location:** `server/ai/dedup-lock.ts`
- **Signatures:**
  ```typescript
  export function acquireDedupLock(key: string): boolean
  export function releaseDedupLock(key: string): void
  ```
- **Purpose:** In-memory lock preventing concurrent identical request execution caused by accidental double-clicks or duplicate triggers.
