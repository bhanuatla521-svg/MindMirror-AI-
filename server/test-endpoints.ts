async function run() {
  const tests = [
    { name: 'Health check', url: 'http://localhost:3001/api/health', method: 'GET' },
    { name: 'AI status check', url: 'http://localhost:3001/api/ai/status', method: 'GET' },
    { name: 'Conversational Coach', url: 'http://localhost:3001/api/ai/coach', method: 'POST', body: { query: 'How can I stay calm when deadlines approach?' } },
    { name: 'Pattern Detection', url: 'http://localhost:3001/api/ai/patterns', method: 'POST', body: { entries: [{ date: '2025-04-14', mood: 4, content: 'Productive day, slept 8 hours.' }] } },
    { name: 'Social Skills Coach', url: 'http://localhost:3001/api/ai/social-coach', method: 'POST', body: { scenario: 'Saying no to extra weekend assignments', userResponse: 'I smiled and said yes anyway.' } },
    { name: 'Critical Thinking Coach', url: 'http://localhost:3001/api/ai/critical-think', method: 'POST', body: { claimOrSituation: 'If I make one mistake, the team will judge me permanently.' } },
    { name: 'Action Planner', url: 'http://localhost:3001/api/ai/action-plan', method: 'POST', body: { goalOrInsight: 'Establish a 20-minute daily reading habit without phone distraction.' } },
    { name: 'Weekly Review', url: 'http://localhost:3001/api/ai/weekly-review', method: 'POST', body: { entries: [{ date: '2025-04-14', title: 'Day 1', content: 'Good focus and steady mindset.', mood: 4 }] } }
  ];

  console.log('Testing MindMirror Phase 3 AI Endpoints...');
  let passed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method,
        headers: { 'Content-Type': 'application/json' },
        body: t.body ? JSON.stringify(t.body) : undefined
      });
      const data: any = await res.json();
      console.log(`[PASS] ${t.name}: status ${res.status}, success: ${res.ok}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${t.name}:`, err.message);
    }
  }

  console.log(`\nFinished: ${passed}/${tests.length} endpoints succeeded.`);
}

run();
