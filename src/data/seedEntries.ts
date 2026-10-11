import { DiaryEntry, AIDailyReview, Goal, Habit, TrackedAction, WeeklyReport } from '../types';

export const SEED_ENTRIES: DiaryEntry[] = [
  {
    id: "entry-1",
    date: "2026-10-09",
    dayOfWeek: "Friday",
    title: "Navigating production deadline pushback & evening clarity",
    content: `Today began under considerable pressure. During our 9:30 AM standup, product requested moving up the production release by three days. Felt a surge of apprehension rather than anger when the sprint timeline changed unexpectedly. My immediate instinct was to say yes to avoid being difficult, but I stopped myself, reviewed our team backlog metrics, and laid out the factual risk trade-offs calmly.

Later, I noticed my default reaction is to over-explain when I feel questioned on architecture. During a technical sync with David, I spent ten minutes justifying why we chose Redis over SQLite before realizing he simply had a quick syntax question. I caught myself and checked in with him directly. Took a 10-minute walk before answering Sarah's critical email instead of firing back immediately. Sent a 3-bullet summary after the call to align on ownership and delivery timestamps.

Finished the day by wrapping up the critical auth migration ticket. Acknowledged in standup that I misestimated the migration ticket, rather than blaming vague specs. Logged off at 7:00 PM, cooked a simple dinner, and read 20 pages of Seneca.`,
    wordCount: 184,
    mood: 4,
    energy: 7,
    stress: 5,
    sleepHours: 7.5,
    sleepQuality: "Good",
    socialInteractions: "Standup sync, technical debate with David, feedback email with Sarah.",
    events: "Sprint timeline negotiation, auth migration code review.",
    successes: "Stood firm on realistic release timeline with objective data; de-escalated reactive email urge with a 10-minute walk.",
    difficulties: "Over-explained architecture when feeling defensive; misestimated migration ticket by half a day.",
    lessons: "When challenged, slow down and ask 'What specific question are you trying to answer?' before launching into a defense.",
    gratitude: "Grateful for teammates who value honest pushback and for calm autumn weather on my walk.",
    prioritiesTomorrow: "Complete morning 5k run, read non-work literature, deep sleep.",
    tags: ["Work", "Communication", "Boundaries", "Mindfulness"],
    isAnalyzed: true,
    aiReviewId: "review-1",
    createdAt: "2026-10-09T20:30:00Z",
    updatedAt: "2026-10-09T20:30:00Z"
  },
  {
    id: "entry-2",
    date: "2026-10-08",
    dayOfWeek: "Thursday",
    title: "Rejection from design review & sustaining deep focus",
    content: `Woke up feeling rested after 7.5 hours of sleep. The morning started with client feedback on our redesign draft. Client rejected draft 1. Reframed as clear data on what they don't want, scheduled sync for Friday. A few months ago this would have derailed my entire afternoon with self-doubt.

Between 10 AM and 1 PM, locked in for uninterrupted deep work. Decomposed the onboarding stall into 3 distinct bottlenecks and addressed the highest friction one. Noticed impulse to check social feeds 4 times during refactoring; kept phone in drawer which stopped the habit loop cold.

In the afternoon, reviewed code from Alex. His PR comments were very brief, and I initially felt slight annoyance, but realized Alex is onboarding two juniors right now, which is why his pull request reviews were brief. Logged off at 7:30 PM despite wanting to push through the bug; slept 7.5 hours. Took a 20-minute sunlight walk at noon.`,
    wordCount: 168,
    mood: 4,
    energy: 8,
    stress: 4,
    sleepHours: 7.5,
    sleepQuality: "Restorative",
    socialInteractions: "Client design review call, PR feedback exchange with Alex.",
    events: "Design proposal revision, onboarding flow refactoring.",
    successes: "Reframed client critique constructively; protected 3 hours of continuous focus.",
    difficulties: "Frequent subconscious impulse to check smartphone during cognitively tough moments.",
    lessons: "Context-dependent empathy prevents unnecessary interpersonal friction.",
    gratitude: "Grateful for ergonomic desk setup and good natural light.",
    prioritiesTomorrow: "Standup timeline planning, wrap up auth token service.",
    tags: ["Productivity", "Resilience", "Deep Work"],
    isAnalyzed: true,
    aiReviewId: "review-2",
    createdAt: "2026-10-08T21:00:00Z",
    updatedAt: "2026-10-08T21:00:00Z"
  },
  {
    id: "entry-3",
    date: "2026-10-07",
    dayOfWeek: "Wednesday",
    title: "Energy dip, physical cues & evening discipline",
    content: `A slightly scattered Wednesday. Skipped breakfast to rush into an 8:30 AM client call, which turned out to be a tactical mistake. Recognized that my irritability around 4 PM was driven by dehydration and hunger rather than the code itself. Once I had an apple and two glasses of water, my frustration with the database indexing dissipated.

Missed the morning workout. Instead of calling myself undisciplined, I scheduled a 30-min evening jog. Weighed Redis vs memory cache: picked Redis for multi-instance scaling despite 2 hours extra setup. Didn't feel like journaling tonight, but sat down and wrote 3 honest paragraphs anyway. Evening reflection habit is now anchored directly to making chamomile tea at 9 PM. Balanced 6 hours of solid engineering with cooking fresh food and reading philosophy for 45 mins.`,
    wordCount: 146,
    mood: 3,
    energy: 5,
    stress: 6,
    sleepHours: 6.5,
    sleepQuality: "Fair",
    socialInteractions: "Early client call, quick Slack sync with team lead.",
    events: "Cache architecture evaluation, missed morning gym routine.",
    successes: "Caught physiological trigger of irritability; maintained evening journaling streak despite low motivation.",
    difficulties: "Skipped breakfast causing severe afternoon energy drop.",
    lessons: "Biological needs (glucose, water) must not be sacrificed for calendar convenience.",
    gratitude: "Grateful for the evening jog that cleared head tension.",
    prioritiesTomorrow: "Prepare client redesign alternative, protect morning focus block.",
    tags: ["Health", "Self-Compassion", "Habits"],
    isAnalyzed: true,
    aiReviewId: "review-3",
    createdAt: "2026-10-07T21:45:00Z",
    updatedAt: "2026-10-07T21:45:00Z"
  },
  {
    id: "entry-4",
    date: "2026-10-06",
    dayOfWeek: "Tuesday",
    title: "Social bravery at all-hands & setting firm weekend limits",
    content: `Good day overall. In our company-wide all-hands meeting, spoke up during the all-hands Q&A about deployment latency without rehearsing for 20 minutes first. My voice was slightly tight initially, but speaking spontaneously felt like a big milestone against perfectionism.

Time-blocked 9:00-11:30 AM for deep work on the auth service and closed Slack completely. Closed out 3 major PRs before noon by front-loading cognitively demanding work. Sketched 4 completely different UX workflows before choosing the simplest tabbed variant.

Later in the day, a colleague asked if I could join an optional Saturday hackathon. Declined the weekend workshop invite politely: 'I need this weekend for recovery, but thank you.' Felt zero residual guilt.`,
    wordCount: 132,
    mood: 5,
    energy: 8,
    stress: 3,
    sleepHours: 8.0,
    sleepQuality: "Restorative",
    socialInteractions: "All-hands Q&A participation, declined weekend workshop invite.",
    events: "Company townhall, auth PR merges.",
    successes: "Spoke publicly without over-rehearsing; cleanly protected weekend personal recovery.",
    difficulties: "Initial physiological spike before unmuting mic.",
    lessons: "Courage is taking action alongside nervous arousal, not the total absence of it.",
    gratitude: "Grateful for honest rest days and supportive colleagues.",
    prioritiesTomorrow: "Architecture cache benchmarking, maintain hydration.",
    tags: ["Courage", "Boundaries", "Deep Work"],
    isAnalyzed: true,
    aiReviewId: "review-4",
    createdAt: "2026-10-06T20:15:00Z",
    updatedAt: "2026-10-06T20:15:00Z"
  },
  {
    id: "entry-5",
    date: "2026-10-05",
    dayOfWeek: "Monday",
    title: "Monday reset, cognitive flexibility with team & family time",
    content: `Started the week with intention. During morning review, reversed my initial opposition to the schema rewrite after Maria demonstrated benchmark gains. Admitting her proposal was superior was surprisingly liberating. Narrowed Q4 goal from 'improve fitness' to 'complete three 5km runs per week under 28 min'.

Said no to an impromptu 6 PM sync because it conflicted with family dinner. Spent evening helping my younger sibling with math instead of scrolling work analytics. Felt grounded and aligned with what genuinely matters.`,
    wordCount: 92,
    mood: 4,
    energy: 7,
    stress: 4,
    sleepHours: 7.2,
    sleepQuality: "Good",
    socialInteractions: "Schema debate with Maria, family dinner, tutoring sibling.",
    events: "Sprint planning kickoff, schema agreement.",
    successes: "Pivoted architectural stance immediately upon seeing benchmark data; protected family dinner.",
    difficulties: "Felt a quick sting of ego when Maria proved her schema was faster.",
    lessons: "Winning the argument is useless if the system performs worse.",
    gratitude: "Grateful for curious colleagues who challenge my assumptions respectfully.",
    prioritiesTomorrow: "Focus on auth token microservice, speak up in townhall.",
    tags: ["Cognitive Flexibility", "Values", "Family"],
    isAnalyzed: true,
    aiReviewId: "review-5",
    createdAt: "2026-10-05T21:10:00Z",
    updatedAt: "2026-10-05T21:10:00Z"
  }
];

