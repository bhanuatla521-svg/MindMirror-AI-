import { z } from 'zod';

export type AIProviderName = 'gemini' | 'groq' | 'cerebras' | 'ollama' | 'local_heuristic';

export const AIDailyReviewSchema = z.object({
  daySummary: z.array(z.string()).min(3).max(6),
  whatWentWell: z.array(z.object({
    observation: z.string(),
    strength: z.string(),
    whyHelpful: z.string(),
    quote: z.string(),
  })).min(1),
  mistakesAndImprovements: z.array(z.object({
    whatHappened: z.string(),
    whyIneffective: z.string(),
    likelyConsequence: z.string(),
    alternative: z.string(),
    practiceMethod: z.string(),
    quote: z.string(),
  })).min(1),
  emotionalReflection: z.object({
    emotionsReported: z.array(z.string()),
    patternObservations: z.array(z.string()),
    triggerHypothesis: z.string(),
    alternativeResponse: z.string(),
    quote: z.string(),
  }),
  thinkingAnalysis: z.object({
    cognitiveBiasesNoticed: z.array(z.string()),
    untestedAssumptions: z.array(z.string()),
    alternativePerspectives: z.array(z.string()),
    evidenceStrength: z.string(),
    quote: z.string(),
  }),
  socialInteractionReview: z.object({
    clarity: z.string(),
    activeListening: z.string(),
    empathy: z.string(),
    boundaryRespect: z.string(),
    perspectiveTaking: z.string(),
    quote: z.string(),
  }),
  actionPlan: z.object({
    highestPriority: z.string(),
    threeActionsTomorrow: z.array(z.string()).min(2),
    smallHabitToPractice: z.string(),
    reflectionQuestion: z.string(),
    behaviorToContinue: z.string(),
    behaviorToReduce: z.string(),
    measurementMetric: z.string(),
  }),
  confidenceAndEvidence: z.object({
    directlyStatedFacts: z.array(z.string()),
    reasonableInterpretations: z.array(z.string()),
    unknownOrUnclearInfo: z.array(z.string()),
    evidenceCoverageScore: z.number().min(0).max(100),
  }),
});

export type ValidatedAIDailyReview = z.infer<typeof AIDailyReviewSchema>;

export interface DiaryEntryPayload {
  id: string;
  date: string;
  dayOfWeek?: string;
  title?: string;
  content: string;
  mood?: number;
  energy?: number;
  stress?: number;
  sleepHours?: number;
  sleepQuality?: string;
  socialInteractions?: string;
  events?: string;
  successes?: string;
  difficulties?: string;
  lessons?: string;
  gratitude?: string;
  prioritiesTomorrow?: string;
  tags?: string[];
}

export interface AIAnalysisResult {
  review: ValidatedAIDailyReview;
  provider: AIProviderName;
  model: string;
  latencyMs: number;
  estimatedTokens: number;
}

// Phase 4: Speech Coaching Zod Schema
export const SpeechCoachingSchema = z.object({
  structure: z.object({
    mainPointIdentified: z.boolean(),
    mainPointSummary: z.string(),
    supportingPoints: z.array(z.string()),
    hasConcreteExample: z.boolean(),
    exampleSummary: z.string().optional(),
    conclusionClarity: z.enum(['Clear', 'Weak', 'Missing']),
    answersAssignedQuestion: z.boolean(),
    structureFramework: z.enum(['PREP', 'STAR', 'Direct', 'Unstructured']),
  }),
  strengths: z.array(z.object({
    title: z.string(),
    evidenceQuote: z.string(),
    timestamp: z.string().optional(),
    whyHelpful: z.string(),
  })).min(1),
  weaknesses: z.array(z.object({
    priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    issue: z.string(),
    evidenceQuote: z.string(),
    timestamp: z.string().optional(),
    whyItMatters: z.string(),
    alternativePhrasing: z.string(),
  })).min(1),
  clearerAlternativeResponse: z.string(),
  targetedExercises: z.array(z.object({
    name: z.string(),
    description: z.string(),
    durationMinutes: z.number(),
    focusArea: z.string(),
  })).min(1),
  measurableRetestCriterion: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

export type ValidatedSpeechCoaching = z.infer<typeof SpeechCoachingSchema>;

// Phase 5: Thinking Gym Evaluation Zod Schema
export const ThinkingEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  intellectualHonestyScore: z.number().min(0).max(100),
  rubricFeedback: z.array(z.object({
    criterion: z.string(),
    score: z.number(),
    observation: z.string(),
  })).min(1),
  strengths: z.array(z.string()).min(1),
  assumptionsOrBiasesFlagged: z.array(z.string()),
  constructiveImprovements: z.array(z.string()).min(1),
  clearerAlternativePerspective: z.string(),
});

export type ValidatedThinkingEvaluation = z.infer<typeof ThinkingEvaluationSchema>;

