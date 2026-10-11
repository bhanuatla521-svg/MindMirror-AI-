import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  FileText,
  Layers,
  Server,
  Database,
  Image,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Shield,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Search,
  Sparkles,
  Mic,
  Brain,
  Compass,
  Activity,
  Heart,
  Users,
  CheckSquare,
  Target,
  Settings,
  MessageSquare,
  ArrowRight,
  Maximize2,
  X,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SinglePageDocumentationView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeNav, setActiveNav] = useState('overview');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; desc: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    docs: true,
    public: true,
    server: true,
    src: true,
    supabase: true
  });

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const screenshots = [
    { id: '01', file: '01-overview-dashboard.png', title: 'Overview Dashboard', category: 'Core', desc: 'Central reflective cockpit with Socratic inquiry suggestions, latest wellbeing stats, and training shortcuts.' },
    { id: '02', file: '02-voice-practice-studio.png', title: 'Voice Practice Studio (Canvas)', category: 'Speech', desc: 'Private vocal recording laboratory with real-time volume RMS visualizer and 5 practice mode selector tabs.' },
    { id: '03', file: '03-voice-studio-sample-input.png', title: 'Voice Studio (Sample Input)', category: 'Speech', desc: 'Populated transcript editor calculating 132 WPM pace, 1.5% filler word frequency, and audio playback.' },
    { id: '04', file: '04-evidence-coaching-report.png', title: 'Evidence-Based Coaching Report', category: 'Speech', desc: 'PREP argument rubric evaluation, verbatim quoted strengths, ranked delivery weaknesses, and micro-drills.' },
    { id: '05', file: '05-thinking-gym-catalog.png', title: 'The Thinking Gym (10 Domains)', category: 'Thinking', desc: 'Cognitive exercise laboratory with scenario premise, challenge questions, and reasoning response editor.' },
    { id: '07', file: '07-introvert-program-curriculum.png', title: 'Introvert Practice Programme', category: 'Thinking', desc: '5-stage progressive desensitization curriculum with 5, 15, and 30-minute daily practice constraints.' },
    { id: '08', file: '08-speech-thinking-stats.png', title: 'Speech & Thinking Stats', category: 'Analytics', desc: 'Longitudinal pacing curve against optimal 130-165 WPM band and filler word density reduction tracking.' },
    { id: '09', file: '09-daily-diary.png', title: 'Daily Psychology Diary', category: 'Journal', desc: 'Distraction-free personal journal canvas with Mood (1-5), Energy (1-10), Stress (1-10), and Sleep sliders.' },
    { id: '10', file: '10-ai-daily-review.png', title: 'AI Daily Review (A-H)', category: 'Journal', desc: 'Structured 8-dimension psychological review analyzing cognitive distortions and tomorrow recommendations.' },
    { id: '11', file: '11-psychological-growth.png', title: 'Psychological Growth (30 Dimensions)', category: 'Journal', desc: 'Transparent scoring across 30 dimensions including Emotional Self-Regulation and Intellectual Humility.' },
    { id: '12', file: '12-emotional-wellness.png', title: 'Emotional Wellness Tracker', category: 'Journal', desc: 'Emotional regulation strategies, mood triggers, and stress-to-energy correlation tracking.' },
    { id: '13', file: '13-social-intelligence.png', title: 'Social Intelligence Studio', category: 'Journal', desc: 'Assertive boundary setting, social battery depletion monitoring, and conversational retrospectives.' },
    { id: '14', file: '14-critical-thinking.png', title: 'Critical Thinking Toolkit', category: 'Thinking', desc: 'Interactive worksheets for identifying cognitive fallacies, challenging assumptions, and testing premises.' },
    { id: '15', file: '15-habits-and-discipline.png', title: 'Habits & Discipline Matrix', category: 'Productivity', desc: 'Habit consistency grid with day-by-day streak counter and friction-reduction routine planner.' },
    { id: '16', file: '16-goals-and-action-plans.png', title: 'Goals & Action Plans', category: 'Productivity', desc: 'Quarterly goals decomposition into measurable monthly milestones and daily micro-actions.' },
    { id: '17', file: '17-weekly-review.png', title: 'Weekly Review Retrospective', category: 'Journal', desc: '7-day retrospective engine synthesizing weekly milestones, recurrent obstacles, and priorities.' },
    { id: '18', file: '18-reports-and-export.png', title: 'Reports & Data Export', category: 'System', desc: 'Data portability hub for downloading complete reflection records as JSON, CSV, or printable PDF.' },
    { id: '19', file: '19-personal-insights.png', title: 'Personal Insights Engine', category: 'Analytics', desc: 'Algorithmic correlation finder linking sleep hours, stress levels, speaking pace, and confidence.' },
    { id: '20', file: '20-settings-and-privacy.png', title: 'Settings & Privacy Center', category: 'System', desc: 'AI provider priority switching (Gemini, Groq, Cerebras, Ollama, Heuristic) and local storage purge.' },
    { id: '21', file: '21-ai-coach-drawer.png', title: 'Conversational AI Coach Drawer', category: 'System', desc: 'Slide-out Socratic mentor dialogue available on every screen for clarifying thoughts and communication.' },
    { id: '22', file: '22-theme-customization.png', title: 'Visual Theme Customization', category: 'System', desc: 'One-click contrast switching between Light, Dark, Warm Editorial, and Ultra-Minimal palettes.' },
    { id: '23', file: '23-safety-modal.png', title: 'Compassionate Crisis Safeguard', category: 'System', desc: '24/7 free and confidential crisis resources dialog (988 US/Canada, 111 UK, 13 11 14 Australia).' },
    { id: '24', file: '24-visual-guide-docs.png', title: 'In-App Documentation Guidebook', category: 'System', desc: 'Interactive searchable feature guide embedded directly inside the running web application.' }
  ];

  const filteredScreenshots = screenshots.filter(s => {
    const matchCat = galleryFilter === 'All' || s.category === galleryFilter;
    const matchSearch = s.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                        s.desc.toLowerCase().includes(gallerySearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const navItems = [
    { id: 'overview', label: '1. Project Overview' },
    { id: 'repo-tree', label: '2. Complete Repository Tree' },
    { id: 'folder-explorer', label: '3. Folder-by-Folder Explorer' },
    { id: 'docs-explained', label: '4. Documentation Files (`docs/`)' },
    { id: 'src-explained', label: '5. Frontend Architecture (`src/`)' },
    { id: 'server-explained', label: '6. Backend Server (`server/`)' },
    { id: 'supabase-explained', label: '7. Database & Supabase (`supabase/`)' },
    { id: 'architecture-flow', label: '8. Architecture & Data Flow' },
    { id: 'screenshot-gallery', label: '9. Screenshot & Feature Gallery' },
    { id: 'learning-path', label: '10. Beginner Learning Path' },
    { id: 'function-reference', label: '11. Code Function Reference' },
    { id: 'testing-matrix', label: '12. Testing & Quality Assurance' },
    { id: 'troubleshooting', label: '13. Troubleshooting & FAQ' },
    { id: 'setup-run', label: '14. Setup & Run Instructions' },
    { id: 'security-privacy', label: '15. Security & Privacy' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 text-primary">
      {/* =========================================================================
          SECTION A: PROFESSIONAL HERO
      ========================================================================= */}
      <section id="overview" className="relative overflow-hidden rounded-3xl bg-surface-1 border border-border p-8 md:p-12 shadow-subtle">
        <div className="max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Repository Documentation
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-surface-2 border border-border text-secondary">
              Single-Page Master Hub • v1.1.0
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-tight">
            MindMirror AI
          </h1>
          <p className="text-base md:text-lg text-secondary leading-relaxed font-sans">
            An evidence-based personal communication practice studio, cognitive reasoning gym, and longitudinal self-reflection platform designed specifically for introverts and thoughtful communicators.
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">React 18.3</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">TypeScript 5.7</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">Vite 6.1</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">Tailwind CSS 3.4</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">Express 5.3</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-accent font-medium">Google Gemini 2.5 Flash</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-emerald-600 dark:text-emerald-400 font-medium">Local-First Storage</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-primary font-medium">MIT License</span>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => scrollToSection('repo-tree')}
              className="px-4 py-2.5 rounded-xl bg-accent text-accent-fg text-xs font-semibold hover:opacity-90 transition-all shadow-subtle flex items-center gap-2"
            >
              <FolderTree className="w-4 h-4" />
              <span>Explore Repository Tree</span>
            </button>
            <button
              onClick={() => scrollToSection('screenshot-gallery')}
              className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-primary text-xs font-semibold hover:bg-surface-hover transition-colors flex items-center gap-2"
            >
              <Image className="w-4 h-4 text-accent" />
              <span>Browse 24 Screenshots</span>
            </button>
            <button
              onClick={() => scrollToSection('architecture-flow')}
              className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-primary text-xs font-semibold hover:bg-surface-hover transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>Architecture & Data Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-primary text-xs font-semibold hover:bg-surface-hover transition-colors flex items-center gap-2 text-accent"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Running Web App</span>
            </button>
          </div>

          {/* Metrics Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] font-mono uppercase text-muted block">Screenshots</span>
              <span className="text-xl font-bold font-serif text-primary">24 Real Captures</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] font-mono uppercase text-muted block">Documented Features</span>
              <span className="text-xl font-bold font-serif text-primary">23 User Modules</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] font-mono uppercase text-muted block">Thinking Domains</span>
              <span className="text-xl font-bold font-serif text-primary">10 Cognitive Fields</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] font-mono uppercase text-muted block">Psychological Scale</span>
              <span className="text-xl font-bold font-serif text-primary">30 Dimensions</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: STICKY TABLE OF CONTENTS
      ========================================================================= */}
      <nav className="sticky top-16 z-20 bg-surface-1/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-subtle">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-mono uppercase text-muted font-semibold px-2 shrink-0">
            Contents:
          </span>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeNav === item.id
                  ? 'bg-accent text-accent-fg font-semibold shadow-subtle'
                  : 'text-secondary hover:text-primary hover:bg-surface-2'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* =========================================================================
          SECTION C: COMPLETE REPOSITORY TREE
      ========================================================================= */}
      <section id="repo-tree" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 2</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Complete Repository Structure
          </h2>
          <p className="text-xs text-secondary mt-1">
            An accurate directory map reflecting the real codebase. Excludes bulky build artifacts and dependencies.
          </p>
        </div>

        <div className="bg-canvas border border-border rounded-2xl p-5 md:p-6 font-mono text-xs overflow-x-auto text-secondary leading-relaxed">
          <pre className="text-primary">{`MindMirror-AI/
├── 📁 docs/                         # Complete technical documentation & visual library
│   ├── 📁 screenshots/              # 24 Genuine 1440×900 desktop application screenshots
│   ├── 📄 architecture.md           # System architecture, Web Audio RMS, and AI cascade specs
│   ├── 📄 beginner-guide.md         # 5 Step-by-step tutorials, PREP examples, FAQs, glossary
│   ├── 📄 feature-reference.md      # Detailed 9-section reference for all 23 user-facing features
│   ├── 📄 function-reference.md     # Code-level function signatures, parameters, and algorithms
│   ├── 📄 screenshot-index.md       # Cross-referenced catalog of all 24 genuine UI captures
│   ├── 📄 testing.md                # QA testing guide, budget tests, and schema verification
│   └── 📄 troubleshooting.md        # Solutions for ports, microphone permissions, API keys
├── 📁 public/                       # Static public assets served directly by Vite
│   └── 📁 screenshots/              # 24 In-app served screenshots for the Visual Guide
├── 📁 server/                       # Node.js + Express backend service (Port 3001)
│   ├── 📁 ai/                       # Multi-model AI waterfall cascade adapters
│   │   ├── 📄 gemini-adapter.ts     # Google Gemini 2.5 Flash primary hosted client
│   │   ├── 📄 groq-adapter.ts       # Groq llama-3.3-70b-versatile fast failover
│   │   ├── 📄 cerebras-adapter.ts   # Cerebras llama3.1-8b ultra-fast failover
│   │   ├── 📄 ollama-adapter.ts     # Ollama private local model adapter (llama3.2)
│   │   ├── 📄 local-heuristic.ts    # Deterministic zero-crash offline heuristic engine
│   │   ├── 📄 provider-manager.ts   # Request dispatcher, waterfall chain, timeout control
│   │   ├── 📄 budget-tracker.ts     # Daily (100) & monthly (2500) API request ceilings
│   │   ├── 📄 dedup-lock.ts         # In-flight deduplication lock preventing double-clicks
│   │   └── 📄 types.ts              # Zod validation schemas for coaching & reviews
│   ├── 📄 index.ts                  # Express router hosting all /api endpoints
│   ├── 📄 check-key.ts              # Diagnostic utility to verify Gemini API key
│   ├── 📄 test-ai.ts                # AI infrastructure, budget, and Zod compliance test
│   └── 📄 test-speech.ts            # Deterministic WPM, filler tokenizer, and schema tests
├── 📁 src/                          # React 18 + TypeScript frontend application (Port 3000)
│   ├── 📁 components/               # Modular UI feature views
│   │   ├── 📁 studio/               # VoiceStudio.tsx & SpeechCoachingReportView.tsx
│   │   ├── 📁 thinking/             # ThinkingGymView.tsx (10 cognitive domains)
│   │   ├── 📁 program/              # IntrovertProgramView.tsx (5-stage curriculum)
│   │   ├── 📁 progress/             # SpeechProgressView.tsx (Longitudinal stats charts)
│   │   ├── 📁 diary/                # DailyDiary.tsx (Long-form reflection editor)
│   │   ├── 📁 review/               # AIDailyReviewView.tsx (8-dimension psychological review)
│   │   ├── 📁 growth/               # PsychologicalGrowth.tsx (30 dimensions tracker)
│   │   ├── 📁 emotions/             # EmotionalWellness.tsx
│   │   ├── 📁 social/               # SocialIntelligence.tsx
│   │   ├── 📁 critical/             # CriticalThinking.tsx
│   │   ├── 📁 habits/               # HabitsAndDiscipline.tsx
│   │   ├── 📁 goals/                # GoalsAndActionPlans.tsx
│   │   ├── 📁 weekly/               # WeeklyReviewView.tsx
│   │   ├── 📁 reports/              # MonthlyYearlyReports.tsx & PDF Export
│   │   ├── 📁 insights/             # PersonalInsightsView.tsx
│   │   ├── 📁 settings/             # SettingsAndPrivacy.tsx
│   │   ├── 📁 coach/                # ConversationalCoachDrawer.tsx
│   │   ├── 📁 common/               # Header.tsx, Sidebar.tsx, SafetyModal.tsx
│   │   └── 📁 docs/                 # SinglePageDocumentationView.tsx & VisualGuideView.tsx
│   ├── 📁 context/                  # AppContext.tsx (Global state, LocalStorage sync)
│   ├── 📁 data/                     # Seed entries, 30 psychological dimensions, exercises
│   ├── 📁 services/                 # Deterministic speech algorithms, AI engine, analytics
│   ├── 📁 types/                    # Shared TypeScript interfaces
│   ├── 📄 App.tsx                   # Main layout container and active tab router
│   ├── 📄 main.tsx                  # React DOM root entry point
│   └── 📄 index.css                 # Design system tokens and 4 selectable themes
├── 📁 supabase/                     # Supabase cloud database configuration
│   └── 📄 schema.sql                # PostgreSQL tables, UUIDs, and Row-Level Security (RLS)
├── 📄 .env.example                  # Environment configuration template
├── 📄 .gitignore                    # Protects private API keys (.env) and node_modules
├── 📄 package.json                  # Dependencies, scripts (dev, server, build, test:ai)
├── 📄 tsconfig.json                 # Strict TypeScript 5.7 configuration
├── 📄 vite.config.ts                # Vite bundler configuration with /api proxy to 3001
├── 📄 README.md                     # GitHub landing page with gallery, badges, and guides
├── 📄 CONTRIBUTING.md               # Open-source contribution protocol
├── 📄 SECURITY.md                   # Security vulnerability reporting and privacy rules
├── 📄 CHANGELOG.md                  # Release version history
└── 📄 LICENSE                       # MIT License`}</pre>
        </div>

        {/* Directory Role Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📁 docs/</strong>
            <span className="text-secondary leading-snug block">Houses the complete technical documentation suite, architecture diagrams, and 24 genuine UI captures.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📁 public/</strong>
            <span className="text-secondary leading-snug block">Stores static assets and screenshots served directly by Vite for in-app visual documentation.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📁 server/</strong>
            <span className="text-secondary leading-snug block">Express backend managing AI provider waterfalls, request budgets, and Zod schema validations.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📁 src/</strong>
            <span className="text-secondary leading-snug block">React 18 client application containing 24 interactive feature views, Web Audio APIs, and state context.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📁 supabase/</strong>
            <span className="text-secondary leading-snug block">PostgreSQL schema, foreign key cascades, and Row-Level Security policies for multi-device sync.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
            <strong className="text-primary font-mono block">📄 Root Configs</strong>
            <span className="text-secondary leading-snug block">Vite, TypeScript, Tailwind, and environment configurations ensuring strict type safety and fast builds.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: DETAILED FOLDER EXPLORER
      ========================================================================= */}
      <section id="folder-explorer" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 3</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Folder-by-Folder Technical Explorer
          </h2>
          <p className="text-xs text-secondary mt-1">
            A deep architectural breakdown of every major directory in the repository.
          </p>
        </div>

        <div className="space-y-4">
          {/* Card: docs/ */}
          <div className="border border-border rounded-2xl p-5 md:p-6 bg-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold font-mono text-primary">docs/ & docs/screenshots/</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-1 border border-border text-muted">Documentation Hub</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              <strong>Purpose:</strong> Serves as the definitive reference library for developers, open-source contributors, and end-users. It contains 7 comprehensive Markdown guides covering system architecture, beginner onboarding, feature specifications, code-level functions, testing procedures, and troubleshooting resolutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Files Present:</span>
                <span className="text-muted font-mono text-[11px] block mt-0.5">architecture.md, beginner-guide.md, feature-reference.md, function-reference.md, screenshot-index.md, testing.md, troubleshooting.md</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Relationships:</span>
                <span className="text-secondary text-[11px] block mt-0.5">Linked by root README.md and mirrored in the in-app Visual Documentation & Guidebook view.</span>
              </div>
            </div>
          </div>

          {/* Card: server/ */}
          <div className="border border-border rounded-2xl p-5 md:p-6 bg-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold font-mono text-primary">server/</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-1 border border-border text-muted">Backend Service (Port 3001)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              <strong>Purpose:</strong> An Express 5 service executing on port 3001. Isolates sensitive AI provider API keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`), enforces daily/monthly request budgets, prevents duplicate simultaneous submissions via deduplication locks, and validates all JSON responses against strict Zod schemas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Key Files:</span>
                <span className="text-muted font-mono text-[11px] block mt-0.5">server/index.ts, ai/provider-manager.ts, ai/budget-tracker.ts, ai/dedup-lock.ts, test-ai.ts, test-speech.ts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Communication:</span>
                <span className="text-secondary text-[11px] block mt-0.5">Vite proxies client requests from /api to http://localhost:3001, ensuring seamless CORS handling.</span>
              </div>
            </div>
          </div>

          {/* Card: src/ */}
          <div className="border border-border rounded-2xl p-5 md:p-6 bg-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold font-mono text-primary">src/</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-1 border border-border text-muted">Frontend Client (Port 3000)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              <strong>Purpose:</strong> The complete React 18 single-page application. Features 24 views spanning speech recording, coaching reports, cognitive exercises, longitudinal progress tracking, daily journaling, and conversational AI coaching. Operates on a local-first principle with automatic LocalStorage synchronization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Subdirectories:</span>
                <span className="text-muted font-mono text-[11px] block mt-0.5">src/components/, src/context/, src/data/, src/services/, src/types/</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">State Management:</span>
                <span className="text-secondary text-[11px] block mt-0.5">Centralized via AppContext.tsx using custom useApp() hook with real-time localStorage sync.</span>
              </div>
            </div>
          </div>

          {/* Card: supabase/ */}
          <div className="border border-border rounded-2xl p-5 md:p-6 bg-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold font-mono text-primary">supabase/</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-1 border border-border text-muted">Database & Cloud Persistence</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              <strong>Purpose:</strong> Contains `schema.sql`, providing an enterprise-grade PostgreSQL relational schema with Row-Level Security (RLS) policies for multi-device sync, UUID keys, foreign key cascades, and audio storage buckets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Tables Defined:</span>
                <span className="text-muted font-mono text-[11px] block mt-0.5">profiles, diary_entries, ai_reviews, personal_dimensions, goals, habits, tracked_actions, weekly_reports</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary block">Security Model:</span>
                <span className="text-secondary text-[11px] block mt-0.5">Strict RLS policies ensure users can only query and mutate records where auth.uid() = user_id.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: EXPLAIN EVERY DOCUMENTATION FILE
      ========================================================================= */}
      <section id="docs-explained" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 4</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Documentation Library Breakdown (`docs/`)
          </h2>
          <p className="text-xs text-secondary mt-1">
            Summary of all 7 specialized technical markdown guides residing in `docs/`.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">architecture.md</span>
              <span className="text-[10px] font-mono text-accent">Architecture Specs</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Details system component topology, Web Audio API RMS visualizer pipeline, multi-model AI waterfall cascade, rate limits, and privacy security boundaries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">beginner-guide.md</span>
              <span className="text-[10px] font-mono text-accent">Beginner Tutorials</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Provides 5 comprehensive step-by-step tutorials with embedded screenshots, practical PREP communication examples, technical glossary, and setup instructions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">feature-reference.md</span>
              <span className="text-[10px] font-mono text-accent">23 User Features</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Exhaustive 9-section reference for all 23 application features. Every feature includes genuine screenshots, element breakdowns, inputs, outputs, and limitations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">function-reference.md</span>
              <span className="text-[10px] font-mono text-accent">Code & API Reference</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Documents important code-level functions, classes, interfaces, parameter types, return signatures, side effects, and all Express API routes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">screenshot-index.md</span>
              <span className="text-[10px] font-mono text-accent">24 Screenshot Index</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Cross-referenced catalog indexing all 24 genuine screenshots with filenames, demonstrated features, verification status, and doc links.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">testing.md</span>
              <span className="text-[10px] font-mono text-accent">Testing & QA Guide</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Explains test commands (`npm run test:ai`, `npx tsx server/test-speech.ts`, `npm run build`), schema verification, and QA matrices.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-mono">troubleshooting.md</span>
              <span className="text-[10px] font-mono text-accent">Troubleshooting Guide</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Provides practical resolutions for common issues: port 3000/3001 conflicts, microphone permissions, Web Speech streaming, API quotas, and Git push protection.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: ARCHITECTURE & DATA FLOW
      ========================================================================= */}
      <section id="architecture-flow" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 5</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Architecture & Data Flow
          </h2>
          <p className="text-xs text-secondary mt-1">
            System diagrams illustrating client audio telemetry, API orchestration, and multi-model failover.
          </p>
        </div>

        {/* Diagram 1: Multi-Model Waterfall */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
            1. Multi-Provider AI Waterfall Cascade
          </h3>
          <div className="bg-canvas border border-border rounded-2xl p-5 font-mono text-xs overflow-x-auto text-secondary leading-relaxed">
            <pre className="text-primary">{`[Client Request] (Sanitized text payload from Voice Studio or Diary)
       │
       ▼
[Express Server: Port 3001]
       │
       ├─► 1. In-Flight Dedup Lock (Acquires hash lock; rejects duplicate double-clicks)
       ├─► 2. Budget Ceiling Check (Daily limit <= 100, Monthly <= 2500)
       │
       ▼
[AI Waterfall Dispatcher]
       │
       ├──► (Attempt 1) Google Gemini (gemini-2.5-flash) [Timeout: 30s] ──► Success? ──► Return Zod Validated JSON
       │         │ (Failover on 429/500/timeout)
       │         ▼
       ├──► (Attempt 2) Groq (llama-3.3-70b-versatile) [Ultra-fast] ─────► Success? ──► Return Zod Validated JSON
       │         │ (Failover)
       │         ▼
       ├──► (Attempt 3) Cerebras (llama3.1-8b) [High-throughput] ────────► Success? ──► Return Zod Validated JSON
       │         │ (Failover)
       │         ▼
       ├──► (Attempt 4) Ollama (Local llama3.2 on localhost:11434) ──────► Success? ──► Return Zod Validated JSON
       │         │ (Failover)
       │         ▼
       └──► (Attempt 5) Deterministic Local Heuristic Engine ─────────────► Always Succeeds (Zero-Crash Guarantee)`}</pre>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            <strong>Explanation:</strong> Every speech coaching and daily review request passes through strict budget and deduplication safeguards before reaching external APIs. If an external quota is exhausted or internet access drops, the system automatically falls back through Groq, Cerebras, Ollama, and local heuristics, guaranteeing zero crashes.
          </p>
        </div>

        {/* Diagram 2: Web Audio RMS Pipeline */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
            2. Audio Telemetry & Physical Delivery Pipeline
          </h3>
          <div className="bg-canvas border border-border rounded-2xl p-5 font-mono text-xs overflow-x-auto text-secondary leading-relaxed">
            <pre className="text-primary">{`Microphone Stream (navigator.mediaDevices.getUserMedia)
       │
       ├─► Web Audio API AudioContext
       │         │
       │         └─► AnalyserNode (FFT Size: 256)
       │                   │
       │                   ├─► Animation Frame RMS Polling (Live Volume Meter Animation)
       │                   └─► Silence Interval Detector (Counts pauses > 1.2s at < 5% amplitude)
       │
       ├─► MediaRecorder (Records audio/webm blob locally in volatile session memory)
       │
       └─► Web Speech API (webkitSpeechRecognition streams live text into transcript editor)
                 │
                 ▼
       calculateSpeechMetrics() -> Computes WPM, Filler density (um, uh, like, you know), & Silence %`}</pre>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            <strong>Explanation:</strong> Audio recording and metric calculations are executed 100% locally in the browser memory. Users retain complete sovereignty over their voice data, with the option to permanently delete audio blobs with a single click.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION J: SCREENSHOT & FEATURE GALLERY
      ========================================================================= */}
      <section id="screenshot-gallery" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 6</span>
            <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
              Genuine Screenshot & Feature Gallery
            </h2>
            <p className="text-xs text-secondary mt-1">
              All 24 genuine desktop screenshots captured at 1440 × 900 resolution. Click any image to enlarge.
            </p>
          </div>

          {/* Gallery Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Filter screenshots..."
                className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-surface-2 border border-border text-primary placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {['All', 'Core', 'Speech', 'Thinking', 'Journal', 'Analytics', 'System'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors border ${
                  galleryFilter === cat
                    ? 'bg-accent text-accent-fg border-accent'
                    : 'bg-surface-2 border-border text-secondary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScreenshots.map((snap) => (
            <div
              key={snap.id}
              className="group bg-surface-2 border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all flex flex-col shadow-subtle cursor-pointer"
              onClick={() => setLightboxImage({ src: `/screenshots/${snap.file}`, title: snap.title, desc: snap.desc })}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
                <img
                  src={`/screenshots/${snap.file}`}
                  alt={snap.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-sm">
                  {snap.category}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-white/90 text-black text-xs font-semibold flex items-center gap-1.5 shadow-soft">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Enlarge Image
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    <span>Figure {snap.id}</span>
                    <span className="truncate max-w-[140px]">{snap.file}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-primary font-serif mt-1">
                    {snap.title}
                  </h4>
                  <p className="text-xs text-secondary leading-snug mt-1">
                    {snap.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION K: BEGINNER LEARNING PATH
      ========================================================================= */}
      <section id="learning-path" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 7</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            8-Step Beginner Developer Roadmap
          </h2>
          <p className="text-xs text-secondary mt-1">
            Follow this sequential path to understand the codebase and contribute effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { step: 1, title: 'Inspect Overview Dashboard', desc: 'Open http://localhost:3000 to examine the central cockpit and Socratic inquiry cards.' },
            { step: 2, title: 'Trace AppContext State', desc: 'Read src/context/AppContext.tsx to see how entries, speech reports, and themes persist to LocalStorage.' },
            { step: 3, title: 'Understand Speech Analytics', desc: 'Inspect src/services/speechAnalysisService.ts to study deterministic WPM and filler tokenizers.' },
            { step: 4, title: 'Test the AI Backend', desc: 'Run npm run test:ai to observe budget enforcement, deduplication locks, and Gemini failovers.' },
            { step: 5, title: 'Explore The Thinking Gym', desc: 'Navigate to ThinkingGymView.tsx to review the 10 analytical reasoning domains.' },
            { step: 6, title: 'Review Database Schema', desc: 'Inspect supabase/schema.sql to understand PostgreSQL tables and Row-Level Security.' },
            { step: 7, title: 'Execute Automated Tests', desc: 'Run npx tsx server/test-speech.ts and npm run build to verify zero TypeScript errors.' },
            { step: 8, title: 'Contribute Safely', desc: 'Review CONTRIBUTING.md and create your feature branch following feat/ conventions.' }
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-surface-2 border border-border space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-mono font-bold text-[11px] flex items-center justify-center mb-1.5">
                  {item.step}
                </span>
                <strong className="text-primary font-semibold block">{item.title}</strong>
                <span className="text-secondary leading-snug block mt-1">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION L: SETUP & RUN INSTRUCTIONS
      ========================================================================= */}
      <section id="setup-run" className="bg-surface-1 border border-border rounded-3xl p-6 md:p-10 space-y-6 shadow-subtle">
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Section 8</span>
          <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Verified Setup & Run Instructions
          </h2>
          <p className="text-xs text-secondary mt-1">
            Exact, verified commands to clone, configure, and execute the project on any computer.
          </p>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <span className="text-secondary font-sans text-xs font-semibold block">1. Clone Repository & Install Dependencies</span>
            <div className="relative p-3.5 rounded-xl bg-canvas border border-border text-primary flex items-center justify-between">
              <code>git clone https://github.com/bhanuatla521-svg/MindMirror-AI-.git && cd MindMirror-AI- && npm install</code>
              <button
                onClick={() => copyToClipboard('git clone https://github.com/bhanuatla521-svg/MindMirror-AI-.git && cd MindMirror-AI- && npm install', 'cmd1')}
                className="p-1 text-muted hover:text-primary rounded"
              >
                {copiedCmd === 'cmd1' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-secondary font-sans text-xs font-semibold block">2. Setup Environment Variables</span>
            <div className="relative p-3.5 rounded-xl bg-canvas border border-border text-primary flex items-center justify-between">
              <code>cp .env.example .env</code>
              <button
                onClick={() => copyToClipboard('cp .env.example .env', 'cmd2')}
                className="p-1 text-muted hover:text-primary rounded"
              >
                {copiedCmd === 'cmd2' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-secondary font-sans text-xs font-semibold block">3. Start the Backend AI Service (Port 3001)</span>
            <div className="relative p-3.5 rounded-xl bg-canvas border border-border text-primary flex items-center justify-between">
              <code>npm run server</code>
              <button
                onClick={() => copyToClipboard('npm run server', 'cmd3')}
                className="p-1 text-muted hover:text-primary rounded"
              >
                {copiedCmd === 'cmd3' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-secondary font-sans text-xs font-semibold block">4. Start the Frontend Client (Port 3000)</span>
            <div className="relative p-3.5 rounded-xl bg-canvas border border-border text-primary flex items-center justify-between">
              <code>npm run dev</code>
              <button
                onClick={() => copyToClipboard('npm run dev', 'cmd4')}
                className="p-1 text-muted hover:text-primary rounded"
              >
                {copiedCmd === 'cmd4' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-secondary font-sans text-xs font-semibold block">5. Execute Automated Test Suites</span>
            <div className="relative p-3.5 rounded-xl bg-canvas border border-border text-primary flex items-center justify-between">
              <code>npm run test:ai && npx tsx server/test-speech.ts && npm run build</code>
              <button
                onClick={() => copyToClipboard('npm run test:ai && npx tsx server/test-speech.ts && npm run build', 'cmd5')}
                className="p-1 text-muted hover:text-primary rounded"
              >
                {copiedCmd === 'cmd5' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION M: PROFESSIONAL FOOTER
      ========================================================================= */}
      <footer className="border-t border-border pt-8 pb-4 text-xs text-secondary flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-primary block">MindMirror AI — Evidence-Based Communication & Reflection</span>
          <span className="text-muted block mt-0.5">Licensed under the MIT License • Built with privacy-first engineering</span>
        </div>

        <div className="flex items-center gap-4 text-muted">
          <a href="https://github.com/bhanuatla521-svg/MindMirror-AI-" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            GitHub Repository
          </a>
          <button onClick={() => scrollToSection('overview')} className="hover:text-primary transition-colors">
            Back to Top
          </button>
          <button onClick={() => setActiveTab('overview')} className="text-accent hover:opacity-80 transition-opacity">
            Launch Overview
          </button>
        </div>
      </footer>

      {/* =========================================================================
          LIGHTBOX MODAL FOR SCREENSHOT ENLARGEMENT
      ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="bg-surface-1 border border-border rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl space-y-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary">{lightboxImage.title}</h3>
                <span className="text-xs text-secondary">{lightboxImage.desc}</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-surface-2 text-muted hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-border bg-canvas">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePageDocumentationView;
