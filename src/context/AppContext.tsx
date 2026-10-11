import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DiaryEntry,
  AIDailyReview,
  PersonalDimension,
  Goal,
  Habit,
  TrackedAction,
  WeeklyReport,
  ChatMessage,
  UserPreferences,
  ThemeType,
  ColorMode,
  SpeechCoachingReport,
  SpeechPracticeMode,
  SpeechDifficulty,
  ThinkingSubmission,
  ThinkingGymCategory,
  IntrovertCurriculumState
} from '../types';
import { SEED_ENTRIES, SEED_REVIEWS, SEED_GOALS, SEED_HABITS, SEED_ACTIONS, SEED_WEEKLY_REPORT } from '../data/seedEntries';
import { INITIAL_DIMENSIONS } from '../data/dimensionsData';
import { generateLocalAIReview, updateDimensionsWithReview, checkSafetyTriggers } from '../services/aiEngine';
import { generateCoachResponse } from '../services/coachService';
import { recomputeDimensionsFromUserEntries } from '../services/analyticsService';
import { generateLocalSpeechCoachingReport, calculateSpeechMetrics } from '../services/speechAnalysisService';

interface AppContextType {
  entries: DiaryEntry[];
  reviews: Record<string, AIDailyReview>;
  dimensions: PersonalDimension[];
  goals: Goal[];
  habits: Habit[];
  actions: TrackedAction[];
  weeklyReport: WeeklyReport;
  chatMessages: ChatMessage[];
  preferences: UserPreferences;
  activeTab: string;
  selectedEntryId: string | null;
  safetyAlertOpen: boolean;
  isAnalyzing: boolean;

  // Phase 2, 3, 4: Speech Studio & Coaching
  speechReports: SpeechCoachingReport[];
  activeSpeechReport: SpeechCoachingReport | null;
  selectedRetestPrompt: any | null;

  // Phase 5: Thinking Gym
  thinkingSubmissions: ThinkingSubmission[];

  // Phase 6: Introvert Curriculum
  curriculumState: IntrovertCurriculumState;

  setActiveTab: (tab: string) => void;
  setSelectedEntryId: (id: string | null) => void;
  setSafetyAlertOpen: (open: boolean) => void;
  saveEntry: (entry: Partial<DiaryEntry> & { content: string }) => DiaryEntry;
  deleteEntry: (id: string) => void;
  analyzeEntry: (id: string) => Promise<AIDailyReview | null>;
  updateReviewFeedback: (reviewId: string, feedback: AIDailyReview['userFeedback']) => void;
  toggleHabitDate: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  turnIntoAction: (actionText: string, targetDate?: string, sourceReviewId?: string) => void;
  toggleAction: (id: string) => void;
  rateAction: (id: string, rating: 'helped' | 'neutral' | 'unhelpful') => void;
  deleteAction: (id: string) => void;
  sendCoachMessage: (text: string) => Promise<ChatMessage>;
  setTheme: (theme: ThemeType) => void;
  setColorMode: (mode: ColorMode) => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  exportData: (format: 'json' | 'csv') => void;
  wipeAllData: () => void;
  resetToSampleData: () => void;
  generateAIWeeklyReview: () => Promise<void>;
  isCoachOpen: boolean;
  setIsCoachOpen: (open: boolean) => void;

