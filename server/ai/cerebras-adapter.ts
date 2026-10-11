import { DiaryEntryPayload, ValidatedAIDailyReview, AIDailyReviewSchema } from './types';

export async function callCerebras(
  entry: DiaryEntryPayload,
  apiKey = process.env.CEREBRAS_API_KEY,
  model = process.env.CEREBRAS_MODEL || 'llama3.1-8b',
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 15000)
): Promise<{ review: ValidatedAIDailyReview; tokens: number }> {
  if (!apiKey) {
    throw new Error('Cerebras API key is not configured.');
  }

  const prompt = `You are MindMirror AI, an objective, evidence-based psychological self-reflection analyst.
Analyze the following personal diary entry. Return strictly a JSON object with keys: daySummary, whatWentWell, mistakesAndImprovements, emotionalReflection, thinkingAnalysis, socialInteractionReview, actionPlan, confidenceAndEvidence.

DIARY ENTRY:
Date: ${entry.date}
Title: ${entry.title || ''}
Content: "${entry.content}"
Successes: "${entry.successes || ''}"
Difficulties: "${entry.difficulties || ''}"
Lessons: "${entry.lessons || ''}"`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Cerebras API error (${response.status}): ${await response.text()}`);
    }

    const data: any = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    const validated = AIDailyReviewSchema.parse(parsed);

    const tokens = data?.usage?.total_tokens || 1000;
    return { review: validated, tokens };
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}
