import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Clock, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';

export const GoalsAndActionPlans: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [smallNextAction, setSmallNextAction] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(50);

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setReason('');
    setTargetDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setSmallNextAction('');
    setObstacles('');
    setLessonsLearned('');
    setProgressPercentage(25);
    setShowModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setReason(goal.reason);
    setTargetDate(goal.targetDate);
    setSmallNextAction(goal.smallNextAction);
    setObstacles(goal.obstacles);
    setLessonsLearned(goal.lessonsLearned);
    setProgressPercentage(goal.progressPercentage);
    setShowModal(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        title,
        reason,
        targetDate,
        smallNextAction,
        obstacles,
        lessonsLearned,
        progressPercentage
      });
    } else {
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title,
        reason,
        targetDate,
        status: 'in_progress',
        smallNextAction,
        relatedHabits: [],
        recentReflection: '',
        obstacles,
        lessonsLearned,
        progressPercentage
      };
      addGoal(newGoal);
    }

    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Teleological Alignment & Intentional Growth
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Goals & Action Plans
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Connect macro personal values and operational milestones to immediate next micro-actions.
        </p>
      </div>

      {/* Goal list controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Active Commitments ({goals.length})</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 transition-opacity shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm text-primary leading-snug">{goal.title}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-1 text-muted hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-muted hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                <strong>Why:</strong> {goal.reason}
              </p>

              {/* Next action pill */}
              <div className="p-2.5 bg-surface-2 rounded-lg border border-border text-xs space-y-1">
                <span className="text-[10px] font-mono text-muted uppercase">Immediate Next Action:</span>
                <p className="font-medium text-primary">{goal.smallNextAction || 'No action defined'}</p>
              </div>

              {goal.obstacles && (
                <div className="text-[11px] text-muted italic">
                  Obstacle context: {goal.obstacles}
                </div>
              )}
            </div>

            {/* Bottom Progress Bar & Target Date */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                <span>Progress: {goal.progressPercentage}%</span>
                <span>Target: {goal.targetDate}</span>
              </div>
              <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${goal.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-1 border border-border rounded-xl max-w-md w-full p-6 shadow-soft space-y-4 text-primary text-xs">
            <h3 className="font-semibold text-sm">
              {editingGoal ? 'Edit Goal' : 'Define New Goal'}
            </h3>

            <form onSubmit={handleSaveGoal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Non-Defensive Communication"
                  className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Underlying Motivation / Purpose</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why does this matter deeply to you?"
                  className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Progress ({progressPercentage}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(Number(e.target.value))}
                    className="w-full accent-primary mt-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Small Next Measurable Action</label>
                <input
                  type="text"
                  value={smallNextAction}
                  onChange={(e) => setSmallNextAction(e.target.value)}
                  placeholder="Single concrete next action..."
                  className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Predicted Obstacles</label>
                <input
                  type="text"
                  value={obstacles}
                  onChange={(e) => setObstacles(e.target.value)}
                  placeholder="What friction usually derails this?"
                  className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-fg font-medium text-xs shadow-subtle"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