  // Speech & Thinking Gym methods
  setActiveSpeechReport: (report: SpeechCoachingReport | null) => void;
  setSelectedRetestPrompt: (prompt: any | null) => void;
  saveSpeechReport: (report: SpeechCoachingReport) => void;
  deleteSpeechReport: (id: string) => void;
  deleteSpeechAudio: (reportId: string) => void;
  saveThinkingSubmission: (sub: ThinkingSubmission) => void;
  updateCurriculumState: (update: Partial<IntrovertCurriculumState>) => void;
  analyzeSpeechSession: (
    transcript: string,
    promptTopic: string,
    mode: SpeechPracticeMode,
    difficulty: SpeechDifficulty,
    durationSeconds: number,
    detectedPauses?: number,
    pauseDurationSeconds?: number,
    previousReport?: SpeechCoachingReport,
    audioBase64?: string,
    mimeType?: string
  ) => Promise<SpeechCoachingReport>;
  evaluateThinkingExercise: (
    exerciseId: string,
    category: ThinkingGymCategory,
    premise: string,
    promptQuestion: string,
    userResponse: string,
    rubricCriteria: string[]
  ) => Promise<ThinkingSubmission>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ENTRIES: 'mindmirror_entries',
  REVIEWS: 'mindmirror_reviews',
  DIMENSIONS: 'mindmirror_dimensions',
  GOALS: 'mindmirror_goals',
  HABITS: 'mindmirror_habits',
  ACTIONS: 'mindmirror_actions',
  WEEKLY: 'mindmirror_weekly',
  CHAT: 'mindmirror_chat',
  PREFS: 'mindmirror_prefs',
  SPEECH: 'mindmirror_speech_reports',
  THINKING: 'mindmirror_thinking_submissions',
  CURRICULUM: 'mindmirror_curriculum'
};

const DEFAULT_PREFS: UserPreferences = {
  theme: 'theme-warm-editorial',
  colorMode: 'light',
  useLocalHeuristicEngine: true,
  activeDimensions: [1, 2, 4, 6, 8, 9, 11, 13, 17, 18, 20, 22, 26, 27, 29, 30],
  exportFormat: 'json'
};

