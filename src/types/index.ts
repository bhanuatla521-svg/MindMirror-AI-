export type MoodRating = 1 | 2 | 3 | 4 | 5; // 1: Exhausted/Low, 2: Difficult, 3: Neutral, 4: Good, 5: Thriving

export type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Restorative';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  title: string;
  content: string;
  wordCount: number;
  mood: MoodRating;
  energy: number; // 1-10
  stress: number; // 1-10
  sleepHours: number;
  sleepQuality: SleepQuality;
  socialInteractions: string;
  events: string;
  successes: string;
  difficulties: string;
  lessons: string;
  gratitude: string;
  prioritiesTomorrow: string;
  tags: string[];
  isAnalyzed: boolean;
  aiReviewId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositiveObservation {
  observation: string;
  strength: string;
  whyHelpful: string;
  quote: string;
}

export interface ImprovementObservation {
  whatHappened: string;
  whyIneffective: string;
  likelyConsequence: string;
  alternative: string;
  practiceMethod: string;
  quote: string;
}

export interface AIDailyReview {
  id: string;
  entryId: string;
  date: string;
  createdAt: string;
  daySummary: string[];
  whatWentWell: PositiveObservation[];
  mistakesAndImprovements: ImprovementObservation[];
  emotionalReflection: {
    emotionsReported: string[];
    patternObservations: string[];
    triggerHypothesis: string;
    alternativeResponse: string;
    quote: string;
  };
  thinkingAnalysis: {
    cognitiveBiasesNoticed: string[];
    untestedAssumptions: string[];
    alternativePerspectives: string[];
    evidenceStrength: string;
    quote: string;
  };
  socialInteractionReview: {
    clarity: string;
    activeListening: string;
    empathy: string;
    boundaryRespect: string;
    perspectiveTaking: string;
    quote: string;
  };
  actionPlan: {
    highestPriority: string;
    threeActionsTomorrow: string[];
    smallHabitToPractice: string;
    reflectionQuestion: string;
    behaviorToContinue: string;
    behaviorToReduce: string;
    measurementMetric: string;
  };
  confidenceAndEvidence: {
    directlyStatedFacts: string[];
    reasonableInterpretations: string[];
    unknownOrUnclearInfo: string[];
    evidenceCoverageScore: number; // 0-100
  };
  userFeedback?: {
    isHelpful?: boolean;
    isAccurate?: boolean;
    userNotes?: string;
    corrections?: string;
  };
}

export type DimensionCategory = 'Emotional' | 'Cognitive' | 'Social' | 'Behavioral' | 'Wellbeing';

export interface EvidenceItem {
  entryId: string;
  date: string;
  quote: string;
  explanation: string;
}

export interface DimensionHistoryPoint {
  date: string;
  score: number;
}

export interface PersonalDimension {
  id: number;
  name: string;
  category: DimensionCategory;
  description: string;
  currentScore: number | null; // 0-100 rubric, null if insufficient evidence
  confidenceScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  sampleSize: number;
  dateRange: string;
  evidenceCoverageLevel: 'Insufficient evidence' | 'Emerging' | 'Developing' | 'Consistent' | 'Strong repeated';
  supportingEvidence: EvidenceItem[];
  strengths: string[];
  developmentOpportunities: string[];
  recommendedExercises: string[];
  history: DimensionHistoryPoint[];
  isUserSelected: boolean;
}

export interface Goal {
  id: string;
  title: string;
  reason: string;
  targetDate: string;
  status: 'in_progress' | 'completed' | 'paused';
  smallNextAction: string;
  relatedHabits: string[];
  recentReflection: string;
  obstacles: string;
  lessonsLearned: string;
  progressPercentage: number;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  targetDays: number;
  currentStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  connectedDimension: string;
  obstacleNotes: string;
}

export interface TrackedAction {
  id: string;
  sourceReviewId?: string;
  actionText: string;
  targetDate: string;
  isCompleted: boolean;
  completedAt?: string;
  didHelpRating?: 'helped' | 'neutral' | 'unhelpful';
  notes?: string;
}

export interface WeeklyReport {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  summary: string;
  positiveExperiences: string[];
  repeatedChallenges: string[];
  emotionalPatterns: string[];
  decisionPatterns: string[];
  habitsHelpful: string[];
  habitsDifficult: string[];
  threePrioritiesNextWeek: string[];
  userCorrections?: string;
}

export type ThemeType = 'theme-ultra-minimal' | 'theme-pure-bw' | 'theme-warm-editorial' | 'theme-dark-minimal' | 'theme-claude';
export type ColorMode = 'light' | 'dark' | 'system';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  referencedEntryDates?: string[];
  suggestedAction?: string;
}

