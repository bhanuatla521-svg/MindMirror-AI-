import React, { useState } from 'react';
import {
  Search,
  Mic,
  Award,
  Brain,
  Compass,
  Activity,
  BookOpen,
  Sparkles,
  TrendingUp,
  Heart,
  Users,
  CheckSquare,
  Target,
  CalendarCheck,
  FileText,
  Lightbulb,
  Settings,
  MessageSquare,
  Shield,
  Palette,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Code2,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FeatureDoc {
  id: string;
  name: string;
  category: 'Speech & Thinking' | 'Journal & Reflection' | 'Productivity & Growth' | 'System & Privacy';
  tabId: string;
  icon: any;
  summary: string;
  screenshot: string;
  screenshotBreakdown: Array<{ element: string; description: string }>;
  steps: string[];
  example: {
    input: string;
    action: string;
    output: string;
  };
  internals: {
    file: string;
    functionName: string;
    description: string;
  };
  limitations: string;
  troubleshooting: string;
}

const FEATURE_DOCS: FeatureDoc[] = [
  {
    id: 'voice_studio',
    name: 'Voice Practice Studio',
    category: 'Speech & Thinking',
    tabId: 'studio',
    icon: Mic,
    summary: 'A private, zero-judgment audio recording laboratory designed specifically for introverts and thoughtful communicators. It captures microphone audio, displays live volume RMS activity, tracks silence intervals (>1.2s), provides real-time Web Speech transcription with manual correction, and calculates physical delivery metrics without peer anxiety.',
    screenshot: '/screenshots/02-voice-practice-studio.png',
    screenshotBreakdown: [
      { element: 'Top Practice Tabs', description: 'Switch between 5 structured modes: Daily Speaking Prompts, Impromptu Speaking, Interview (STAR), Presentation, and Roleplay.' },
      { element: 'Recording Canvas', description: 'Central terracotta Start Recording button, real-time volume frequency meter, and live session duration timer.' },
      { element: 'Transcript Editor', description: 'Real-time text streaming with an editable box allowing manual fixes before coaching evaluation.' },
      { element: 'Delivery Meters', description: 'Live calculation of Speaking Pace (WPM), Filler Word Density, and Pause Frequency.' }
    ],
    steps: [
      'Select your desired practice mode and difficulty level (Foundational, Intermediate, Advanced).',
      'Click the terracotta Start Recording button and grant microphone access if prompted.',
      'Speak your answer into the microphone while watching the volume level meter and session timer.',
      'Click Stop Recording when finished.',
      'Review your calculated WPM pace and filler words, then click Generate Evidence Coaching Report.'
    ],
    example: {
      input: 'Spoken reflection: "Handling unexpected questions by pausing deliberately for 2 seconds before answering."',
      action: 'Recorded 33 seconds of audio at 132 words per minute.',
      output: 'Optimal pace rating (130-165 WPM band) with 1.5% filler word frequency.'
    },
    internals: {
      file: 'src/services/speechAnalysisService.ts',
      functionName: 'calculateSpeechMetrics()',
      description: 'Calculates WPM via word count / duration * 60, and parses filler words using strict regex tokenization across "um", "uh", "like", "you know", and "basically".'
    },
    limitations: 'Live speech transcription requires browsers supporting the Web Speech API (Chrome, Edge, Safari).',
    troubleshooting: 'If microphone permission is blocked, click the URL padlock icon in your browser and switch Microphone to Allow.'
  },
  {
    id: 'coaching_report',
    name: 'Evidence-Based Coaching Report',
    category: 'Speech & Thinking',
    tabId: 'speech_report',
    icon: Award,
    summary: 'An empirical rhetorical evaluation engine that assesses user answers against the PREP framework (Point, Reason, Example, Point). It quotes verbatim phrases from the transcript, ranks delivery weaknesses by listener cognitive friction, rewrites the response into a gold-standard model, and provides targeted micro-drills.',
    screenshot: '/screenshots/04-evidence-coaching-report.png',
    screenshotBreakdown: [
      { element: 'PREP Assessment Checklist', description: 'Confirms whether Point, Reason, Concrete Example, and Conclusion were delivered.' },
      { element: 'Strengths with Quotes', description: 'Highlights exact phrases from the user transcript that demonstrated clarity.' },
      { element: 'Ranked Weaknesses', description: 'Prioritizes flaws with verbatim evidence, explaining why they increase listener fatigue.' },
      { element: 'Clearer Model Response', description: 'A complete rewritten PREP model response demonstrating high-impact framing.' }
    ],
    steps: [
      'Record a practice session in the Voice Studio or click Insert Sample Answer.',
      'Click Generate Evidence Coaching Report.',
      'Review your PREP structure checkmarks and confidence score.',
      'Read the Ranked Weaknesses and study the rewritten Clearer Alternative Response.',
      'Click Launch Retest Challenge to practice again with specific focus criteria.'
    ],
    example: {
      input: 'Unstructured practice response lacking a concrete metric or example.',
      action: 'Dispatched to Gemini 2.5 Flash with strict Zod schema validation.',
      output: 'PREP evaluation flagging missing example, generating rewritten answer with a 45-minute resolution benchmark.'
    },
    internals: {
      file: 'server/index.ts & server/ai/provider-manager.ts',
      functionName: 'dispatchSpeechAnalysis()',
      description: 'Multi-provider waterfall sending transcript and metrics to Gemini, Groq, Cerebras, Ollama, or deterministic local heuristics.'
    },
    limitations: 'AI generation requires active backend connection or falls back to local heuristic rules.',
    troubleshooting: 'If report generation times out, verify your GEMINI_API_KEY in .env and run npx tsx server/check-key.ts.'
  },
  {
    id: 'thinking_gym',
    name: 'The Thinking Gym',
    category: 'Speech & Thinking',
    tabId: 'thinking',
    icon: Brain,
    summary: 'A cognitive workout laboratory offering structured reasoning exercises across 10 analytical domains. Designed to strengthen the cognitive foundation of verbal communication by rewarding intellectual honesty, assumption audits, and bias recognition over mere rhetorical confidence.',
    screenshot: '/screenshots/05-thinking-gym-catalog.png',
    screenshotBreakdown: [
      { element: '10 Domain Selector', description: 'Tabs for Critical Logic, Fact vs Opinion, Biases, First Principles, Systems Thinking, and more.' },
      { element: 'Scenario Card', description: 'Presents real-world dilemma premise, difficulty level, and explicit rubric criteria.' },
      { element: 'Reasoning Editor', description: 'Textarea for typing structured arguments and deconstructing hidden assumptions.' },
      { element: 'Rubric Evaluator', description: 'Submit button triggering multi-criteria pedagogical evaluation.' }
    ],
    steps: [
      'Select any of the 10 domain tabs in the horizontal selector.',
      'Read the scenario premise and challenge question.',
      'Write your reasoned analysis in the text box, explicitly auditing assumptions.',
      'Click Evaluate with Cognitive Rubric.',
      'Inspect your intellectual honesty score and steel-manned counterarguments.'
    ],
    example: {
      input: 'Reasoning identifying potential confounding variables in a workplace causality claim.',
      action: 'Evaluated against the Critical Logic rubric.',
      output: 'Score of 88/100, intellectual honesty rating of 90%, and suggested falsification test.'
    },
    internals: {
      file: 'src/components/thinking/ThinkingGymView.tsx',
      functionName: 'evaluateThinkingExercise()',
      description: 'Applies cognitive rubric evaluation assessing claim-evidence separation and uncertainty calibration.'
    },
    limitations: 'Evaluations focus on epistemic rigor and structure rather than domain-specific factual trivia.',
    troubleshooting: 'If evaluation button is disabled, ensure you have typed at least one sentence of reasoning.'
  },
  {
    id: 'introvert_curriculum',
    name: 'Introvert Practice Programme',
    category: 'Speech & Thinking',
    tabId: 'program',
    icon: Compass,
    summary: 'A 5-stage progressive desensitization pathway that guides introverted communicators from low-pressure private vocal practice to high-stakes group simulations and real-world conversations without overwhelming them.',
    screenshot: '/screenshots/07-introvert-program-curriculum.png',
    screenshotBreakdown: [
      { element: 'Stage Indicator', description: 'Visual progress bar tracking stages 1 through 5.' },
      { element: 'Time Constraint Chips', description: 'Customizes daily drills for 5, 15, or 30 available minutes.' },
      { element: 'Stage Modules', description: 'Expandable stage cards with specific exercises and completion checkboxes.' },
      { element: 'Comfort Rating', description: 'Self-reported subjective vocal confidence rating scale (1-10).' }
    ],
    steps: [
      'Choose your daily practice time budget (5, 15, or 30 minutes).',
      'Select your current stage (Stage 1 for solo vocalization; Stage 2 for PREP structure).',
      'Read the assigned exercise and launch into the Voice Studio.',
      'Check off completed drills to update your curriculum progress.'
    ],
    example: {
      input: '15 minutes daily time budget in Stage 2 (Clear & Structured Answers).',
      action: 'Completed 60-Second PREP Challenge drill.',
      output: 'Curriculum progress updated to 40% with next drill unlocked.'
    },
    internals: {
      file: 'src/components/program/IntrovertProgramView.tsx',
      functionName: 'updateCurriculumState()',
      description: 'Persists active stage, completed drill IDs, and comfort ratings to LocalStorage.'
    },
    limitations: 'Self-paced; requires honest user self-reporting for drill completion.',
    troubleshooting: 'Use the reset button in Settings if you wish to restart the curriculum from Stage 1.'
  },
  {
    id: 'speech_stats',
    name: 'Speech & Thinking Stats',
    category: 'Speech & Thinking',
    tabId: 'speech_progress',
    icon: Activity,
    summary: 'A longitudinal progress tracker providing mathematical confirmation that speaking fluency, pacing control, and concise phrasing are improving across weeks and months of practice.',
    screenshot: '/screenshots/08-speech-thinking-stats.png',
    screenshotBreakdown: [
      { element: 'Pace Trend Line', description: 'Line chart comparing speaking pace against the 130-165 WPM optimal band.' },
      { element: 'Filler Reduction Bar Chart', description: 'Visualizes reduction in filler word density across consecutive sessions.' },
      { element: 'Recurrent Strengths', description: 'Identifies persistent verbal habits praised across coaching reports.' },
      { element: 'Session History Log', description: 'Detailed table of past recordings with duration and one-click report relaunchers.' }
    ],
    steps: [
      'Complete at least two voice practice sessions.',
      'Navigate to Speech & Thinking Stats in the sidebar.',
      'Inspect your pacing curve to see if you are staying within the optimal 130-165 WPM zone.',
      'Review your session history table to monitor filler word reduction.'
    ],
    example: {
      input: 'Practice sessions over 7 days showing pacing increase from 110 WPM to 142 WPM.',
      action: 'Aggregated via Recharts visualization engine.',
      output: 'Green target band alignment and 45% reduction in filler density.'
    },
    internals: {
      file: 'src/components/progress/SpeechProgressView.tsx',
      functionName: 'Recharts LineChart & BarChart rendering',
      description: 'Parses speechReports array from AppContext, plotting WPM and filler percentage chronologically.'
    },
    limitations: 'Charts require at least 1 completed practice session to display trend curves.',
    troubleshooting: 'If history table is empty, complete a session in Voice Studio and click Generate Coaching Report.'
  },
  {
    id: 'daily_diary',
    name: 'Daily Diary Reflection',
    category: 'Journal & Reflection',
    tabId: 'diary',
    icon: BookOpen,
    summary: 'A tranquil, distraction-free personal psychology diary designed for logging daily experiences, emotional states, sleep hours, and stress levels without judgment.',
    screenshot: '/screenshots/09-daily-diary.png',
    screenshotBreakdown: [
      { element: 'Date Selector', description: 'Allows picking today or logging reflections for previous dates.' },
      { element: 'Wellbeing Sliders', description: 'Sliders for Mood (1-5), Energy (1-10), Stress (1-10), and Sleep (hours).' },
      { element: 'Content Textarea', description: 'Long-form writing area with live word counter.' },
      { element: 'Tag Management', description: 'Interactive pills for tagging entries by topic (e.g., #communication, #focus).' }
    ],
    steps: [
      'Click Write Today\'s Reflection in the sidebar or New Entry in the header.',
      'Adjust the Mood, Energy, Stress, and Sleep sliders to reflect your current physical state.',
      'Type your reflection into the content area.',
      'Click Save Reflection.',
      'Click AI Daily Review to generate an empirical analysis of your entry.'
    ],
    example: {
      input: 'Entry describing a high-pressure presentation, noting a 2-second pause before speaking.',
      action: 'Saved with Mood: 4, Energy: 8, Stress: 3, Sleep: 7.5 hrs.',
      output: 'Stored in LocalStorage and flagged as ready for psychological analysis.'
    },
    internals: {
      file: 'src/components/diary/DailyDiary.tsx',
      functionName: 'saveEntry()',
      description: 'Calculates word count, day of week, formats entry object, checks safety triggers, and prepends to entries array.'
    },
    limitations: 'Plaintext entries are stored in browser LocalStorage by default.',
    troubleshooting: 'If entries disappear after closing browser in Incognito mode, use normal browsing mode to persist LocalStorage.'
  },
  {
    id: 'ai_daily_review',
    name: 'AI Daily Review',
    category: 'Journal & Reflection',
    tabId: 'review',
    icon: Sparkles,
    summary: 'A psychological synthesis engine that reads the daily journal entry and produces a structured 8-dimension review (A through H) analyzing cognitive distortions, decision quality, and tomorrow recommendations.',
    screenshot: '/screenshots/10-ai-daily-review.png',
    screenshotBreakdown: [
      { element: 'Dimensions A-H Cards', description: 'Structured cards covering Executive Summary, Biases, Decisions, Social Dynamics, and Habits.' },
      { element: 'Evidence Anchors', description: 'Direct quotes from the entry supporting each psychological observation.' },
      { element: 'Actionable Recommendations', description: 'Concrete micro-action suggestions with + Add to Actions button.' },
      { element: 'Confidence Score', description: 'Scoring indicator assessing the empirical grounding of the analysis.' }
    ],
    steps: [
      'Save a diary entry in the Daily Diary.',
      'Click AI Daily Review in the sidebar.',
      'Review the 8-dimension breakdown (A through H).',
      'Click Add to Actions on any recommended tomorrow micro-habit.'
    ],
    example: {
      input: 'Diary entry describing defensiveness during a peer code review.',
      action: 'Analyzed via Gemini 2.5 Flash / local heuristic engine.',
      output: 'Flagged "Mind Reading" distortion; recommended asking clarifying questions before defending code.'
    },
    internals: {
      file: 'src/services/aiEngine.ts',
      functionName: 'analyzeEntry() & updateDimensionsWithReview()',
      description: 'Parses entry through strict Zod schema, updates psychological dimensions, and calculates growth deltas.'
    },
    limitations: 'Requires at least one saved diary entry.',
    troubleshooting: 'If analysis fails to load, ensure backend server is active on port 3001 or let the local heuristic engine process it.'
  },
  {
    id: 'psychological_growth',
    name: 'Psychological Growth (30 Dimensions)',
    category: 'Journal & Reflection',
    tabId: 'growth',
    icon: TrendingUp,
    summary: 'An evidence-based psychological dashboard tracking user maturity across 30 distinct dimensions such as Emotional Self-Regulation, Intellectual Humility, Boundary Setting, and Stoic Resilience.',
    screenshot: '/screenshots/11-psychological-growth.png',
    screenshotBreakdown: [
      { element: 'Domain Filter Tabs', description: 'Filter dimensions by Cognitive, Emotional, Social, or Behavioral categories.' },
      { element: 'Dimension Cards', description: 'Displays score (0-100), baseline description, and recent score delta.' },
      { element: 'Evidence History', description: 'Shows specific diary entries and reviews that influenced each dimension score.' }
    ],
    steps: [
      'Navigate to Psychological Growth in the sidebar.',
      'Browse through the 30 dimensions or filter by category.',
      'Inspect any dimension card to review recent score changes and evidence quotes.'
    ],
    example: {
      input: 'Multiple journal entries demonstrating deliberate pausing and objective evidence reviews.',
      action: 'Scored via recomputeDimensionsFromUserEntries().',
      output: 'Emotional Self-Regulation increased from 65 to 78 with positive delta indicator.'
    },
    internals: {
      file: 'src/services/analyticsService.ts',
      functionName: 'recomputeDimensionsFromUserEntries()',
      description: 'Iterates through user entries and reviews, matching psychological keywords and rubric observations.'
    },
    limitations: 'Scores reflect self-reported diary entries and algorithmic pedagogical estimates.',
    troubleshooting: 'To reset dimensions to default baseline, visit Settings & Privacy and click Reset to Sample Data.'
  },
  {
    id: 'ai_coach',
    name: 'Conversational AI Coach Drawer',
    category: 'System & Privacy',
    tabId: 'overview',
    icon: MessageSquare,
    summary: 'A slide-out conversational mentor available on every screen. Provides real-time Socratic inquiry, advice on communication framing, and constructive feedback grounded in the user\'s personal journal history.',
    screenshot: '/screenshots/21-ai-coach-drawer.png',
    screenshotBreakdown: [
      { element: 'Slide-Out Drawer', description: 'Appears smoothly on the right side without navigating away from the current page.' },
      { element: 'Message Stream', description: 'Displays conversation history between user and AI coach.' },
      { element: 'Input Bar', description: 'Text entry box with Send button and Socratic suggestion chips.' },
      { element: 'Close Button', description: 'Top-right X button or backdrop click to dismiss the drawer.' }
    ],
    steps: [
      'Click Coach in the top navigation header or Ask AI Coach in the sidebar.',
      'Type your question or dilemma (e.g., "How should I structure my proposal tomorrow?").',
      'Press Enter or click the Send button.',
      'Read the coach\'s Socratic guidance and practical framing recommendations.'
    ],
    example: {
      input: 'Query: "I feel anxious about speaking up in tomorrow\'s design review."',
      action: 'Dispatched to /api/ai/coach.',
      output: 'Coach outlines a 3-step PREP script and suggests taking a 2-second pause before opening.'
    },
    internals: {
      file: 'src/components/coach/ConversationalCoachDrawer.tsx',
      functionName: 'sendCoachMessage()',
      description: 'Posts query with recent entries and dimensions to /api/ai/coach; updates conversation state in AppContext.'
    },
    limitations: 'Conversations are stored in browser memory and LocalStorage.',
    troubleshooting: 'If the coach fails to respond, verify port 3001 is running and check console network tab.'
  },
  {
    id: 'safety_modal',
    name: 'Compassionate Crisis Safeguard',
    category: 'System & Privacy',
    tabId: 'overview',
    icon: Shield,
    summary: 'An immediate compassionate safeguard dialog providing free, confidential 24/7 crisis resources (988 in US/Canada, 111 in UK, 13 11 14 in Australia) whenever acute distress language is detected.',
    screenshot: '/screenshots/23-safety-modal.png',
    screenshotBreakdown: [
      { element: 'Heart & Shield Icon', description: 'Clear compassionate visual indicator.' },
      { element: 'Support Notice', description: 'Affirms that MindMirror is a self-reflection tool, not a clinical crisis service.' },
      { element: '24/7 Hotlines Card', description: 'Direct numbers and links for instant confidential phone and text support.' },
      { element: 'Close Button', description: 'Dismissible modal allowing user to resume application.' }
    ],
    steps: [
      'Click the Shield icon in the top header at any time.',
      'The modal displays verified 24/7 crisis telephone hotlines and text services.',
      'Click any phone number or link to connect immediately, or click X to close.'
    ],
    example: {
      input: 'User types language indicating extreme crisis or clicks the header shield icon.',
      action: 'Client-side regex check triggers setSafetyAlertOpen(true).',
      output: 'Modal opens immediately with 988 lifeline numbers displayed.'
    },
    internals: {
      file: 'src/components/common/SafetyModal.tsx',
      functionName: 'checkSafetyTriggers()',
      description: 'Pure client-side regex scanner inspecting text for distress terms; zero data is logged or reported.'
    },
    limitations: 'Information resource only; does not replace licensed medical or psychiatric care.',
    troubleshooting: 'If modal appears unexpectedly, review recent diary text for accidental trigger words.'
  }
];

export const VisualGuideView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('voice_studio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Speech & Thinking', 'Journal & Reflection', 'System & Privacy'];

  const filteredFeatures = FEATURE_DOCS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeDoc = FEATURE_DOCS.find(d => d.id === selectedFeatureId) || FEATURE_DOCS[0];
  const Icon = activeDoc.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
            In-App Documentation & Learning System
          </span>
          <span className="text-xs text-secondary font-mono">22 Illustrated Features</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-1 tracking-tight">
          Visual Feature Guide & Technical Documentation
        </h1>
        <p className="text-sm text-secondary mt-1 max-w-3xl">
          Explore every feature of MindMirror AI with genuine interface screenshots, step-by-step tutorials, code internals, practical examples, and troubleshooting instructions.
        </p>
      </div>

      {/* Main Grid: Sidebar Navigator + Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, tools, metrics..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-1 border border-border text-primary placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-accent text-accent-fg border-accent'
                    : 'bg-surface-1 border-border text-secondary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feature List */}
          <div className="bg-surface-1 border border-border rounded-xl p-2 space-y-1 max-h-[640px] overflow-y-auto">
            {filteredFeatures.map((feat) => {
              const FeatIcon = feat.icon;
              const isSelected = feat.id === activeDoc.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => setSelectedFeatureId(feat.id)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-accent/15 text-accent border border-accent/30 font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-surface-2'
                  }`}
                >
                  <FeatIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-accent' : 'text-muted'}`} />
                  <div className="min-w-0">
                    <span className="text-xs block truncate">{feat.name}</span>
                    <span className="text-[10px] text-muted block truncate font-mono">{feat.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Article View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-1 border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-subtle">
            {/* Header with Launch Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold block">
                    {activeDoc.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
                    {activeDoc.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(activeDoc.tabId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-xs font-medium hover:opacity-90 transition-opacity self-start sm:self-auto shadow-subtle"
              >
                <span>Launch This Feature</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. What is this feature? */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                1. What is this feature?
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                {activeDoc.summary}
              </p>
            </div>

            {/* 2. Genuine Screenshot (DIRECTLY BELOW IT) */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                2. Feature Screenshot
              </h3>
              <div className="rounded-xl overflow-hidden border border-border bg-canvas shadow-subtle">
                <img
                  src={activeDoc.screenshot}
                  alt={`${activeDoc.name} Interface Screenshot`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <span className="text-[11px] text-muted font-mono block text-center">
                Genuine Chrome capture at 1440 × 900 desktop resolution.
              </span>
            </div>

            {/* 3. Understand the Screenshot */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                3. Understand the Screenshot Elements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeDoc.screenshotBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-surface-2 border border-border space-y-1">
                    <span className="text-xs font-semibold text-primary block flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-accent/20 text-accent text-[10px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {item.element}
                    </span>
                    <span className="text-xs text-secondary leading-snug block">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. How to use this feature */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                4. Step-by-Step Tutorial
              </h3>
              <ol className="space-y-2 text-xs text-secondary list-decimal list-inside bg-surface-2 p-4 rounded-xl border border-border">
                {activeDoc.steps.map((st, i) => (
                  <li key={i} className="leading-relaxed">
                    <strong className="text-primary font-medium">Step {i + 1}:</strong> {st}
                  </li>
                ))}
              </ol>
            </div>

            {/* 5. Practical Example */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                5. Practical Example
              </h3>
              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2 text-xs">
                <div>
                  <span className="text-muted font-mono uppercase text-[10px] block">Input Sample:</span>
                  <span className="text-primary font-serif italic block mt-0.5">"{activeDoc.example.input}"</span>
                </div>
                <div>
                  <span className="text-muted font-mono uppercase text-[10px] block">Action:</span>
                  <span className="text-secondary block mt-0.5">{activeDoc.example.action}</span>
                </div>
                <div>
                  <span className="text-muted font-mono uppercase text-[10px] block">Expected Result:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5">{activeDoc.example.output}</span>
                </div>
              </div>
            </div>

            {/* 6. Code Internals */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                6. How It Works Internally
              </h3>
              <div className="bg-canvas p-4 rounded-xl border border-border font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-muted text-[11px] border-b border-border pb-1">
                  <span>Source File: <strong className="text-primary">{activeDoc.internals.file}</strong></span>
                  <span>Function: <strong className="text-accent">{activeDoc.internals.functionName}</strong></span>
                </div>
                <p className="text-secondary text-[11px] leading-relaxed pt-1">
                  {activeDoc.internals.description}
                </p>
              </div>
            </div>

            {/* 7. Limitations & Troubleshooting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1 text-xs">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Known Limitations
                </span>
                <span className="text-secondary block leading-snug">
                  {activeDoc.limitations}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1 text-xs">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Troubleshooting Tip
                </span>
                <span className="text-secondary block leading-snug">
                  {activeDoc.troubleshooting}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualGuideView;