export const SEED_REVIEWS: Record<string, AIDailyReview> = {
  "review-1": {
    id: "review-1",
    entryId: "entry-1",
    date: "2026-10-09",
    createdAt: "2026-10-09T20:35:00Z",
    daySummary: [
      "Negotiated an abrupt sprint timeline acceleration using factual risk trade-offs rather than reactive compliance.",
      "Identified and mitigated an over-explaining habit when questioned by David on architectural decisions.",
      "Interrupted emotional reactivity by taking a 10-minute walk before responding to critical feedback.",
      "Concluded the workday with clear written alignment (3-bullet recap) and healthy evening decompression."
    ],
    whatWentWell: [
      {
        observation: "Objective negotiation under deadline pressure",
        strength: "Assertiveness & Evidence-Based Boundary Setting",
        whyHelpful: "By relying on backlog metrics rather than emotional refusal, you preserved stakeholder trust while protecting team bandwidth.",
        quote: "reviewed our team backlog metrics, and laid out the factual risk trade-offs calmly."
      },
      {
        observation: "Physiological pause prior to asynchronous reply",
        strength: "Emotional Regulation",
        whyHelpful: "Creating a physical buffer prevented impulsive escalation in a high-stakes professional relationship.",
        quote: "Took a 10-minute walk before answering Sarah's critical email instead of firing back immediately."
      }
    ],
    mistakesAndImprovements: [
      {
        whatHappened: "Over-explained architecture when questioned by David, spending 10 minutes on defensive justification.",
        whyIneffective: "Assumed the inquiry was an attack on credibility rather than a simple operational question.",
        likelyConsequence: "Depletes cognitive bandwidth, risks confusing the listener, and signals underlying insecurity.",
        alternative: "Answer in one sentence, then pause and ask: 'Does that answer what you needed, or would you like deeper context?'",
        practiceMethod: "The 'Pause-and-Clarify' drill: wait 2 seconds after any technical question before speaking.",
        quote: "spent ten minutes justifying why we chose Redis over SQLite before realizing he simply had a quick syntax question."
      }
    ],
    emotionalReflection: {
      emotionsReported: ["Apprehension", "Defensiveness", "Relief", "Calm"],
      patternObservations: [
        "Defensive behavior surfaced directly in response to perceived evaluation of your technical competence.",
        "Physical movement (10-minute walk) reliably down-regulates sympathetic nervous system activation."
      ],
      triggerHypothesis: "Perceived questioning of competence triggers rapid justification scripts to preempt criticism.",
      alternativeResponse: "Notice somatic tightening in the chest, name it internally ('I feel evaluated'), and ask a clarifying question.",
      quote: "Felt a surge of apprehension rather than anger when the sprint timeline changed unexpectedly."
    },
    thinkingAnalysis: {
      cognitiveBiasesNoticed: [
        "Mind Reading: Assumed David was questioning your architectural judgment rather than asking a syntax question.",
        "Catastrophizing: Initial impulse to say yes to deadline acceleration to avoid being labeled 'difficult'."
      ],
      untestedAssumptions: [
        "Belief that setting realistic boundaries will damage relationships with product management."
      ],
      alternativePerspectives: [
        "David was likely pressed for time and needed a quick syntax reference without evaluation intent.",
        "Product managers often ask for earlier dates as an exploratory probe, not an unchangeable mandate."
      ],
      evidenceStrength: "Directly supported by user's self-observation of the conversation outcome.",
      quote: "realizing he simply had a quick syntax question."
    },
    socialInteractionReview: {
      clarity: "High clarity in follow-up written communication; 3-bullet recap effectively eliminated ambiguity.",
      activeListening: "Moderate initially with David due to internal defensive script, but self-corrected into listening.",
      empathy: "Recognized stakeholder constraints while upholding realistic delivery thresholds.",
      boundaryRespect: "Respected own bandwidth by logging off at 7:00 PM and saying no to unrealistic deadline.",
      perspectiveTaking: "Demonstrated growth in recognizing why product wanted accelerated timelines.",
      quote: "Sent a 3-bullet summary after the call to align on ownership and delivery timestamps."
    },
    actionPlan: {
      highestPriority: "Practice single-sentence responses followed by clarification checks during tomorrow's technical reviews.",
      threeActionsTomorrow: [
        "Complete morning 5k recovery run without audio distractions to maintain mental clarity.",
        "Log at least 30 minutes of uninterrupted reading before opening digital devices.",
        "Review upcoming week's calendar and block two 90-minute focus buffers."
      ],
      smallHabitToPractice: "Count to two silently before answering questions that trigger defensive feelings.",
      reflectionQuestion: "What evidence actually exists that others think less of me when I state simple facts?",
      behaviorToContinue: "Decompressing with physical walks when receiving critical asynchronous messages.",
      behaviorToReduce: "Over-explaining technical rationales before being asked for elaboration.",
      measurementMetric: "Number of times you ask 'Does that address your question?' before offering more details."
    },
    confidenceAndEvidence: {
      directlyStatedFacts: [
        "Product requested moving the sprint timeline up by 3 days.",
        "User spent 10 minutes justifying Redis before realizing David had a syntax question.",
        "User took a 10-minute walk before responding to Sarah.",
        "User logged off at 7:00 PM."
      ],
      reasonableInterpretations: [
        "Over-explaining is an automatic coping strategy for anxiety around technical credibility.",
        "Walking acts as an effective behavioral disruptor for emotional reactivity."
      ],
      unknownOrUnclearInfo: [
        "Sarah's actual reaction to the delayed email response.",
        "The specific impact on team morale during the standup negotiation."
      ],
      evidenceCoverageScore: 88
    },
    userFeedback: {
      isHelpful: true,
      isAccurate: true,
      userNotes: "Spot on about David's question. I definitely felt my chest tighten thinking he doubted the architecture."
    }
  }
};

