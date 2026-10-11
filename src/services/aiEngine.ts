import { DiaryEntry, AIDailyReview, PersonalDimension } from '../types';

/**
 * Checks for immediate safety triggers in journal entries.
 */
export function checkSafetyTriggers(text: string): boolean {
  const normalized = text.toLowerCase();
  const dangerousPatterns = [
    'end my life', 'want to kill myself', 'suicide', 'self-harm',
    'cut myself', 'better off dead', 'no reason to live'
  ];
  return dangerousPatterns.some(pattern => normalized.includes(pattern));
}

/**
 * Extracts representative quotes from user text that match themes.
 */
function extractMatchingQuote(text: string, keywords: string[]): string {
  const sentences = text.split(/(?<=[.?!])\s+/);
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      return sentence.trim();
    }
  }
  return sentences[0]?.trim() || "Observed from daily entry.";
}

/**
 * Robust, evidence-based psychological heuristic analysis engine.
 * Adheres strictly to the MindMirror AI prompt specifications.
 */
export function generateLocalAIReview(entry: DiaryEntry): AIDailyReview {
  const combinedText = [
    entry.title,
    entry.content,
    entry.events,
    entry.difficulties,
    entry.successes,
    entry.lessons
  ].filter(Boolean).join('. ');

  const sentences = entry.content.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 5);

  // 1. Day Summary (3-6 concise bullets)
  const daySummary: string[] = [];
  if (sentences.length >= 1) daySummary.push(sentences[0].trim());
  if (entry.events) daySummary.push(`Key events noted: ${entry.events.trim()}`);
  if (sentences.length >= 2) daySummary.push(sentences[Math.floor(sentences.length / 2)].trim());
  if (entry.successes) daySummary.push(`Key accomplishment: ${entry.successes.trim()}`);
  if (sentences.length >= 3 && daySummary.length < 4) daySummary.push(sentences[sentences.length - 1].trim());

  // Ensure 3-6 items
  while (daySummary.length < 3) {
    daySummary.push(`Recorded reflection with mood rating ${entry.mood}/5 and energy level ${entry.energy}/10.`);
  }

  // 2. What Went Well
  const whatWentWell = [];
  if (entry.successes) {
    whatWentWell.push({
      observation: "Demonstrated positive agency in recorded accomplishments",
      strength: "Self-Efficacy & Intention",
      whyHelpful: "Following through on targeted priorities reinforces confidence and creates upward behavioral momentum.",
      quote: entry.successes
    });
  } else if (sentences.length > 0) {
    const positiveSentence = sentences.find(s => /accomplished|proud|worked|finished|resolved|handled|calm/i.test(s)) || sentences[0];
    whatWentWell.push({
      observation: "Constructive engagement with daily responsibilities",
      strength: "Accountability & Persistence",
      whyHelpful: "Taking direct ownership of responsibilities provides stability under fluctuating circumstances.",
      quote: positiveSentence
    });
  }

  if (entry.gratitude) {
    whatWentWell.push({
      observation: "Active recognition of positive conditions",
      strength: "Perspective & Gratitude",
      whyHelpful: "Consciously noticing supportive conditions buffers against negative cognitive bias and reduces chronic stress.",
      quote: entry.gratitude
    });
  } else {
    whatWentWell.push({
      observation: "Commitment to honest daily self-reflection",
      strength: "Self-Awareness",
      whyHelpful: "Taking time to articulate thoughts creates psychological distance, allowing clearer decision-making.",
      quote: entry.content.slice(0, 100) + "..."
    });
  }

  // 3. Mistakes & Improvement Opportunities
  const mistakesAndImprovements = [];
  if (entry.difficulties) {
    mistakesAndImprovements.push({
      whatHappened: entry.difficulties,
      whyIneffective: "Operating in reactive or strained mode often amplifies friction and narrows problem-solving perspective.",
      likelyConsequence: "Observed outcome: increased stress and diminished cognitive bandwidth. Potential consequence: recurring avoidance.",
      alternative: "Slow down the cycle: take a 2-minute breath pause to separate objective facts from immediate internal tension.",
      practiceMethod: "The 'Fact vs. Feeling' ledger: write down the factual event in one line before reacting.",
      quote: entry.difficulties
    });
  } else {
    const challengeSentence = sentences.find(s => /struggled|mistake|hard|annoyed|tired|failed|overwhelmed/i.test(s));
    if (challengeSentence) {
      mistakesAndImprovements.push({
        whatHappened: challengeSentence,
        whyIneffective: "Stretching personal limits without planned pauses compromises attention and emotional regulation.",
        likelyConsequence: "Subtle burnout and reduced responsiveness to nuanced interpersonal cues.",
        alternative: "Establish clear boundaries around time and energy before diving into taxing work.",
        practiceMethod: "Declare one firm 'shutdown boundary' for tomorrow's schedule.",
        quote: challengeSentence
      });
    } else {
      mistakesAndImprovements.push({
        whatHappened: "Potential risk of high pace without explicit biological recovery intervals.",
        whyIneffective: "Prolonged output without rest degrades executive function gradually without sudden alarms.",
        likelyConsequence: "Diminished late-afternoon patience and degraded sleep quality.",
        alternative: "Insert two scheduled 5-minute non-digital recovery intervals during transition hours.",
        practiceMethod: "Schedule a micro-walk after lunch before checking communications.",
        quote: entry.content.slice(0, 80) + "..."
      });
    }
  }

  // 4. Emotional Reflection
  const reportedEmotions: string[] = [];
  if (entry.mood <= 2) reportedEmotions.push("Strained", "Fatigued", "Frustrated");
  else if (entry.mood === 3) reportedEmotions.push("Equanimous", "Reflective", "Neutral");
  else reportedEmotions.push("Grounded", "Satisfied", "Energized");

  if (entry.stress >= 6) reportedEmotions.push("Elevated Stress");
  if (entry.energy <= 4) reportedEmotions.push("Low Physical Stamina");

  const emotionalReflection = {
    emotionsReported: reportedEmotions,
    patternObservations: [
      `Self-reported stress is rated at ${entry.stress}/10 alongside energy at ${entry.energy}/10.`,
      `Sleep quality was recorded as '${entry.sleepQuality}' (${entry.sleepHours}h), which correlates directly with emotional baseline.`
    ],
    triggerHypothesis: entry.difficulties
      ? `Friction likely escalated around unexpected friction in: "${entry.difficulties.slice(0, 70)}..."`
      : "Emotional shifts appear closely linked to task volume and recovery transitions.",
    alternativeResponse: "Practice acknowledging the emotional sensation in the body for 60 seconds without feeling compelled to fix it immediately.",
    quote: extractMatchingQuote(combinedText, ['felt', 'irritab', 'stress', 'calm', 'anxious', 'happy', 'tired'])
  };

  // 5. Thinking & Decision Analysis
  const detectedBiases: string[] = [];
  if (/always|never|everyone|nobody|ruined|impossible/i.test(combinedText)) {
    detectedBiases.push("All-or-Nothing Thinking (potential overgeneralization in descriptions)");
  }
  if (/should have|ought to|must/i.test(combinedText)) {
    detectedBiases.push("'Should' Statements (rigid internal expectations that induce unnecessary guilt)");
  }
  if (/they think|he thinks|she thinks|assumed/i.test(combinedText)) {
    detectedBiases.push("Mind Reading (inferring thoughts or evaluations of others without verification)");
  }
  if (detectedBiases.length === 0) {
    detectedBiases.push("Confirmation Bias check: Review if contradictory evidence was weighed equally");
  }

  const thinkingAnalysis = {
    cognitiveBiasesNoticed: detectedBiases,
    untestedAssumptions: [
      "Assumption that current pressure requires an immediate, exhaustive resolution without delay.",
      "Assumption that pausing to clarify requirements slows down overall velocity."
    ],
    alternativePerspectives: [
      "The situation may be an ordinary system constraint rather than a personal failure or urgency emergency.",
      "Others involved may have distinct priorities, constraints, or information unknown to you."
    ],
    evidenceStrength: sentences.length > 5 ? "Moderate: Multiple details provided in entry." : "Preliminary: Based on short text.",
    quote: extractMatchingQuote(combinedText, ['think', 'assume', 'decid', 'realiz', 'wonder'])
  };

  // 6. Social Interaction Review
  const socialInteractionReview = {
    clarity: entry.socialInteractions ? "Directly referenced interpersonal contact with specific participants." : "Social context not explicitly detailed in entry.",
    activeListening: "Opportunity to verify what the other person meant before offering answers or defenses.",
    empathy: "Good baseline capacity to consider external perspectives and teammates' workloads.",
    boundaryRespect: "Noted importance of maintaining healthy time and cognitive limits.",
    perspectiveTaking: "Recognizing that colleagues navigate their own unstated pressures and deadlines.",
    quote: entry.socialInteractions || extractMatchingQuote(combinedText, ['talk', 'call', 'meet', 'told', 'asked', 'said'])
  };

  // 7. Action Plan
  const actionPlan = {
    highestPriority: entry.prioritiesTomorrow
      ? `Execute top priority: ${entry.prioritiesTomorrow}`
      : "Schedule one 90-minute uninterrupted deep focus block tomorrow morning.",
    threeActionsTomorrow: [
      entry.prioritiesTomorrow ? `Advance core deliverable: ${entry.prioritiesTomorrow}` : "Protect morning focus block before opening communication apps",
      "Take a 15-minute restorative walk outdoors at midday without looking at a screen",
      "Perform a 3-minute evening shutdown review to cleanly detach from work"
    ],
    smallHabitToPractice: "Pause for two deep breaths before answering any demanding question or email.",
    reflectionQuestion: "What assumption am I making today that I haven't tested with objective facts?",
    behaviorToContinue: entry.successes ? `Continue ${entry.successes.slice(0, 60)}` : "Honest journaling and self-reflection.",
    behaviorToReduce: "Impulsive multitasking during high-stress afternoon hours.",
    measurementMetric: "Tracking completion of the planned morning focus block and midday walk."
  };

  // 8. Confidence & Evidence
  const directlyStatedFacts = [
    `Date: ${entry.date} (${entry.dayOfWeek})`,
    `Self-reported Mood: ${entry.mood}/5, Energy: ${entry.energy}/10, Stress: ${entry.stress}/10`,
    `Recorded Sleep: ${entry.sleepHours} hours (${entry.sleepQuality})`
  ];
  if (entry.events) directlyStatedFacts.push(`Reported event: ${entry.events}`);
  if (entry.difficulties) directlyStatedFacts.push(`Reported difficulty: ${entry.difficulties}`);

  const reasonableInterpretations = [
    "Energy level and sleep duration substantially influence tolerance for friction.",
    "Explicit journaling of lessons learned indicates proactive learning agility."
  ];

  const unknownOrUnclearInfo = [
    "Unobserved external factors and non-verbal reactions of other participants.",
    "Long-term biological patterns beyond the recorded 24-hour timeframe."
  ];

  const evidenceCoverageScore = Math.min(95, Math.max(40, Math.floor((combinedText.length / 8) + 30)));

  return {
    id: `review-${Date.now()}`,
    entryId: entry.id,
    date: entry.date,
    createdAt: new Date().toISOString(),
    daySummary,
    whatWentWell,
    mistakesAndImprovements,
    emotionalReflection,
    thinkingAnalysis,
    socialInteractionReview,
    actionPlan,
    confidenceAndEvidence: {
      directlyStatedFacts,
      reasonableInterpretations,
      unknownOrUnclearInfo,
      evidenceCoverageScore
    }
  };
}

