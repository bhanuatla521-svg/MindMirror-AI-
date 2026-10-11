import {
  SpeechPracticeMode,
  SpeechDifficulty,
  ThinkingExercise,
  ThinkingGymCategory,
  IntrovertStage
} from '../types';

export interface SpeakingPrompt {
  id: string;
  mode: SpeechPracticeMode;
  difficulty: SpeechDifficulty;
  title: string;
  promptText: string;
  contextTip: string;
  recommendedDurationSeconds: number;
  frameworkSuggestion: 'PREP' | 'STAR' | 'Direct';
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // 1. Daily Speaking Prompts (Low friction, self-reflection)
  {
    id: 'daily-1',
    mode: 'daily_prompt',
    difficulty: 'foundational',
    title: 'A Decision You Made Today',
    promptText: 'Explain one choice you made today, why you made it, and what you learned from the outcome.',
    contextTip: 'Focus on being clear about the reason behind the choice, rather than narrating every detail.',
    recommendedDurationSeconds: 60,
    frameworkSuggestion: 'PREP'
  },
  {
    id: 'daily-2',
    mode: 'daily_prompt',
    difficulty: 'foundational',
    title: 'A Boundary or Preference',
    promptText: 'Describe a personal boundary or working preference you value, and explain how it helps you do better work.',
    contextTip: 'State the boundary directly in your first sentence without apologizing.',
    recommendedDurationSeconds: 60,
    frameworkSuggestion: 'Direct'
  },
  {
    id: 'daily-3',
    mode: 'daily_prompt',
    difficulty: 'intermediate',
    title: 'Explaining a Complex Idea Simply',
    promptText: 'Take one concept from your work, study, or hobby and explain it so that a bright 12-year-old would understand it.',
    contextTip: 'Use a single concrete analogy or metaphor instead of jargon.',
    recommendedDurationSeconds: 90,
    frameworkSuggestion: 'PREP'
  },

  // 2. Impromptu Speaking (Quick thinking, structured framing)
  {
    id: 'impromptu-1',
    mode: 'impromptu',
    difficulty: 'foundational',
    title: 'Depth vs. Breadth in Learning',
    promptText: 'Is it more valuable in today’s world to be a deep specialist or a broad generalist? Take a stance and justify it.',
    contextTip: 'Pick one side decisively for the drill, provide two reasons, and give one concrete example.',
    recommendedDurationSeconds: 60,
    frameworkSuggestion: 'PREP'
  },
  {
    id: 'impromptu-2',
    mode: 'impromptu',
    difficulty: 'intermediate',
    title: 'Handling Unexpected Delays',
    promptText: 'Your key project delivery has been delayed by two weeks due to a vendor issue. How do you communicate this to your stakeholders?',
    contextTip: 'Acknowledge the objective fact, propose a path forward, and request aligned next steps.',
    recommendedDurationSeconds: 90,
    frameworkSuggestion: 'Direct'
  },
  {
    id: 'impromptu-3',
    mode: 'impromptu',
    difficulty: 'advanced',
    title: 'Disagreeing with a Consensus Decision',
    promptText: 'Your team is eager to adopt a solution you believe will fail at scale. How do you raise your concern without sounding obstructive?',
    contextTip: 'Separate the team’s shared intent from the operational risk. Use questions and data.',
    recommendedDurationSeconds: 90,
    frameworkSuggestion: 'PREP'
  },

  // 3. Interview Practice (STAR format: Situation, Task, Action, Result)
  {
    id: 'interview-1',
    mode: 'interview',
    difficulty: 'intermediate',
    title: 'Navigating Technical Disagreement',
    promptText: 'Tell me about a time you strongly disagreed with a peer on an approach. How did you handle the situation and what was the outcome?',
    contextTip: 'Focus 70% of your time on YOUR specific actions and the objective resolution.',
    recommendedDurationSeconds: 120,
    frameworkSuggestion: 'STAR'
  },
  {
    id: 'interview-2',
    mode: 'interview',
    difficulty: 'intermediate',
    title: 'Managing a Critical Mistake',
    promptText: 'Describe a situation where a project you owned encountered an unexpected failure or mistake. How did you react?',
    contextTip: 'Show emotional accountability: admit the fault plainly, explain immediate containment, and show system-level fixes.',
    recommendedDurationSeconds: 120,
    frameworkSuggestion: 'STAR'
  },
  {
    id: 'interview-3',
    mode: 'interview',
    difficulty: 'advanced',
    title: 'Prioritizing Under Severe Constraints',
    promptText: 'How do you handle having three urgent, high-visibility requests that cannot all be finished by their deadlines?',
    contextTip: 'Explain your explicit prioritization matrix and how you communicate trade-offs upward.',
    recommendedDurationSeconds: 90,
    frameworkSuggestion: 'PREP'
  },

