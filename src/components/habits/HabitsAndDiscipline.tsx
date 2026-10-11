import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Trash2, ThumbsUp, ThumbsDown, Minus, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';

export const HabitsAndDiscipline: React.FC = () => {
  const {
    habits,
    toggleHabitDate,
    addHabit,
    deleteHabit,
    actions,
    toggleAction,
    rateAction,
    deleteAction
  } = useApp();

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDimension, setNewHabitDimension] = useState('Self-Awareness');
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Generate last 7 calendar days
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const habit: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabitName.trim(),
      frequency: 'daily',
      targetDays: 7,
      currentStreak: 0,
      completedDates: [],
      connectedDimension: newHabitDimension,
      obstacleNotes: ''
    };

    addHabit(habit);
    setNewHabitName('');
    setShowAddHabit(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Behavioral Fidelity & Shame-Free Habit Formation
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Habits & Discipline Tracker
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Build sustainable rituals through environmental triggers and habit stacking. Missed days are treated as operational data, never moral failure.
        </p>
      </div>

      {/* Habits Grid */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-primary">Active Behavioral Habits</h2>
            <p className="text-[11px] text-muted">7-day consistency view. Click a date box to toggle completion.</p>
          </div>
          <button
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>

        {showAddHabit && (
          <form onSubmit={handleCreateHabit} className="p-4 bg-surface-2 rounded-xl border border-border space-y-3 text-xs animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. 10-minute afternoon sunlight walk"
                  className="w-full p-2 bg-surface-1 border border-border rounded-lg text-primary text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-primary">Connected Dimension</label>
                <input
                  type="text"
                  value={newHabitDimension}
                  onChange={(e) => setNewHabitDimension(e.target.value)}
                  placeholder="e.g. Emotional Regulation or Focus"
                  className="w-full p-2 bg-surface-1 border border-border rounded-lg text-primary text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddHabit(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-accent text-accent-fg font-medium text-xs"
              >
                Add Habit
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="p-4 bg-surface-2 rounded-xl border border-border space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-primary text-sm">{habit.name}</h3>
                  <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                    <span className="font-mono">Linked to: {habit.connectedDimension}</span>
                    <span>•</span>
                    <span className="font-mono font-medium text-primary">{habit.currentStreak} day streak</span>
                  </div>
                </div>

                {/* 7-day check row */}
                <div className="flex items-center gap-1.5">
                  {last7Days.map(date => {
                    const isDone = habit.completedDates.includes(date);
                    const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' });
                    return (
                      <button
                        key={date}
                        onClick={() => toggleHabitDate(habit.id, date)}
                        title={`${date} (${dayLabel}): ${isDone ? 'Completed' : 'Missed'}`}
                        className={`w-7 h-8 rounded flex flex-col items-center justify-center text-[10px] border transition-colors ${
                          isDone
                            ? 'bg-primary text-canvas border-primary font-bold'
                            : 'bg-canvas text-muted border-border hover:border-border-strong'
                        }`}
                      >
                        <span className="text-[9px] opacity-75">{dayLabel}</span>
                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : '·'}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 text-muted hover:text-rose-600 transition-colors ml-1"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {habit.obstacleNotes && (
                <div className="text-[11px] text-muted italic bg-canvas/70 p-2 rounded border border-border/50">
                  Obstacle context: {habit.obstacleNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tracked Action Recommendations */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-primary">Tracked Actions from Daily AI Reviews</h2>
          <p className="text-[11px] text-muted">Actions converted directly from daily reflection suggestions</p>
        </div>

        <div className="space-y-2">
          {actions.map(action => (
            <div
              key={action.id}
              className="p-3 bg-surface-2 rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={action.isCompleted}
                  onChange={() => toggleAction(action.id)}
                  className="mt-0.5 rounded border-border accent-primary cursor-pointer"
                />
                <div className="min-w-0">
                  <p className={`font-medium ${action.isCompleted ? 'line-through text-muted' : 'text-primary'}`}>
                    {action.actionText}
                  </p>
                  <span className="text-[10px] text-muted font-mono">
                    Target: {action.targetDate} {action.completedAt && `• Done on ${action.completedAt.slice(0, 10)}`}
                  </span>
                </div>
              </div>

              {/* Did it help feedback pills */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <span className="text-[10px] text-muted font-mono hidden md:inline">Did it help?</span>
                <button
                  onClick={() => rateAction(action.id, 'helped')}
                  className={`p-1 rounded border text-[11px] ${
                    action.didHelpRating === 'helped' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-border text-muted hover:text-primary'
                  }`}
                  title="Helped"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => rateAction(action.id, 'neutral')}
                  className={`p-1 rounded border text-[11px] ${
                    action.didHelpRating === 'neutral' ? 'bg-surface-1 text-primary border-border-strong' : 'border-border text-muted hover:text-primary'
                  }`}
                  title="Neutral"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => rateAction(action.id, 'unhelpful')}
                  className={`p-1 rounded border text-[11px] ${
                    action.didHelpRating === 'unhelpful' ? 'bg-rose-600 text-white border-rose-600' : 'border-border text-muted hover:text-primary'
                  }`}
                  title="Unhelpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteAction(action.id)}
                  className="p-1 text-muted hover:text-rose-600 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {actions.length === 0 && (
            <div className="text-center py-6 text-xs text-muted">
              No actions tracked yet. Click "Turn into Action" on any AI Daily Review to track recommendations here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
