import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Scale,
  Compass,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  THINKING_EXERCISES
} from '../../data/speechAndThinkingData';
import {
  ThinkingGymCategory,
  ThinkingExercise,
  ThinkingSubmission
} from '../../types';

export const ThinkingGymView: React.FC = () => {
  const {
    thinkingSubmissions,
    evaluateThinkingExercise
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ThinkingGymCategory>('critical_logic');
  const [selectedExercise, setSelectedExercise] = useState<ThinkingExercise>(() => {
    return THINKING_EXERCISES[0];
  });
  const [userReasoningInput, setUserReasoningInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<ThinkingSubmission | null>(null);

  const categories: Array<{ id: ThinkingGymCategory; label: string; icon: any }> = [
    { id: 'critical_logic', label: 'Critical Logic', icon: Brain },
    { id: 'fact_vs_opinion', label: 'Fact vs Opinion', icon: Scale },
    { id: 'evidence_arguments', label: 'Evidence & Arguments', icon: ShieldCheck },
    { id: 'cognitive_biases', label: 'Cognitive Biases', icon: AlertTriangle },
    { id: 'first_principles', label: 'First Principles', icon: Compass },
    { id: 'lateral_creativity', label: 'Lateral Thinking', icon: Lightbulb },
    { id: 'problem_solving', label: 'Problem Solving', icon: Layers },
    { id: 'probabilistic_reasoning', label: 'Probabilistic Thinking', icon: Scale },
    { id: 'perspective_taking', label: 'Perspective Taking', icon: Compass },
    { id: 'metacognition', label: 'Metacognition', icon: Brain },
  ];

  const handleSelectCategory = (catId: ThinkingGymCategory) => {
    setSelectedCategory(catId);
    const exercise = THINKING_EXERCISES.find(e => e.category === catId) || THINKING_EXERCISES[0];
    setSelectedExercise(exercise);
    setUserReasoningInput('');
    setActiveSubmission(null);
  };

  const handleSubmitReasoning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReasoningInput.trim()) return;

    setIsSubmitting(true);
    try {
      const submission = await evaluateThinkingExercise(
        selectedExercise.id,
        selectedExercise.category,
        selectedExercise.premise,
        selectedExercise.promptQuestion,
        userReasoningInput.trim(),
        selectedExercise.keyRubricCriteria
      );
      setActiveSubmission(submission);
    } catch (err) {
      console.error('[ThinkingGym] Evaluation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Gym Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
            Phase 5 • Cognitive & Reasoning Gym
          </span>
          <span className="text-xs text-secondary font-mono">10 Philosophical & Analytical Domains</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-primary mt-1 tracking-tight">
          The Thinking Gym
        </h1>
        <p className="text-sm text-secondary mt-1">
          Structured exercises in first-principles, bias audits, probabilistic reasoning, and metacognition. Evaluated with explicit rubrics that reward intellectual honesty, not mere confidence.
        </p>
      </div>

      {/* 10 Category Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-accent text-accent-fg border-accent shadow-subtle'
                  : 'bg-surface-1 border-border text-secondary hover:text-primary hover:bg-surface-2'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Exercise Scenario Card */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 md:p-8 space-y-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-accent font-semibold block">
              {selectedExercise.categoryTitle} • {selectedExercise.difficulty}
            </span>
            <h2 className="text-xl font-serif font-bold text-primary mt-1">
              {selectedExercise.title}
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 border border-border text-secondary self-start sm:self-auto">
            Rubric Evaluation Active
          </span>
        </div>

        {/* Premise & Prompt */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-surface-2/70 border border-border text-sm text-primary leading-relaxed font-sans">
            {selectedExercise.premise}
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 space-y-1">
            <span className="text-[11px] font-mono uppercase text-accent font-semibold block">
              Analytical Question
            </span>
            <p className="text-sm font-medium text-primary leading-relaxed">
              {selectedExercise.promptQuestion}
            </p>
          </div>
        </div>

        {/* Rubric Criteria Checklist */}
        <div className="p-4 rounded-xl bg-surface-2/40 border border-border space-y-2">
          <span className="text-[11px] font-mono uppercase text-secondary font-semibold block">
            Evaluation Rubric Criteria (What the Coach Checks)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-primary">
            {selectedExercise.keyRubricCriteria.map((crit, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-surface-1 p-2 rounded-lg border border-border">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{crit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmitReasoning} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-secondary font-semibold block">
              Your Reasoning & Argument Submission
            </label>
            <textarea
              value={userReasoningInput}
              onChange={(e) => setUserReasoningInput(e.target.value)}
              placeholder="State your analysis clearly. Focus on causal mechanisms, distinguishing facts from assumptions, and acknowledging counter-arguments..."
              rows={6}
              className="w-full p-4 rounded-xl bg-surface-2 border border-border text-primary font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-secondary font-mono">
              Word count: {userReasoningInput.trim() ? userReasoningInput.trim().split(/\s+/).length : 0} words
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !userReasoningInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-subtle disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Analytical Rubric...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluate My Reasoning</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live Submission Evaluation Result Card */}
      {activeSubmission && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-accent font-semibold block">
                Rubric Assessment Result
              </span>
              <h3 className="text-xl font-serif font-bold text-primary mt-0.5">
                {activeSubmission.exerciseTitle}
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-secondary block">Reasoning Score</span>
                <span className="text-2xl font-bold font-mono text-primary">{activeSubmission.overallScore}/100</span>
              </div>
              <div className="text-right pl-3 border-l border-border">
                <span className="text-[10px] font-mono uppercase text-accent block">Intellectual Honesty</span>
                <span className="text-2xl font-bold font-mono text-accent">{activeSubmission.intellectualHonestyScore}/100</span>
              </div>
            </div>
          </div>

          {/* Rubric Feedback Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-secondary font-semibold">
              Rubric Criteria Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeSubmission.rubricFeedback.map((rf, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-primary">
                    <span className="line-clamp-1">{rf.criterion}</span>
                    <span className="font-mono text-accent">{rf.score}/100</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed pt-1">
                    {rf.observation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Flagged Biases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Analytical Strengths</span>
              </div>
              <ul className="text-xs text-primary space-y-1.5 list-disc list-inside">
                {activeSubmission.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs font-mono uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Flagged Assumptions & Biases</span>
              </div>
              <ul className="text-xs text-primary space-y-1.5 list-disc list-inside">
                {activeSubmission.assumptionsOrBiasesFlagged.map((asmp, i) => (
                  <li key={i}>{asmp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* World-Class Alternative Perspective */}
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-xs font-mono uppercase">
              <Lightbulb className="w-4 h-4" />
              <span>Steel-Manned Alternative Synthesis</span>
            </div>
            <p className="text-xs text-primary leading-relaxed font-sans">
              {activeSubmission.clearerAlternativePerspective}
            </p>
          </div>
        </div>
      )}

      {/* Thinking History */}
      {thinkingSubmissions.length > 0 && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <h3 className="text-xs font-mono uppercase font-semibold text-secondary">
            Completed Thinking Exercises ({thinkingSubmissions.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {thinkingSubmissions.slice(0, 6).map((sub) => (
              <div
                key={sub.id}
                onClick={() => setActiveSubmission(sub)}
                className="p-3.5 rounded-xl bg-surface-2 border border-border hover:border-accent cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary line-clamp-1">{sub.exerciseTitle}</span>
                  <span className="font-mono text-[10px] text-secondary">{sub.date}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-secondary">
                  <span>Score: <strong className="text-primary">{sub.overallScore}</strong></span>
                  <span>Honesty: <strong className="text-accent">{sub.intellectualHonestyScore}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
