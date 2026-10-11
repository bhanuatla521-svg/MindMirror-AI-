import { DiaryEntryPayload, ValidatedAIDailyReview, AIDailyReviewSchema } from './types';

export async function callOllama(
  entry: DiaryEntryPayload,
  baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model = process.env.OLLAMA_MODEL || 'llama3.2',
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 25000)
): Promise<{ review: ValidatedAIDailyReview; tokens: number }> {
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
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        format: 'json',
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Ollama local error (${response.status}): ${await response.text()}`);
    }

    const data: any = await response.json();
    const parsed = JSON.parse(data.response);
    const validated = AIDailyReviewSchema.parse(parsed);

    return { review: validated, tokens: data.eval_count || 800 };
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}
