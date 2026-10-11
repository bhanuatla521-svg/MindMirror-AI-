import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Sliders,
  Target,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INTROVERT_STAGES, SPEAKING_PROMPTS } from '../../data/speechAndThinkingData';
import { IntrovertStageId, SpeechDifficulty } from '../../types';

export const IntrovertProgramView: React.FC = () => {
  const {
    curriculumState,
    updateCurriculumState,
    setActiveTab,
    setSelectedRetestPrompt
  } = useApp();

  const [activeStageId, setActiveStageId] = useState<IntrovertStageId>(curriculumState.currentStage);

  // Available topics for selection
  const availableTopicTags = [
    'Personal Reflection',
    'Technical Architecture',
    'Setting Boundaries',
    'Career & Interviews',
    'Executive Updates',
    'Disagreeing Constructively',
    'Meeting Contribution',
    'Handling Criticism'
  ];

  const handleToggleTopic = (topic: string) => {
    const existing = curriculumState.preferredTopics || [];
    const updated = existing.includes(topic)
      ? existing.filter(t => t !== topic)
      : [...existing, topic];
    updateCurriculumState({ preferredTopics: updated });
  };

  const handleLaunchStageDrill = (stageId: IntrovertStageId) => {
    // Map stage to appropriate studio prompt
    let targetPrompt = SPEAKING_PROMPTS[0];
    if (stageId === 1) {
      targetPrompt = SPEAKING_PROMPTS.find(p => p.mode === 'daily_prompt') || SPEAKING_PROMPTS[0];
    } else if (stageId === 2) {
      targetPrompt = SPEAKING_PROMPTS.find(p => p.mode === 'impromptu') || SPEAKING_PROMPTS[3];
    } else if (stageId === 3) {
      targetPrompt = SPEAKING_PROMPTS.find(p => p.mode === 'roleplay') || SPEAKING_PROMPTS[10];
    } else if (stageId === 4) {
      targetPrompt = SPEAKING_PROMPTS.find(p => p.mode === 'interview') || SPEAKING_PROMPTS[6];
    } else {
      targetPrompt = SPEAKING_PROMPTS.find(p => p.mode === 'presentation') || SPEAKING_PROMPTS[9];
    }

    setSelectedRetestPrompt(targetPrompt);
    setActiveTab('studio');
  };

  const activeStage = INTROVERT_STAGES.find(s => s.id === activeStageId) || INTROVERT_STAGES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Curriculum Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
            Phase 6 • Introvert-Friendly Practice Programme
          </span>
          <span className="text-xs text-secondary font-mono">Progressive 5-Stage Desensitization Curriculum</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-primary mt-1 tracking-tight">
          Introvert Communication Curriculum
        </h1>
        <p className="text-sm text-secondary mt-1">
          A stepped pathway from completely private solo vocalization to high-impact structured dialogues. Build genuine confidence without forced extroversion.
        </p>
      </div>

      {/* User Preferences & Daily Commitment Bar */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-5 shadow-subtle">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm font-mono uppercase">
          <Sliders className="w-4 h-4 text-accent" />
          <span>Practice Preferences & Constraints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Daily Time Commitment */}
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-2">
            <span className="text-[11px] font-mono uppercase text-secondary font-semibold block">
              Daily Time Commitment
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => updateCurriculumState({ dailyAvailableMinutes: mins as 5 | 15 | 30 })}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    curriculumState.dailyAvailableMinutes === mins
                      ? 'bg-accent text-accent-fg shadow-subtle'
                      : 'bg-surface-1 text-secondary hover:text-primary'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Target Difficulty */}
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-2">
            <span className="text-[11px] font-mono uppercase text-secondary font-semibold block">
              Starting Difficulty
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['foundational', 'intermediate', 'advanced'] as SpeechDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => updateCurriculumState({ preferredDifficulty: diff })}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize ${
                    curriculumState.preferredDifficulty === diff
                      ? 'bg-accent text-accent-fg shadow-subtle'
                      : 'bg-surface-1 text-secondary hover:text-primary'
                  }`}
                >
                  {diff.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>

          {/* Self-Rated Speaking Comfort (1-10) */}
          <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-secondary font-semibold">
                Speaking Comfort Rating
              </span>
              <span className="text-xs font-mono font-bold text-accent">
                {curriculumState.comfortSelfRating}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={curriculumState.comfortSelfRating}
              onChange={(e) => updateCurriculumState({ comfortSelfRating: Number(e.target.value) })}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-mono">
              <span>Hesitant / Avoidant</span>
              <span>Fully Confident</span>
            </div>
          </div>
        </div>

        {/* Preferred Topics Tags */}
        <div className="space-y-2 pt-2 border-t border-border/70">
          <span className="text-[11px] font-mono uppercase text-secondary font-semibold block">
            Preferred Practice Focus Areas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableTopicTags.map((topic) => {
              const isSelected = (curriculumState.preferredTopics || []).includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => handleToggleTopic(topic)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-accent/15 border-accent text-accent font-semibold'
                      : 'bg-surface-2 border-border text-secondary hover:text-primary'
                  }`}
                >
                  {isSelected ? `✓ ${topic}` : topic}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5-Stage Stepper Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {INTROVERT_STAGES.map((stage) => {
          const isSelected = activeStageId === stage.id;
          const isCurrentActive = curriculumState.currentStage === stage.id;
          const isCompleted = curriculumState.currentStage > stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-surface-1 border-accent ring-1 ring-accent shadow-subtle'
                  : 'bg-surface-1 border-border hover:bg-surface-2 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-secondary font-semibold">Stage {stage.id}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isCurrentActive ? (
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                ) : null}
              </div>
              <h4 className="text-xs font-serif font-bold text-primary line-clamp-1">
                {stage.title.split(': ')[1] || stage.title}
              </h4>
              <p className="text-[10px] text-secondary line-clamp-1 mt-0.5">
                {stage.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Stage Deep-Dive Card */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1 flex-1">
            <span className="text-[11px] font-mono uppercase text-accent font-semibold block">
              Stage {activeStage.id} Focus
            </span>
            <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">
              {activeStage.title}
            </h2>
            <p className="text-sm text-secondary font-medium italic">
              "{activeStage.tagline}"
            </p>
            <p className="text-sm text-primary leading-relaxed pt-2">
              {activeStage.description}
            </p>
          </div>

          <button
            onClick={() => handleLaunchStageDrill(activeStage.id)}
            className="px-6 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-subtle shrink-0 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Studio Drill for Stage {activeStage.id}</span>
          </button>
        </div>

        {/* Learning Milestones Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-secondary font-semibold">
            Stage Milestones & Desensitization Targets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeStage.learningGoals.map((goal, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5 text-xs text-primary leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Completion Advancer */}
        <div className="p-4 rounded-xl bg-surface-2/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-primary block">
              Ready for the next desensitization phase?
            </span>
            <span className="text-[11px] text-secondary">
              Unlock Stage {Math.min(5, activeStage.id + 1)} once you feel steady with these drills.
            </span>
          </div>

          <button
            onClick={() => {
              const nextStage = Math.min(5, activeStage.id + 1) as IntrovertStageId;
              updateCurriculumState({ currentStage: nextStage });
              setActiveStageId(nextStage);
            }}
            className="px-4 py-2 rounded-xl bg-surface-1 border border-border text-primary hover:bg-surface-hover text-xs font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Advance to Stage {Math.min(5, activeStage.id + 1)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
