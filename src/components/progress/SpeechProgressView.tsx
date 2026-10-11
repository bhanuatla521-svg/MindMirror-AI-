import React from 'react';
import {
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Target,
  Sparkles,
  BarChart3,
  Calendar,
  Shield,
  ArrowRight,
  Mic,
  Brain
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const SpeechProgressView: React.FC = () => {
  const {
    speechReports,
    thinkingSubmissions,
    setActiveTab,
    setActiveSpeechReport
  } = useApp();

  // Aggregate telemetry from real practice records
  const totalSessions = speechReports.length;
  const totalWordsSpoken = speechReports.reduce((acc, r) => acc + r.metrics.wordCount, 0);
  const totalDurationMinutes = Math.round(
    speechReports.reduce((acc, r) => acc + r.metrics.durationSeconds, 0) / 60
  );

  const averageWpm = totalSessions > 0
    ? Math.round(speechReports.reduce((acc, r) => acc + r.metrics.wordsPerMinute, 0) / totalSessions)
    : 0;

  const averageFillerRate = totalSessions > 0
    ? Number((speechReports.reduce((acc, r) => acc + r.metrics.fillerWordsPer100Words, 0) / totalSessions).toFixed(1))
    : 0;

  // Longitudinal trend series (ordered oldest to newest)
  const chartData = speechReports
    .slice()
    .reverse()
    .map((r, idx) => ({
      session: `#${idx + 1}`,
      date: r.date,
      wpm: r.metrics.wordsPerMinute,
      fillersPer100w: r.metrics.fillerWordsPer100Words,
      targetWpmLow: 130,
      targetWpmHigh: 165
    }));

  // Aggregate recurring strengths and weaknesses
  const strengthCounts: Record<string, number> = {};
  const weaknessCounts: Record<string, number> = {};

  speechReports.forEach(r => {
    r.strengths.forEach(s => {
      strengthCounts[s.title] = (strengthCounts[s.title] || 0) + 1;
    });
    r.weaknesses.forEach(w => {
      weaknessCounts[w.issue] = (weaknessCounts[w.issue] || 0) + 1;
    });
  });

  const sortedWeaknesses = Object.entries(weaknessCounts).sort((a, b) => b[1] - a[1]);
  const sortedStrengths = Object.entries(strengthCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
              Phase 7 • Longitudinal Progress Dashboard
            </span>
            <span className="text-xs text-secondary font-mono">Empirical Practice Trends</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1 tracking-tight">
            Speaking & Thinking Analytics
          </h1>
          <p className="text-sm text-secondary mt-1">
            Track measurable vocal cadence, filler reduction, and reasoning rubric scores over time. No exaggerated percentile claims.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('studio')}
          className="px-4 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-xs flex items-center gap-1.5 self-start sm:self-auto hover:opacity-95 shadow-subtle"
        >
          <Mic className="w-4 h-4" />
          <span>New Studio Session</span>
        </button>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Total Practice Takes</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{totalSessions}</span>
            <span className="text-xs text-secondary font-mono">sessions</span>
          </div>
          <span className="text-[11px] font-mono text-accent block">
            {totalDurationMinutes} minutes recorded
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Average Speaking Pace</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{averageWpm}</span>
            <span className="text-xs text-secondary font-mono">WPM</span>
          </div>
          <span className="text-[11px] font-mono text-secondary block">
            Target band: 130–165 WPM
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Average Filler Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{averageFillerRate}</span>
            <span className="text-xs text-secondary font-mono">/ 100w</span>
          </div>
          <span className="text-[11px] font-mono text-secondary block">
            Target benchmark: &lt; 3.0/100w
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Thinking Gym Solved</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{thinkingSubmissions.length}</span>
            <span className="text-xs text-secondary font-mono">exercises</span>
          </div>
          <span className="text-[11px] font-mono text-accent block">
            Rubric evaluated
          </span>
        </div>
      </div>

      {/* Longitudinal Speaking Pace (WPM) & Filler Trend Chart */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speaking Pace Chart */}
          <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-secondary font-semibold block">
                  Measured Delivery Cadence
                </span>
                <h3 className="text-sm font-semibold text-primary">Words Per Minute (WPM) Trend</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-secondary">
                Optimal: 130–165 WPM
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="session" stroke="var(--color-text-muted)" fontSize={11} />
                  <YAxis domain={[80, 220]} stroke="var(--color-text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-1)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'var(--color-accent)' }}
                    name="Speaking Pace (WPM)"
                  />
                  <Line
                    type="monotone"
                    dataKey="targetWpmLow"
                    stroke="var(--color-border-strong)"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    dot={false}
                    name="Target Low (130)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filler Word Reduction Chart */}
          <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-secondary font-semibold block">
                  Verbal Clarity Progress
                </span>
                <h3 className="text-sm font-semibold text-primary">Filler Word Rate per 100 Words</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-secondary">
                Goal: &lt; 3.0
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="session" stroke="var(--color-text-muted)" fontSize={11} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-1)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Bar
                    dataKey="fillersPer100w"
                    fill="var(--color-accent)"
                    radius={[6, 6, 0, 0]}
                    name="Fillers / 100w"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-surface-1 border border-border text-center space-y-2">
          <Activity className="w-8 h-8 text-secondary mx-auto" />
          <h3 className="text-sm font-medium text-primary">No Speech Telemetry Recorded Yet</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Complete your first session in the Voice Practice Studio to start plotting pace and filler density curves.
          </p>
        </div>
      )}

      {/* Recurrence Tracker: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recurring Strengths */}
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-serif font-bold text-primary">Consistent Strengths Observed</h3>
          </div>
          {sortedStrengths.length > 0 ? (
            <div className="space-y-2.5">
              {sortedStrengths.slice(0, 4).map(([title, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border text-xs">
                  <span className="font-medium text-primary">{title}</span>
                  <span className="font-mono text-secondary px-2 py-0.5 rounded bg-surface-1 border border-border">
                    {count} {count === 1 ? 'session' : 'sessions'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-secondary italic">Record your first session to establish strengths.</p>
          )}
        </div>

        {/* Priority Focus Areas */}
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-serif font-bold text-primary">Priority Focus Areas</h3>
          </div>
          {sortedWeaknesses.length > 0 ? (
            <div className="space-y-2.5">
              {sortedWeaknesses.slice(0, 4).map(([issue, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border text-xs">
                  <span className="font-medium text-primary line-clamp-1">{issue}</span>
                  <span className="font-mono text-accent px-2 py-0.5 rounded bg-surface-1 border border-border">
                    {count} {count === 1 ? 'take' : 'takes'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-secondary italic">No recurring weaknesses identified yet.</p>
          )}
        </div>
      </div>

      {/* Recent Studio Takes Table */}
      {speechReports.length > 0 && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <h3 className="text-xs font-mono uppercase font-semibold text-secondary">
            Practice Log History ({speechReports.length} Takes)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-secondary font-mono text-[10px] uppercase">
                <tr>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Topic</th>
                  <th className="pb-2">Mode</th>
                  <th className="pb-2">Duration</th>
                  <th className="pb-2">Pace</th>
                  <th className="pb-2">Fillers</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {speechReports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="py-3 font-mono text-secondary">{r.date}</td>
                    <td className="py-3 font-medium text-primary max-w-xs truncate">{r.promptTopic}</td>
                    <td className="py-3 capitalize text-secondary">{r.mode.replace('_', ' ')}</td>
                    <td className="py-3 font-mono text-secondary">{Math.round(r.metrics.durationSeconds)}s</td>
                    <td className="py-3 font-mono font-medium text-primary">{r.metrics.wordsPerMinute} WPM</td>
                    <td className="py-3 font-mono text-accent">{r.metrics.fillerWordsPer100Words}/100w</td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          setActiveSpeechReport(r);
                          setActiveTab('speech_report');
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <span>Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
