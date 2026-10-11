import { DiaryEntry, AIDailyReview, PersonalDimension, Goal, ChatMessage } from '../types';

export function generateCoachResponse(
  userQuery: string,
  entries: DiaryEntry[],
  reviews: Record<string, AIDailyReview>,
  dimensions: PersonalDimension[],
  goals: Goal[]
): { text: string; referencedDates: string[]; suggestedAction?: string } {
  const queryLower = userQuery.toLowerCase();
  const referencedDates: string[] = [];

  // Check safety first
  if (/suicide|kill myself|harm myself|end it all|can't go on/i.test(queryLower)) {
    return {
      text: `I hear how much pain you are experiencing right now. Please know that you are not alone, and your safety is the absolute highest priority.

MindMirror is an introspective journaling tool, not a clinical crisis service. Please reach out right now to compassionate human support:
- In the US: Call or text **988** (Suicide & Crisis Lifeline, 24/7, free & confidential)
- In the UK: Call **111** or **116 123** (Samaritans)
- In Canada: Call or text **988**
- International: Find your local crisis line at [findahelpline.com](https://findahelpline.com)

Please step away from this screen and connect with a trusted friend, family member, or healthcare professional right now.`,
      referencedDates: []
    };
  }

  // Question 1: Patterns / repeat behaviors
  if (queryLower.includes('repeat') || queryLower.includes('pattern') || queryLower.includes('last 30')) {
    const recentDefensive = entries.filter(e => /defensive|over-explain|justif|reaction/i.test(e.content));
    recentDefensive.forEach(e => referencedDates.push(e.date));

    return {
      text: `Looking across your recent entries, an interesting behavioral pattern appears around **perceived evaluation of your competence**.

For example, on **${entries[0]?.date || 'recent days'}**, you noticed spending ten minutes over-explaining a technical architectural choice when asked a simple syntax question.

Here is what the evidence suggests:
1. **The Antecedent:** A colleague or stakeholder asks a question or proposes a timeline change.
2. **The Internal Thought:** A quick automatic inference: *"They think I don't know what I'm doing"* or *"If I don't defend this thoroughly, I will look incompetent."*
3. **The Habitual Response:** Accelerated speech, detailed justifications, or an urge to say yes immediately to avoid being difficult.
4. **The Helpful Counter-behavior You Discovered:** Taking a physical 10-minute walk or a 2-second pause before answering, which down-regulates that urgency.

**A reflective question for you:**
When you feel that familiar tightening urge to over-explain, what is the *worst-case assumption* your mind is trying to prevent from coming true?`,
      referencedDates,
      suggestedAction: "Notice physical tension in your chest before technical syncs tomorrow"
    };
  }

  // Question 2: What could I have done differently today?
  if (queryLower.includes('differently') || queryLower.includes('could have done') || queryLower.includes('today')) {
    const latest = entries[0];
    if (latest) referencedDates.push(latest.date);

    return {
      text: `Looking at your entry from **${latest ? latest.date : 'today'}**, the overall handling of challenges was grounded, but there is one high-leverage alternative:

Instead of offering the full backstory when asked a clarifying question, you could test the **"Single-Sentence Rule"**:
- Give your direct answer in one sentence.
- Stop speaking and ask: *"Does that answer the specific question you had, or would you like me to walk through the trade-offs?"*

This transfers the control to the listener, saves your cognitive energy, and projects deep composure.

**What do you think might happen if you tested that in your next conversation?**`,
      referencedDates,
      suggestedAction: "Apply the Single-Sentence Rule in your first meeting tomorrow"
    };
  }

  // Question 3: Communication & Social confidence
  if (queryLower.includes('communicat') || queryLower.includes('social') || queryLower.includes('confident')) {
    const commDim = dimensions.find(d => d.name.includes('Communication')) || dimensions[7];
    return {
      text: `In your diary records, your communication clarity is consistently rated at **${commDim?.currentScore || 76}/100** with strong supporting evidence (such as sending clean 3-bullet summaries following alignment calls).

Where friction tends to occur is not in your written communication, but in **real-time impromptu verbal exchanges** when you feel evaluated.

Notice this distinction:
- **Perfectionist assumption:** *"I must have the flawless, articulate answer ready instantly."*
- **Evidence-based reality:** High-trust leaders frequently say, *"That's a good question. Let me check the metrics and follow up in ten minutes."*

**Thoughtful follow-up for you:**
What would change if you gave yourself permission to pause for three full seconds of silence before answering unexpected questions?`,
      referencedDates: entries.slice(0, 2).map(e => e.date),
      suggestedAction: "Practice a 3-second deliberate pause before responding in tomorrow's standup"
    };
  }

  // Question 4: Assumptions & Evidence
  if (queryLower.includes('assumption') || queryLower.includes('evidence') || queryLower.includes('bias')) {
    return {
      text: `Let's examine how you test assumptions based on your diary records:

In technical systems (e.g., verifying server metrics before diagnosing connection pool issues), your critical thinking is exceptionally strong (**84/100**).

However, in **interpersonal dynamics**, there is an occasional tendency toward **Mind Reading**:
- Inferring that a colleague's brevity or critique implies disapproval of your character or intelligence.
- For example, when Alex gave brief PR reviews on Oct 8, you initially felt frustrated before recalling that he was onboarding two juniors.

**Reflection exercise:**
Whenever you infer someone else's motives, ask yourself:
*1. What did they objectively say or do (the camera footage)?*
*2. What story did I layer on top of that footage?*
*3. What are two alternative explanations that have nothing to do with me?*`,
      referencedDates: ["2026-10-08"],
      suggestedAction: "Run an 'Objective Fact vs. Inferred Story' audit on one friction point today"
    };
  }

  // Default thoughtful Socratic response
  return {
    text: `That is a worthwhile question to explore deeply. Based on your recent journal entries and active goals:

You have been demonstrating strong progress in **emotional awareness** and **setting boundaries with objective data**, while continuing to work on **curbing defensive justification under pressure**.

To help us ground this in your actual lived experience:
1. Is this question sparked by a specific interaction you experienced today or this week?
2. What feelings or bodily sensations arose when the situation occurred?
3. What would the most balanced, compassionate version of yourself advise you to do next?

Tell me what feels most pressing right now, and we can unpack the evidence together.`,
    referencedDates: entries.slice(0, 1).map(e => e.date)
  };
}