export const SEED_GOALS: Goal[] = [
  {
    id: "goal-1",
    title: "Master Non-Defensive Communication Under Pressure",
    reason: "To communicate with calm authority, prevent unnecessary friction, and foster open technical collaboration.",
    targetDate: "2026-11-15",
    status: "in_progress",
    smallNextAction: "Use the 2-second pause before answering questions in Monday's sprint demo.",
    relatedHabits: ["Daily evening reflection", "Somatic pause before reactive emails"],
    recentReflection: "Successfully caught over-explaining with David on Friday; made notable progress in recognizing defensive triggers.",
    obstacles: "Subconscious fear of appearing uninformed when junior or senior peers probe decisions.",
    lessonsLearned: "Asking 'What specific context helps you most?' is 10x more effective than a 10-minute lecture.",
    progressPercentage: 65
  },
  {
    id: "goal-2",
    title: "Sustain Consistent 7.5h Circadian Sleep Baseline",
    reason: "Sleep is the single highest-leverage biological prerequisite for emotional regulation and cognitive stamina.",
    targetDate: "2026-12-01",
    status: "in_progress",
    smallNextAction: "Screen shutdown at 9:30 PM followed by 20 minutes of fiction or philosophy.",
    relatedHabits: ["Chamomile tea evening habit", "No screens past 9:30 PM"],
    recentReflection: "Maintained 7.5h on 5 out of 7 days; directly correlated with lower irritability.",
    obstacles: "Late evening coding urge when experiencing high problem-solving momentum.",
    lessonsLearned: "Problems solved after 10 PM almost always introduce bugs that take 2 hours to fix the next morning.",
    progressPercentage: 80
  },
  {
    id: "goal-3",
    title: "Complete 3x Weekly 5km Aerobic Running",
    reason: "Cardiovascular resilience, stress hormone clearance, and physical vigor.",
    targetDate: "2026-11-30",
    status: "in_progress",
    smallNextAction: "Run 5km Saturday morning at 8:00 AM.",
    relatedHabits: ["Morning running routine"],
    recentReflection: "Logged 2 runs this week; need to protect Saturday morning slot.",
    obstacles: "Morning schedule compression when waking up late.",
    lessonsLearned: "Lay out running clothes the night before to eliminate morning friction.",
    progressPercentage: 60
  }
];