export interface UserPreferences {
  name?: string;
  theme: ThemeType;
  colorMode: ColorMode;
  geminiApiKey?: string;
  useLocalHeuristicEngine: boolean;
  activeDimensions: number[];
  exportFormat: 'json' | 'csv' | 'markdown';
}

// ==========================================
// Phase 2, 3, 4: Speech Studio & Coaching
// ==========================================

export type SpeechPracticeMode = 
  | 'daily_prompt' 
  | 'impromptu' 
  | 'interview' 
  | 'presentation' 
  | 'roleplay';

export type SpeechDifficulty = 'foundational' | 'intermediate' | 'advanced';

export interface SpeechMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number; // Measured WPM
  fillerWordsCount: number;
  fillerWordsPer100Words: number; // Measured rate
  fillerBreakdown: Record<string, number>;
  pauseCount: number; // Measured pauses > 1.2s
  totalPauseDurationSeconds: number;
  averageSentenceLength: number;
  vocabularyDiversityRatio: number; // Unique words / total words
  silencePercentage: number;
}

export interface SpeechStrength {
  title: string;
  evidenceQuote: string;
  timestamp?: string;
  whyHelpful: string;
}

export interface SpeechWeakness {
  priority: 1 | 2 | 3;
  issue: string;
  evidenceQuote: string;
  timestamp?: string;
  whyItMatters: string;
  alternativePhrasing: string;
}

export interface SpeechTargetedExercise {
  name: string;
  description: string;
  durationMinutes: number;
  focusArea: string;
}

export interface SpeechStructureAssessment {
  mainPointIdentified: boolean;
  mainPointSummary: string;
  supportingPoints: string[];
  hasConcreteExample: boolean;
  exampleSummary?: string;
  conclusionClarity: 'Clear' | 'Weak' | 'Missing';
  answersAssignedQuestion: boolean;
  structureFramework: 'PREP' | 'STAR' | 'Direct' | 'Unstructured';
}

export interface SpeechCoachingReport {
  id: string;
  sessionId: string;
  date: string;
  promptTopic: string;
  mode: SpeechPracticeMode;
  difficulty: SpeechDifficulty;
  taskObjective: string;
  transcript: string;
  userCorrectedTranscript?: string;
  hasAudioRecording: boolean;
  audioBlobUrl?: string;
  metrics: SpeechMetrics;
  measuredVsEstimatedNotice: string;
  structure: SpeechStructureAssessment;
  strengths: SpeechStrength[];
  weaknesses: SpeechWeakness[];
  clearerAlternativeResponse: string;
  targetedExercises: SpeechTargetedExercise[];
  measurableRetestCriterion: string;
  confidenceScore: number; // 0-100 for subjective AI analysis
  comparisonWithPrevious?: {
    previousSessionId?: string;
    previousWpm?: number;
    wpmDelta?: number;
    previousFillerRate?: number;
    fillerDelta?: number;
    trendSummary?: string;
  };
  retestTargetMet?: boolean;
}

// ==========================================
// Phase 5: Thinking Gym Types
// ==========================================

export type ThinkingGymCategory = 
  | 'critical_logic'
  | 'fact_vs_opinion'
  | 'evidence_arguments'
  | 'cognitive_biases'
  | 'first_principles'
  | 'lateral_creativity'
  | 'problem_solving'
  | 'probabilistic_reasoning'
  | 'perspective_taking'
  | 'metacognition';

export interface ThinkingExercise {
  id: string;
  category: ThinkingGymCategory;
  categoryTitle: string;
  title: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  premise: string;
  promptQuestion: string;
  keyRubricCriteria: string[];
  sampleHonestResponse: string;
}

export interface ThinkingSubmission {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  category: ThinkingGymCategory;
  date: string;
  userResponse: string;
  overallScore: number; // 0-100 rubric score
  intellectualHonestyScore: number; // 0-100
  rubricFeedback: Array<{
    criterion: string;
    score: number;
    observation: string;
  }>;
  strengths: string[];
  assumptionsOrBiasesFlagged: string[];
  constructiveImprovements: string[];
  clearerAlternativePerspective: string;
}

// ==========================================
// Phase 6: Introvert Practice Programme
// ==========================================

export type IntrovertStageId = 1 | 2 | 3 | 4 | 5;

export interface IntrovertStage {
  id: IntrovertStageId;
  title: string;
  tagline: string;
  description: string;
  learningGoals: string[];
  recommendedDrillsCount: number;
  unlocked: boolean;
}

export interface IntrovertCurriculumState {
  currentStage: IntrovertStageId;
  dailyAvailableMinutes: 5 | 15 | 30;
  preferredDifficulty: SpeechDifficulty;
  preferredTopics: string[];
  completedDrillIds: string[];
  retestAttempts: number;
  comfortSelfRating: number; // 1-10
}

