import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Sparkles,
  Trash2,
  Calendar,
  Search,
  Tag,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
  Smile,
  Zap,
  Activity,
  Moon,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiaryEntry, MoodRating, SleepQuality } from '../../types';

export const DailyDiary: React.FC = () => {
  const {
    entries,
    selectedEntryId,
    setSelectedEntryId,
    saveEntry,
    deleteEntry,
    analyzeEntry,
    isAnalyzing,
    setActiveTab
  } = useApp();

  // Find currently selected entry or default to empty today draft
  const currentEntry = entries.find(e => e.id === selectedEntryId);

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(currentEntry ? currentEntry.date : todayStr);
  const [title, setTitle] = useState<string>(currentEntry ? currentEntry.title : '');
  const [content, setContent] = useState<string>(currentEntry ? currentEntry.content : '');
  const [mood, setMood] = useState<MoodRating>(currentEntry ? currentEntry.mood : 3);
  const [energy, setEnergy] = useState<number>(currentEntry ? currentEntry.energy : 7);
  const [stress, setStress] = useState<number>(currentEntry ? currentEntry.stress : 4);
  const [sleepHours, setSleepHours] = useState<number>(currentEntry ? currentEntry.sleepHours : 7.5);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(currentEntry ? currentEntry.sleepQuality : 'Good');

  // Structured prompt fields
  const [events, setEvents] = useState<string>(currentEntry ? currentEntry.events : '');
  const [successes, setSuccesses] = useState<string>(currentEntry ? currentEntry.successes : '');
  const [difficulties, setDifficulties] = useState<string>(currentEntry ? currentEntry.difficulties : '');
  const [lessons, setLessons] = useState<string>(currentEntry ? currentEntry.lessons : '');
  const [gratitude, setGratitude] = useState<string>(currentEntry ? currentEntry.gratitude : '');
  const [socialInteractions, setSocialInteractions] = useState<string>(currentEntry ? currentEntry.socialInteractions : '');
  const [prioritiesTomorrow, setPrioritiesTomorrow] = useState<string>(currentEntry ? currentEntry.prioritiesTomorrow : '');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(currentEntry ? currentEntry.tags : ['Reflection']);

  const [showStructuredPrompts, setShowStructuredPrompts] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMood, setFilterMood] = useState<number | 'all'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  // Sync state when selected entry changes
  useEffect(() => {
    if (currentEntry) {
      setDate(currentEntry.date);
      setTitle(currentEntry.title);
      setContent(currentEntry.content);
      setMood(currentEntry.mood);
      setEnergy(currentEntry.energy);
      setStress(currentEntry.stress);
      setSleepHours(currentEntry.sleepHours);
      setSleepQuality(currentEntry.sleepQuality);
      setEvents(currentEntry.events);
      setSuccesses(currentEntry.successes);
      setDifficulties(currentEntry.difficulties);
      setLessons(currentEntry.lessons);
      setGratitude(currentEntry.gratitude);
      setSocialInteractions(currentEntry.socialInteractions);
      setPrioritiesTomorrow(currentEntry.prioritiesTomorrow);
      setTags(currentEntry.tags);
      setSaveStatus('saved');
    } else {
      // Clear for new entry
      setDate(todayStr);
      setTitle('');
      setContent('');
      setMood(3);
      setEnergy(7);
      setStress(4);
      setSleepHours(7.5);
      setSleepQuality('Good');
      setEvents('');
      setSuccesses('');
      setDifficulties('');
      setLessons('');
      setGratitude('');
      setSocialInteractions('');
      setPrioritiesTomorrow('');
      setTags(['Reflection']);
      setSaveStatus('saved');
    }
  }, [selectedEntryId]);

  // Mark unsaved on user typing
  const handleContentChange = (val: string) => {
    setContent(val);
    setSaveStatus('unsaved');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    const saved = saveEntry({
      id: currentEntry ? currentEntry.id : undefined,
      date,
      title: title.trim() || `Reflection for ${date}`,
      content,
      mood,
      energy,
      stress,
      sleepHours,
      sleepQuality,
      events,
      successes,
      difficulties,
      lessons,
      gratitude,
      socialInteractions,
      prioritiesTomorrow,
      tags
    });
    setSelectedEntryId(saved.id);
    setSaveStatus('saved');
  };

  const handleAnalyze = async () => {
    handleSave();
    const targetId = currentEntry ? currentEntry.id : entries[0]?.id;
    if (targetId) {
      await analyzeEntry(targetId);
      setActiveTab('review');
    }
  };

  const handleDelete = () => {
    if (currentEntry) {
      deleteEntry(currentEntry.id);
      setSelectedEntryId(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
      setSaveStatus('unsaved');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(item => item !== t));
    setSaveStatus('unsaved');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Filtered entries for sidebar browsing
  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = filterMood === 'all' || e.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 animate-fade-in pb-16">
      {/* Left: Previous Entries Drawer & Search */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
        <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Entries</span>
            <button
              onClick={() => setSelectedEntryId(null)}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-accent text-accent-fg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content or tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-2 border border-border rounded-lg text-primary placeholder:text-muted focus:outline-none focus:border-border-strong"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 text-[11px] font-mono overflow-x-auto pb-1">
            <button
              onClick={() => setFilterMood('all')}
              className={`px-2 py-0.5 rounded border ${filterMood === 'all' ? 'bg-surface-2 border-border-strong text-primary' : 'border-border text-muted'}`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(m => (
              <button
                key={m}
                onClick={() => setFilterMood(m)}
                className={`px-2 py-0.5 rounded border ${filterMood === m ? 'bg-surface-2 border-border-strong text-primary' : 'border-border text-muted'}`}
              >
                M{m}
              </button>
            ))}
          </div>

          {/* Entry items list */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredEntries.map(entry => {
              const isSelected = selectedEntryId === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-surface-2 border-border-strong text-primary shadow-subtle'
                      : 'bg-surface-1 hover:bg-surface-2 border-border text-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1">
                    <span>{entry.date}</span>
                    <span>Mood: {entry.mood}/5</span>
                  </div>
                  <h4 className="text-xs font-semibold text-primary truncate mb-1">
                    {entry.title || 'Untitled Reflection'}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted font-mono">
                    <span>{entry.wordCount} words</span>
                    {entry.isAnalyzed && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Analyzed</span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-xs text-muted">
                No reflections found matching filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Rich Distraction-free Writing Canvas */}
      <div className="flex-1 space-y-4">
        <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-subtle space-y-5">
          {/* Top metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setSaveStatus('unsaved'); }}
                className="text-xs font-mono bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-primary focus:outline-none"
              />
              <span className="text-xs text-muted font-mono">
                {wordCount} words
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted font-mono">
                {saveStatus === 'saved' && 'Saved'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'unsaved' && 'Unsaved changes'}
              </span>

              {currentEntry && (
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="p-1.5 text-muted hover:text-rose-600 rounded-md transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 border border-border text-primary hover:bg-surface-hover transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-accent text-accent-fg hover:opacity-90 disabled:opacity-40 transition-all shadow-subtle"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze My Day'}</span>
              </button>
            </div>
          </div>

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaveStatus('unsaved'); }}
            placeholder="Title of this reflection (optional)..."
            className="w-full text-lg md:text-xl font-bold bg-transparent text-primary placeholder:text-muted focus:outline-none heading-editorial"
          />

          {/* Quick biological check-in pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-2 border-b border-border text-xs">
            {/* Mood selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted font-mono uppercase">Mood (1–5)</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(m => (
                  <button
                    key={m}
                    onClick={() => { setMood(m as MoodRating); setSaveStatus('unsaved'); }}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium border transition-colors ${
                      mood === m ? 'bg-primary text-canvas border-primary font-bold' : 'bg-surface-2 border-border text-secondary hover:text-primary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted font-mono uppercase">Energy: {energy}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => { setEnergy(Number(e.target.value)); setSaveStatus('unsaved'); }}
                className="w-full accent-primary"
              />
            </div>

            {/* Stress selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted font-mono uppercase">Stress: {stress}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => { setStress(Number(e.target.value)); setSaveStatus('unsaved'); }}
                className="w-full accent-primary"
              />
            </div>

            {/* Sleep */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted font-mono uppercase">Sleep: {sleepHours}h ({sleepQuality})</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={sleepHours}
                  onChange={(e) => { setSleepHours(Number(e.target.value)); setSaveStatus('unsaved'); }}
                  className="w-14 text-xs font-mono bg-surface-2 border border-border rounded px-1.5 py-0.5 text-primary"
                />
                <select
                  value={sleepQuality}
                  onChange={(e) => { setSleepQuality(e.target.value as SleepQuality); setSaveStatus('unsaved'); }}
                  className="text-xs bg-surface-2 border border-border rounded px-1 py-0.5 text-primary"
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Restorative">Restorative</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Long-Form Writing Canvas */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write freely about your day: what happened, what decisions you made, how you felt, what challenged you, and how you responded..."
            rows={14}
            className="w-full bg-transparent text-sm md:text-base leading-relaxed text-primary placeholder:text-muted focus:outline-none resize-none font-sans"
          />

          {/* Tags */}
          <div className="pt-2 border-t border-border flex flex-wrap items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-muted" />
            {tags.map(t => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-surface-2 text-secondary border border-border"
              >
                <span>#{t}</span>
                <button onClick={() => removeTag(t)} className="text-muted hover:text-primary">×</button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag + Enter..."
              className="text-xs bg-transparent border-none text-primary placeholder:text-muted focus:outline-none px-1"
            />
          </div>

          {/* Optional Expandable Structured Prompts */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowStructuredPrompts(!showStructuredPrompts)}
              className="flex items-center justify-between w-full text-xs font-semibold text-secondary hover:text-primary py-1 transition-colors"
            >
              <span>Optional Structured Reflection Prompts</span>
              {showStructuredPrompts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showStructuredPrompts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Important Events of the Day</label>
                  <input
                    type="text"
                    value={events}
                    onChange={(e) => { setEvents(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="Key meetings, deadlines, milestones..."
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Social Interactions</label>
                  <input
                    type="text"
                    value={socialInteractions}
                    onChange={(e) => { setSocialInteractions(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="Who did you communicate with? Tone, clarity, conflicts?"
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Successes & What Went Well</label>
                  <input
                    type="text"
                    value={successes}
                    onChange={(e) => { setSuccesses(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="What did you do well? Where did you show discipline?"
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Difficulties, Mistakes & Avoidance</label>
                  <input
                    type="text"
                    value={difficulties}
                    onChange={(e) => { setDifficulties(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="What felt ineffective or produced unnecessary tension?"
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Lessons Learned</label>
                  <input
                    type="text"
                    value={lessons}
                    onChange={(e) => { setLessons(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="What rule of thumb or realization emerged?"
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-primary">Gratitude & Positive Grounding</label>
                  <input
                    type="text"
                    value={gratitude}
                    onChange={(e) => { setGratitude(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="Supportive conditions, moments of calm..."
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] font-medium text-primary">Top Priorities for Tomorrow</label>
                  <input
                    type="text"
                    value={prioritiesTomorrow}
                    onChange={(e) => { setPrioritiesTomorrow(e.target.value); setSaveStatus('unsaved'); }}
                    placeholder="Single most important deliverable or practice for tomorrow..."
                    className="w-full p-2 bg-surface-2 border border-border rounded-lg text-primary text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-1 border border-border rounded-xl p-5 max-w-sm w-full space-y-3 text-primary shadow-soft">
            <h3 className="font-semibold text-sm">Permanently Delete Entry?</h3>
            <p className="text-xs text-secondary">
              This will remove this reflection record from your diary and historical statistics. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-surface-2 text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
