# MindMirror AI — Personal Communication & Thinking Coach for Introverts

> **Private Vocal Practice × Evidence-Based Delivery Metrics × The Thinking Gym × 5-Stage Desensitization Curriculum**

MindMirror AI is an evidence-based personal communication and cognitive training platform. It provides introverts and thoughtful communicators with a private, judgment-free practice studio, deterministic delivery metrics, structured reasoning rubrics, and longitudinal growth tracking.

---

## 📚 Documentation & User Guides

Explore our complete documentation, beginner guides, and genuine visual walkthroughs:

- 📖 **[Beginner's Guidebook](docs/beginner-guide.md)** — Step-by-step tutorial for getting started, running the app on any device, and practicing daily.
- 🔍 **[Comprehensive Function Reference](docs/function-reference.md)** — Detailed operational and code reference for all 22+ modules, features, and controls.
- 📸 **[Screenshot Index](docs/screenshot-index.md)** — Visual catalog of all 22 genuine 1440×900 UI screenshots.
- 🛠️ **[Troubleshooting Guide](docs/troubleshooting.md)** — Quick fixes for microphone access, port conflicts, and offline fallback mode.

---

## 🌟 Core Modules

### 1. 🎙️ Voice Practice Studio (Phase 2 & 3)
- **100% Private Recording Canvas**: Microphone permission handling, visual audio volume meter (`AudioContext` + `AnalyserNode`), session timer, start, pause, stop, retake, and live audio playback.
- **5 Structured Practice Modes**:
  1. *Daily Speaking Prompts* (low-friction personal reflection)
  2. *Impromptu Speaking* (rapid framing with randomized refresher)
  3. *Interview Practice* (STAR framework: Situation, Task, Action, Result)
  4. *Presentation Practice* (executive summaries & proposals)
  5. *Conversation Role-Play* (assertive boundary setting & feedback)
- **Live Speech Transcription**: Real-time speech transcription via Web Speech API with an editable correction box allowing manual transcription fixes prior to analysis.
- **Deterministic Delivery Metrics**:
  - **Speaking Pace (WPM)**: Words per minute with optimal target band (130–165 WPM).
  - **Filler Frequency**: Strict case-insensitive boundary tokenization (*um*, *uh*, *like*, *you know*, *basically*, *actually*, *so*, etc.) calculated per 100 words.
  - **Pause & Cadence Analysis**: Silence intervals (>1.2s) measured via audio RMS levels.
  - **Structure Assessment**: Main point summary, supporting points, concrete example detection, and conclusion clarity.

### 2. 📋 Evidence-Based Coaching Reports (Phase 4)
Every speech session generates an empirical, constructive coaching report featuring:
1. **Session Objective & Difficulty**: Contextualizes performance against difficulty.
2. **Strengths with Verbatim Quotes**: Specific phrases that demonstrated clarity or impact.
3. **Ranked Weaknesses by Priority**: Prioritized by effect on listener cognitive load, with verbatim evidence and "Why this matters".
4. **Clearer Alternative Response**: A rewritten, 4-part PREP (Point, Reason, Example, Point) model.
5. **Targeted Micro-Drills**: 2–3 specific drills (e.g., *The Silent Pause Drill*, *60-Second PREP Challenge*).
6. **Measurable Retest Criterion**: Single-click retest launcher targeting specific delivery goals.
7. **Empirical Comparison with Previous Sessions**: WPM and filler delta curves.

### 3. 🧠 The Thinking Gym (Phase 5)
Structured reasoning exercises across 10 analytical domains, evaluated with explicit rubrics that reward justified conclusions and intellectual honesty, not mere confidence:
1. *Critical & Logical Thinking* (spotting false causes and fallacies)
2. *Fact vs. Opinion & Assumption Detection*
3. *Evidence Evaluation & Argument Construction* (Claim-Evidence-Reasoning)
4. *Cognitive Biases & Alternative Explanations*
5. *First-Principles & Systems Thinking*
6. *Creativity & Lateral Thinking* (inversion thinking)
7. *Problem-Solving & Decision-Making* (reversible vs irreversible doors)
8. *Probabilistic Reasoning & Uncertainty* (asymmetric risk)
9. *Perspective-Taking & Respectful Disagreement* (steel-manning)
10. *Metacognition & Self-Reflection* (auditing defensive reactivity)

### 4. 🧭 Introvert Practice Programme (Phase 6)
A 5-stage progressive desensitization pathway:
- **Stage 1**: Private Speaking Practice (solo vocalization comfort).
- **Stage 2**: Clear & Structured Answers (PREP framing).
- **Stage 3**: AI Conversation Role-Play (tolerating silence & active listening).
- **Stage 4**: Group & Interview Simulations (multi-stakeholder syncs).
- **Stage 5**: Real-World Practice Challenges (transferring studio skills to everyday conversations).
- **Customizable Constraints**: Available daily time (5, 15, 30 min), difficulty level, and focus area tags.

### 5. 📈 Longitudinal Progress Dashboard (Phase 7)
- Line chart of speaking pace (WPM) against the 130–165 WPM target band.
- Bar chart of filler word density reduction over time.
- Recurrence tracker identifying persistent strengths and priority focus areas.
- Complete practice log history with session reports and retest tracking.

### 6. 📓 Distraction-Free Journaling & 30 Growth Dimensions (Preserved)
- Long-form daily journaling canvas with mood/energy/stress/sleep sliders.
- 8-dimension AI Daily Review (A–H) with 30 psychological growth dimensions.
- 4 Selectable Visual Themes: *MindMirror Warm Editorial*, *Ultra-Minimal Light*, *Pure Black & White*, and *Dark Minimal*.

---

## 🔒 Security, Privacy & Reliability Guardrails (Phase 8)

1. **Audio Sovereignty & Privacy**:
   - Audio recordings are processed locally in the browser.
   - Users can permanently delete the audio recording blob at any time with a single click (*Delete Audio (Privacy)*).
2. **Server-Side API Keys**:
   - All AI keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, etc.) remain exclusively on the server in `.env`.
   - Client sends sanitized text payloads to port 3001.
