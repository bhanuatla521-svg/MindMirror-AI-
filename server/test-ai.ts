import dotenv from 'dotenv';
dotenv.config();

import { aiProviderManager } from './ai/provider-manager';
import { budgetTracker } from './ai/budget-tracker';
import { dedupLock } from './ai/dedup-lock';
import { AIDailyReviewSchema } from './ai/types';

async function runTests() {
  console.log('--- MindMirror AI Infrastructure Test Suite ---');

  // Test 1: Configuration check
  console.log('\n[Test 1] Inspecting AI Provider Configuration...');
  const config = aiProviderManager.getConfiguration();
  console.log('Primary provider:', config.primaryProvider);
  console.log('Fallback chain:', config.fallbackChain.join(' -> '));
  console.log('Gemini key configured:', config.geminiKeyConfigured);
  console.log('Daily budget limit:', config.budget.dailyLimit);

  // Test 2: Deduplication Lock
  console.log('\n[Test 2] Testing Deduplication Lock...');
  const lockKey = 'test-entry-123';
  const acquiredFirst = dedupLock.acquire(lockKey);
  const acquiredSecond = dedupLock.acquire(lockKey);
  dedupLock.release(lockKey);
  const acquiredAfterRelease = dedupLock.acquire(lockKey);
  dedupLock.release(lockKey);

  if (acquiredFirst && !acquiredSecond && acquiredAfterRelease) {
    console.log('✓ Deduplication lock successfully prevents duplicate simultaneous runs.');
  } else {
    throw new Error('Deduplication lock failed.');
  }

  // Test 3: Budget Safeguards
  console.log('\n[Test 3] Testing Budget Enforcement...');
  const canProceed = budgetTracker.canProceed();
  console.log('Budget permission granted:', canProceed.allowed);
  budgetTracker.recordRequest(500, 120, false);
  const updatedStats = budgetTracker.getStats();
  console.log('Recorded requests today:', updatedStats.todayRequests);

  // Test 4: Live AI Analysis Run
  console.log('\n[Test 4] Executing Analysis on Sample Entry...');
  const sampleEntry = {
    id: 'test-run-1',
    date: '2026-10-10',
    title: 'Testing architectural pushback and focus',
    content: 'Felt initial apprehension when client requested a major timeline compression today. Took a 10-minute walk before responding, reviewed backlog metrics, and explained the risks calmly. Avoided defensive justification and focused on objective trade-offs.',
    mood: 4,
    energy: 7,
    stress: 4,
    sleepHours: 7.5,
    sleepQuality: 'Good',
    successes: 'Reframed urgency calmly using backlog metrics',
    difficulties: 'Subconscious urge to justify decisions defensively',
    lessons: 'A 2-second pause before replying clarifies priorities'
  };

  const startTime = Date.now();
  const result = await aiProviderManager.analyzeDiaryEntry(sampleEntry);
  const duration = Date.now() - startTime;

  console.log(`✓ Analysis completed in ${duration}ms using provider: [${result.provider}]`);
  console.log('Model used:', result.model);
  console.log('Day summary points:', result.review.daySummary.length);
  console.log('What went well:', result.review.whatWentWell[0]?.observation);
  console.log('Highest priority action:', result.review.actionPlan.highestPriority);
  console.log('Confidence evidence score:', result.review.confidenceAndEvidence.evidenceCoverageScore);

  // Test 5: Strict Schema Validation
  console.log('\n[Test 5] Validating Output Against Strict Zod Schema...');
  const validation = AIDailyReviewSchema.safeParse(result.review);
  if (validation.success) {
    console.log('✓ Schema validation passed with 100% strict compliance.');
  } else {
    console.error('Schema validation error:', validation.error);
    throw new Error('Schema validation failed.');
  }

  console.log('\n=========================================');
  console.log('ALL AI & INFRASTRUCTURE TESTS PASSED ✓');
  console.log('=========================================');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
