import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return new Response(JSON.stringify({ reply: 'No prompt provided' }), { status: 400 });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content || 'No reply';
    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (err) {
    console.error('API error', err);
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
  }
}