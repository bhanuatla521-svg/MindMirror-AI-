import {
  SpeechMetrics,
  SpeechCoachingReport,
  SpeechPracticeMode,
  SpeechDifficulty,
  SpeechStructureAssessment,
  SpeechStrength,
  SpeechWeakness,
  SpeechTargetedExercise
} from '../types';

/**
 * Standard filler words and hesitation vocalizations to track.
 */
export const FILLER_DICTIONARY = [
  'um',
  'uh',
  'er',
  'ah',
  'like',
  'you know',
  'actually',
  'basically',
  'literally',
  'sort of',
  'kind of',
  'i mean',
  'right',
  'anyway'
];

/**
 * Deterministically analyzes a transcript and duration for measurable delivery metrics.
 * Distinguishes measured physical/token data from AI qualitative interpretations.
 */
export function calculateSpeechMetrics(
  transcript: string,
  durationSeconds: number,
  detectedPauses: number = 0,
  pauseDurationSeconds: number = 0
): SpeechMetrics {
  const safeDuration = Math.max(durationSeconds, 1);
  const cleanText = transcript.trim();
  
  if (!cleanText) {
    return {
      durationSeconds,
      wordCount: 0,
      wordsPerMinute: 0,
      fillerWordsCount: 0,
      fillerWordsPer100Words: 0,
      fillerBreakdown: {},
      pauseCount: detectedPauses,
      totalPauseDurationSeconds: pauseDurationSeconds,
      averageSentenceLength: 0,
      vocabularyDiversityRatio: 0,
      silencePercentage: Math.min(100, Math.round((pauseDurationSeconds / safeDuration) * 100))
    };
  }

  // Tokenize words
  const words = cleanText
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;
  const minutes = safeDuration / 60;
  const wordsPerMinute = Math.round(wordCount / minutes);

  // Count filler occurrences
  const lowerText = ` ${cleanText.toLowerCase()} `;
  const fillerBreakdown: Record<string, number> = {};
  let totalFillers = 0;

  for (const filler of FILLER_DICTIONARY) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<=[^a-zA-Z0-9'])${escaped}(?=[^a-zA-Z0-9'])`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerBreakdown[filler] = matches.length;
      totalFillers += matches.length;
    }
  }

  // Filler frequency per 100 words
  const fillerWordsPer100Words = wordCount > 0 
    ? Number(((totalFillers / wordCount) * 100).toFixed(1))
    : 0;

  // Sentences
  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 0);
  const averageSentenceLength = sentences.length > 0
    ? Number((wordCount / sentences.length).toFixed(1))
    : wordCount;

  // Vocabulary diversity (Type-Token Ratio)
  const uniqueWords = new Set(words);
  const vocabularyDiversityRatio = wordCount > 0
    ? Number((uniqueWords.size / wordCount).toFixed(2))
    : 0;

  const silencePercentage = Math.min(100, Math.round((pauseDurationSeconds / safeDuration) * 100));

  return {
    durationSeconds,
    wordCount,
    wordsPerMinute,
    fillerWordsCount: totalFillers,
    fillerWordsPer100Words,
    fillerBreakdown,
    pauseCount: detectedPauses,
    totalPauseDurationSeconds: pauseDurationSeconds,
    averageSentenceLength,
    vocabularyDiversityRatio,
    silencePercentage
  };
}

/**
 * Heuristic/Offline generator for evidence-based speech coaching reports.
 * Used whenever backend AI is offline or unreachable to maintain continuous practice.
 */
export function generateLocalSpeechCoachingReport(
  transcript: string,
  promptTopic: string,
  mode: SpeechPracticeMode,
  difficulty: SpeechDifficulty,
  durationSeconds: number,
  detectedPauses: number = 0,
  pauseDurationSeconds: number = 0,
  previousReport?: SpeechCoachingReport
): SpeechCoachingReport {
  const metrics = calculateSpeechMetrics(transcript, durationSeconds, detectedPauses, pauseDurationSeconds);
  const sentences = transcript.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 3);
  
  // 1. Structure Assessment (PREP / Point-Reason-Example)
  const hasExample = /for example|for instance|such as|in my experience|one time|specifically/i.test(transcript);
  const hasReason = /because|therefore|since|the reason is|due to/i.test(transcript);
  const hasConclusion = /in conclusion|overall|ultimately|to summarize|that's why|in short/i.test(transcript);

  const structure: SpeechStructureAssessment = {
    mainPointIdentified: sentences.length > 0,
    mainPointSummary: sentences[0] || "Answer directly touches on prompt topic.",
    supportingPoints: sentences.slice(1, 3).map(s => s.trim()),
    hasConcreteExample: hasExample,
    exampleSummary: hasExample ? "Included explicit illustrative case or concrete reference." : undefined,
    conclusionClarity: hasConclusion ? 'Clear' : (sentences.length > 3 ? 'Weak' : 'Missing'),
    answersAssignedQuestion: transcript.length > 20,
    structureFramework: hasExample && hasReason ? 'PREP' : 'Direct'
  };

  // 2. Strengths with transcript evidence
  const strengths: SpeechStrength[] = [];
  if (sentences.length > 0) {
    strengths.push({
      title: "Direct Initial Framing",
      evidenceQuote: sentences[0].slice(0, 120),
      timestamp: "0:02",
      whyHelpful: "Stating your thesis or immediate answer early reduces listener cognitive strain."
    });
  }

  if (metrics.wordsPerMinute >= 125 && metrics.wordsPerMinute <= 165) {
    strengths.push({
      title: "Balanced Conversational Cadence",
      evidenceQuote: `Measured at ${metrics.wordsPerMinute} WPM across ${Math.round(durationSeconds)}s`,
      timestamp: "Overall",
      whyHelpful: "Speaking in the 130–165 WPM window allows listeners to comfortably absorb nuanced ideas without feeling rushed."
    });
  } else if (metrics.vocabularyDiversityRatio > 0.65) {
    strengths.push({
      title: "Varied and Precise Phrasing",
      evidenceQuote: `Vocabulary diversity ratio of ${metrics.vocabularyDiversityRatio}`,
      timestamp: "Overall",
      whyHelpful: "Minimizing repetitive word patterns keeps your explanation sharp and professional."
    });
  }

  if (hasExample) {
    strengths.push({
      title: "Concrete Grounding via Example",
      evidenceQuote: sentences.find(s => /example|instance|experience/i.test(s))?.slice(0, 100) || "Used concrete example",
      timestamp: "Middle",
      whyHelpful: "Abstract points evaporate quickly; concrete examples anchor retention."
    });
  }

  // Ensure at least 2 strengths
  if (strengths.length < 2) {
    strengths.push({
      title: "Commitment to Private Practice",
      evidenceQuote: `Completed ${metrics.wordCount} words uninterrupted`,
      whyHelpful: "Consistent recorded repetition builds vocal muscle memory without performance anxiety."
    });
  }

  // 3. Ranked Weaknesses (Ranked by priority)
  const weaknesses: SpeechWeakness[] = [];

  // Weakness A: Filler density
  if (metrics.fillerWordsPer100Words > 3.0) {
    const topFiller = Object.entries(metrics.fillerBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fillers';
    weaknesses.push({
      priority: 1,
      issue: `High filler word density (${metrics.fillerWordsPer100Words} per 100 words)`,
      evidenceQuote: `Frequent use of "${topFiller}" (${metrics.fillerBreakdown[topFiller] || metrics.fillerWordsCount} times)`,
      whyItMatters: "Filler words dilute authority and signal cognitive hesitation, distracting the audience from your message.",
      alternativePhrasing: `Replace "${topFiller}" with a silent 1.5-second inhalation pause before your next clause.`
    });
  }

  // Weakness B: Pace outside benchmark
  if (metrics.wordsPerMinute > 175) {
    weaknesses.push({
      priority: weaknesses.length === 0 ? 1 : 2,
      issue: `Rushed delivery pace (${metrics.wordsPerMinute} WPM)`,
      evidenceQuote: `${metrics.wordCount} words compressed into ${Math.round(durationSeconds)} seconds`,
      whyItMatters: "Rapid delivery increases vocal tension and often causes listeners to miss key transition points.",
      alternativePhrasing: "Insert a distinct pause between each supporting point to let key points sink in."
    });
  } else if (metrics.wordsPerMinute < 110 && durationSeconds > 15) {
    weaknesses.push({
      priority: weaknesses.length === 0 ? 1 : 2,
      issue: `Hesitant pace (${metrics.wordsPerMinute} WPM)`,
      evidenceQuote: `Delivered only ${metrics.wordCount} words over ${Math.round(durationSeconds)} seconds`,
      whyItMatters: "Long trailing pauses without verbal signposts can give the impression of uncertainty.",
      alternativePhrasing: "Use structural signposts like 'There are two reasons...' to maintain conversational momentum."
    });
  }

  // Weakness C: Missing structure or concrete example
  if (!hasExample && sentences.length > 2) {
    weaknesses.push({
      priority: (weaknesses.length + 1) as 1 | 2 | 3,
      issue: "Absence of a concrete real-world example",
      evidenceQuote: "Response remains in conceptual or abstract terms",
      whyItMatters: "Abstract arguments feel theoretical. A single specific instance turns a claim into persuasive proof.",
      alternativePhrasing: "Add: 'To illustrate this in practice, consider when [mention specific scenario]...'"
    });
  } else if (!hasConclusion && sentences.length > 2) {
    weaknesses.push({
      priority: (weaknesses.length + 1) as 1 | 2 | 3,
      issue: "Trailing conclusion",
      evidenceQuote: sentences[sentences.length - 1]?.slice(0, 100) || "Ended without synthesis",
      whyItMatters: "Weak endings weaken the impact of strong points. A decisive final sentence reinforces your key takeaway.",
      alternativePhrasing: `Conclude with: 'So the key takeaway for ${promptTopic} is [one sentence core point].'`
    });
  }

  // Ensure at least 1 constructive weakness
  if (weaknesses.length === 0) {
    weaknesses.push({
      priority: 1,
      issue: "Room to sharpen conciseness",
      evidenceQuote: sentences[0] || "Introductory sentence",
      whyItMatters: "Front-loading your strongest conclusion ensures the message lands even if interrupted.",
      alternativePhrasing: "Try starting directly with the outcome rather than background context."
    });
  }

  // 4. Clearer Alternative Response
  const clearerAlternativeResponse = `Here is how you can deliver this response using the PREP (Point, Reason, Example, Point) framework:

