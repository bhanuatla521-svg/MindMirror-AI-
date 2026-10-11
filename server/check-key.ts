import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY || '';

async function testGeneration() {
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  console.log('Testing generateContent with', model);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with exactly: OK_SUCCESS' }] }]
      })
    });
    console.log('Status code:', res.status, res.statusText);
    const data: any = await res.json();
    console.log('Candidate text:', data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (err: any) {
    console.error('Fetch error:', err.message);
  }
}

testGeneration();
