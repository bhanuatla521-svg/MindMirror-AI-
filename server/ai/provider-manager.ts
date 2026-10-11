import { DiaryEntryPayload, AIAnalysisResult, AIProviderName } from './types';
import { callGemini, callGeminiText } from './gemini-adapter';
import { callGroq } from './groq-adapter';
import { callCerebras } from './cerebras-adapter';
import { callOllama } from './ollama-adapter';
import { callLocalHeuristics } from './local-heuristic-adapter';
import { budgetTracker } from './budget-tracker';
import { dedupLock } from './dedup-lock';

export class AIProviderManager {
  private primaryProvider: AIProviderName;
  private fallbackProviders: AIProviderName[];

  constructor() {
    this.primaryProvider = (process.env.PRIMARY_AI_PROVIDER as AIProviderName) || 'gemini';
    const fallbacks = (process.env.FALLBACK_AI_PROVIDERS || 'groq,cerebras,ollama,local_heuristic')
      .split(',')
      .map(p => p.trim() as AIProviderName);
    this.fallbackProviders = fallbacks;
  }

  public getConfiguration() {
    return {
      primaryProvider: this.primaryProvider,
      fallbackChain: this.fallbackProviders,
      budget: budgetTracker.getStats(),
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      groqKeyConfigured: Boolean(process.env.GROQ_API_KEY),
      cerebrasKeyConfigured: Boolean(process.env.CEREBRAS_API_KEY),
      ollamaConfigured: Boolean(process.env.OLLAMA_BASE_URL),
    };
  }

  public async analyzeDiaryEntry(entry: DiaryEntryPayload): Promise<AIAnalysisResult> {
    const lockKey = `analysis-${entry.id}`;
    if (!dedupLock.acquire(lockKey)) {
      throw new Error(`Analysis is already in progress for entry ${entry.id}. Please wait.`);
    }

    try {
      // 1. Check budget limits first
      const budgetCheck = budgetTracker.canProceed();
      if (!budgetCheck.allowed) {
        console.warn(`[AI Manager] Budget limit reached: ${budgetCheck.reason}. Falling back to zero-cost local heuristics.`);
        const startTime = Date.now();
        const { review } = callLocalHeuristics(entry);
        return {
          review,
          provider: 'local_heuristic',
          model: 'rule-engine-v1',
          latencyMs: Date.now() - startTime,
          estimatedTokens: 0
        };
      }

      // 2. Build full provider execution order: [primary, ...fallbacks]
      const executionOrder = Array.from(new Set([this.primaryProvider, ...this.fallbackProviders]));
      let lastError: Error | null = null;

      for (const provider of executionOrder) {
        const startTime = Date.now();
        try {
          console.log(`[AI Manager] Attempting analysis using provider: ${provider}...`);

          switch (provider) {
            case 'gemini': {
              const res = await callGemini(entry);
              const latency = Date.now() - startTime;
              budgetTracker.recordRequest(res.tokens, latency, false);
              return {
                review: res.review,
                provider: 'gemini',
                model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
                latencyMs: latency,
                estimatedTokens: res.tokens
              };
            }

            case 'groq': {
              if (!process.env.GROQ_API_KEY) throw new Error('Groq API key not configured.');
              const res = await callGroq(entry);
              const latency = Date.now() - startTime;
              budgetTracker.recordRequest(res.tokens, latency, false);
              return {
                review: res.review,
                provider: 'groq',
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                latencyMs: latency,
                estimatedTokens: res.tokens
              };
            }

            case 'cerebras': {
              if (!process.env.CEREBRAS_API_KEY) throw new Error('Cerebras API key not configured.');
              const res = await callCerebras(entry);
              const latency = Date.now() - startTime;
              budgetTracker.recordRequest(res.tokens, latency, false);
              return {
                review: res.review,
                provider: 'cerebras',
                model: process.env.CEREBRAS_MODEL || 'llama3.1-8b',
                latencyMs: latency,
                estimatedTokens: res.tokens
              };
            }

            case 'ollama': {
              const res = await callOllama(entry);
              const latency = Date.now() - startTime;
              budgetTracker.recordRequest(res.tokens, latency, false);
              return {
                review: res.review,
                provider: 'ollama',
                model: process.env.OLLAMA_MODEL || 'llama3.2',
                latencyMs: latency,
                estimatedTokens: res.tokens
              };
            }

            case 'local_heuristic': {
              const res = callLocalHeuristics(entry);
              const latency = Date.now() - startTime;
              return {
                review: res.review,
                provider: 'local_heuristic',
                model: 'rule-engine-v1',
                latencyMs: latency,
                estimatedTokens: 0
              };
            }
          }
        } catch (err: any) {
          console.warn(`[AI Manager] Provider ${provider} failed: ${err.message}. Trying next fallback...`);
          lastError = err;
          budgetTracker.recordRequest(0, Date.now() - startTime, true);
        }
      }

      // If all cloud providers fail, guarantee resolution via zero-cost local heuristic
      console.log('[AI Manager] Cloud providers exhausted. Using resilient local heuristic fallback.');
      const startFallback = Date.now();
      const fallbackResult = callLocalHeuristics(entry);
      return {
        review: fallbackResult.review,
        provider: 'local_heuristic',
        model: 'rule-engine-v1',
        latencyMs: Date.now() - startFallback,
        estimatedTokens: 0
      };
    } finally {
      dedupLock.release(lockKey);
    }
  }

  public async generateText(prompt: string, asJson = false): Promise<{ text: string; provider: string; tokens: number }> {
    try {
      if (process.env.GEMINI_API_KEY) {
        const res = await callGeminiText(prompt, process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL || 'gemini-3.8-flash', asJson);
        return { text: res.text, provider: 'gemini', tokens: res.tokens };
      }
    } catch (err: any) {
      console.warn(`[AI Manager] generateText Gemini failed: ${err.message}. Using heuristic fallback.`);
    }

    return {
      text: asJson ? JSON.stringify({ note: 'Analysis generated via rule engine heuristics.' }) : 'Here is an objective reflection based on your diary records.',
      provider: 'local_heuristic',
      tokens: 0
    };
  }
}

export const aiProviderManager = new AIProviderManager();