  // 4. Presentation Practice (Executive summaries & pitches)
  {
    id: 'pres-1',
    mode: 'presentation',
    difficulty: 'intermediate',
    title: '60-Second Executive Status Update',
    promptText: 'Deliver a high-impact, 60-second status update on your current main priority. Cover: Objective, Status, Key Blocker, Next Milestone.',
    contextTip: 'Start with the bottom line first (BLUF). Avoid starting with historical backstory.',
    recommendedDurationSeconds: 60,
    frameworkSuggestion: 'Direct'
  },
  {
    id: 'pres-2',
    mode: 'presentation',
    difficulty: 'advanced',
    title: 'Pitching a Process Improvement',
    promptText: 'Pitch an internal change or tool adoption to senior leadership that requires spending $5,000 or 40 hours of team time.',
    contextTip: 'Quantify the cost of inaction before presenting the benefits of your proposal.',
    recommendedDurationSeconds: 120,
    frameworkSuggestion: 'PREP'
  },

  // 5. Conversation Role-Play (Assertive communication & empathy)
  {
    id: 'roleplay-1',
    mode: 'roleplay',
    difficulty: 'foundational',
    title: 'Declining a Last-Minute Weekend Request',
    promptText: 'Your lead asks you at 4:45 PM on Friday to take on a non-critical document rewrite over the weekend. Respond with calm assertion.',
    contextTip: 'Acknowledge importance, decline the weekend timeframe, and offer the Monday morning plan.',
    recommendedDurationSeconds: 60,
    frameworkSuggestion: 'Direct'
  },
  {
    id: 'roleplay-2',
    mode: 'roleplay',
    difficulty: 'intermediate',
    title: 'Giving Constructive Feedback to a Colleague',
    promptText: 'A colleague repeatedly interrupts you in cross-functional syncs. Bring this up in a private 1-on-1 constructively.',
    contextTip: 'Use camera-like objective observations: "In the last two syncs, when I was detailing the roadmap..."',
    recommendedDurationSeconds: 90,
    frameworkSuggestion: 'PREP'
  }
];

// ==========================================
// Phase 5: Thinking Gym (10 Structured Domains)
// ==========================================