/**
 * Updates dimensions based on entry and review evidence.
 */
export function updateDimensionsWithReview(
  dimensions: PersonalDimension[],
  entry: DiaryEntry,
  review: AIDailyReview
): PersonalDimension[] {
  return dimensions.map(dim => {
    // Check if entry text relates to dimension
    const lowerName = dim.name.toLowerCase();
    const lowerContent = (entry.content + ' ' + entry.difficulties + ' ' + entry.successes).toLowerCase();
    const isRelevant = lowerContent.includes(lowerName.split(' ')[0]) ||
      (dim.category === 'Emotional' && entry.stress > 0) ||
      (dim.category === 'Wellbeing' && entry.sleepHours > 0) ||
      (dim.category === 'Cognitive' && review.thinkingAnalysis.cognitiveBiasesNoticed.length > 0);

    if (!isRelevant) return dim;

    const newSampleSize = dim.sampleSize + 1;
    const currentScore = dim.currentScore || 65;
    // Transparent adjustment: small realistic nudge based on self-reflection indicators
    const performanceSignal = (entry.mood * 10) + ((10 - entry.stress) * 3) + (entry.energy * 2);
    const targetScore = Math.min(95, Math.max(30, performanceSignal));
    const updatedScore = Math.round((currentScore * 0.85) + (targetScore * 0.15));

    const newEvidence = [
      {
        entryId: entry.id,
        date: entry.date,
        quote: entry.content.slice(0, 100) + '...',
        explanation: `Observed in daily entry with mood ${entry.mood}/5 and stress ${entry.stress}/10.`
      },
      ...dim.supportingEvidence.slice(0, 4)
    ];

    const newHistory = [
      ...dim.history,
      { date: entry.date, score: updatedScore }
    ].slice(-8);

    const trend = updatedScore > currentScore ? 'improving' : updatedScore < currentScore ? 'declining' : 'stable';

    return {
      ...dim,
      currentScore: updatedScore,
      sampleSize: newSampleSize,
      trend,
      supportingEvidence: newEvidence,
      history: newHistory,
      confidenceScore: Math.min(98, dim.confidenceScore + 2),
      evidenceCoverageLevel: newSampleSize > 7 ? 'Strong repeated' : newSampleSize > 4 ? 'Consistent' : 'Developing'
    };
  });
}
