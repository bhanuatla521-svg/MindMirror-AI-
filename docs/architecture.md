# MindMirror AI — System Architecture & Design Specification

This document details the architectural design, data pipelines, AI cascades, and security models underpinning MindMirror AI.

---

## 1. High-Level Architecture Overview

MindMirror AI is built on a **local-first, privacy-prioritized architecture**. The client application executes in the user's browser, recording and calculating audio telemetry locally, while the Express server manages external AI provider orchestration, strict budget safeguards, and schema validations.

```
+--------------------------------------------------------------------------+
|                            USER'S BROWSER                                |
|                                                                          |
|  +--------------------+   +---------------------+   +-----------------+  |
|  | Web Audio API      |   | Web Speech API      |   | React 18 UI     |  |
|  | - AudioContext     |   | - Live Streaming    |   | - 22 Views      |  |
|  | - AnalyserNode     |   | - Transcript Buffer |   | - LocalStorage  |  |
|  | - MediaRecorder    |   +----------+----------+   | - Recharts      |  |
|  +---------+----------+              |              +--------+--------+  |
|            |                         |                       |           |
|            +-------------------------+-----------------------+           |
|                                      |                                   |
|                        Sanitized Text & Audio RMS                        |
+--------------------------------------|-----------------------------------+
                                       | HTTP POST /api/...
                                       v
+--------------------------------------------------------------------------+
|                          EXPRESS BACKEND (PORT 3001)                     |
|                                                                          |
|  +--------------------+   +---------------------+   +-----------------+  |
|  | Request Budgets    |   | In-Flight Dedup     |   | Strict Zod      |  |
|  | - Daily Limit: 100 |   | - Double-Click Lock |   | - Schema Guard  |  |
|  | - Monthly: 2500    |   +----------+----------+   +--------+--------+  |
|  +---------+----------+              |                       |           |
|            +-------------------------+-----------------------+           |
|                                      |                                   |
|                         AI Provider Waterfall Cascade                    |
|                                      v                                   |
|            +---------------------------------------------------+         |
|            | 1. Google Gemini (gemini-2.5-flash) - Primary     |         |
|            |                      | (Failover)                 |         |
|            | 2. Groq (llama-3.3-70b-versatile)                 |         |
|            |                      | (Failover)                 |         |
|            | 3. Cerebras (llama3.1-8b)                         |         |
|            |                      | (Failover)                 |         |
|            | 4. Ollama (Private Local Model: llama3.2)         |         |
|            |                      | (Failover)                 |         |
|            | 5. Deterministic Local Heuristic Engine (Offline) |         |
|            +---------------------------------------------------+         |
+--------------------------------------------------------------------------+
```

---

## 2. Audio & Speech Processing Pipeline

### 2.1 Private Audio Sampling
1. **Permission & Stream Capture:** When the user clicks **Start Recording**, `navigator.mediaDevices.getUserMedia({ audio: true })` requests microphone access.
2. **Audio Analysis:** A Web Audio API `AudioContext` is instantiated, feeding into an `AnalyserNode` with an FFT size of 256.
3. **Volume Visualization:** A `requestAnimationFrame` loop polls `getByteFrequencyData()`, computing real-time Root-Mean-Square (RMS) amplitude to animate the visualizer and track pause thresholds (>1.2s of silence).
4. **Local Recording:** `MediaRecorder` buffers incoming chunks into an in-memory `Blob` (`audio/webm` or `audio/ogg`). The blob URL is bound to browser session memory and can be permanently purged at any time.

### 2.2 Speech Transcription
- In Chrome, Edge, and Safari, `webkitSpeechRecognition` streams spoken words into an interim transcript buffer.
- When recording finishes, the user has full access to an editable textarea to correct misrecognized terms before submitting for analysis.

---

## 3. Deterministic Delivery Metrics Engine

Before calling any AI models, MindMirror computes empirical physical delivery metrics using strict deterministic algorithms in `src/services/speechAnalysisService.ts`:

- **Words Per Minute (WPM):**
  $$\text{WPM} = \frac{\text{Total Words}}{\text{Duration in Seconds}} \times 60$$
  Evaluated against the optimal conversational target band of **130–165 WPM**.
- **Filler Word Detection:**
  Evaluated using strict case-insensitive boundary regex matching across multi-word and single-word tokens:
  `\b(um|uh|er|ah|like|you know|basically|actually|so|i mean|sort of|kind of|right)\b`
- **Filler Word Density:**
  $$\text{Filler Percentage} = \frac{\text{Total Fillers}}{\text{Total Words}} \times 100$$
- **Pause & Cadence Tracking:**
  Silence segments where audio RMS remains below 5% amplitude for $\ge 1.2$ seconds are counted as deliberate pauses.

---

## 4. Multi-Provider AI Cascade & Safeguards

The backend router in `server/ai/provider-manager.ts` handles all AI requests through a fault-tolerant cascade:

1. **Deduplication Lock:** Hashes incoming request payloads to prevent double-click duplicate runs.
2. **Budget Verification:** Enforces a daily request ceiling (`DAILY_REQUEST_BUDGET=100`) and monthly budget (`MONTHLY_REQUEST_BUDGET=2500`).
3. **Provider Waterfall:**
   - **Google Gemini:** `gemini-2.5-flash` with 30-second timeout.
   - **Groq:** `llama-3.3-70b-versatile` ultra-fast inference.
   - **Cerebras:** `llama3.1-8b` high-throughput fallback.
   - **Ollama:** `http://localhost:11434` for 100% offline private local execution.
   - **Deterministic Heuristic Engine:** Offline fallback ensuring zero-crash availability.
4. **Zod Schema Guard:** All model outputs must parse through strict TypeScript Zod schemas before being returned to the frontend.

---

## 5. Security & Privacy Boundaries

| Asset | Storage Location | Privacy Guarantee |
|---|---|---|
| **API Keys** | Server-side `.env` | Never exposed to client browser bundles or committed to Git. |
| **Voice Recordings** | Client Memory (`Blob`) | Stored in volatile session memory. Zero cloud audio upload by default. |
| **Diary Reflections** | Browser `LocalStorage` | Kept entirely on user's device. Exportable as JSON/CSV. |
| **Crisis Detection** | Client-Side Regex | Intercepts self-harm expressions instantly and displays 24/7 resources without logging. |
