import React, { useState } from 'react';
import { Lightbulb, BookOpen, Quote, Sparkles, Compass, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonalInsightsView: React.FC = () => {
  const { entries, setActiveTab, setSelectedEntryId } = useApp();

  const lessons = entries
    .filter(e => e.lessons && e.lessons.trim().length > 0)
    .map(e => ({
      date: e.date,
      title: e.title,
      lesson: e.lessons,
      entryId: e.id
    }));

  const coreValues = [
    { name: "Intellectual Honesty", description: "Changing views when evidence appears; not clinging to ego.", status: "Strongly Supported" },
    { name: "Family Presence", description: "Protecting evening dinners and undistracted time with loved ones.", status: "Maintained" },
    { name: "Deep Work Craftsmanship", description: "Dedication to high-leverage technical problem solving.", status: "Consistent" },
    { name: "Biological Baseline Respect", description: "Prioritizing sleep hygiene as the anchor of emotional resilience.", status: "Emerging Improvement" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Empirical Wisdom & Values Audit
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Personal Insights & Lessons-Learned Library
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Synthesized self-knowledge, behavioral axioms extracted from your diary, and ongoing alignment with your core values.
        </p>
      </div>

      {/* Reflection Question of the Day */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
          <Lightbulb className="w-4 h-4 text-accent" />
          <span>Reflection Question of the Day</span>
        </div>
        <blockquote className="text-base md:text-lg font-serif italic text-primary leading-relaxed pl-3 border-l-2 border-accent">
          "What assumption am I treating as an indisputable fact today that I haven't tested with objective evidence?"
        </blockquote>
        <p className="text-xs text-muted">
          Consider exploring this question in your next daily diary entry.
        </p>
      </div>

      {/* Lessons-Learned Library */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-primary">Lessons-Learned Library</h2>
            <p className="text-[11px] text-muted">Realizations directly documented in your journal entries</p>
          </div>
          <span className="text-[11px] font-mono text-muted">{lessons.length} archived lessons</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-surface-2 rounded-xl border border-border space-y-2 text-xs flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>{item.date}</span>
                  <span className="truncate max-w-[140px]">{item.title}</span>
                </div>
                <p className="text-primary font-medium leading-relaxed">
                  "{item.lesson}"
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedEntryId(item.entryId);
                    setActiveTab('diary');
                  }}
                  className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Open Entry</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values Alignment Check */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-semibold text-primary">Core Values Alignment Matrix</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {coreValues.map((v, idx) => (
            <div key={idx} className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{v.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas border border-border text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.status}
                </span>
              </div>
              <p className="text-secondary text-[11px] leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
