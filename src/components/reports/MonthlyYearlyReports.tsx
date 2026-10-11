import React from 'react';
import { FileText, Printer, Download, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MonthlyYearlyReports: React.FC = () => {
  const { entries, dimensions, goals, weeklyReport } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = `# MindMirror AI — Longitudinal Psychological Growth Report
Generated: ${new Date().toLocaleDateString()}
Journal Window: ${entries[entries.length - 1]?.date || 'N/A'} to ${entries[0]?.date || 'N/A'}

## Executive Summary
${weeklyReport.summary}

## Top Supported Development Dimensions
${dimensions.slice(0, 5).map(d => `- **${d.name}**: ${d.currentScore}/100 (${d.evidenceCoverageLevel})`).join('\n')}

## Meaningful Positive Observations
${weeklyReport.positiveExperiences.map(e => `- ${e}`).join('\n')}

## Recurring Challenges & Areas for Continued Attention
${weeklyReport.repeatedChallenges.map(c => `- ${c}`).join('\n')}

## Core Priorities Ahead
${weeklyReport.threePrioritiesNextWeek.map((p, i) => `${i + 1}. ${p}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmirror-growth-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header & Export Actions */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
              Longitudinal Arc & Milestone Synthesis
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
              Monthly & Longitudinal Growth Report
            </h1>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 border border-border text-primary hover:bg-surface-hover transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
          </div>
        </div>

        <p className="text-xs md:text-sm text-secondary leading-relaxed">
          This report aggregates qualitative themes, repeated behavioral responses, and transparent indicator trajectories across your journal history. It emphasizes verifiable behavioral adaptations over assumed personality shifts.
        </p>
      </div>

      {/* Section 1: Major Recurring Themes */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3 text-xs md:text-sm">
        <h2 className="text-sm font-semibold text-primary">1. Major Recurring Themes in Journal Entries</h2>
        <div className="space-y-3 text-secondary leading-relaxed">
          <p>
            • <strong>Professional Boundaries Under Pressure:</strong> Across recent weeks, multiple entries documented navigating accelerated sprint schedules and client revisions. The consistent presence of objective data points (metrics, backlog burndown) replaced reactive compliance or argumentative refusal.
          </p>
          <p>
            • <strong>Biological Regulation as Psychological Foundation:</strong> A pronounced recurring pattern: sleep durations of 7.5+ hours directly coincide with patient active listening and lower somatic defensiveness during code reviews.
          </p>
          <p>
            • <strong>Defensive Reflex Recognition:</strong> Noticing an urge to over-explain technical choices before being asked for elaboration. Progression shows awareness moving from post-hoc realization to in-the-moment pauses.
          </p>
        </div>
      </section>

      {/* Section 2: Validated Behavioral Progress */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4 text-xs md:text-sm">
        <div className="flex items-center gap-2 font-semibold text-primary text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2>2. Improvements Supported by Repeated Evidence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-1">
            <span className="font-semibold text-primary">Circadian Decompression</span>
            <p className="text-secondary">Consistent 9 PM evening tea ritual anchoring journaling; 12 consecutive days recorded without lapse.</p>
          </div>
          <div className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-1">
            <span className="font-semibold text-primary">Empirical Hypothesis Revision</span>
            <p className="text-secondary">Demonstrated willingness to adopt colleague's schema rewrite immediately after benchmark demonstration.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Unresolved Challenges */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3 text-xs md:text-sm">
        <h2 className="text-sm font-semibold text-primary">3. Challenges That Remain Unresolved</h2>
        <p className="text-secondary leading-relaxed">
          Afternoon energy dips when skipping morning hydration or delaying lunch for client meetings. Midday nutrition planning requires continued structural protection.
        </p>
      </section>
    </div>
  );
};
