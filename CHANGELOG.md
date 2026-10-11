# Changelog

All notable changes to the **MindMirror AI** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-11

### Added
- **22 High-Resolution Genuine Screenshots:** Automated capture of all 22 active views, modal dialogs, and drawer states at 1440 × 900 desktop resolution using Playwright Chromium automation.
- **Comprehensive Feature Reference (`docs/feature-reference.md`):** Complete operational and user-facing breakdown of all 22 features with embedded screenshots, inputs, outputs, examples, and limitations.
- **Complete Beginner's Guidebook (`docs/beginner-guide.md`):** 5 step-by-step tutorials, real-world PREP communication examples, glossary, and setup guides.
- **Technical Architecture Guide (`docs/architecture.md`):** High-level component diagrams, Web Audio RMS volume pipeline, multi-provider AI waterfall cascade, and privacy boundary specs.
- **Testing & Quality Assurance Guide (`docs/testing.md`):** Automated test suite documentation, schema verification matrices, and command reference.
- **Screenshot Catalog Index (`docs/screenshot-index.md`):** Cross-referenced index linking every screenshot to its corresponding feature guide.
- **Troubleshooting Guide (`docs/troubleshooting.md`):** Solutions for microphone permissions, port conflicts, API keys, and offline mode.
- **Open-Source Repository Assets:** Added `CONTRIBUTING.md`, `SECURITY.md`, and `CHANGELOG.md`.

### Fixed
- **Duplicate Network Request Bug:** Fixed redundant concurrent fetches to `/api/ai/coach` in `OverviewDashboard.tsx` by returning the created message directly from `sendCoachMessage()` in `AppContext.tsx`.
- **Secret Push Protection Compliance:** Fixed hardcoded development test key in `server/check-key.ts` to read securely from `process.env.GEMINI_API_KEY`.
- **Git Repository Scoping:** Initialized localized Git repository inside project root with comprehensive `.gitignore` safeguarding `.env`, `node_modules`, and build artifacts.

---

## [1.0.0] - 2026-10-10

### Initial Release
- **Voice Practice Studio:** 5 structured modes (Daily, Impromptu, Interview, Presentation, Roleplay), Web Audio volume visualizer, live speech transcription, and deterministic delivery metrics (WPM, fillers, pause duration).
- **Evidence-Based Coaching Reports:** PREP framework analysis, transcript-anchored strength quotes, ranked delivery weaknesses, and model answer rewrites.
- **The Thinking Gym:** 10 cognitive reasoning domains evaluated with objective pedagogical rubrics.
- **Introvert Practice Programme:** 5-stage progressive desensitization pathway.
- **Longitudinal Stats Dashboard:** Pacing curve vs. 130–165 WPM band and filler word density reduction tracking.
- **Daily Psychology Diary:** Long-form journaling with Mood, Energy, Stress, and Sleep sliders.
- **AI Daily Review:** 8-dimension psychological synthesis (Dimensions A–H).
- **30 Psychological Growth Dimensions:** Transparent growth tracking and score distributions.
- **Multi-Provider AI Engine:** Waterfall support for Google Gemini, Groq, Cerebras, Ollama, and local heuristic engines.
