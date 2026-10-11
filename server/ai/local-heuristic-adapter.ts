import { DiaryEntryPayload, ValidatedAIDailyReview, AIDailyReviewSchema } from './types';

export function callLocalHeuristics(entry: DiaryEntryPayload): { review: ValidatedAIDailyReview; tokens: number } {
  const combinedText = [
    entry.title,
    entry.content,
    entry.events,
    entry.difficulties,
    entry.successes,
    entry.lessons
  ].filter(Boolean).join('. ');

  const sentences = entry.content.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 5);

  const daySummary: string[] = [];
  if (sentences.length >= 1) daySummary.push(sentences[0].trim());
  if (entry.events) daySummary.push(`Key events noted: ${entry.events.trim()}`);
  if (sentences.length >= 2) daySummary.push(sentences[Math.floor(sentences.length / 2)].trim());
  if (entry.successes) daySummary.push(`Key accomplishment: ${entry.successes.trim()}`);
  while (daySummary.length < 3) {
    daySummary.push(`Logged reflection with self-reported mood ${entry.mood || 3}/5 and stress ${entry.stress || 4}/10.`);
  }

  const whatWentWell = [
    {
      observation: entry.successes || "Maintained daily reflection practice under active workload",
      strength: "Self-Efficacy & Intention",
      whyHelpful: "Following through on chosen commitments reinforces internal locus of control and cognitive clarity.",
      quote: entry.successes || sentences[0]?.slice(0, 100) || "Observed from daily entry."
    }
  ];

  if (entry.gratitude) {
    whatWentWell.push({
      observation: "Conscious recognition of supportive external factors",
      strength: "Perspective & Gratitude",
      whyHelpful: "Actively noticing positive conditions buffers against negative bias and regulates stress.",
      quote: entry.gratitude
    });
  }

  const mistakesAndImprovements = [
    {
      whatHappened: entry.difficulties || "Experienced tension during cognitively taxing segments of the day.",
      whyIneffective: "Operating without structured transition pauses accumulates baseline sympathetic arousal.",
      likelyConsequence: "Observed outcome: transient fatigue. Potential consequence: reduced interpersonal patience.",
      alternative: "Implement a 90-second physiological pause before responding to high-stakes demands.",
      practiceMethod: "Take 2 deep breaths and write down verifiable facts before replying.",
      quote: entry.difficulties || sentences[sentences.length - 1]?.slice(0, 80) || "Recorded reflection."
    }
  ];

  const reportedEmotions: string[] = [];
  if ((entry.mood || 3) <= 2) reportedEmotions.push("Strained", "Fatigued");
  else if ((entry.mood || 3) === 3) reportedEmotions.push("Neutral", "Reflective");
  else reportedEmotions.push("Grounded", "Confident");

  if ((entry.stress || 4) >= 6) reportedEmotions.push("Elevated Stress");

  const emotionalReflection = {
    emotionsReported: reportedEmotions,
    patternObservations: [
      `Self-reported stress level is ${entry.stress || 4}/10 alongside energy at ${entry.energy || 7}/10.`,
      `Sleep quality was recorded as '${entry.sleepQuality || 'Good'}' (${entry.sleepHours || 7.5}h).`
    ],
    triggerHypothesis: entry.difficulties
      ? `Friction emerged around: "${entry.difficulties.slice(0, 60)}..."`
      : "Transitions between high-focus blocks and asynchronous communications.",
    alternativeResponse: "Pause for 60 seconds before speaking or writing when feeling evaluated.",
    quote: sentences[0]?.slice(0, 80) || "Recorded entry."
  };

  const detectedBiases: string[] = [];
  if (/always|never|everyone|nobody/i.test(combinedText)) {
    detectedBiases.push("All-or-Nothing Thinking");
  }
  if (/should|ought|must/i.test(combinedText)) {
    detectedBiases.push("Rigid 'Should' Expectations");
  }
  if (/they think|he thinks|she thinks|assumed/i.test(combinedText)) {
    detectedBiases.push("Mind Reading (inferring thoughts without verification)");
  }
  if (detectedBiases.length === 0) {
    detectedBiases.push("Confirmation Bias check: Review if contradictory evidence was weighed equally");
  }

  const thinkingAnalysis = {
    cognitiveBiasesNoticed: detectedBiases,
    untestedAssumptions: [
      "Assumption that unexpected schedule shifts require immediate, rushed resolution."
    ],
    alternativePerspectives: [
      "Colleagues may be navigating undisclosed deadline pressures or personal bandwidth constraints."
    ],
    evidenceStrength: sentences.length > 4 ? "Solid: Multiple verifiable details provided." : "Preliminary: Brief text.",
    quote: sentences[0]?.slice(0, 80) || "Recorded entry."
  };

  const socialInteractionReview = {
    clarity: entry.socialInteractions ? "Directly referenced interpersonal contact." : "Social context not explicitly detailed in entry.",
    activeListening: "Opportunity to clarify counterparty requirements before providing answers or defenses.",
    empathy: "Good baseline capacity to consider external perspectives and teammates' workloads.",
    boundaryRespect: "Protecting personal recovery time cleanly without apologetic overtones.",
    perspectiveTaking: "Recognizing that other stakeholders carry their own structural priorities.",
    quote: entry.socialInteractions || "Logged interactions."
  };

  const actionPlan = {
    highestPriority: entry.prioritiesTomorrow
      ? `Advance priority: ${entry.prioritiesTomorrow}`
      : "Protect morning focus block before opening communication channels.",
    threeActionsTomorrow: [
      entry.prioritiesTomorrow ? `Deliver on: ${entry.prioritiesTomorrow}` : "Protect first 90 minutes of morning work for core deliverable",
      "Take a 15-minute midday restorative walk without looking at devices",
      "Perform a 3-minute evening shutdown review to cleanly separate work from rest"
    ],
    smallHabitToPractice: "Pause for two seconds before responding to questions that trigger defensive feelings.",
    reflectionQuestion: "What assumption am I making today that I have not tested with objective evidence?",
    behaviorToContinue: "Consistent daily journaling and honest self-appraisal.",
    behaviorToReduce: "Multitasking during cognitively complex problem-solving sessions.",
    measurementMetric: "Tracking completion of morning focus block and midday walk."
  };

  const confidenceAndEvidence = {
    directlyStatedFacts: [
      `Date: ${entry.date}`,
      `Self-reported Mood: ${entry.mood || 3}/5, Stress: ${entry.stress || 4}/10, Energy: ${entry.energy || 7}/10`,
      `Reported Sleep: ${entry.sleepHours || 7.5} hours (${entry.sleepQuality || 'Good'})`
    ],
    reasonableInterpretations: [
      "Energy baseline and sleep duration significantly influence resilience to unexpected friction.",
      "Conscious journaling of lessons indicates strong adaptive learning agility."
    ],
    unknownOrUnclearInfo: [
      "Unobserved non-verbal reactions or unstated pressures of other participants.",
      "Multi-week physiological patterns beyond this recorded 24-hour cycle."
    ],
    evidenceCoverageScore: Math.min(95, Math.max(45, Math.floor((combinedText.length / 8) + 35)))
  };

  const review: ValidatedAIDailyReview = {
    daySummary,
    whatWentWell,
    mistakesAndImprovements,
    emotionalReflection,
    thinkingAnalysis,
    socialInteractionReview,
    actionPlan,
    confidenceAndEvidence
  };

  return { review, tokens: 0 };
}
