import React, { useState } from 'react';
import { Heart, Activity, Moon, Calendar, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';

export const EmotionalWellness: React.FC = () => {
  const { entries, setActiveTab, setSelectedEntryId } = useApp();

  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);

  const moodColor = (m: number) => {
    switch (m) {
      case 5: return 'bg-emerald-500 text-white';
      case 4: return 'bg-emerald-400 text-black';
      case 3: return 'bg-amber-400 text-black';
      case 2: return 'bg-orange-400 text-black';
      case 1: return 'bg-rose-500 text-white';
      default: return 'bg-surface-2 text-muted';
    }
  };

  const chartData = [...entries].reverse().map(e => ({
    date: e.date.slice(5),
    mood: e.mood,
    energy: e.energy,
    stress: e.stress
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-2">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Affective Balance & Somatic Self-Regulation
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          Emotional Wellness & Trigger Tracker
        </h1>
        <p className="text-xs md:text-sm text-secondary max-w-2xl">
          Track biological patterns, emotional triggers, and physiological stress baselines to cultivate equanimity and self-compassion.
        </p>
      </div>

      {/* Mood Calendar Grid */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-primary">Recent Diary Mood Calendar</h2>
          </div>
          <span className="text-[11px] text-muted font-mono">Click day to open reflection</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {entries.slice(0, 14).map(entry => (
            <div
              key={entry.id}
              onClick={() => {
                setSelectedEntryId(entry.id);
                setActiveTab('diary');
              }}
              className="p-3 bg-surface-2 hover:bg-surface-hover rounded-lg border border-border cursor-pointer transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                <span>{entry.date.slice(5)}</span>
                <span>{entry.dayOfWeek.slice(0, 3)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${moodColor(entry.mood)}`}>
                  {entry.mood}
                </div>
                <div className="text-[11px] text-secondary truncate">
                  {entry.mood === 5 ? 'Thriving' : entry.mood === 4 ? 'Good' : entry.mood === 3 ? 'Neutral' : 'Strained'}
                </div>
              </div>
              <div className="text-[10px] text-muted font-mono">
                Stress: {entry.stress}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy vs Stress Area Chart */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-primary">Stress vs. Energy Correlation</h2>
          <p className="text-[11px] text-muted">Tracking autonomic balance across recorded journal days</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="currentColor" className="text-muted text-[10px]" />
              <YAxis domain={[0, 10]} stroke="currentColor" className="text-muted text-[10px]" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-1)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Area
                type="monotone"
                dataKey="energy"
                name="Energy (1-10)"
                stroke="var(--color-text-primary)"
                fill="var(--color-surface-2)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="stress"
                name="Stress (1-10)"
                stroke="var(--color-accent)"
                fill="none"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Somatic & Emotional Granularity Reflection Drills */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-subtle space-y-4">
        <h2 className="text-sm font-semibold text-primary">Somatic & Emotional Regulation Drills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-2">
            <h3 className="font-semibold text-primary">1. The 90-Second Physiological Pause</h3>
            <p className="text-secondary leading-relaxed">
              When encountering sudden friction or an alarming email, neurochemical adrenaline surges last approximately 90 seconds. Commit to zero typed responses until this window closes.
            </p>
            <div className="text-[10px] text-muted font-mono pt-1">Evidence: Validated on Oct 9 email reply</div>
          </div>

          <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-2">
            <h3 className="font-semibold text-primary">2. Emotion Granularity Expanding</h3>
            <p className="text-secondary leading-relaxed">
              Replace catch-all labels like "stressed" with specific terms: <em>Apprehensive, Dehydrated, Overwhelmed, Ambivalent, or Disappointed</em>. Specificity reduces amygdala activation.
            </p>
            <div className="text-[10px] text-muted font-mono pt-1">Active exercise</div>
          </div>

          <div className="p-4 bg-surface-2 rounded-lg border border-border space-y-2">
            <h3 className="font-semibold text-primary">3. Physiological Sigh</h3>
            <p className="text-secondary leading-relaxed">
              Two quick nasal inhales followed by one long, slow mouth exhale. Repeat 3 times during afternoon energy transitions to reset autonomic carbon-dioxide balance.
            </p>
            <div className="text-[10px] text-muted font-mono pt-1">Recommended mid-afternoon</div>
          </div>
        </div>
      </div>
    </div>
  );
};
