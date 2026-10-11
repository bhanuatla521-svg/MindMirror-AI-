import dotenv from 'dotenv';
dotenv.config();

import { calculateSpeechMetrics, FILLER_DICTIONARY } from '../src/services/speechAnalysisService';
import { SpeechCoachingSchema, ThinkingEvaluationSchema } from './ai/types';

async function runSpeechAndThinkingTests() {
  console.log('=== MindMirror AI Speech & Thinking Test Suite ===');

  // Test 1: Deterministic Metrics Calculation
  console.log('\n[Test 1] Testing Deterministic Metrics & Filler Tokenizer...');
  const sampleTranscript = "Um, so basically, our team noticed that, you know, query latency was high. For example, last sprint we refactored the join index, which reduced response time by 40%. Ultimately, upfront optimization prevents compounding technical debt.";
  const durationSec = 45;
  const metrics = calculateSpeechMetrics(sampleTranscript, durationSec, 2, 4);

  console.log('Word count:', metrics.wordCount);
  console.log('Words per minute:', metrics.wordsPerMinute);
  console.log('Filler count:', metrics.fillerWordsCount);
  console.log('Fillers per 100 words:', metrics.fillerWordsPer100Words);
  console.log('Filler breakdown:', JSON.stringify(metrics.fillerBreakdown));
  console.log('Silence percentage:', metrics.silencePercentage, '%');

  if (metrics.wordsPerMinute > 0 && metrics.fillerWordsCount >= 3) {
    console.log('✓ Deterministic speech metrics calculation succeeded.');
  } else {
    throw new Error('Deterministic metrics test failed.');
  }

  // Test 2: Speech Coaching Schema Validation
  console.log('\n[Test 2] Validating Speech Coaching Schema Structure...');
  const sampleCoaching = {
    structure: {
      mainPointIdentified: true,
      mainPointSummary: "Addressed latency reduction with join index refactoring.",
      supportingPoints: ["Noticed high query latency", "Upfront optimization prevents compounding debt"],
      hasConcreteExample: true,
      exampleSummary: "Refactored join index reducing response time by 40%",
      conclusionClarity: "Clear" as const,
      answersAssignedQuestion: true,
      structureFramework: "PREP" as const
    },
    strengths: [
      {
        title: "Direct Initial Framing",
        evidenceQuote: "our team noticed that query latency was high",
        timestamp: "0:04",
        whyHelpful: "Establishes immediate context."
      }
    ],
    weaknesses: [
      {
        priority: 1 as const,
        issue: "Filler word density",
        evidenceQuote: "Um, so basically, you know",
        timestamp: "0:01",
        whyItMatters: "Dilutes authoritative delivery.",
        alternativePhrasing: "Take a silent 1.5s breath pause."
      }
    ],
    clearerAlternativeResponse: "Point: Our team focused on query latency. Reason: High latency compounds debt. Example: Refactoring join indexes cut latency by 40%. Point: Optimization yields reliable throughput.",
    targetedExercises: [
      {
        name: "The Silent Pause Drill",
        description: "Replace verbal fillers with silent breathing pause.",
        durationMinutes: 3,
        focusArea: "Filler reduction"
      }
    ],
    measurableRetestCriterion: "Retake session: Deliver in 45s with under 2 fillers per 100 words.",
    confidenceScore: 90
  };

  const validatedCoaching = SpeechCoachingSchema.parse(sampleCoaching);
  console.log('✓ Speech Coaching Schema validation passed with 100% strict compliance.');

  // Test 3: Thinking Gym Schema Validation
  console.log('\n[Test 3] Validating Thinking Gym Evaluation Schema...');
  const sampleThinkingEvaluation = {
    overallScore: 88,
    intellectualHonestyScore: 92,
    rubricFeedback: [
      {
        criterion: "Identifies correlation vs causation",
        score: 90,
        observation: "Correctly differentiated observed metric bump from causal factor."
      }
    ],
    strengths: ["Clear counter-factual analysis", "Recognized confounding variables"],
    assumptionsOrBiasesFlagged: ["Small sample size assumption"],
    constructiveImprovements: ["Define explicit falsification condition"],
    clearerAlternativePerspective: "Distinguish camera observations from inferences."
  };

  const validatedThinking = ThinkingEvaluationSchema.parse(sampleThinkingEvaluation);
  console.log('✓ Thinking Gym Schema validation passed with 100% strict compliance.');

  console.log('\n=================================================');
  console.log('ALL SPEECH & THINKING REASONING TESTS PASSED ✓');
  console.log('=================================================');
}

runSpeechAndThinkingTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