export const SEED_HABITS: Habit[] = [
  {
    id: "habit-1",
    name: "Evening Reflection & Journaling",
    frequency: "daily",
    targetDays: 7,
    currentStreak: 12,
    completedDates: ["2026-10-09", "2026-10-08", "2026-10-07", "2026-10-06", "2026-10-05", "2026-10-04", "2026-10-03"],
    connectedDimension: "Self-Awareness",
    obstacleNotes: "Late dinners make it easy to postpone, but chamomile tea ritual keeps it anchored."
  },
  {
    id: "habit-2",
    name: "90-Second Emotional Pause Before Difficult Emails",
    frequency: "daily",
    targetDays: 5,
    currentStreak: 5,
    completedDates: ["2026-10-09", "2026-10-08", "2026-10-07", "2026-10-06", "2026-10-05"],
    connectedDimension: "Emotional Regulation",
    obstacleNotes: "Urge to resolve uncertainty quickly makes pausing feel uncomfortable initially."
  },
  {
    id: "habit-3",
    name: "Morning Phone Isolation (Drawer until 9:00 AM)",
    frequency: "daily",
    targetDays: 7,
    currentStreak: 6,
    completedDates: ["2026-10-09", "2026-10-08", "2026-10-07", "2026-10-06", "2026-10-05", "2026-10-04"],
    connectedDimension: "Focus & Attention",
    obstacleNotes: "Checking notifications in bed ruins morning momentum."
  },
  {
    id: "habit-4",
    name: "Hydration & Midday 20-min Sunlight Walk",
    frequency: "daily",
    targetDays: 5,
    currentStreak: 4,
    completedDates: ["2026-10-09", "2026-10-08", "2026-10-06", "2026-10-05"],
    connectedDimension: "Physical Wellbeing Habits",
    obstacleNotes: "Back-to-back lunch meetings on Wednesday led to a skip."
  }
];

