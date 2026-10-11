import { DiaryEntryPayload, ValidatedAIDailyReview, AIDailyReviewSchema } from './types';

export async function callGemini(
  entry: DiaryEntryPayload,
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 15000)
): Promise<{ review: ValidatedAIDailyReview; tokens: number }> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const prompt = `You are MindMirror AI, an objective, evidence-based psychological self-reflection analyst.
Analyze the following personal diary entry. You must strictly base all observations and quotes ONLY on the provided text. Never hallucinate, invent events, assume hidden motives, or offer clinical mental health diagnoses.

DIARY ENTRY METRICS:
Date: ${entry.date} (${entry.dayOfWeek || ''})
Mood self-rating: ${entry.mood || 3}/5
Energy self-rating: ${entry.energy || 7}/10
Stress self-rating: ${entry.stress || 4}/10
Sleep: ${entry.sleepHours || 7.5} hours (${entry.sleepQuality || 'Good'})
Title: ${entry.title || 'Untitled'}
Content:
"""${entry.content}"""
Events noted: "${entry.events || ''}"
Successes noted: "${entry.successes || ''}"
Difficulties noted: "${entry.difficulties || ''}"
Lessons noted: "${entry.lessons || ''}"
Social interactions: "${entry.socialInteractions || ''}"

Return ONLY a valid JSON object strictly matching this schema with no markdown wrapping:
{
  "daySummary": ["3 to 6 concise bullet sentences summarizing the day"],
  "whatWentWell": [
    {
      "observation": "Specific positive behavior demonstrated",
      "strength": "Recognized psychological strength (e.g. Assertiveness, Self-Efficacy)",
      "whyHelpful": "Explanation of why this behavior was constructive",
      "quote": "Exact short sentence quote from entry"
    }
  ],
  "mistakesAndImprovements": [
    {
      "whatHappened": "Objective friction point from user account",
      "whyIneffective": "Why it produced undesirable outcomes or strain",
      "likelyConsequence": "Observed vs potential consequence",
      "alternative": "Better constructive alternative",
      "practiceMethod": "Concrete micro-drill to practice",
      "quote": "Exact short sentence quote from entry"
    }
  ],
  "emotionalReflection": {
    "emotionsReported": ["Reported emotion labels"],
    "patternObservations": ["Observed affective patterns"],
    "triggerHypothesis": "Grounded hypothesis of what triggered the reaction",
    "alternativeResponse": "Adaptive regulation response",
    "quote": "Supporting quote"
  },
  "thinkingAnalysis": {
    "cognitiveBiasesNoticed": ["Biases examined e.g. Mind Reading, Catastrophizing"],
    "untestedAssumptions": ["Assumptions taken without empirical proof"],
    "alternativePerspectives": ["Plausible alternative explanations"],
    "evidenceStrength": "Evaluation of evidence rigor",
    "quote": "Supporting quote"
  },
  "socialInteractionReview": {
    "clarity": "Assessment of communication clarity",
    "activeListening": "Listening posture observation",
    "empathy": "Perspective-taking capacity",
    "boundaryRespect": "Boundary protection",
    "perspectiveTaking": "Recognition of counterparty constraints",
    "quote": "Supporting quote"
  },
  "actionPlan": {
    "highestPriority": "Single highest-leverage improvement",
    "threeActionsTomorrow": ["Action 1", "Action 2", "Action 3"],
    "smallHabitToPractice": "One micro-habit to cement",
    "reflectionQuestion": "One Socratic inquiry question",
    "behaviorToContinue": "Behavior to maintain",
    "behaviorToReduce": "Behavior to dial back",
    "measurementMetric": "Observable test of completion"
  },
  "confidenceAndEvidence": {
    "directlyStatedFacts": ["Direct facts directly present in entry"],
    "reasonableInterpretations": ["Interpretations grounded in facts"],
    "unknownOrUnclearInfo": ["Unobserved factors or context"],
    "evidenceCoverageScore": 85
  }
}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini API returned an empty response.');
    }

    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    const validated = AIDailyReviewSchema.parse(parsed);

    const tokens = (prompt.length + rawText.length) / 4;
    return { review: validated, tokens: Math.round(tokens) };
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

export async function callGeminiText(
  prompt: string,
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  asJson = false,
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 15000)
): Promise<{ text: string; tokens: number }> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          ...(asJson ? { responseMimeType: 'application/json' } : {})
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini API returned an empty response.');
    }

    const tokens = Math.round((prompt.length + rawText.length) / 4);
    return { text: rawText.trim(), tokens };
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

export async function callGeminiAudioTranscribe(
  audioBase64: string,
  mimeType = 'audio/webm',
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000)
): Promise<{ transcript: string }> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const cleanMime = mimeType.split(';')[0] || 'audio/webm';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Transcribe the spoken speech in this audio recording accurately and verbatim. Return ONLY the transcribed text with no preface, labels, or formatting. If filler words like um, uh, you know are spoken, include them verbatim." },
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Transcribe API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { transcript: rawText ? rawText.trim() : '' };
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}


