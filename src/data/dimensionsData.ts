import { PersonalDimension, DimensionCategory } from '../types';

export interface BaseDimensionDefinition {
  id: number;
  name: string;
  category: DimensionCategory;
  description: string;
  recommendedExercises: string[];
  isUserSelected: boolean;
}

export const BASE_DIMENSIONS: BaseDimensionDefinition[] = [
  {
    id: 1,
    name: "Emotional Awareness",
    category: "Emotional",
    description: "Recognizing, naming, and distinguishing specific emotions rather than experiencing generic distress.",
    recommendedExercises: [
      "Somatic check-in: pause twice daily to label 3 physical sensations and their corresponding emotion",
      "Emotion-granularity journaling: replace broad words like 'stressed' with precise descriptors"
    ],
    isUserSelected: true
  },
  {
    id: 2,
    name: "Emotional Regulation",
    category: "Emotional",
    description: "Responding constructively to distressing emotions rather than suppressing or escalating them.",
    recommendedExercises: [
      "The 90-second physiological pause: allow adrenaline spike to subside before formulating responses",
      "Opposite-action drill when experiencing withdrawal urge"
    ],
    isUserSelected: true
  },
  {
    id: 3,
    name: "Stress Management",
    category: "Emotional",
    description: "Recognizing systemic pressure and deploying sustainable physiological and cognitive recovery habits.",
    recommendedExercises: [
      "Deliberate decompression transition between workday and evening",
      "Box breathing (4-4-4-4) before starting high-friction tasks"
    ],
    isUserSelected: true
  },
  {
    id: 4,
    name: "Self-Awareness",
    category: "Cognitive",
    description: "Understanding recurring patterns, behavioral triggers, personal limitations, and underlying drivers.",
    recommendedExercises: [
      "Trigger mapping: list top 3 recurring triggers and default defensive reactions"
    ],
    isUserSelected: true
  },
  {
    id: 5,
    name: "Self-Esteem & Self-Compassion",
    category: "Emotional",
    description: "Responding to mistakes with constructive accountability rather than harsh self-recrimination.",
    recommendedExercises: [
      "Neutral reframing: Speak to yourself as you would to a competent colleague"
    ],
    isUserSelected: false
  },
  {
    id: 6,
    name: "Resilience",
    category: "Emotional",
    description: "Recovering quickly and constructively after unexpected obstacles, rejection, or plan failures.",
    recommendedExercises: [
      "After-Action Review: What happened, what did I expect, what do I keep?"
    ],
    isUserSelected: true
  },
  {
    id: 7,
    name: "Social Confidence",
    category: "Social",
    description: "Participating calmly and authentically in group discussions, meetings, and personal gatherings.",
    recommendedExercises: [
      "Speak first 5 minutes: contribute one clarifying question early in every meeting"
    ],
    isUserSelected: false
  },
  {
    id: 8,
    name: "Communication Clarity",
    category: "Social",
    description: "Expressing intentions, context, and requirements concisely and confirming mutual understanding.",
    recommendedExercises: [
      "Bottom-Line Up Front (BLUF): State decision/request in the very first sentence"
    ],
    isUserSelected: true
  },
  {
    id: 9,
    name: "Empathy & Perspective-Taking",
    category: "Social",
    description: "Considering the cognitive frame, constraints, pressures, and emotional context of others.",
    recommendedExercises: [
      "Perspective swap: write 3 sentences from the opposing person's viewpoint before challenging"
    ],
    isUserSelected: true
  },
  {
    id: 10,
    name: "Relationship & Boundary Skills",
    category: "Social",
    description: "Building trustworthy relationships while preserving personal limits and communicating boundaries kindly.",
    recommendedExercises: [
      "Proactive boundary setting: declare workload thresholds during planning"
    ],
    isUserSelected: false
  },
  {
    id: 11,
    name: "Critical Thinking",
    category: "Cognitive",
    description: "Evaluating claims with evidence, identifying assumptions, and testing logical consistency.",
    recommendedExercises: [
      "Assumption audit: What am I treating as fact that is actually an inference?"
    ],
    isUserSelected: true
  },
  {
    id: 12,
    name: "Problem-Solving",
    category: "Cognitive",
    description: "Defining root problems cleanly, generating targeted options, and verifying resolution.",
    recommendedExercises: [
      "Root Cause 5-Whys analysis on weekly operational friction points"
    ],
    isUserSelected: false
  },
  {
    id: 13,
    name: "Decision-Making",
    category: "Cognitive",
    description: "Comparing viable trade-offs, anticipating secondary effects, and acting decisively under uncertainty.",
    recommendedExercises: [
      "Write 2-way vs 1-way door decision rule before deliberating"
    ],
    isUserSelected: true
  },
  {
    id: 14,
    name: "Cognitive Flexibility",
    category: "Cognitive",
    description: "Willingness to revise existing models and abandon hypotheses when contradictory evidence appears.",
    recommendedExercises: [
      "Steel-manning: Formulate the strongest counterargument to your favorite viewpoint"
    ],
    isUserSelected: false
  },
  {
    id: 15,
    name: "Adaptability",
    category: "Behavioral",
    description: "Modifying behavior smoothly when priorities, tools, or environments shift unexpectedly.",
    recommendedExercises: [
      "Plan B mapping: identify backup task whenever working on dependency-heavy goals"
    ],
    isUserSelected: true
  },
  {
    id: 16,
    name: "Growth Mindset",
    category: "Cognitive",
    description: "Viewing capability as malleable through deliberate practice, feedback, and study.",
    recommendedExercises: [
      "Journal 'Not yet': append 'yet' to any sentence expressing difficulty"
    ],
    isUserSelected: false
  },
  {
    id: 17,
    name: "Discipline & Consistency",
    category: "Behavioral",
    description: "Honoring commitments over time, particularly when emotional motivation is absent.",
    recommendedExercises: [
      "Implementation intentions: 'If [time/event], then I will [action]'"
    ],
    isUserSelected: true
  },
  {
    id: 18,
    name: "Time Management",
    category: "Behavioral",
    description: "Allocating hours realistically, honoring time blocks, and protecting focus against fragmentation.",
    recommendedExercises: [
      "Buffer blocking: Add 20% slack buffer to estimated project durations"
    ],
    isUserSelected: true
  },
  {
    id: 19,
    name: "Focus & Attention",
    category: "Cognitive",
    description: "Sustaining concentration on singular objectives and noticing urge toward distraction.",
    recommendedExercises: [
      "Distraction parking lot: Write distracting thoughts on notepad to review later"
    ],
    isUserSelected: false
  },
  {
    id: 20,
    name: "Habit Formation",
    category: "Behavioral",
    description: "Anchoring automatic, low-friction routines to established environmental triggers.",
    recommendedExercises: [
      "Habit stacking: pair desired micro-habit immediately after a cemented ritual"
    ],
    isUserSelected: true
  },
  {
    id: 21,
    name: "Goal Clarity",
    category: "Behavioral",
    description: "Defining precise, falsifiable milestones rather than vague aspirational wishes.",
    recommendedExercises: [
      "Definition of Done: define exact observable proof of goal completion"
    ],
    isUserSelected: false
  },
  {
    id: 22,
    name: "Accountability",
    category: "Behavioral",
    description: "Acknowledging personal agency in outcomes without resorting to victimhood or deflection.",
    recommendedExercises: [
      "Locus of control audit: list what is 100% within your direct control vs outside"
    ],
    isUserSelected: true
  },
  {
    id: 23,
    name: "Learning Agility",
    category: "Cognitive",
    description: "Rapidly synthesizing lessons from recent friction and modifying upcoming tactics.",
    recommendedExercises: [
      "End-of-day 1-sentence synthesis: 'What did I learn today that modifies tomorrow?'"
    ],
    isUserSelected: false
  },
  {
    id: 24,
    name: "Creativity",
    category: "Cognitive",
    description: "Generating divergent alternatives and novel problem framings before converging on solutions.",
    recommendedExercises: [
      "Rule of 3: Formulate at least 3 distinct conceptual alternatives before building"
    ],
    isUserSelected: false
  },
  {
    id: 25,
    name: "Conflict Management",
    category: "Social",
    description: "Addressing interpersonal disagreements directly, calmly, and focusing on problems over personalities.",
    recommendedExercises: [
      "Interest-based negotiation framing: Focus on underlying need, not entrenched position"
    ],
    isUserSelected: false
  },
  {
    id: 26,
    name: "Boundary Setting",
    category: "Social",
    description: "Protecting cognitive bandwidth, commitments, and energy against unreasonable impositions.",
    recommendedExercises: [
      "Clean refusal script: 'I cannot take this on without dropping [X], which is priority'"
    ],
    isUserSelected: true
  },
  {
    id: 27,
    name: "Physical Wellbeing Habits",
    category: "Wellbeing",
    description: "Honoring biological baselines: restorative sleep, hydration, movement, and nervous system recovery.",
    recommendedExercises: [
      "Circadian light hygiene: 10 mins natural sunlight within 1 hour of waking"
    ],
    isUserSelected: true
  },
  {
    id: 28,
    name: "Work & Study Effectiveness",
    category: "Behavioral",
    description: "Designing workflows and environments that optimize throughput while preventing burnout.",
    recommendedExercises: [
      "Chronotype task mapping: High-cognitive tasks before noon, admin tasks after 3 PM"
    ],
    isUserSelected: false
  },
  {
    id: 29,
    name: "Values Alignment",
    category: "Behavioral",
    description: "Comparing everyday time allocation and behavioral choices against declared personal values.",
    recommendedExercises: [
      "Weekly values audit: Compare top 3 values to actual hours logged"
    ],
    isUserSelected: true
  },
  {
    id: 30,
    name: "Life Balance",
    category: "Wellbeing",
    description: "Harmonizing vocation, relationships, intellectual growth, solitude, and physical vitality.",
    recommendedExercises: [
      "Guilt-free downtime block: 2 hours weekly devoted to pure leisure without optimization"
    ],
    isUserSelected: true
  }
];

/**
 * Creates honest, zero-state dimensions for new user profiles with zero entries.
 * No fabricated scores or quotes are present.
 */
export function createInitialDimensions(): PersonalDimension[] {
  return BASE_DIMENSIONS.map(d => ({
    id: d.id,
    name: d.name,
    category: d.category,
    description: d.description,
    currentScore: null,
    confidenceScore: 0,
    trend: 'insufficient_data',
    sampleSize: 0,
    dateRange: 'No entries recorded',
    evidenceCoverageLevel: 'Insufficient evidence',
    supportingEvidence: [],
    strengths: [],
    developmentOpportunities: [],
    recommendedExercises: d.recommendedExercises,
    history: [],
    isUserSelected: d.isUserSelected
  }));
}

export const INITIAL_DIMENSIONS: PersonalDimension[] = createInitialDimensions();
