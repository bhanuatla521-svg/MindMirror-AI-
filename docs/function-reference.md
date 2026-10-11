# MindMirror AI — Comprehensive Function Reference

This document provides a complete technical and operational reference for every user-facing feature and core backend function in MindMirror AI.

---

## Table of Contents
1. [Overview Dashboard](#1-overview-dashboard)
2. [Voice Practice Studio](#2-voice-practice-studio)
3. [Sample Answer & Metric Calculation](#3-sample-answer--metric-calculation)
4. [Evidence-Based Coaching Report](#4-evidence-based-coaching-report)
5. [The Thinking Gym](#5-the-thinking-gym)
6. [Introvert Practice Programme](#6-introvert-practice-programme)
7. [Speech & Thinking Stats](#7-speech--thinking-stats)
8. [Daily Diary Reflection](#8-daily-diary-reflection)
9. [AI Daily Review](#9-ai-daily-review)
10. [Psychological Growth (30 Dimensions)](#10-psychological-growth-30-dimensions)
11. [Emotional Wellness](#11-emotional-wellness)
12. [Social Intelligence](#12-social-intelligence)
13. [Critical Thinking Toolkit](#13-critical-thinking-toolkit)
14. [Habits & Discipline](#14-habits--discipline)
15. [Goals & Action Plans](#15-goals--action-plans)
16. [Weekly Review Retrospective](#16-weekly-review-retrospective)
17. [Reports & Data Export](#17-reports--data-export)
18. [Personal Insights Engine](#18-personal-insights-engine)
19. [Settings & Privacy Center](#19-settings--privacy-center)
20. [Conversational AI Coach Drawer](#20-conversational-ai-coach-drawer)
21. [Theme & Dark Mode Customization](#21-theme--dark-mode-customization)
22. [Mental Health Safety Safeguard](#22-mental-health-safety-safeguard)

---

### 1. Overview Dashboard

![Overview Dashboard](screenshots/01-overview-dashboard.png)

- **Purpose:** Central operational home displaying quick reflective prompts, today's Stoic quote, active behavioral metrics, Socratic inquiry questions, and quick links to core training modules.
- **Where to find it:** Click **Overview** in the sidebar (or navigates by default on page load).
- **Why it is useful:** Gives introverted communicators a structured, low-friction starting point each day without feeling overwhelmed by blank screens.
- **How to use it:**
  1. Review your current **Latest Self-Reported Metrics** (Mood, Energy, Stress, Sleep).
  2. Click any of the pre-built prompt pills (e.g., *"What patterns appear in my last 30 days?"* or *"What could I have done differently?"*).
  3. Read the generated Socratic reflection guidance and click **Add to Actions** to schedule behavioral micro-commitments.
- **Inputs:** Click selection on inquiry suggestion pills or quick action buttons.
- **Output:** Socratic reflection advice card with suggested actionable steps.
- **Example:** Clicking *"What patterns appear in my last 30 days?"* produces a structured prompt reminding the user to evaluate emotional consistency and vocal confidence.
- **Common mistakes:** Expecting longitudinal trends immediately when no previous journal entries exist.
- **Limitations:** Relies on recorded entries in LocalStorage to formulate historical pattern reflections.
- **Code Reference:**
  - **Component:** `src/components/dashboard/OverviewDashboard.tsx`
  - **State Hook:** `useApp()` in `src/context/AppContext.tsx`

---

### 2. Voice Practice Studio

![Voice Practice Studio](screenshots/02-voice-practice-studio.png)

- **Purpose:** A private, zero-judgment audio recording studio that measures delivery mechanics (words per minute, filler words, pauses) and captures live speech transcripts.
- **Where to find it:** Click **Voice Practice Studio** under the **Speech & Thinking** sidebar section.
- **Why it is useful:** Allows introverts and anxious speakers to practice solo without peer pressure, establishing objective baseline vocal metrics.
- **How to use it:**
  1. Select a practice mode from the top tabs (*Daily Prompts*, *Impromptu*, *Interview*, *Presentation*, or *Roleplay*).
  2. Choose a difficulty level (*Foundational*, *Intermediate*, or *Advanced*).
  3. Click **Start Recording** and speak clearly into your microphone.
  4. Watch the visual volume meter and real-time transcription update.
  5. Click **Stop Recording** when finished.
- **Inputs:** Microphone audio input via Web Audio API; optional manual text corrections.
- **Output:** Waveform volume activity, audio playback player, live transcript, and physical delivery meters (WPM, Fillers, Pauses).
- **Common mistakes:** Forgetting to allow microphone permissions in the browser settings.
- **Limitations:** Real-time speech streaming requires a browser supporting the Web Speech API (Chrome/Edge/Safari).
- **Code Reference:**
  - **Component:** `src/components/studio/VoiceStudio.tsx`
  - **Audio Engine:** `AudioContext`, `AnalyserNode`, and `MediaRecorder` web APIs.

---

### 3. Sample Answer & Metric Calculation

![Sample Answer & Live Metrics](screenshots/03-voice-studio-sample-input.png)

- **Purpose:** Instantly populates the Voice Studio with a verified, realistic practice answer to test speech analytics without requiring a live microphone.
- **Where to find it:** Inside **Voice Practice Studio**, click the **Insert Sample Answer** button above the transcript box.
- **Why it is useful:** Provides instant demonstration capability on devices without microphones, during testing, or when evaluating the coaching engine.
- **How to use it:**
  1. Navigate to **Voice Practice Studio**.
  2. Click **Insert Sample Answer**.
  3. Observe the calculated **132 WPM** pace, **1.5% filler word frequency**, and duration metrics.
  4. Edit any word in the text box if you want to test specific vocabulary.
- **Inputs:** Single click on **Insert Sample Answer**.
- **Output:** Populated transcript, computed delivery meters, and active **Generate Evidence Coaching Report** button.
- **Code Reference:**
  - **Function:** `calculateSpeechMetrics(transcript, durationSeconds, pauses, pauseDuration)`
  - **File:** `src/services/speechAnalysisService.ts`
  - **Return:** `{ wpm: number, fillerCount: number, fillerPercentage: number, paceRating: string }`

---

### 4. Evidence-Based Coaching Report

![Coaching Report Generator](screenshots/04-evidence-coaching-report.png)

- **Purpose:** Generates deep, structured rhetorical feedback evaluating the speaker's argument structure using the **PREP framework** (Point, Reason, Example, Point).
- **Where to find it:** Click **Coaching Report** in the sidebar, or click **Generate Evidence Coaching Report** in the Voice Studio.
- **Why it is useful:** Moves beyond vague praise to provide empirical quotes, ranked cognitive weaknesses, and concrete micro-drills for rapid speaking improvement.
- **How to use it:**
  1. Record or insert a speech practice transcript.
  2. Click **Generate Evidence Coaching Report**.
  3. Review the **PREP Structure Assessment** checkmarks (Main point, Reason, Concrete example, Conclusion).
  4. Inspect **Strengths** with verbatim quotes and **Ranked Weaknesses** with alternative phrasing.
  5. Read the rewritten **PREP Model Response** and try the recommended targeted drills.
- **Inputs:** Sanitized transcript text and physical delivery metrics.
- **Output:** Comprehensive evidence-based coaching card with confidence scoring and retest launcher.
- **Code Reference:**
  - **Component:** `src/components/studio/SpeechCoachingReportView.tsx`
  - **Endpoint:** `POST /api/speech/analyze` in `server/index.ts`
  - **AI Model:** `gemini-2.5-flash` with fallback to Groq, Cerebras, Ollama, and deterministic local heuristics.

---

### 5. The Thinking Gym

![The Thinking Gym](screenshots/05-thinking-gym-catalog.png)

- **Purpose:** Cognitive and analytical reasoning gym with exercises across 10 philosophical and critical thinking domains.
- **Where to find it:** Click **The Thinking Gym** in the sidebar.
- **Why it is useful:** Trains communicators to formulate rigorous, justified arguments before speaking, removing intellectual blindspots and cognitive fallacies.
- **10 Available Domains:**
  1. *Critical & Logical Thinking* (false cause fallacy audits)
  2. *Fact vs. Opinion & Assumption Detection*
  3. *Evidence Evaluation & Argument Construction* (Claim-Evidence-Reasoning)
  4. *Cognitive Biases & Alternative Explanations*
  5. *First-Principles & Systems Thinking*
  6. *Creativity & Lateral Thinking* (inversion models)
  7. *Problem-Solving & Decision-Making* (reversible vs. irreversible decisions)
  8. *Probabilistic Reasoning & Uncertainty* (asymmetric risk)
  9. *Perspective-Taking & Respectful Disagreement* (steel-manning)
  10. *Metacognition & Self-Reflection* (auditing defensiveness)
- **How to use it:**
  1. Select a category tab at the top.
  2. Read the scenario premise and prompt question.
  3. Type your reasoned analysis into the response box.
  4. Click **Evaluate with Cognitive Rubric**.
- **Code Reference:**
  - **Component:** `src/components/thinking/ThinkingGymView.tsx`
  - **Exercises Dataset:** `src/data/speechAndThinkingData.ts`

---

### 6. Introvert Practice Programme

![Practice Programme](screenshots/07-introvert-program-curriculum.png)

- **Purpose:** A 5-stage progressive desensitization pathway designed to systematically build vocal confidence from solo comfort to high-stakes group communication.
- **Where to find it:** Click **Practice Programme** in the sidebar.
- **5 Progressive Stages:**
  - **Stage 1:** Private Speaking Practice (solo vocalization comfort).
  - **Stage 2:** Clear & Structured Answers (PREP framing drills).
  - **Stage 3:** AI Conversation Role-Play (tolerating silence and assertive inquiry).
  - **Stage 4:** Group & Interview Simulations (multi-stakeholder alignment).
  - **Stage 5:** Real-World Practice Challenges (transferring studio skills to everyday conversations).
- **Controls:** Customize daily practice duration (5 min, 15 min, 30 min) and difficulty setting.
- **Code Reference:**
  - **Component:** `src/components/program/IntrovertProgramView.tsx`

---

### 7. Speech & Thinking Stats

![Speech & Thinking Stats](screenshots/08-speech-thinking-stats.png)

- **Purpose:** Longitudinal visual dashboard tracking speaking pace (WPM), filler word reduction, and practice frequency across multiple sessions.
- **Where to find it:** Click **Speech & Thinking Stats** in the sidebar.
- **Why it is useful:** Gives introverted speakers objective, mathematical confirmation that their delivery is steadily improving over time.
- **Metrics Displayed:**
  - Pacing line graph against the optimal conversational band (130–165 WPM).
  - Filler frequency reduction bar chart.
  - Recurrent strengths counter.
  - Complete history log of previous practice recordings.
- **Code Reference:**
  - **Component:** `src/components/progress/SpeechProgressView.tsx`

---

### 8. Daily Diary Reflection

![Daily Diary](screenshots/09-daily-diary.png)

- **Purpose:** Distraction-free personal psychology diary for capturing daily events, thoughts, mood, and physical wellbeing metrics.
- **Where to find it:** Click **Daily Diary** in the sidebar, or click **Write Today's Reflection**.
- **Inputs:**
  - Date selector.
  - Numerical sliders for Mood (1–5), Energy (1–10), Stress (1–10), and Sleep (hours).
  - Rich long-form journal textarea.
  - Custom topic tags (e.g., `#communication`, `#deepwork`).
- **Output:** Stored encrypted diary record ready for AI Daily Review.
- **Code Reference:**
  - **Component:** `src/components/diary/DailyDiary.tsx`

---

### 9. AI Daily Review

![AI Daily Review](screenshots/10-ai-daily-review.png)

- **Purpose:** Psychological synthesis engine that reads the day's diary entry and generates an 8-dimension structured review (A through H).
- **Where to find it:** Click **AI Daily Review** in the sidebar.
- **The 8 Dimensions:**
  - **A:** Executive Summary & Emotional Theme.
  - **B:** Cognitive Distortion & Bias Detection.
  - **C:** Decision-Making Quality & Rationale.
  - **D:** Social & Interpersonal Dynamics.
  - **E:** Habits & Behavioral Discipline.
  - **F:** Energy, Sleep, and Stress Physical Correlations.
  - **G:** Actionable Tomorrow Recommendations.
  - **H:** Psychological Growth Dimension Delta Scoring.
- **Code Reference:**
  - **Component:** `src/components/review/AIDailyReviewView.tsx`
  - **Engine:** `src/services/aiEngine.ts`

---

### 10. Psychological Growth (30 Dimensions)

![Psychological Growth](screenshots/11-psychological-growth.png)

- **Purpose:** Maps user reflection entries into 30 distinct psychological growth dimensions (e.g., Emotional Self-Regulation, Cognitive Flexibility, Boundary Setting, Intellectual Humility).
- **Where to find it:** Click **Psychological Growth** in the sidebar.
- **Why it is useful:** Replaces superficial self-help with transparent, multi-dimensional tracking of emotional and mental maturity.
- **Code Reference:**
  - **Component:** `src/components/growth/PsychologicalGrowth.tsx`
  - **Dimension Definitions:** `src/data/dimensionsData.ts`

---

### 11. Emotional Wellness

![Emotional Wellness](screenshots/12-emotional-wellness.png)

- **Purpose:** Tracks emotional fluctuations, identifies triggers, and guides evidence-backed regulation strategies.
- **Where to find it:** Click **Emotional Wellness** in the sidebar.
- **Code Reference:** `src/components/emotions/EmotionalWellness.tsx`

---

### 12. Social Intelligence

![Social Intelligence](screenshots/13-social-intelligence.png)

- **Purpose:** Dedicated space for introverts to reflect on social interactions, audit social battery depletion, and practice assertive boundary setting.
- **Where to find it:** Click **Social Intelligence** in the sidebar.
- **Code Reference:** `src/components/social/SocialIntelligence.tsx`

---

### 13. Critical Thinking Toolkit

![Critical Thinking](screenshots/14-critical-thinking.png)

- **Purpose:** Guided worksheet interface for deconstructing complex decisions, auditing cognitive assumptions, and stress-testing arguments.
- **Where to find it:** Click **Critical Thinking** in the sidebar.
- **Code Reference:** `src/components/critical/CriticalThinking.tsx`

---

### 14. Habits & Discipline

![Habits & Discipline](screenshots/15-habits-and-discipline.png)

- **Purpose:** Habit consistency matrix allowing users to create routines, track streaks, and minimize execution friction.
- **Where to find it:** Click **Habits & Discipline** in the sidebar.
- **Code Reference:** `src/components/habits/HabitsAndDiscipline.tsx`

---

### 15. Goals & Action Plans

![Goals & Action Plans](screenshots/16-goals-and-action-plans.png)

- **Purpose:** Decomposes long-term aspirational goals into measurable monthly milestones and daily micro-actions.
- **Where to find it:** Click **Goals & Action Plans** in the sidebar.
- **Code Reference:** `src/components/goals/GoalsAndActionPlans.tsx`

---

### 16. Weekly Review Retrospective

![Weekly Review](screenshots/17-weekly-review.png)

- **Purpose:** 7-day retrospective engine that synthesizes all diary entries and speech sessions from the past week into high-level achievements and next-week priorities.
- **Where to find it:** Click **Weekly Review** in the sidebar.
- **Code Reference:** `src/components/weekly/WeeklyReviewView.tsx`

---

### 17. Reports & Data Export

![Reports & Export](screenshots/18-reports-and-export.png)

- **Purpose:** Comprehensive data export hub allowing users to download their complete reflection logs, metrics, and coaching reports as JSON or CSV files, or print printable PDF summaries.
- **Where to find it:** Click **Reports & Export** in the sidebar.
- **Code Reference:** `src/components/reports/MonthlyYearlyReports.tsx`

---

### 18. Personal Insights Engine

![Personal Insights](screenshots/19-personal-insights.png)

- **Purpose:** Algorithmic correlation finder that uncovers subtle patterns between physical sleep, stress levels, speaking pace, and overall daily mood.
- **Where to find it:** Click **Personal Insights** in the sidebar.
- **Code Reference:** `src/components/insights/PersonalInsightsView.tsx`

---

### 19. Settings & Privacy Center

![Settings & Privacy](screenshots/20-settings-and-privacy.png)

- **Purpose:** Local privacy control center for switching AI providers (Gemini, Groq, Cerebras, Ollama, Heuristic), auditing API quotas, resetting sample data, or wiping browser storage.
- **Where to find it:** Click **Settings & Privacy** in the sidebar.
- **Security Guarantee:** All API keys reside server-side in `.env`; local audio recordings can be permanently deleted with a single click.
- **Code Reference:** `src/components/settings/SettingsAndPrivacy.tsx`

---

### 20. Conversational AI Coach Drawer

![AI Coach Drawer](screenshots/21-ai-coach-drawer.png)

- **Purpose:** Slide-out interactive Socratic coach available on every screen for clarifying thoughts, asking communication questions, or receiving feedback on draft ideas.
- **Where to find it:** Click **Ask AI Coach** in the sidebar or the **Coach** button in the top navigation header.
- **Code Reference:** `src/components/coach/ConversationalCoachDrawer.tsx`

---

### 21. Theme & Dark Mode Customization

![Theme Customization](screenshots/22-theme-customization.png)

- **Purpose:** One-click color mode switcher toggling between Light, Dark, and System modes, with support for 4 curated aesthetic palettes (*MindMirror Warm Editorial*, *Ultra-Minimal Light*, *Pure Black & White*, and *Dark Minimal*).
- **Where to find it:** Sun/Moon icon in the top right header, or inside **Settings & Privacy**.
- **Code Reference:** `src/components/common/Header.tsx` and `src/index.css`

---

### 22. Mental Health Safety Safeguard

![Safety Modal](screenshots/23-safety-modal.png)

- **Purpose:** Immediate compassionate interceptor that displays free, confidential 24/7 crisis resources (988 in US/Canada, 111 in UK, 13 11 14 in Australia) whenever acute distress or self-harm keywords are detected.
- **Where to find it:** Click the **Shield icon** in the top header, or triggers automatically if severe distress phrases appear in a reflection.
- **Code Reference:** `src/components/common/SafetyModal.tsx` and `checkSafetyTriggers()` in `src/services/aiEngine.ts`
