import React, { useState, useMemo } from 'react';
import {
  PenLine,
  Smile,
  Zap,
  Activity,
  Moon,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Paperclip,
  Search,
  Send,
  Plus,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  List,
  Quote,
  Link,
  Target,
  Clock,
  Heart,
  TrendingUp,
  Brain,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Mic,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useApp } from '../../context/AppContext';
import {
  calculateRadarData,
  calculateMoodTrend,
  calculateSleepEnergy,
  detectBehavioralPatterns
} from '../../services/analyticsService';

export const OverviewDashboard: React.FC = () => {
  const {
    entries,
    dimensions,
    goals,
    actions,
    toggleAction,
    turnIntoAction,
    setActiveTab,
    setSelectedEntryId,
    preferences,
    saveEntry,
    analyzeEntry,
    isAnalyzing,
    sendCoachMessage,
    isCoachOpen,
    setIsCoachOpen
  } = useApp();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [reflectionQuery, setReflectionQuery] = useState('');

  // Live Socratic Reflection State for Overview Input
  const [activeInquiry, setActiveInquiry] = useState<string | null>(null);
  const [inquiryResponse, setInquiryResponse] = useState<string | null>(null);
  const [inquiryReferencedDates, setInquiryReferencedDates] = useState<string[]>([]);
  const [inquirySuggestedAction, setInquirySuggestedAction] = useState<string | null>(null);
  const [isInquiryLoading, setIsInquiryLoading] = useState<boolean>(false);
  const [actionAddedNotice, setActionAddedNotice] = useState<boolean>(false);

  // 1. Dynamic Calculations from Real Persisted Data
  const { data: radarData, hasData: hasRadarData } = useMemo(
    () => calculateRadarData(dimensions),
    [dimensions]
  );
  const moodTrendData = useMemo(() => calculateMoodTrend(entries), [entries]);
  const sleepEnergyData = useMemo(() => calculateSleepEnergy(entries), [entries]);
  const behavioralPatterns = useMemo(() => detectBehavioralPatterns(entries), [entries]);

  // 2. Metrics derived from the most recent real diary entry
  const latestEntry = entries.length > 0 ? entries[0] : null;
  const currentMoodLabel = latestEntry
    ? latestEntry.mood >= 4
      ? 'Good'
      : latestEntry.mood === 3
      ? 'Balanced'
      : 'Low'
    : '—';
  const currentEnergyLabel = latestEntry?.energy ? `${latestEntry.energy}/10` : '—';
  const currentStressLabel = latestEntry?.stress ? `${latestEntry.stress}/10` : '—';
  const currentSleepLabel = latestEntry?.sleepHours ? `${latestEntry.sleepHours} hrs` : '—';

  // 3. User name and localized date
  const userName = preferences.name?.trim() || 'Friend';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // 4. Actions / Priorities tracking
  const activeActions = useMemo(() => {
    return actions.slice(0, 5);
  }, [actions]);

  const completedActionsCount = activeActions.filter(a => a.isCompleted).length;

  const handleQuickWriteSubmit = async () => {
    if (!quickContent.trim()) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = saveEntry({
      title: quickTitle.trim() || `Reflection for ${todayStr}`,
      content: quickContent.trim(),
      date: todayStr
    });
    setQuickContent('');
    setQuickTitle('');
    await analyzeEntry(newEntry.id);
    setActiveTab('review');
  };

  const handleSendReflection = async (queryText: string) => {
    if (!queryText.trim()) return;
    const cleanQuery = queryText.trim();
    setActiveInquiry(cleanQuery);
    setIsInquiryLoading(true);
    setInquiryResponse(null);
    setInquiryReferencedDates([]);
    setInquirySuggestedAction(null);
    setReflectionQuery('');

    try {
      const assistantMsg = await sendCoachMessage(cleanQuery);
      if (assistantMsg) {
        setInquiryResponse(assistantMsg.text);
        setInquiryReferencedDates(assistantMsg.referencedEntryDates || []);
        setInquirySuggestedAction(assistantMsg.suggestedAction || null);
        setIsInquiryLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[Reflection] AI coach response error, using local synthesis.', err);
    }

    // Local heuristic fallback
    const referenced = entries.slice(0, 2).map(e => e.date);
    const fallbackText = `Examining your journal records regarding "${cleanQuery}":\n\n1. What were the concrete, verifiable events (camera facts), separated from emotional interpretations?\n2. What worst-case assumption was your mind anticipating or protecting against?\n3. What would change if you took a 90-second pause before responding to similar triggers tomorrow?\n\nWhat feels like the most grounded next step?`;
    setInquiryResponse(fallbackText);
    setInquiryReferencedDates(referenced);
    setInquirySuggestedAction("Take a 90-second pause before reacting to challenging situations tomorrow");
    setIsInquiryLoading(false);
  };

  // Circular progress ring helper
  const renderCircularProgress = (done: number, total: number) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const safeTotal = total > 0 ? total : 1;
    const progress = (done / safeTotal) * circumference;
    return (
      <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
        <svg className="w-14 h-14 transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            className="text-border"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary transition-all duration-300"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-mono text-xs font-bold text-primary">
          {done}/{total}
        </span>
      </div>
    );
  };

  /* =========================================================================
   * THEME 1: ULTRA-MINIMAL LIGHT LAYOUT
   * ========================================================================= */
  if (preferences.theme === 'theme-ultra-minimal') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16 font-sans">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              Welcome, {userName} <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              {entries.length > 0
                ? `${entries.length} reflections recorded. Continuous awareness guides growth.`
                : 'Begin your journey with your first honest daily reflection.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted">{todayFormatted}</span>
            <button
              onClick={() => { setSelectedEntryId(null); setActiveTab('diary'); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-canvas hover:opacity-90 transition-opacity shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write in Diary</span>
            </button>
          </div>
        </div>

        {/* 4 Check-in metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Mood</div>
              <div className="text-xs font-bold text-primary">{currentMoodLabel}</div>
            </div>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Energy</div>
              <div className="text-xs font-bold text-primary">{currentEnergyLabel}</div>
            </div>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Stress</div>
              <div className="text-xs font-bold text-primary">{currentStressLabel}</div>
            </div>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Sleep</div>
              <div className="text-xs font-bold text-primary">{currentSleepLabel}</div>
            </div>
          </div>
        </div>

        {/* Row 2: Radar Chart + Recent Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Your Growth Overview</h2>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-border-strong inline-block"></span> Last Month
                </span>
              </div>
            </div>
            {hasRadarData ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="dimension" stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <Radar name="Last Month" dataKey="lastMonth" stroke="var(--color-border-strong)" fill="var(--color-border)" fillOpacity={0.2} />
                    <Radar name="Current" dataKey="current" stroke="var(--color-text-primary)" fill="var(--color-text-primary)" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-surface-2/40">
                <Brain className="w-8 h-8 text-muted mb-2" />
                <p className="text-xs font-medium text-primary">Dimension Baseline Initializing</p>
                <p className="text-[11px] text-muted max-w-xs mt-1">
                  Save your first diary entry and run an AI review to plot your 6-dimension development radar.
                </p>
              </div>
            )}
          </div>

          {/* Recent Insights */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-primary">Behavioral Patterns</h2>
                <button onClick={() => setActiveTab('insights')} className="text-[11px] text-muted hover:text-primary flex items-center gap-0.5">
                  <span>View All</span> <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {behavioralPatterns.length > 0 ? (
                <div className="space-y-2.5">
                  {behavioralPatterns.slice(0, 4).map((pat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-2 border border-border/70 text-xs">
                      <div className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                        ✦
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-semibold text-primary">{pat.title}</span>
                        <p className="text-secondary leading-snug">{pat.observation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-surface-2/40">
                  <TrendingUp className="w-7 h-7 text-muted mb-2" />
                  <p className="text-xs font-medium text-primary">No Patterns Detected Yet</p>
                  <p className="text-[11px] text-muted max-w-xs mt-1">
                    Patterns emerge after logging at least 2 entries. MindMirror strictly avoids fabricating trends without evidence.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Today's Priorities + Mood Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-primary">Targeted Actions</h2>
                <span className="text-[11px] text-muted font-mono">
                  {completedActionsCount}/{activeActions.length} completed
                </span>
              </div>
              {renderCircularProgress(completedActionsCount, activeActions.length)}
            </div>

            {activeActions.length > 0 ? (
              <div className="space-y-2 pt-1">
                {activeActions.map(act => (
                  <div
                    key={act.id}
                    onClick={() => toggleAction(act.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={act.isCompleted}
                      onChange={() => {}}
                      className="rounded border-border accent-primary cursor-pointer"
                    />
                    <span className={`text-xs ${act.isCompleted ? 'line-through text-muted' : 'text-primary'}`}>
                      {act.actionText}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
                <Target className="w-6 h-6 text-muted mx-auto mb-1" />
                <p className="text-xs text-primary font-medium">No Pending Actions</p>
                <p className="text-[11px] text-muted mt-1">
                  Run an AI daily reflection on any entry to automatically generate actionable micro-drills.
                </p>
              </div>
            )}
          </div>

          {/* Mood Trend Line Chart */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Mood Trend</h2>
              <span className="text-[11px] text-muted font-mono">Recorded Days</span>
            </div>
            {moodTrendData.length > 0 ? (
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <YAxis domain={[1, 5]} stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface-1)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="var(--color-text-primary)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'var(--color-text-primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-surface-2/40">
                <Smile className="w-7 h-7 text-muted mb-2" />
                <p className="text-xs font-medium text-primary">No Mood Records Yet</p>
                <p className="text-[11px] text-muted max-w-xs mt-1">
                  Log your daily mood rating to visualize your affective trajectory.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What's on your mind today? Editor Card */}
        <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between text-xs text-muted font-mono">
            <span>‹ {todayFormatted}</span>
            <span className="text-[11px]">Private Client Encrypted</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-primary">What's on your mind today?</h2>
            <p className="text-xs text-muted">
              Write freely about your day, decisions, conversations, or difficulties...
            </p>
          </div>

          <textarea
            value={quickContent}
            onChange={(e) => setQuickContent(e.target.value)}
            placeholder="Describe what occurred today, what you handled well, and what felt challenging..."
            rows={5}
            className="w-full bg-surface-2/50 p-3 rounded-lg border border-border text-sm leading-relaxed text-primary placeholder:text-muted focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => { setQuickContent(''); setQuickTitle(''); }}
              className="px-3 py-1.5 text-xs text-muted hover:text-primary"
            >
              Clear
            </button>
            <button
              onClick={handleQuickWriteSubmit}
              disabled={isAnalyzing || !quickContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-canvas hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              <span>{isAnalyzing ? 'Reflecting with AI...' : 'Save & Analyze Entry'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * THEME 2: PURE BLACK & WHITE THEME (Monochrome)
   * ========================================================================= */
  if (preferences.theme === 'theme-pure-bw') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16 font-sans">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Overview — {userName}</h1>
            <p className="text-xs text-secondary mt-0.5">Objective personal analysis without cognitive distortion.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted">{todayFormatted}</span>
            <button
              onClick={() => { setSelectedEntryId(null); setActiveTab('diary'); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-canvas hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write in Diary</span>
            </button>
          </div>
        </div>

        {/* Metric pills in strict monochrome */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary">
              <Smile className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Mood</div>
              <div className="text-xs font-bold text-primary">{currentMoodLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Energy</div>
              <div className="text-xs font-bold text-primary">{currentEnergyLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Stress</div>
              <div className="text-xs font-bold text-primary">{currentStressLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-muted font-mono uppercase">Sleep</div>
              <div className="text-xs font-bold text-primary">{currentSleepLabel}</div>
            </div>
          </div>
        </div>

        {/* Row 1: Growth Overview Radar + Behavioral Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Growth Dimensions</h2>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                <span>● Current</span>
                <span>○ Baseline</span>
              </div>
            </div>
            {hasRadarData ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="dimension" stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <Radar name="Baseline" dataKey="lastMonth" stroke="var(--color-border-strong)" fill="transparent" strokeDasharray="3 3" />
                    <Radar name="Current" dataKey="current" stroke="var(--color-text-primary)" fill="var(--color-text-primary)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-surface-2/40">
                <Brain className="w-7 h-7 text-muted mb-2" />
                <p className="text-xs font-semibold text-primary">Awaiting Diary Data</p>
                <p className="text-[11px] text-muted mt-1 max-w-xs">
                  Scores populate directly from AI-reviewed journal entries.
                </p>
              </div>
            )}
          </div>

          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Observed Patterns</h2>
              <button onClick={() => setActiveTab('insights')} className="text-[11px] text-muted hover:text-primary flex items-center gap-0.5">
                <span>View All</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {behavioralPatterns.length > 0 ? (
              <div className="space-y-2.5">
                {behavioralPatterns.slice(0, 4).map((pat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-2 border border-border text-xs">
                    <span className="font-mono text-[10px] text-muted mt-0.5">[{idx + 1}]</span>
                    <div>
                      <div className="font-semibold text-primary">{pat.title}</div>
                      <p className="text-secondary mt-0.5">{pat.observation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-surface-2/40">
                <p className="text-xs font-semibold text-primary">No Patterns Yet</p>
                <p className="text-[11px] text-muted mt-1">
                  Log at least 2 days of reflections to detect recurring patterns.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Sleep & Energy Bar Chart + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Sleep & Energy Correlation</h2>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                <span>■ Sleep</span>
                <span>■ Energy</span>
              </div>
            </div>
            {sleepEnergyData.length > 0 ? (
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepEnergyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface-1)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                    <Bar dataKey="sleep" fill="var(--color-border-strong)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="energy" fill="var(--color-text-primary)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-surface-2/40">
                <Moon className="w-7 h-7 text-muted mb-2" />
                <p className="text-xs font-semibold text-primary">No Sleep Records</p>
                <p className="text-[11px] text-muted mt-1">Track sleep and energy in your reflections.</p>
              </div>
            )}
          </div>

          {/* Action items */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Today's Targets</h2>
              <span className="text-[11px] font-mono text-muted">
                {completedActionsCount}/{activeActions.length} Done
              </span>
            </div>
            {activeActions.length > 0 ? (
              <div className="space-y-2 pt-1">
                {activeActions.map(act => (
                  <div
                    key={act.id}
                    onClick={() => toggleAction(act.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-2 cursor-pointer text-xs"
                  >
                    <input type="checkbox" checked={act.isCompleted} onChange={() => {}} className="accent-primary" />
                    <span className={act.isCompleted ? 'line-through text-muted' : 'text-primary'}>
                      {act.actionText}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
                <p className="text-xs text-primary font-medium">Zero Targets Active</p>
                <p className="text-[11px] text-muted mt-1">
                  Actions are suggested when an AI daily review is performed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Recent Diary Entries + Upcoming Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Recent Diary Entries</h2>
              <button onClick={() => setActiveTab('diary')} className="text-[11px] text-muted hover:text-primary flex items-center gap-0.5">
                <span>View All</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {entries.length > 0 ? (
              <div className="space-y-2">
                {entries.slice(0, 4).map(e => (
                  <div
                    key={e.id}
                    onClick={() => { setSelectedEntryId(e.id); setActiveTab('diary'); }}
                    className="p-2.5 rounded-lg bg-surface-2 border border-border flex items-center justify-between text-xs cursor-pointer hover:bg-surface-2/80 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-primary">{e.title}</div>
                      <div className="text-[10px] text-muted font-mono">{e.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded border border-border text-[10px] font-mono text-muted">
                      Mood {e.mood}/5
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
                <PenLine className="w-6 h-6 text-muted mx-auto mb-1" />
                <p className="text-xs text-primary font-medium">No Entries Recorded</p>
                <p className="text-[11px] text-muted mt-1">Write your first reflection to start your journal.</p>
              </div>
            )}
          </div>

          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">Active Goals</h2>
              <button onClick={() => setActiveTab('goals')} className="text-[11px] text-muted hover:text-primary flex items-center gap-0.5">
                <span>View All</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 4).map(g => (
                  <div key={g.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-primary">{g.title}</span>
                        <span className="text-muted ml-2 text-[11px]">{g.reason}</span>
                      </div>
                      <span className="font-mono text-[11px] text-primary">{g.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
                <Target className="w-6 h-6 text-muted mx-auto mb-1" />
                <p className="text-xs text-primary font-medium">No Active Goals</p>
                <p className="text-[11px] text-muted mt-1">Define long-term growth milestones in the Goals tab.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * THEME 3 & 4: WARM CONVERSATIONAL & DARK MINIMAL (Default)
   * ========================================================================= */
  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-16 font-sans">
      {/* Top Editorial Greeting */}
      <div className="space-y-1 pt-2">
        <h1 className="text-2xl md:text-3xl font-serif text-primary tracking-tight heading-editorial">
          Welcome back, {userName}.
        </h1>
        <p className="text-sm font-serif italic text-secondary">
          {entries.length > 0
            ? 'What will you explore with honest reflection today?'
            : 'Begin your personal psychology journal with today\'s thoughts.'}
        </p>
      </div>

      {/* Big Conversational Input Bar Directly Below Greeting */}
      <div className="bg-surface-1 border border-border rounded-2xl p-4 shadow-subtle space-y-3">
        <div className="relative">
          <input
            type="text"
            value={reflectionQuery}
            onChange={(e) => setReflectionQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReflection(reflectionQuery); }}
            placeholder="Write about your day, or ask for an evidence-backed reflection..."
            className="w-full pl-3 pr-24 py-3 text-xs md:text-sm bg-transparent text-primary placeholder:text-muted focus:outline-none"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            {reflectionQuery.trim().length > 35 && (
              <button
                onClick={() => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const newEntry = saveEntry({
                    title: `Reflection for ${todayStr}`,
                    content: reflectionQuery.trim(),
                    date: todayStr
                  });
                  setReflectionQuery('');
                  analyzeEntry(newEntry.id);
                  setActiveTab('review');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-[11px] font-medium text-primary border border-border transition-colors hidden sm:block"
                title="Save as today's journal entry and run deep AI review"
              >
                Save as Journal Entry
              </button>
            )}
            <button
              onClick={() => handleSendReflection(reflectionQuery)}
              disabled={isInquiryLoading || !reflectionQuery.trim()}
              className="w-8 h-8 rounded-full bg-accent text-accent-fg flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
              aria-label="Send reflection inquiry"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
          {[
            "What patterns appear in my last 30 days?",
            "What could I have done differently?",
            "Which habits seem to help me most?",
            "What assumptions should I reconsider?"
          ].map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendReflection(chip)}
              className="px-3 py-1 rounded-full bg-surface-2 border border-border text-xs text-secondary hover:text-primary hover:border-accent transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Live Interactive Socratic Reflection Card */}
        {(activeInquiry || isInquiryLoading) && (
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border space-y-3 animate-fade-in text-xs md:text-sm mt-3">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-semibold text-primary">MindMirror AI Socratic Reflection</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCoachOpen(true)}
                  className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1"
                >
                  <span>Open Coach Drawer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => { setActiveInquiry(null); setInquiryResponse(null); }}
                  className="text-muted hover:text-primary px-1.5 py-0.5 rounded text-xs"
                  title="Close reflection"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-muted">
              Inquiry: <span className="text-primary italic font-sans font-medium">"{activeInquiry}"</span>
            </div>

            {isInquiryLoading ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-2 text-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-muted">Consulting your diary history & synthesizing evidence-backed reflection...</p>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="whitespace-pre-wrap leading-relaxed text-secondary font-serif md:text-sm bg-surface-1 p-3.5 rounded-lg border border-border">
                  {inquiryResponse}
                </div>

                {inquiryReferencedDates.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                    <span>Referenced journal dates:</span>
                    {inquiryReferencedDates.map(date => (
                      <span
                        key={date}
                        onClick={() => {
                          const entry = entries.find(e => e.date === date);
                          if (entry) {
                            setSelectedEntryId(entry.id);
                            setActiveTab('diary');
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-surface-1 border border-border text-primary cursor-pointer hover:border-accent"
                      >
                        📅 {date}
                      </span>
                    ))}
                  </div>
                )}

                {inquirySuggestedAction && (
                  <div className="p-3 rounded-lg bg-surface-1 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-mono text-accent font-semibold block">Suggested Tomorrow Action</span>
                      <p className="text-xs text-primary font-medium">{inquirySuggestedAction}</p>
                    </div>
                    <button
                      onClick={() => {
                        turnIntoAction(inquirySuggestedAction);
                        setActionAddedNotice(true);
                        setTimeout(() => setActionAddedNotice(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-xs font-medium hover:opacity-90 transition-opacity self-start sm:self-auto flex items-center gap-1 whitespace-nowrap"
                    >
                      {actionAddedNotice ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Added to Actions!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Actions</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Today's Check-in 4 pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-primary">
          <span>Latest Self-Reported Metrics</span>
          <button onClick={() => setActiveTab('diary')} className="text-muted hover:text-primary font-normal text-[11px]">
            Write Entry ▾
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-2.5 shadow-subtle">
            <Smile className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-[10px] text-muted font-mono">Mood</div>
              <div className="text-xs font-semibold text-primary">{currentMoodLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-2.5 shadow-subtle">
            <Zap className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-[10px] text-muted font-mono">Energy</div>
              <div className="text-xs font-semibold text-primary">{currentEnergyLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-2.5 shadow-subtle">
            <Activity className="w-4 h-4 text-indigo-500" />
            <div>
              <div className="text-[10px] text-muted font-mono">Stress</div>
              <div className="text-xs font-semibold text-primary">{currentStressLabel}</div>
            </div>
          </div>

          <div className="p-3 bg-surface-1 rounded-xl border border-border flex items-center gap-2.5 shadow-subtle">
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <div>
              <div className="text-[10px] text-muted font-mono">Sleep</div>
              <div className="text-xs font-semibold text-primary">{currentSleepLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Studio & Thinking Gym Quick Access Training Hub */}
      <div className="bg-surface-1 border border-border rounded-2xl p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-primary">
              Personal Communication & Thinking Coach
            </h2>
          </div>
          <span className="text-[11px] font-mono text-secondary">Private & Evidence-Based</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Studio Quick Launch */}
          <div
            onClick={() => setActiveTab('studio')}
            className="p-3.5 rounded-xl bg-surface-2 border border-border hover:border-accent cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-primary group-hover:text-accent transition-colors">
                Voice Practice Studio
              </h3>
              <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                Record speech, track WPM & fillers, and receive PREP coaching.
              </p>
            </div>
          </div>

          {/* Thinking Gym Quick Launch */}
          <div
            onClick={() => setActiveTab('thinking')}
            className="p-3.5 rounded-xl bg-surface-2 border border-border hover:border-accent cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-primary text-canvas flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-primary group-hover:text-accent transition-colors">
                The Thinking Gym
              </h3>
              <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                10 analytical reasoning domains evaluated with honest rubrics.
              </p>
            </div>
          </div>

          {/* Introvert Curriculum Quick Launch */}
          <div
            onClick={() => setActiveTab('program')}
            className="p-3.5 rounded-xl bg-surface-2 border border-border hover:border-accent cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-1 border border-border text-secondary flex items-center justify-center">
                <Compass className="w-4 h-4 text-accent" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-primary group-hover:text-accent transition-colors">
                Practice Programme
              </h3>
              <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                5-stage progressive curriculum tailored for introverts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Thought of the Day + Today's Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-3">
          <span className="text-xs font-semibold text-primary font-serif">Daily Stoic Reflection</span>
          <blockquote className="text-sm font-serif italic text-secondary leading-relaxed pl-2 border-l-2 border-accent">
            "First say to yourself what you would be; and then do what you have to do."
          </blockquote>
          <span className="text-[11px] font-mono text-muted text-right">— Epictetus</span>
        </div>

        {/* Action items */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-primary">Evidence-Backed Actions</h2>
            <span className="text-[10px] font-mono text-muted">
              {completedActionsCount}/{activeActions.length}
            </span>
          </div>
          {activeActions.length > 0 ? (
            <div className="space-y-2">
              {activeActions.map(act => (
                <div
                  key={act.id}
                  onClick={() => toggleAction(act.id)}
                  className="flex items-center gap-2.5 text-xs text-secondary hover:text-primary cursor-pointer transition-colors"
                >
                  <input type="checkbox" checked={act.isCompleted} onChange={() => {}} className="accent-primary" />
                  <span className={act.isCompleted ? 'line-through text-muted' : ''}>
                    {act.actionText}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center border border-dashed border-border rounded-lg p-3 bg-surface-2/40">
              <p className="text-xs text-primary font-medium">No actions pending</p>
              <p className="text-[11px] text-muted mt-0.5">Generate an AI reflection to receive actionable steps.</p>
            </div>
          )}
        </div>
      </div>

      {/* Your Growth Journey Indicator Cards */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary">Your Growth Dimensions</h2>
          <button onClick={() => setActiveTab('growth')} className="text-[11px] text-muted hover:text-primary flex items-center gap-0.5">
            <span>View All 30 Dimensions</span> <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {hasRadarData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {radarData.map((dim, i) => (
              <div key={i} className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
                <div className="text-[11px] text-secondary truncate">{dim.dimension}</div>
                <div className="text-base font-bold font-mono text-primary">{dim.current}</div>
                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(dim.current, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
            <Brain className="w-6 h-6 text-muted mx-auto mb-1" />
            <p className="text-xs text-primary font-semibold">Dimensions Awaiting User Data</p>
            <p className="text-[11px] text-muted mt-1 max-w-sm mx-auto">
              MindMirror does not fabricate baseline scores. Complete diary reflections to dynamically evaluate your growth dimensions.
            </p>
          </div>
        )}
      </div>

      {/* Row: Recent Reflections + Mood Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
          <h2 className="text-sm font-semibold text-primary">Recent Reflections</h2>
          {entries.length > 0 ? (
            <div className="space-y-2 text-xs">
              {entries.slice(0, 3).map(r => (
                <div
                  key={r.id}
                  onClick={() => { setSelectedEntryId(r.id); setActiveTab('diary'); }}
                  className="p-2.5 rounded-lg bg-surface-2 border border-border space-y-0.5 cursor-pointer hover:bg-surface-2/80 transition-colors"
                >
                  <div className="font-medium text-primary">{r.title}</div>
                  <div className="text-[10px] text-muted font-mono">{r.date} — Mood {r.mood}/5</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-border rounded-lg p-4 bg-surface-2/40">
              <PenLine className="w-6 h-6 text-muted mx-auto mb-1" />
              <p className="text-xs text-primary font-medium">No reflections recorded</p>
              <p className="text-[11px] text-muted mt-0.5">Click 'Write in Diary' to record your first entry.</p>
            </div>
          )}
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary">Mood Trajectory</h2>
            <span className="text-[11px] text-muted font-mono">Recorded History</span>
          </div>
          {moodTrendData.length > 0 ? (
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                  <YAxis domain={[1, 5]} stroke="var(--color-text-muted)" tick={{ fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--color-text-primary)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--color-text-primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-surface-2/40">
              <Smile className="w-6 h-6 text-muted mb-1" />
              <p className="text-xs text-primary font-medium">No mood history</p>
              <p className="text-[11px] text-muted mt-0.5">Daily mood ratings render a 7-entry line graph here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
