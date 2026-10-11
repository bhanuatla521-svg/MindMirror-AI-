import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  CheckCircle,
  AlertCircle,
  Dumbbell,
  Quote,
  X,
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PersonalDimension, DimensionCategory } from '../../types';

export const PsychologicalGrowth: React.FC = () => {
  const { dimensions, updatePreferences, preferences } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DimensionCategory | 'All'>('All');
  const [activeDimension, setActiveDimension] = useState<PersonalDimension | null>(null);

  const categories: Array<DimensionCategory | 'All'> = ['All', 'Emotional', 'Cognitive', 'Social', 'Behavioral', 'Wellbeing'];

  const filteredDimensions = dimensions.filter(dim => {
    const matchesSearch = dim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dim.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dim.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePinDimension = (id: number) => {
    const currentActive = preferences.activeDimensions || [];
    const newActive = currentActive.includes(id)
      ? currentActive.filter(i => i !== id)
      : [...currentActive, id];
    updatePreferences({ activeDimensions: newActive });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header & Rubric Disclaimer */}
      <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-3">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Evidence-Based Personal Architecture
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary heading-editorial">
          30 Personal Development Dimensions
        </h1>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-3xl">
          MindMirror tracks observable behavioral evidence from your journal across 30 research-backed dimensions of self-regulation, cognitive flexibility, social competence, and wellbeing.
        </p>

        {/* Transparent Rubric Explanation */}
        <div className="p-3.5 bg-surface-2 rounded-lg border border-border text-xs text-secondary space-y-1.5 mt-2">
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <Info className="w-4 h-4 text-accent" />
            <span>Provisional Reflection Indicator (0–100 Rubric)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted">
            These indicators reflect <strong>observed diary evidence</strong>, not permanent personality traits, worth, or clinical medical evaluations.
            Scores update gradually based on recurring behaviors and require multi-entry evidence before shifting.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-canvas border border-border">0–19: Very limited evidence</span>
            <span className="px-1.5 py-0.5 rounded bg-canvas border border-border">20–39: Emerging</span>
            <span className="px-1.5 py-0.5 rounded bg-canvas border border-border">40–59: Developing</span>
            <span className="px-1.5 py-0.5 rounded bg-canvas border border-border">60–79: Consistent</span>
            <span className="px-1.5 py-0.5 rounded bg-canvas border border-border">80–100: Strong repeated</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-canvas border-primary font-semibold'
                  : 'bg-surface-1 border-border text-secondary hover:text-primary hover:bg-surface-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 30 dimensions..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-1 border border-border rounded-lg text-primary placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of 30 Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDimensions.map(dim => {
          const isPinned = (preferences.activeDimensions || []).includes(dim.id);
          return (
            <div
              key={dim.id}
              onClick={() => setActiveDimension(dim)}
              className="bg-surface-1 border border-border hover:border-border-strong rounded-xl p-4 shadow-subtle cursor-pointer transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    {dim.category} • #{dim.id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinDimension(dim.id);
                    }}
                    title={isPinned ? "Pinned to Overview" : "Pin to Overview"}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono border transition-colors ${
                      isPinned
                        ? 'bg-accent text-accent-fg border-accent'
                        : 'bg-surface-2 text-muted border-border hover:text-primary'
                    }`}
                  >
                    {isPinned ? '★ Pinned' : '☆ Pin'}
                  </button>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-primary">{dim.name}</h3>
                  <div className="text-base font-bold font-mono text-primary">
                    {dim.currentScore !== null ? dim.currentScore : '—'}
                  </div>
                </div>

                <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                  {dim.description}
                </p>
              </div>

              {/* Progress meter & Evidence Badge */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${dim.currentScore || 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                  <span>Coverage: {dim.evidenceCoverageLevel}</span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dimension Detail Drawer / Modal */}
      {activeDimension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-1 border border-border rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-soft space-y-6 text-primary">
            {/* Modal header */}
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                  Dimension #{activeDimension.id} • {activeDimension.category}
                </span>
                <h2 className="text-xl font-bold tracking-tight heading-editorial">
                  {activeDimension.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveDimension(null)}
                className="p-1 text-muted hover:text-primary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Rubric Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-surface-2 rounded-lg border border-border text-center">
              <div>
                <div className="text-[10px] text-muted font-mono uppercase">Indicator Score</div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {activeDimension.currentScore !== null ? `${activeDimension.currentScore}/100` : 'Not enough data'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted font-mono uppercase">Confidence</div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {activeDimension.confidenceScore}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted font-mono uppercase">Sample Size</div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {activeDimension.sampleSize} entries
                </div>
              </div>
            </div>

            {/* Supporting Diary Evidence */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
                Direct Supporting Evidence from Your Journal
              </h3>
              <div className="space-y-2">
                {activeDimension.supportingEvidence.map((ev, idx) => (
                  <div key={idx} className="p-3 bg-surface-2 rounded-lg border border-border text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                      <span>Date: {ev.date}</span>
                      <span>Entry #{ev.entryId}</span>
                    </div>
                    <div className="text-primary italic flex items-start gap-1.5 bg-canvas p-2 rounded border border-border/50">
                      <Quote className="w-3.5 h-3.5 flex-shrink-0 text-muted mt-0.5" />
                      <span>"{ev.quote}"</span>
                    </div>
                    <p className="text-secondary text-[11px]">{ev.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Development Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="list-disc list-inside text-secondary space-y-1">
                  {activeDimension.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Growth Opportunities</span>
                </div>
                <ul className="list-disc list-inside text-secondary space-y-1">
                  {activeDimension.developmentOpportunities.map((opp, idx) => (
                    <li key={idx}>{opp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Reflective Exercises */}
            <div className="p-3.5 bg-surface-2 rounded-lg border border-border space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Dumbbell className="w-4 h-4 text-accent" />
                <span>Recommended Behavioral Exercises</span>
              </div>
              <ul className="space-y-1.5 text-secondary">
                {activeDimension.recommendedExercises.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-muted">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveDimension(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-2 hover:bg-surface-hover text-primary border border-border"
              >
                Close Dimension Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