export const SEED_ACTIONS: TrackedAction[] = [
  {
    id: "action-1",
    sourceReviewId: "review-1",
    actionText: "Practice the 2-second pause before answering questions in technical reviews",
    targetDate: "2026-10-10",
    isCompleted: false,
    notes: "Applied during Friday wrap-up call; worked well with David."
  },
  {
    id: "action-2",
    sourceReviewId: "review-1",
    actionText: "Complete 5km recovery run Saturday morning",
    targetDate: "2026-10-10",
    isCompleted: true,
    completedAt: "2026-10-10T09:00:00Z",
    didHelpRating: "helped",
    notes: "Ran 5.2km at easy pace. Noticeable drop in resting tension."
  },
  {
    id: "action-3",
    sourceReviewId: "review-2",
    actionText: "Break Friday client sync into 3 concise alternative design proposals",
    targetDate: "2026-10-09",
    isCompleted: true,
    completedAt: "2026-10-09T14:00:00Z",
    didHelpRating: "helped",
    notes: "Client appreciated structured options instead of defending draft 1."
  }
];

export const SEED_WEEKLY_REPORT: WeeklyReport = {
  id: "week-2026-w41",
  weekStartDate: "2026-10-04",
  weekEndDate: "2026-10-10",
  summary: "A resilient and grounded week characterized by strong boundary preservation, evidence-based client navigation, and steady improvement in recognizing somatic triggers before responding to perceived criticism.",
  positiveExperiences: [
    "Successfully turned down an unreasonable sprint compression with data rather than conflict.",
    "Reframed client rejection of draft 1 without self-doubt spiral.",
    "Spoke spontaneously in company townhall without 20 minutes of anticipatory rehearsing.",
    "Preserved weekend recovery and family presence without guilt."
  ],
  repeatedChallenges: [
    "Defaulting to defensive over-explaining when feeling evaluated in technical conversations.",
    "Afternoon energy dips when skipping morning meals or hydration.",
    "Subconscious pull toward digital distraction during difficult refactoring segments."
  ],
  emotionalPatterns: [
    "High correlation between physical recovery (7.5h sleep) and calm assertiveness in standups.",
    "Apprehension quickly converts into defensive verbosity if not intercepted by a deliberate pause."
  ],
  decisionPatterns: [
    "Excellent prioritization of long-term maintainability (Redis selection, schema refactor acceptance).",
    "Pragmatic decomposition of complex engineering problems into manageable sub-tasks."
  ],
  habitsHelpful: [
    "Chamomile tea anchor for evening journaling (12-day streak).",
    "Phone in drawer during morning focus blocks (eliminated 4 distraction loops)."
  ],
  habitsDifficult: [
    "Midday hydration consistency during compressed lunch transitions."
  ],
  threePrioritiesNextWeek: [
    "Apply the 'One-Sentence Answer' rule in technical meetings before offering elaboration.",
    "Protect morning hydration and a balanced breakfast before 9 AM meetings.",
    "Conduct weekly values audit comparing actual calendar hours against personal priorities."
  ],
  userCorrections: ""
};