export const THINKING_EXERCISES: ThinkingExercise[] = [
  {
    id: 'think-1',
    category: 'critical_logic',
    categoryTitle: 'Critical & Logical Thinking',
    title: 'Spotting the False Cause (Post Hoc Fallacy)',
    difficulty: 'Foundational',
    premise: 'Premise: "Ever since we installed the new ergonomic standing desks last month, the engineering team’s delivery speed increased by 22%. Therefore, standing desks are the primary driver of engineering throughput."',
    promptQuestion: 'Analyze the logic of this claim. What confounding variables might explain the increase? What experiment would test whether the desks actually caused the speed increase?',
    keyRubricCriteria: [
      'Identifies correlation vs. causation confusion',
      'Proposes at least 2 plausible confounding factors (e.g., sprint backlog size, release cycle, seasonality)',
      'Outlines a controlled test or counter-factual analysis'
    ],
    sampleHonestResponse: 'The argument commits the post hoc ergo propter hoc fallacy. The 22% throughput bump could be confounded by lighter tickets in the sprint, end-of-quarter pressure, or the Hawthorne effect (temporary improvement due to being observed). To test causality, we would need a randomized cohort split or an A/B test over 6 sprints.'
  },
  {
    id: 'think-2',
    category: 'fact_vs_opinion',
    categoryTitle: 'Fact vs. Opinion & Assumptions',
    title: 'Deconstructing a Performance Review Claim',
    difficulty: 'Intermediate',
    premise: 'Premise: "Jordan is not a team player because they rarely speak up during spontaneous brainstorming sessions, proving they don’t care about our collaborative culture."',
    promptQuestion: 'Separate the objective camera facts from the unverified assumptions and subjective evaluations in this statement.',
    keyRubricCriteria: [
      'Extracts the single verifiable fact (Jordan rarely speaks up during spontaneous sessions)',
      'Identifies the unverified leaps (assuming silence equals lack of care or anti-collaboration)',
      'Provides alternative explanations (e.g., internal processing style, async preference, poorly structured meetings)'
    ],
    sampleHonestResponse: 'Verifiable camera fact: Jordan speaks infrequently during spontaneous brainstorming. Unverified opinions: "Not a team player" and "doesn\'t care about collaborative culture". Confounding assumption: Equating verbal extroversion with collaborative intent. Jordan may provide thoughtful asynchronous documentation or prefer structured agendas.'
  },
  {
    id: 'think-3',
    category: 'evidence_arguments',
    categoryTitle: 'Evidence Evaluation & Argument Construction',
    title: 'Building a Falsifiable Hypothesis',
    difficulty: 'Intermediate',
    premise: 'You suspect that daily 30-minute status standups are reducing your team’s deep work time and increasing context switching costs.',
    promptQuestion: 'Construct a formal argument for modifying the standup format. Formulate: (1) Main claim, (2) Direct measurable evidence to collect, (3) Counter-arguments to address, (4) Falsification condition.',
    keyRubricCriteria: [
      'Clear, precise claim without emotional hyperbole',
      'Measurable evidence proposed (calendar fragmentation, commit times, survey)',
      'Anticipates stakeholder objections (loss of visibility, coordination drift)',
      'Defines explicit condition under which the hypothesis would be proven false'
    ],
    sampleHonestResponse: 'Claim: Moving 3 of 5 weekly standups to asynchronous Slack check-ins will increase uninterrupted focus time without increasing blocker resolution latency. Evidence to collect: 2-week baseline of self-reported focus blocks vs. ticket blocked time. Falsification condition: If average blocker duration increases by more than 20% over 4 weeks, we will revert to synchronous daily standups.'
  },
  {
    id: 'think-4',
    category: 'cognitive_biases',
    categoryTitle: 'Cognitive Biases & Alternative Explanations',
    title: 'Stress-Testing Sunk Cost & Confirmation Bias',
    difficulty: 'Intermediate',
    premise: 'Premise: "We have already spent 4 months and $40,000 building custom in-house billing software. Even though a verified third-party SaaS tool launched that does everything for $50/month, we must finish our custom tool so that investment isn’t wasted."',
    promptQuestion: 'Explain the psychological traps operating here. What would a rational forward-looking decision framework look like for this leadership team?',
    keyRubricCriteria: [
      'Explicitly identifies the Sunk Cost Fallacy',
      'Highlights ongoing maintenance overhead as future costs',
      'Constructs a zero-base decision model focusing solely on future returns'
    ],
    sampleHonestResponse: 'This is a textbook Sunk Cost Fallacy. The $40k and 4 months are gone and irrecoverable whether they continue or stop. The only rational inquiry is: "Going forward from today, will completing and maintaining this custom tool yield a higher return on team bandwidth than paying $50/mo and reassigning engineers to our core differentiator?"'
  },
  {
    id: 'think-5',
    category: 'first_principles',
    categoryTitle: 'First-Principles & Systems Thinking',
    title: 'Deconstructing Meeting Overload',
    difficulty: 'Advanced',
    premise: 'Your company suffers from calendar overload. The executive team proposed adding a "No-Meeting Friday" policy, but within two months, Mondays and Thursdays became completely jammed and burnout remained unchanged.',
    promptQuestion: 'Using systems thinking, analyze why the No-Meeting Friday policy created an unintended secondary feedback loop. Propose a first-principles intervention.',
    keyRubricCriteria: [
      'Identifies the symptom-treating nature of scheduling bans (waterbed effect)',
      'Analyzes why the underlying communication demand was not reduced',
      'Proposes first-principles changes to communication requirements (e.g. written proposals, async approval thresholds)'
    ],
    sampleHonestResponse: 'The policy treated the symptom (meeting density on Friday) rather than the generative cause (the default culture of using synchronous conversation to discover what to do). Banning Friday meetings simply shifted the identical conversation volume onto surrounding days. A first-principles solution changes the mechanism of decision-making: require a 1-page written memo before any meeting can be scheduled, resolving 60% of issues asynchronously.'
  },
  {
    id: 'think-6',
    category: 'lateral_creativity',
    categoryTitle: 'Creativity & Lateral Thinking',
    title: 'Inversion Thinking (How to Guarantee Failure)',
    difficulty: 'Intermediate',
    premise: 'You want to establish a reliable, confident habit of speaking up in team discussions as an introvert.',
    promptQuestion: 'Use Charlie Munger’s Inversion Principle: What are the 5 most reliable ways to guarantee you stay completely silent, anxious, and miserable in meetings? How does inverting these illuminate your actual strategy?',
    keyRubricCriteria: [
      'Lists 5 concrete, actionable ways to guarantee failure',
      'Explicitly inverts each failure mode into a protective positive practice',
      'Demonstrates humor and intellectual honesty'
    ],
    sampleHonestResponse: 'To guarantee failure: 1) Enter meetings without reading the agenda beforehand. 2) Expect my first comment to be world-changing perfection. 3) Wait until the final 5 minutes when energy is highest. 4) Tell myself everyone is scrutinizing my tone. 5) Beat myself up for 3 days afterwards. Inversion: Read agenda 10 mins early, prepare one simple clarifying question, speak within the first 10 minutes, and focus on the problem rather than self-image.'
  },
  {
    id: 'think-7',
    category: 'problem_solving',
    categoryTitle: 'Problem-Solving & Decision-Making',
    title: 'Two-Way vs. One-Way Doors (Reversible Decisions)',
    difficulty: 'Foundational',
    premise: 'A team has been debating for three weeks whether to use Tailwind CSS or CSS Modules for a temporary internal admin dashboard with 4 internal users.',
    promptQuestion: 'Apply the Type 1 (One-Way Door / Irreversible) vs. Type 2 (Two-Way Door / Reversible) framework to evaluate this debate. How should the team proceed?',
    keyRubricCriteria: [
      'Correctly classifies the decision as Type 2 (low-consequence, easily reversible)',
      'Quantifies the hidden cost of the 3-week delay vs the cost of switching later',
      'Proposes a biased-for-action resolution'
    ],
    sampleHonestResponse: 'This is a Type 2 reversible door for an internal tool with 4 users. Three weeks of senior engineering debate cost far more than the total cost of rewriting the dashboard later. The team should pick whichever tool the primary author is fastest with right now and move forward immediately.'
  },
  {
    id: 'think-8',
    category: 'probabilistic_reasoning',
    categoryTitle: 'Probabilistic Reasoning & Uncertainty',
    title: 'Expected Value and Risk Asymmetry',
    difficulty: 'Advanced',
    premise: 'You are invited to present your technical proposal at an industry conference. You feel 80% confident in the technical content, but worry about experiencing nervous pauses or stuttering during the Q&A.',
    promptQuestion: 'Analyze this decision using Expected Value and Asymmetric Upside/Downside instead of fear-based avoidance.',
    keyRubricCriteria: [
      'Contrasts the temporary, bounded downside with the compounding upside',
      'Recognizes that worst-case fear (awkward pause) is non-fatal',
      'Formulates a probabilistic expected-growth outcome'
    ],
    sampleHonestResponse: 'The downside is emotional discomfort and a temporary awkward moment (bounded, non-fatal, forgotten in 48 hours). The upside is professional credibility, peer network expansion, and accelerated desensitization to public speaking (compounding, durable). This is an asymmetric bet: finite downside with unbounded upside. The rational decision is to accept.'
  },
  {
    id: 'think-9',
    category: 'perspective_taking',
    categoryTitle: 'Perspective-Taking & Respectful Disagreement',
    title: 'Steel-manning an Opponent’s Argument',
    difficulty: 'Intermediate',
    premise: 'A senior executive wants to mandate a strict 5-day-a-week in-office return policy. You strongly prefer hybrid/remote work.',
    promptQuestion: 'Steel-man the executive’s position: Formulate the strongest, most compelling, and most generous version of their argument without using mockery or cynicism.',
    keyRubricCriteria: [
      'Presents the opponent’s view so strongly that the opponent would agree with the wording',
      'Identifies genuine organizational challenges (onboarding junior hires, spontaneous cross-silo trust, cultural cohesion)',
      'Demonstrates emotional maturity and intellectual empathy'
    ],
    sampleHonestResponse: 'The executive’s strongest case: Fully distributed work works well for established contributors executing known tasks, but degrades tacit knowledge transfer for new graduates, weakens cross-departmental serendipity, and increases feelings of isolation. Having people physically present builds trust reserves and informal empathy that cannot be easily replicated over scheduled Zoom calls.'
  },
  {
    id: 'think-10',
    category: 'metacognition',
    categoryTitle: 'Metacognition & Self-Reflection',
    title: 'Auditing Defensive Reactivity',
    difficulty: 'Foundational',
    premise: 'In a code review, an architect writes: "Why didn’t you use the standard repository pattern here? This implementation will cause duplicate queries."',
    promptQuestion: 'Notice the immediate somatic and mental reactions this comment might provoke. Distinguish the threat to your ego from the objective technical inquiry.',
    keyRubricCriteria: [
      'Identifies the visceral urge to defend competence or blame time pressure',
      'Separates the reviewer’s blunt phrasing from the verifiable technical assertion',
      'Drafts a non-defensive, high-agency response'
    ],
    sampleHonestResponse: 'Immediate somatic reaction: Tightness in chest, cognitive narrative of "They think I\'m incompetent". Metacognitive audit: The ego is reacting to the blunt phrasing ("Why didn\'t you"), but the technical question is valid: will it duplicate queries? High-agency response: "Good catch on the duplicate query risk. I prioritized shipping the baseline first, but let’s look at adapting the repo pattern here. Do you have 5 minutes to look at this junction?"'
  }
];

