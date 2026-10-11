import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  RotateCcw,
  Volume2,
  Clock,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Trash2,
  Play,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPEAKING_PROMPTS } from '../../data/speechAndThinkingData';

export const SpeechCoachingReportView: React.FC = () => {
  const {
    activeSpeechReport,
    setActiveTab,
    setSelectedRetestPrompt,
    deleteSpeechAudio,
    speechReports
  } = useApp();

  if (!activeSpeechReport) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <FileText className="w-12 h-12 text-secondary mx-auto" />
        <h2 className="text-xl font-serif font-bold text-primary">No Active Speech Coaching Report</h2>
        <p className="text-sm text-secondary">
          Record a speech session in the Voice Studio or select a previous session to inspect your coaching report.
        </p>
        <button
          onClick={() => setActiveTab('studio')}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-sm inline-flex items-center gap-2"
        >
          <span>Open Voice Practice Studio</span>
        </button>
      </div>
    );
  }

  const report = activeSpeechReport;
  const metrics = report.metrics;

  // Handle launch retest
  const handleLaunchRetest = () => {
    const matchingPrompt = SPEAKING_PROMPTS.find(
      p => p.title === report.promptTopic || p.mode === report.mode
    ) || SPEAKING_PROMPTS[0];

    setSelectedRetestPrompt(matchingPrompt);
    setActiveTab('studio');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('studio')}
            className="p-2 rounded-xl bg-surface-1 border border-border text-secondary hover:text-primary transition-colors"
            title="Return to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
                Phase 4 • Evidence-Based Coaching Report
              </span>
              <span className="text-xs text-secondary font-mono">Session ID: {report.sessionId.slice(0, 14)}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary mt-1 tracking-tight">
              {report.promptTopic}
            </h1>
          </div>
        </div>

        {/* Retest & Actions */}
        <div className="flex items-center gap-2">
          {report.hasAudioRecording && (
            <button
              onClick={() => deleteSpeechAudio(report.id)}
              className="px-3 py-2 rounded-xl bg-surface-1 border border-border text-secondary hover:text-red-500 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Permanently remove local audio recording"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Audio (Privacy)</span>
            </button>
          )}

          <button
            onClick={handleLaunchRetest}
            className="px-4 py-2 rounded-xl bg-accent text-accent-fg font-medium text-xs flex items-center gap-1.5 hover:opacity-95 transition-opacity shadow-subtle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retest This Objective</span>
          </button>
        </div>
      </div>

      {/* 1. Session Objective & Measured Data Notice Banner */}
      <div className="bg-surface-1 border border-border rounded-2xl p-5 space-y-3 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-secondary font-semibold">Session Objective</span>
            <p className="text-sm font-medium text-primary">{report.taskObjective}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-surface-2 border border-border text-secondary">
              Difficulty: <strong className="text-primary uppercase">{report.difficulty}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-2 border border-border text-secondary">
              Mode: <strong className="text-primary">{report.mode}</strong>
            </span>
          </div>
        </div>

        {/* Guardrail Distinction Alert */}
        <div className="p-3 bg-surface-2/60 rounded-xl border border-border text-xs text-secondary flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-primary">Evidence Guardrail:</strong> {report.measuredVsEstimatedNotice}
          </p>
        </div>
      </div>

      {/* 2. Physical Measured Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Speaking Pace</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{metrics.wordsPerMinute}</span>
            <span className="text-xs text-secondary font-mono">WPM</span>
          </div>
          <span className={`text-[11px] font-mono block ${
            metrics.wordsPerMinute >= 125 && metrics.wordsPerMinute <= 165
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}>
            {metrics.wordsPerMinute >= 125 && metrics.wordsPerMinute <= 165
              ? '✓ Target Cadence (130-165)'
              : metrics.wordsPerMinute > 165 ? '▲ Rushed Pace' : '▼ Hesitant Pace'}
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Filler Word Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{metrics.fillerWordsPer100Words}</span>
            <span className="text-xs text-secondary font-mono">/ 100 words</span>
          </div>
          <span className={`text-[11px] font-mono block ${
            metrics.fillerWordsPer100Words <= 3.0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}>
            {metrics.fillerWordsCount} total fillers counted
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Pause & Cadence</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{metrics.pauseCount}</span>
            <span className="text-xs text-secondary font-mono">pauses (&gt;1.2s)</span>
          </div>
          <span className="text-[11px] font-mono text-secondary block">
            {metrics.totalPauseDurationSeconds}s total silence ({metrics.silencePercentage}%)
          </span>
        </div>

        <div className="bg-surface-1 border border-border rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-secondary block">Structure & Words</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-primary">{metrics.wordCount}</span>
            <span className="text-xs text-secondary font-mono">words</span>
          </div>
          <span className="text-[11px] font-mono text-accent block">
            {report.structure.structureFramework} Framework ({report.structure.conclusionClarity} ending)
          </span>
        </div>
      </div>

      {/* Comparison with Previous Session (If available) */}
      {report.comparisonWithPrevious && (
        <div className="bg-surface-1 border border-border rounded-2xl p-5 space-y-2 shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-semibold text-accent">
            <TrendingUp className="w-4 h-4" />
            <span>Comparison with Previous Comparable Session</span>
          </div>
          <p className="text-xs text-primary leading-relaxed">
            {report.comparisonWithPrevious.trendSummary}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-secondary pt-1">
            <span>Previous WPM: <strong>{report.comparisonWithPrevious.previousWpm}</strong> (Delta: {report.comparisonWithPrevious.wpmDelta && report.comparisonWithPrevious.wpmDelta > 0 ? `+${report.comparisonWithPrevious.wpmDelta}` : report.comparisonWithPrevious.wpmDelta})</span>
            <span>•</span>
            <span>Previous Fillers: <strong>{report.comparisonWithPrevious.previousFillerRate}</strong>/100w (Delta: {report.comparisonWithPrevious.fillerDelta && report.comparisonWithPrevious.fillerDelta > 0 ? `+${report.comparisonWithPrevious.fillerDelta}` : report.comparisonWithPrevious.fillerDelta})</span>
          </div>
        </div>
      )}

      {/* 3. Strengths with Verbatim Evidence Quotes */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-serif font-bold text-primary">
              Strengths (Supported by Transcript Evidence)
            </h2>
          </div>
          <span className="text-xs font-mono text-secondary">
            AI Confidence: {report.confidenceScore}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.strengths.map((str, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">{str.title}</h3>
                {str.timestamp && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-secondary">
                    {str.timestamp}
                  </span>
                )}
              </div>
              <blockquote className="text-xs italic text-primary/90 bg-surface-1 p-2.5 rounded-lg border-l-2 border-emerald-500 font-sans">
                "{str.evidenceQuote}"
              </blockquote>
              <p className="text-xs text-secondary leading-relaxed">
                <strong className="text-primary font-medium">Why it worked:</strong> {str.whyHelpful}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Weaknesses Ranked Strictly by Priority */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-serif font-bold text-primary">
            Prioritized Growth Areas (Ranked by Impact on Listener Clarity)
          </h2>
        </div>

        <div className="space-y-4">
          {report.weaknesses.map((w, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent text-accent-fg font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {w.priority}
                  </span>
                  <h3 className="text-sm font-semibold text-primary">{w.issue}</h3>
                </div>
                {w.timestamp && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-secondary shrink-0">
                    {w.timestamp}
                  </span>
                )}
              </div>

              <blockquote className="text-xs italic text-primary/90 bg-surface-1 p-2.5 rounded-lg border-l-2 border-amber-500 font-sans">
                "{w.evidenceQuote}"
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-1 border border-border space-y-1">
                  <span className="text-[10px] font-mono uppercase text-secondary font-semibold block">Why this matters</span>
                  <p className="text-secondary leading-relaxed">{w.whyItMatters}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-1 border border-border space-y-1">
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Clearer alternative phrasing</span>
                  <p className="text-primary font-medium leading-relaxed">{w.alternativePhrasing}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clearer Alternative Response (Full 4-Part PREP Model) */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-3 shadow-subtle">
        <div className="flex items-center gap-2 text-primary font-serif font-bold text-lg">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h2>Clearer Alternative Response (PREP Executive Framework)</h2>
        </div>
        <p className="text-xs text-secondary">
          Here is how this response can be phrased cleanly to maximize retention and eliminate ambiguity:
        </p>
        <div className="p-4 rounded-xl bg-surface-2 border border-border font-sans text-xs text-primary leading-relaxed whitespace-pre-wrap">
          {report.clearerAlternativeResponse}
        </div>
      </div>

      {/* 6. Targeted Drills & Measurable Retest Criterion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Targeted Drills */}
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-base">
            <Target className="w-4 h-4 text-accent" />
            <h3>Targeted Micro-Exercises</h3>
          </div>
          <div className="space-y-3">
            {report.targetedExercises.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{ex.name}</span>
                  <span className="text-[10px] font-mono text-accent">{ex.durationMinutes} mins</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">{ex.description}</p>
                <span className="text-[10px] font-mono text-secondary block pt-1">
                  Focus: {ex.focusArea}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Measurable Retest Criterion */}
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-serif font-bold text-base">
              <RotateCcw className="w-4 h-4 text-accent" />
              <h3>Measurable Retest Criterion</h3>
            </div>
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-xs text-primary leading-relaxed space-y-2">
              <span className="text-[10px] uppercase font-mono text-accent font-semibold block">Target Benchmark</span>
              <p className="font-medium">{report.measurableRetestCriterion}</p>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Retesting this exact prompt with a defined target establishes a measurable feedback loop. Notice whether your filler density decreases on the second attempt.
            </p>
          </div>

          <button
            onClick={handleLaunchRetest}
            className="w-full py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-subtle mt-4"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Launch Retest in Studio</span>
          </button>
        </div>
      </div>

      {/* Verbatim Recorded Transcript */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-3 shadow-subtle">
        <h3 className="text-xs font-mono uppercase font-semibold text-secondary">
          Recorded Spoken Transcript
        </h3>
        <p className="text-xs text-primary leading-relaxed bg-surface-2 p-4 rounded-xl border border-border font-sans whitespace-pre-wrap">
          {report.transcript}
        </p>
      </div>
    </div>
  );
};