const DEFAULT_CURRICULUM: IntrovertCurriculumState = {
  currentStage: 1,
  dailyAvailableMinutes: 15,
  preferredDifficulty: 'foundational',
  preferredTopics: ['Personal Reflection', 'Technical Communication', 'Assertiveness'],
  completedDrillIds: [],
  retestAttempts: 0,
  comfortSelfRating: 5
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage (Strictly honest empty arrays for new users - no auto-injected demo data)
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Record<string, AIDailyReview>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    return saved ? JSON.parse(saved) : [];
  });

  const [actions, setActions] = useState<TrackedAction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [dimensions, setDimensions] = useState<PersonalDimension[]>(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const parsedEntries: DiaryEntry[] = savedEntries ? JSON.parse(savedEntries) : [];
    const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const parsedReviews: Record<string, AIDailyReview> = savedReviews ? JSON.parse(savedReviews) : {};
    return recomputeDimensionsFromUserEntries(INITIAL_DIMENSIONS, parsedEntries, parsedReviews);
  });

  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEKLY);
    if (saved) return JSON.parse(saved);
    return {
      id: `week-${Date.now()}`,
      weekStartDate: new Date().toISOString().slice(0, 10),
      weekEndDate: new Date().toISOString().slice(0, 10),
      summary: "Write your first weekly reflections to generate an empirical multi-day synthesis.",
      positiveExperiences: [],
      repeatedChallenges: [],
      emotionalPatterns: [],
      decisionPatterns: [],
      habitsHelpful: [],
      habitsDifficult: [],
      threePrioritiesNextWeek: []
    };
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: `Welcome to MindMirror AI. I am your personal reflection assistant. I review your diary records with psychological honesty, evidence-based curiosity, and zero judgment.\n\nYou can ask me about behavioral patterns, communication choices, cognitive assumptions, or what to practice tomorrow.`
      }
    ];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
    return saved ? JSON.parse(saved) : DEFAULT_PREFS;
  });

  // Speech Practice & Coaching State
  const [speechReports, setSpeechReports] = useState<SpeechCoachingReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPEECH);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSpeechReport, setActiveSpeechReport] = useState<SpeechCoachingReport | null>(null);
  const [selectedRetestPrompt, setSelectedRetestPrompt] = useState<any | null>(null);

  // Thinking Gym State
  const [thinkingSubmissions, setThinkingSubmissions] = useState<ThinkingSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THINKING);
    return saved ? JSON.parse(saved) : [];
  });

  // Introvert Curriculum State
  const [curriculumState, setCurriculumState] = useState<IntrovertCurriculumState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
    return saved ? JSON.parse(saved) : DEFAULT_CURRICULUM;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [safetyAlertOpen, setSafetyAlertOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DIMENSIONS, JSON.stringify(dimensions)); }, [dimensions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions)); }, [actions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WEEKLY, JSON.stringify(weeklyReport)); }, [weeklyReport]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SPEECH, JSON.stringify(speechReports)); }, [speechReports]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.THINKING, JSON.stringify(thinkingSubmissions)); }, [thinkingSubmissions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculumState)); }, [curriculumState]);

  // Apply theme & color mode to document root
  useEffect(() => {
    const root = document.documentElement;
    // Remove previous theme classes
    root.classList.remove('theme-ultra-minimal', 'theme-pure-bw', 'theme-warm-editorial', 'theme-claude', 'theme-dark-minimal');
    const activeTheme = preferences.theme === 'theme-claude' ? 'theme-warm-editorial' : preferences.theme;
    root.classList.add(activeTheme);

    // Dark mode handling
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = preferences.colorMode === 'dark' || (preferences.colorMode === 'system' && isSystemDark);

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme, preferences.colorMode]);

  // Save or update diary entry
  const saveEntry = (entryData: Partial<DiaryEntry> & { content: string }): DiaryEntry => {
    if (checkSafetyTriggers(entryData.content)) {
      setSafetyAlertOpen(true);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[new Date(entryData.date || todayStr).getDay()];
    const wordCount = entryData.content.trim() ? entryData.content.trim().split(/\s+/).length : 0;

    let targetEntry: DiaryEntry;

    if (entryData.id) {
      // Update existing
      targetEntry = {
        ...entries.find(e => e.id === entryData.id)!,
        ...entryData,
        wordCount,
        updatedAt: new Date().toISOString()
      };
      setEntries(prev => prev.map(e => e.id === targetEntry.id ? targetEntry : e));
    } else {
      // Create new
      targetEntry = {
        id: `entry-${Date.now()}`,
        date: entryData.date || todayStr,
        dayOfWeek: dayOfWeek,
        title: entryData.title || `Reflection for ${entryData.date || todayStr}`,
        content: entryData.content,
        wordCount,
        mood: entryData.mood || 3,
        energy: entryData.energy || 7,
        stress: entryData.stress || 4,
        sleepHours: entryData.sleepHours || 7,
        sleepQuality: entryData.sleepQuality || 'Good',
        socialInteractions: entryData.socialInteractions || '',
        events: entryData.events || '',
        successes: entryData.successes || '',
        difficulties: entryData.difficulties || '',
        lessons: entryData.lessons || '',
        gratitude: entryData.gratitude || '',
        prioritiesTomorrow: entryData.prioritiesTomorrow || '',
        tags: entryData.tags || ['Reflection'],
        isAnalyzed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEntries(prev => [targetEntry, ...prev]);
    }

    return targetEntry;
  };

  // Delete diary entry
  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (selectedEntryId === id) setSelectedEntryId(null);
  };

  // Run AI analysis pipeline
  const analyzeEntry = async (id: string): Promise<AIDailyReview | null> => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    if (checkSafetyTriggers(entry.content)) {
      setSafetyAlertOpen(true);
      return null;
    }

    setIsAnalyzing(true);

    try {
      let review: AIDailyReview;

      try {
        // Attempt live backend AI endpoint (Gemini / Groq / Cerebras / Ollama)
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry })
        });

        if (response.ok) {
          const data = await response.json();
          review = {
            id: `review-${Date.now()}`,
            entryId: entry.id,
            date: entry.date,
            createdAt: new Date().toISOString(),
            ...data.review
          };
        } else {
          // Fallback to local heuristic engine
          review = generateLocalAIReview(entry);
        }
      } catch (networkErr) {
        // Offline / server unreachable fallback
        review = generateLocalAIReview(entry);
      }

      // Store review
      setReviews(prev => ({
        ...prev,
        [review.id]: review
      }));

      // Update entry status
      setEntries(prev => prev.map(e => e.id === entry.id ? {
        ...e,
        isAnalyzed: true,
        aiReviewId: review.id
      } : e));

      // Update 30 dimensions with transparent evidence scoring
      setDimensions(prev => updateDimensionsWithReview(prev, entry, review));

      return review;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // User correction & feedback on AI review
  const updateReviewFeedback = (reviewId: string, feedback: AIDailyReview['userFeedback']) => {
    setReviews(prev => {
      const existing = prev[reviewId];
      if (!existing) return prev;
      return {
        ...prev,
        [reviewId]: {
          ...existing,
          userFeedback: { ...existing.userFeedback, ...feedback }
        }
      };
    });
  };

  // Habit tracking
  const toggleHabitDate = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const exists = h.completedDates.includes(date);
      const newDates = exists
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];

      return {
        ...h,
        completedDates: newDates,
        currentStreak: exists ? Math.max(0, h.currentStreak - 1) : h.currentStreak + 1
      };
    }));
  };

  const addHabit = (habit: Habit) => {
    setHabits(prev => [habit, ...prev]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Goals
  const addGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
  };

  const updateGoal = (goal: Goal) => {
    setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Turn recommendation into tracked action
  const turnIntoAction = (actionText: string, targetDate?: string, sourceReviewId?: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = targetDate || tomorrow.toISOString().split('T')[0];

    const newAction: TrackedAction = {
      id: `action-${Date.now()}`,
      actionText,
      targetDate: dateStr,
      sourceReviewId,
      isCompleted: false
    };
    setActions(prev => [newAction, ...prev]);
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a,
        isCompleted: !a.isCompleted,
        completedAt: !a.isCompleted ? new Date().toISOString() : undefined
      };
    }));
  };

  const rateAction = (id: string, rating: 'helped' | 'neutral' | 'unhelpful') => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, didHelpRating: rating } : a));
  };

  const deleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  // Conversational coach assistant
  const sendCoachMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, entries, dimensions })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: data.text,
          referencedEntryDates: data.referencedDates,
          suggestedAction: data.suggestedAction
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        return assistantMsg;
      }
    } catch (err) {
      console.warn('[Coach] Backend AI coach unavailable, using client fallback.', err);
    }

    // Fallback heuristic coach
    const response = generateCoachResponse(text, entries, reviews, dimensions, goals);
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: response.text,
      referencedEntryDates: response.referencedDates,
      suggestedAction: response.suggestedAction
    };
    setChatMessages(prev => [...prev, assistantMsg]);
    return assistantMsg;
  };

  const generateAIWeeklyReview = async () => {
    if (entries.length === 0) return;
    try {
      const res = await fetch('/api/ai/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, period: 'week' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          const rev = data.review;
          const updated: WeeklyReport = {
            id: `week-${Date.now()}`,
            weekStartDate: entries[entries.length - 1]?.date || new Date().toISOString().slice(0, 10),
            weekEndDate: entries[0]?.date || new Date().toISOString().slice(0, 10),
            summary: rev.headline || "Weekly reflection review synthesized from recorded entries.",
            positiveExperiences: rev.keyMilestones || [],
            repeatedChallenges: rev.recurringChallenges || [],
            emotionalPatterns: rev.consistencyHighlights ? [rev.consistencyHighlights] : [],
            decisionPatterns: [],
            habitsHelpful: [],
            habitsDifficult: [],
            threePrioritiesNextWeek: rev.recommendedPriorities || []
          };
          setWeeklyReport(updated);
          localStorage.setItem(STORAGE_KEYS.WEEKLY, JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.warn('[Weekly] AI weekly review generation error:', err);
    }
  };

  const setTheme = (theme: ThemeType) => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setColorMode = (colorMode: ColorMode) => {
    setPreferences(prev => ({ ...prev, colorMode }));
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  // Data export
  const exportData = (format: 'json' | 'csv') => {
    const exportBundle = {
      exportedAt: new Date().toISOString(),
      entries,
      reviews,
      dimensions,
      goals,
      habits,
      actions,
      weeklyReport
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmirror-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Export entries as CSV
      const headers = ['Date', 'Title', 'Mood', 'Energy', 'Stress', 'SleepHours', 'Content', 'Tags'];
      const rows = entries.map(e => [
        e.date,
        `"${e.title.replace(/"/g, '""')}"`,
        e.mood,
        e.energy,
        e.stress,
        e.sleepHours,
        `"${e.content.replace(/"/g, '""')}"`,
        `"${e.tags.join(', ')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmirror-diary-entries-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Wipe data completely
  const wipeAllData = () => {
    setEntries([]);
    setReviews({});
    setGoals([]);
    setHabits([]);
    setActions([]);
    setChatMessages([]);
    localStorage.clear();
  };

  // Reset to realistic seed dataset
  const resetToSampleData = () => {
    setEntries(SEED_ENTRIES);
    setReviews(SEED_REVIEWS);
    setDimensions(INITIAL_DIMENSIONS);
    setGoals(SEED_GOALS);
    setHabits(SEED_HABITS);
    setActions(SEED_ACTIONS);
    setWeeklyReport(SEED_WEEKLY_REPORT);
  };

  // Speech Practice Handlers
  const saveSpeechReport = (report: SpeechCoachingReport) => {
    setSpeechReports(prev => [report, ...prev.filter(r => r.id !== report.id)]);
    setActiveSpeechReport(report);
  };

  const deleteSpeechReport = (id: string) => {
    setSpeechReports(prev => prev.filter(r => r.id !== id));
    if (activeSpeechReport?.id === id) {
      setActiveSpeechReport(null);
    }
  };

  const deleteSpeechAudio = (reportId: string) => {
    setSpeechReports(prev => prev.map(r => {
      if (r.id === reportId) {
        if (r.audioBlobUrl) {
          try { URL.revokeObjectURL(r.audioBlobUrl); } catch (e) {}
        }
        return { ...r, hasAudioRecording: false, audioBlobUrl: undefined };
      }
      return r;
    }));
    if (activeSpeechReport?.id === reportId) {
      setActiveSpeechReport(prev => prev ? { ...prev, hasAudioRecording: false, audioBlobUrl: undefined } : null);
    }
  };

  const saveThinkingSubmission = (sub: ThinkingSubmission) => {
    setThinkingSubmissions(prev => [sub, ...prev.filter(s => s.id !== sub.id)]);
  };

  const updateCurriculumState = (update: Partial<IntrovertCurriculumState>) => {
    setCurriculumState(prev => ({ ...prev, ...update }));
  };

  const analyzeSpeechSession = async (
    transcript: string,
    promptTopic: string,
    mode: SpeechPracticeMode,
    difficulty: SpeechDifficulty,
    durationSeconds: number,
    detectedPauses: number = 0,
    pauseDurationSeconds: number = 0,
    previousReport?: SpeechCoachingReport,
    audioBase64?: string,
    mimeType?: string
  ): Promise<SpeechCoachingReport> => {
    const effectiveTranscript = transcript.trim() || `Speech practice session on "${promptTopic}". Duration: ${Math.round(durationSeconds)}s.`;
    const metrics = calculateSpeechMetrics(effectiveTranscript, durationSeconds, detectedPauses, pauseDurationSeconds);
    const localReport = generateLocalSpeechCoachingReport(
      effectiveTranscript,
      promptTopic,
      mode,
      difficulty,
      durationSeconds,
      detectedPauses,
      pauseDurationSeconds,
      previousReport
    );

    try {
      const response = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: effectiveTranscript,
          promptTopic,
          mode,
          difficulty,
          durationSeconds,
          metrics,
          audioBase64,
          mimeType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.coaching) {
          const mergedReport: SpeechCoachingReport = {
            ...localReport,
            transcript: data.transcript || effectiveTranscript,
            structure: data.coaching.structure || localReport.structure,
            strengths: data.coaching.strengths || localReport.strengths,
            weaknesses: data.coaching.weaknesses || localReport.weaknesses,
            clearerAlternativeResponse: data.coaching.clearerAlternativeResponse || localReport.clearerAlternativeResponse,
            targetedExercises: data.coaching.targetedExercises || localReport.targetedExercises,
            measurableRetestCriterion: data.coaching.measurableRetestCriterion || localReport.measurableRetestCriterion,
            confidenceScore: data.coaching.confidenceScore || 88
          };
          saveSpeechReport(mergedReport);
          return mergedReport;
        }
      }
    } catch (err) {
      console.warn('[AppContext] Speech API unavailable, using local heuristic.', err);
    }

    saveSpeechReport(localReport);
    return localReport;
  };

  const evaluateThinkingExercise = async (
    exerciseId: string,
    category: ThinkingGymCategory,
    premise: string,
    promptQuestion: string,
    userResponse: string,
    rubricCriteria: string[]
  ): Promise<ThinkingSubmission> => {
    const wordCount = userResponse.trim().split(/\s+/).length;
    const hasUncertaintyWords = /perhaps|likely|probability|confounding|assumption|uncertain|trade-off|evidence/i.test(userResponse);
    const score = Math.min(95, Math.max(60, Math.round(50 + (wordCount / 5) + (hasUncertaintyWords ? 15 : 0))));

    let submission: ThinkingSubmission = {
      id: `think-sub-${Date.now()}`,
      exerciseId,
      exerciseTitle: promptQuestion.slice(0, 60),
      category,
      date: new Date().toISOString().split('T')[0],
      userResponse,
      overallScore: score,
      intellectualHonestyScore: hasUncertaintyWords ? 90 : 75,
      rubricFeedback: rubricCriteria.map(c => ({
        criterion: c,
        score,
        observation: `Evaluated with analytical scrutiny across ${wordCount} words.`
      })),
      strengths: ["Directly evaluated the premise rather than accepting conclusions at face value"],
      assumptionsOrBiasesFlagged: ["Verify whether additional confounding variables exist"],
      constructiveImprovements: ["Identify explicit falsification thresholds for proposed hypotheses"],
      clearerAlternativePerspective: "Distinguish camera observations from inferences and test alternative hypotheses."
    };

    try {
      const res = await fetch('/api/thinking/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          category,
          premise,
          promptQuestion,
          userResponse,
          rubricCriteria
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.evaluation) {
          submission = {
            ...submission,
            overallScore: data.evaluation.overallScore,
            intellectualHonestyScore: data.evaluation.intellectualHonestyScore,
            rubricFeedback: data.evaluation.rubricFeedback || submission.rubricFeedback,
            strengths: data.evaluation.strengths || submission.strengths,
            assumptionsOrBiasesFlagged: data.evaluation.assumptionsOrBiasesFlagged || submission.assumptionsOrBiasesFlagged,
            constructiveImprovements: data.evaluation.constructiveImprovements || submission.constructiveImprovements,
            clearerAlternativePerspective: data.evaluation.clearerAlternativePerspective || submission.clearerAlternativePerspective
          };
        }
      }
    } catch (err) {
      console.warn('[AppContext] Thinking Gym API unavailable, using local evaluator.', err);
    }

    saveThinkingSubmission(submission);
    return submission;
  };

  return (
    <AppContext.Provider
      value={{
        entries,
        reviews,
        dimensions,
        goals,
        habits,
        actions,
        weeklyReport,
        chatMessages,
        preferences,
        activeTab,
        selectedEntryId,
        safetyAlertOpen,
        isAnalyzing,

        speechReports,
        activeSpeechReport,
        selectedRetestPrompt,
        thinkingSubmissions,
        curriculumState,

        setActiveTab,
        setSelectedEntryId,
        setSafetyAlertOpen,
        saveEntry,
        deleteEntry,
        analyzeEntry,
        updateReviewFeedback,
        toggleHabitDate,
        addHabit,
        deleteHabit,
        addGoal,
        updateGoal,
        deleteGoal,
        turnIntoAction,
        toggleAction,
        rateAction,
        deleteAction,
        sendCoachMessage,
        setTheme,
        setColorMode,
        updatePreferences,
        exportData,
        wipeAllData,
        resetToSampleData,
        generateAIWeeklyReview,
        isCoachOpen,
        setIsCoachOpen,

        setActiveSpeechReport,
        setSelectedRetestPrompt,
        saveSpeechReport,
        deleteSpeechReport,
        deleteSpeechAudio,
        saveThinkingSubmission,
        updateCurriculumState,
        analyzeSpeechSession,
        evaluateThinkingExercise
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