3. **Explicit Evidence Guardrail**:
   - Delivery pace (WPM), filler frequency, and pauses are directly measured from physical audio timing and transcript tokens.
   - Rhetorical assessments are algorithmic pedagogical estimates.
   - **Never infer psychological conditions, intelligence, personality, or honesty from a voice recording.**
4. **Resilient Multi-Provider Fallback**:
   - `gemini-3.8-flash` &rarr; `groq` &rarr; `cerebras` &rarr; `ollama` &rarr; `local_heuristic`.
   - Never crashes when internet or external API quotas are exhausted; seamlessly produces valid Zod-schema coaching reports offline.
5. **Mental Health Safety Interceptor**:
   - Real-time detection of self-harm phrases displays immediate 24/7 hotline resources (988 US/Canada, 111 UK, 13 11 14 Australia).

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.14`)
- npm `v9+` or `v11+`

### Installation & Run

```bash
# 1. Navigate to the project directory
cd growth

# 2. Install dependencies
npm install

# 3. Start the Vite client (Port 3000)
npm run dev

# 4. In a separate terminal, start the AI backend (Port 3001)
npm run server
```

The application is live at `http://localhost:3000`.

### Production Build & Test Suites

```bash
# Production bundle compilation
npm run build

# AI backend and budget test suite
npm run test:ai

# Speech metrics and Thinking Gym test suite
npx tsx server/test-speech.ts
```

---

## ⚙️ Environment Variables (`.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Express backend server port | `3001` |
| `PRIMARY_AI_PROVIDER` | Primary AI provider (`gemini`, `groq`, `cerebras`, `ollama`, `local_heuristic`) | `gemini` |
| `GEMINI_API_KEY` | Google Gemini API key | Configured |
| `GEMINI_MODEL` | Gemini model name | `gemini-3.8-flash` |
| `DAILY_REQUEST_BUDGET` | Maximum AI requests allowed per day | `100` |
| `MONTHLY_REQUEST_BUDGET`| Maximum AI requests allowed per month | `2500` |
| `AI_REQUEST_TIMEOUT_MS` | AI timeout safeguard before falling back | `15000` |

---

## ⚠️ Known Limitations & Hardware Requirements

1. **Microphone Permissions**: Web audio recording requires user approval in the browser. If denied, users can manually type/edit transcripts directly.
2. **Web Speech API**: In Chrome/Edge/Safari, speech recognition streams in real-time. In browsers where the Web Speech API is restricted or absent, the manual correction editor allows instant typing or transcription pasting.
3. **Audio File Retention**: In local-first mode, audio playback URLs are bound to the browser session memory. Permanent audio archival in cloud storage requires configuring Supabase Storage in `.env`.