// ==========================================
// Phase 6: Introvert Practice Programme Curriculum
// ==========================================

export const INTROVERT_STAGES: IntrovertStage[] = [
  {
    id: 1,
    title: 'Stage 1: Private Speaking Practice',
    tagline: 'Vocal ease without audience pressure',
    description: 'Build basic comfort speaking aloud into a safe, completely private environment. Eliminate the physiological freeze response by recording low-stakes, 60-second thoughts.',
    learningGoals: [
      'Overcome initial discomfort with hearing your recorded voice',
      'Sustain continuous speaking for 60 seconds without aborting',
      'Notice personal vocal cadence and natural breathing rhythm'
    ],
    recommendedDrillsCount: 5,
    unlocked: true
  },
  {
    id: 2,
    title: 'Stage 2: Clear & Structured Answers',
    tagline: 'Executive framing with the PREP framework',
    description: 'Transform internal, circular thoughts into crisp, linear explanations. Master the PREP (Point, Reason, Example, Point) framework to answer any question cleanly.',
    learningGoals: [
      'State your main point within the first 10 seconds',
      'Anchor conceptual ideas with at least one concrete real-world example',
      'Reduce filler words to under 3 per 100 words using the silent breath pause'
    ],
    recommendedDrillsCount: 6,
    unlocked: true
  },
  {
    id: 3,
    title: 'Stage 3: AI Conversation Role-Play',
    tagline: 'Interactive dialogue & thoughtful response timing',
    description: 'Simulate conversational back-and-forth without human anxiety. Practice listening actively, holding your ground, and taking a 2-second pause before replying.',
    learningGoals: [
      'Tolerate conversational silence without rushing to fill it',
      'Respond to unexpected follow-up questions calmly',
      'Maintain steady volume and pace during mild disagreements'
    ],
    recommendedDrillsCount: 6,
    unlocked: false
  },
  {
    id: 4,
    title: 'Stage 4: Group & Interview Simulations',
    tagline: 'Handling high-stakes Q&A and multi-stakeholder syncs',
    description: 'Simulate structured job interviews, technical defenses, and multi-peer discussions. Practice executive summaries, conciseness, and assertive boundary setting.',
    learningGoals: [
      'Deliver 90-second STAR interview responses',
      'Pitch proposals with upfront trade-offs and clear asks',
      'Disagree constructively using objective camera facts'
    ],
    recommendedDrillsCount: 7,
    unlocked: false
  },
  {
    id: 5,
    title: 'Stage 5: Real-World Practice Challenges',
    tagline: 'Transferring studio confidence to everyday conversations',
    description: 'Take your studio-tested skills into daily life through micro-challenges: speaking first in a team sync, asking a clarifying question, or voicing a boundary.',
    learningGoals: [
      'Speak within the first 10 minutes of a live meeting',
      'Ask one clarifying question before accepting a complex request',
      'Reflect on real-world interactions without self-flagellation'
    ],
    recommendedDrillsCount: 8,
    unlocked: false
  }
];
