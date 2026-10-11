import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, AlertCircle, Compass, Sparkles, MessageSquare, Heart, Brain, ThumbsUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeeklyReviewView: React.FC = () => {
  const { weeklyReport, entries, generateAIWeeklyReview } = useApp();
  const [correctionText, setCorrectionText] = useState(weeklyReport.userCorrections || '');
  const [savedNotice, setSavedNotice] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSynthesize = async () => {
    setIsGenerating(true);
    await generateAIWeeklyReview();
    setIsGenerating(false);
  };

  const handleSaveCorrection = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
            Weekly Synthesis / {weeklyReport.weekStartDate} to {weeklyReport.weekEndDate}
          </span>
          <button
            onClick={handleSynthesize}
            disabled={isGenerating || entries.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-accent-fg font-medium text-xs hover:opacity-90 disabled:opacity-50 transition-opacity self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing with AI...' : 'Synthesize This Week with AI'}</span>
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Executive Psychological Weekly Review
        </h1>
        <p className="text-xs md:text-sm text-secondary leading-relaxed">
          {weeklyReport.summary}
        </p>
        <div className="text-[11px] text-muted font-mono pt-1">
          Synthesized from {entries.length} persisted diary reflections and recorded check-ins.
        </div>
      </div>

      {/* Two Column Grid: Positive Experiences & Repeated Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h2 className="text-sm">Most Meaningful Positive Experiences</h2>
          </div>
          <ul className="space-y-2 text-secondary leading-relaxed list-disc list-inside">
            {weeklyReport.positiveExperiences.map((exp, idx) => (
              <li key={idx} className="pl-1">{exp}</li>
            ))}
          </ul>
        </div>

        <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <h2 className="text-sm">Repeated Friction Points & Challenges</h2>
          </div>
          <ul className="space-y-2 text-secondary leading-relaxed list-disc list-inside">
            {weeklyReport.repeatedChallenges.map((chal, idx) => (
              <li key={idx} className="pl-1">{chal}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emotional Patterns & Decision-Making */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm">Emotional & Physiological Patterns</h2>
          </div>
          <ul className="space-y-2 text-secondary leading-relaxed">
            {weeklyReport.emotionalPatterns.map((pat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-muted">•</span>
                <span>{pat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Brain className="w-4 h-4 text-accent" />
            <h2 className="text-sm">Decision-Making & Trade-off Patterns</h2>
          </div>
          <ul className="space-y-2 text-secondary leading-relaxed">
            {weeklyReport.decisionPatterns.map((dec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-muted">•</span>
                <span>{dec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Habits Helpful vs Difficult */}
      <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-primary">Habits Evaluation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1.5">
            <span className="font-semibold text-primary">Habits That Provided High Leverage</span>
            <ul className="list-disc list-inside text-secondary space-y-1">
              {weeklyReport.habitsHelpful.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1.5">
            <span className="font-semibold text-primary">Habits Under Pressure</span>
            <ul className="list-disc list-inside text-secondary space-y-1">
              {weeklyReport.habitsDifficult.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Three Priorities for Next Week */}
      <div className="p-6 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-primary text-sm">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2>Three Core Priorities for Next Week</h2>
        </div>
        <div className="space-y-2">
          {weeklyReport.threePrioritiesNextWeek.map((prio, idx) => (
            <div key={idx} className="p-3 bg-surface-2 rounded-lg border border-border font-medium text-primary flex items-center gap-3">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-canvas border border-border">0{idx + 1}</span>
              <span>{prio}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What Did The AI Get Wrong? Correction Box */}
      <div className="p-5 bg-surface-1 rounded-xl border border-border shadow-subtle space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary">What did the AI get wrong or misunderstand?</h3>
          {savedNotice && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ Correction noted
            </span>
          )}
        </div>
        <p className="text-muted leading-relaxed">
          Correcting false impressions ensures the platform does not cement inaccurate psychological narratives.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <textarea
            value={correctionText}
            onChange={(e) => setCorrectionText(e.target.value)}
            rows={2}
            placeholder="Provide context the AI missed (e.g. 'The Friday client discussion was actually relaxed, not tense')..."
            className="flex-1 p-2.5 bg-surface-2 border border-border rounded-lg text-primary text-xs focus:outline-none"
          />
          <button
            onClick={handleSaveCorrection}
            className="self-end px-3.5 py-2.5 rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