1. [Point]: "When approaching ${promptTopic}, my primary priority is clarity and intentional preparation."
2. [Reason]: "Because without upfront alignment, teams waste energy clarifying misunderstandings later."
3. [Example]: "For example, in a recent project where requirements were shifting, taking 10 minutes to document key assumptions prevented two days of redundant rework."
4. [Point]: "Ultimately, taking a moment to structure our response makes the outcome far more reliable."`;

  // 5. Targeted Drills
  const targetedExercises: SpeechTargetedExercise[] = [
    {
      name: "The Silent Pause Drill",
      description: "Deliver this same answer again, but whenever you feel the urge to say a filler word, close your lips and take a silent 1.5-second breath.",
      durationMinutes: 3,
      focusArea: "Filler word reduction & vocal calm"
    },
    {
      name: "PREP 60-Second Challenge",
      description: "Answer the prompt in exactly 60 seconds with strict four-part structure: 1 Point (10s) -> 1 Reason (15s) -> 1 Example (25s) -> 1 Summary Point (10s).",
      durationMinutes: 4,
      focusArea: "Executive answer structure"
    }
  ];

  // 6. Measurable Retest Criterion
  const targetFillerMax = Math.max(1, Math.round(metrics.fillerWordsPer100Words * 0.5));
  const measurableRetestCriterion = metrics.fillerWordsPer100Words > 3
    ? `Retake session: Deliver in 45–75 seconds with fewer than ${targetFillerMax} filler words per 100 words.`
    : `Retake session: Maintain WPM between 130–160 and include one explicit 'For example...' clause.`;

  // 7. Comparison with previous session if available
  let comparisonWithPrevious = undefined;
  if (previousReport) {
    const wpmDelta = metrics.wordsPerMinute - previousReport.metrics.wordsPerMinute;
    const fillerDelta = Number((metrics.fillerWordsPer100Words - previousReport.metrics.fillerWordsPer100Words).toFixed(1));
    comparisonWithPrevious = {
      previousSessionId: previousReport.id,
      previousWpm: previousReport.metrics.wordsPerMinute,
      wpmDelta,
      previousFillerRate: previousReport.metrics.fillerWordsPer100Words,
      fillerDelta,
      trendSummary: fillerDelta <= 0
        ? `Filler density improved by ${Math.abs(fillerDelta)} per 100 words compared to your previous attempt.`
        : `Filler density was higher than your previous session (${previousReport.metrics.fillerWordsPer100Words} -> ${metrics.fillerWordsPer100Words}). Practice the silent pause.`
    };
  }

  return {
    id: `speech-report-${Date.now()}`,
    sessionId: `session-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    promptTopic,
    mode,
    difficulty,
    taskObjective: `Structured oral communication practice: ${promptTopic}`,
    transcript,
    hasAudioRecording: durationSeconds > 0,
    metrics,
    measuredVsEstimatedNotice: "Delivery pace (WPM), filler frequency, and duration are directly measured from audio timing and transcript tokens. Structure clarity and alternative suggestions are algorithmic pedagogical assessments. MindMirror does not evaluate personality, intelligence, honesty, or mental health.",
    structure,
    strengths,
    weaknesses,
    clearerAlternativeResponse,
    targetedExercises,
    measurableRetestCriterion,
    confidenceScore: 88,
    comparisonWithPrevious
  };
}
