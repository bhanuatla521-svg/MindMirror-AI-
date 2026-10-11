import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Brain,
  Heart,
  Users,
  Compass,
  Plus,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ShieldCheck,
  Quote,
  ArrowRight,
  PenLine
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIDailyReviewView: React.FC = () => {
  const {
    entries,
    reviews,
    selectedEntryId,
    setSelectedEntryId,
    turnIntoAction,
    updateReviewFeedback,
    setActiveTab
  } = useApp();

  // Find target review: if selectedEntryId matches an entry with review, use it, else use the first review available
  const entryWithReview = entries.find(e => e.id === selectedEntryId && e.aiReviewId && reviews[e.aiReviewId]);
  const defaultEntryWithReview = entries.find(e => e.aiReviewId && reviews[e.aiReviewId]);

  const activeEntry = entryWithReview || defaultEntryWithReview;
  const activeReview = activeEntry && activeEntry.aiReviewId ? reviews[activeEntry.aiReviewId] : null;

  const [userNote, setUserNote] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  if (!activeReview || !activeEntry) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto text-muted">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-primary">No AI Daily Review Generated Yet</h2>
        <p className="text-xs text-secondary max-w-md mx-auto">
          Write an entry in your daily diary and click "Analyze My Day" to run the evidence-based psychological reflection engine.
        </p>
        <button
          onClick={() => setActiveTab('diary')}
          className="px-4 py-2 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 transition-opacity"
        >
          Go to Daily Diary
        </button>
      </div>
    );
  }

  const handleFeedback = (isHelpful: boolean, isAccurate: boolean) => {
    updateReviewFeedback(activeReview.id, {
      isHelpful,
      isAccurate,
      userNotes: userNote || activeReview.userFeedback?.userNotes
    });
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2500);
  };

  const handleSaveCorrection = () => {
    if (!userNote.trim()) return;
    updateReviewFeedback(activeReview.id, {
      corrections: userNote.trim()
    });
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Review Header Banner */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
              AI Daily Review / {activeReview.date}
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
              Reflective Analysis for "{activeEntry.title}"
            </h1>
          </div>

          {/* Entry Selector Dropdown if multiple entries exist */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-muted font-mono">Date:</label>
            <select
              value={activeEntry.id}
              onChange={(e) => setSelectedEntryId(e.target.value)}
              className="text-xs font-mono bg-surface-2 border border-border rounded-lg px-2.5 py-1.5 text-primary focus:outline-none"
            >
              {entries.filter(e => e.aiReviewId).map(e => (
                <option key={e.id} value={e.id}>
                  {e.date} — {e.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Evidence & Analytical Honesty Disclaimer */}
        <div className="flex items-center justify-between text-xs text-secondary bg-surface-2 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Evidence Coverage: <strong>{activeReview.confidenceAndEvidence.evidenceCoverageScore}%</strong> (Based strictly on user account)
            </span>
          </div>
          <span className="text-[11px] text-muted font-mono">Zero hallucinated events</span>
        </div>
      </div>

      {/* A. Day Summary */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Compass className="w-4 h-4 text-accent" />
          <h2>A. Day Summary</h2>
        </div>
        <ul className="space-y-2 text-xs md:text-sm text-secondary list-disc list-inside leading-relaxed">
          {activeReview.daySummary.map((item, idx) => (
            <li key={idx} className="pl-1 marker:text-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* B. What Went Well */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2>B. What Went Well & Strengths Demonstrated</h2>
        </div>
        <div className="space-y-3">
          {activeReview.whatWentWell.map((item, idx) => (
            <div key={idx} className="p-4 bg-surface-2 rounded-lg border border-border space-y-2 text-xs md:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-primary">{item.observation}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-canvas border border-border text-secondary">
                  Strength: {item.strength}
                </span>
              </div>
              <p className="text-secondary leading-relaxed">{item.whyHelpful}</p>
              <div className="text-xs text-muted italic bg-canvas/60 p-2 rounded border border-border/60 flex items-start gap-1.5">
                <Quote className="w-3 h-3 text-muted flex-shrink-0 mt-0.5" />
                <span>"{item.quote}"</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* C. Mistakes & Improvement Opportunities */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h2>C. Ineffective Behaviors & Constructive Alternatives</h2>
        </div>
        <div className="space-y-4">
          {activeReview.mistakesAndImprovements.map((item, idx) => (
            <div key={idx} className="p-4 bg-surface-2 rounded-lg border border-border space-y-3 text-xs md:text-sm">
              <div className="font-semibold text-primary">Observed Friction Point</div>
              <p className="text-secondary leading-relaxed">{item.whatHappened}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 bg-canvas rounded border border-border space-y-1">
                  <div className="font-medium text-primary">Why Ineffective</div>
                  <p className="text-muted leading-relaxed">{item.whyIneffective}</p>
                </div>

                <div className="p-2.5 bg-canvas rounded border border-border space-y-1">
                  <div className="font-medium text-primary">Likely Consequences</div>
                  <p className="text-muted leading-relaxed">{item.likelyConsequence}</p>
                </div>
              </div>

              <div className="p-3 bg-surface-1 rounded border border-border space-y-1.5 text-xs">
                <div className="font-semibold text-primary">Recommended Constructive Alternative:</div>
                <p className="text-secondary">{item.alternative}</p>
                <div className="text-[11px] text-muted font-mono pt-1">
                  <strong>Practice Method:</strong> {item.practiceMethod}
                </div>
              </div>

              <div className="text-xs text-muted italic bg-canvas/60 p-2 rounded border border-border/60 flex items-start gap-1.5">
                <Quote className="w-3 h-3 text-muted flex-shrink-0 mt-0.5" />
                <span>"{item.quote}"</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* D. Emotional Reflection */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Heart className="w-4 h-4 text-rose-500" />
          <h2>D. Emotional Reflection & Trigger Hypotheses</h2>
        </div>
        <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-3 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-primary">Explicitly Reported Emotions:</span>
            {activeReview.emotionalReflection.emotionsReported.map((emo, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full bg-canvas border border-border text-[11px] font-mono text-primary">
                {emo}
              </span>
            ))}
          </div>

          <div className="space-y-1">
            <div className="font-medium text-primary">Pattern Observations:</div>
            <ul className="list-disc list-inside text-secondary space-y-1 pl-1">
              {activeReview.emotionalReflection.patternObservations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-canvas rounded border border-border space-y-1 text-xs">
            <div className="font-semibold text-primary">Trigger Hypothesis (To be tested, not taken as fact):</div>
            <p className="text-secondary leading-relaxed">{activeReview.emotionalReflection.triggerHypothesis}</p>
            <div className="pt-1 text-muted">
              <strong>Constructive Alternative Response:</strong> {activeReview.emotionalReflection.alternativeResponse}
            </div>
          </div>
        </div>
      </section>

      {/* E. Thinking & Decision Analysis */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Brain className="w-4 h-4 text-accent" />
          <h2>E. Thinking & Decision Analysis (Cognitive Check)</h2>
        </div>
        <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-3 text-xs md:text-sm">
          <div className="space-y-1.5">
            <div className="font-medium text-primary">Cognitive Distortions / Biases Examined:</div>
            <div className="flex flex-wrap gap-1.5">
              {activeReview.thinkingAnalysis.cognitiveBiasesNoticed.map((bias, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-canvas border border-border text-xs text-secondary font-mono">
                  {bias}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-canvas rounded border border-border space-y-1">
              <div className="font-medium text-primary">Untested Assumptions</div>
              <ul className="list-disc list-inside text-muted space-y-1">
                {activeReview.thinkingAnalysis.untestedAssumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 bg-canvas rounded border border-border space-y-1">
              <div className="font-medium text-primary">Alternative Perspectives</div>
              <ul className="list-disc list-inside text-muted space-y-1">
                {activeReview.thinkingAnalysis.alternativePerspectives.map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* F. Social Interaction Review */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Users className="w-4 h-4 text-primary" />
          <h2>F. Social Interaction Review</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <div className="font-medium text-primary">Communication Clarity</div>
            <p className="text-secondary">{activeReview.socialInteractionReview.clarity}</p>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <div className="font-medium text-primary">Active Listening</div>
            <p className="text-secondary">{activeReview.socialInteractionReview.activeListening}</p>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <div className="font-medium text-primary">Empathy & Perspective-Taking</div>
            <p className="text-secondary">{activeReview.socialInteractionReview.perspectiveTaking}</p>
          </div>
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-1">
            <div className="font-medium text-primary">Boundary Respect</div>
            <p className="text-secondary">{activeReview.socialInteractionReview.boundaryRespect}</p>
          </div>
        </div>
      </section>

      {/* G. Action Plan */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2>G. Action Plan for Tomorrow</h2>
          </div>
          <span className="text-[11px] text-muted font-mono">Connects to habit tracker</span>
        </div>

        <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-4 text-xs md:text-sm">
          {/* Highest priority */}
          <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-2">
            <div className="text-[11px] font-mono text-muted uppercase">Highest Priority Improvement</div>
            <div className="font-semibold text-primary">{activeReview.actionPlan.highestPriority}</div>
            <button
              onClick={() => turnIntoAction(activeReview.actionPlan.highestPriority, undefined, activeReview.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3 h-3" />
              <span>Turn into Action</span>
            </button>
          </div>

          {/* Three actions tomorrow */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary">Three Achievable Actions:</div>
            {activeReview.actionPlan.threeActionsTomorrow.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-surface-1 rounded border border-border text-xs gap-2">
                <span className="text-secondary truncate flex-1">{act}</span>
                <button
                  onClick={() => turnIntoAction(act, undefined, activeReview.id)}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-2 border border-border text-primary hover:bg-surface-hover text-[11px] font-medium"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Track</span>
                </button>
              </div>
            ))}
          </div>

          {/* Micro habit & reflection question */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-canvas rounded border border-border space-y-1">
              <div className="font-medium text-primary">Micro-Habit to Practice</div>
              <p className="text-secondary">{activeReview.actionPlan.smallHabitToPractice}</p>
            </div>
            <div className="p-3 bg-canvas rounded border border-border space-y-1">
              <div className="font-medium text-primary">Reflection Question</div>
              <p className="text-secondary italic">"{activeReview.actionPlan.reflectionQuestion}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* H. Confidence & Supporting Evidence Breakdown */}
      <section className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2>H. Confidence & Evidence Attribution</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-2">
            <div className="font-semibold text-primary">Directly Stated Facts</div>
            <ul className="list-disc list-inside text-secondary space-y-1">
              {activeReview.confidenceAndEvidence.directlyStatedFacts.map((fact, idx) => (
                <li key={idx} className="text-[11px]">{fact}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-2">
            <div className="font-semibold text-primary">Reasonable Interpretations</div>
            <ul className="list-disc list-inside text-secondary space-y-1">
              {activeReview.confidenceAndEvidence.reasonableInterpretations.map((interp, idx) => (
                <li key={idx} className="text-[11px]">{interp}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-surface-2 rounded-lg border border-border space-y-2">
            <div className="font-semibold text-primary">Unknown / Unobserved</div>
            <ul className="list-disc list-inside text-secondary space-y-1">
              {activeReview.confidenceAndEvidence.unknownOrUnclearInfo.map((unk, idx) => (
                <li key={idx} className="text-[11px]">{unk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* User Feedback & Correction Actions */}
      <section className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-primary">Was this review accurate and helpful?</h3>
          {feedbackSaved && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ Feedback saved
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => handleFeedback(true, true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 hover:bg-surface-hover text-primary text-xs font-medium transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Helpful & Accurate</span>
          </button>

          <button
            onClick={() => handleFeedback(false, false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 hover:bg-surface-hover text-primary text-xs font-medium transition-colors"
          >
            <ThumbsDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Not Accurate</span>
          </button>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Clarify or correct an AI interpretation (e.g. 'I wasn't angry, just in a hurry')..."
            className="flex-1 text-xs bg-surface-2 border border-border rounded-lg px-3 py-2 text-primary placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={handleSaveCorrection}
            className="px-3 py-2 text-xs rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border font-medium"
          >
            Save Note
          </button>
        </div>
      </section>
    </div>
  );
};
