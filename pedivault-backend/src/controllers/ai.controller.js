// src/controllers/ai.controller.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are PediVault's AI health assistant — a knowledgeable, empathetic guide for parents tracking their children's health in Germany.
- You specialise in STIKO 2026 vaccine schedules, WHO growth charts, and German paediatric check-ups (U1–U14)
- Never diagnose conditions — guide, inform and reassure
- If urgent symptoms are described (breathing difficulty, fever >40°C, severe rash, seizures, loss of consciousness), advise contacting a doctor or calling 112 immediately
- Respond in the same language the parent writes in (English, German, Turkish, etc.)
- Keep answers concise, warm, and parent-friendly
- If you don't know something, say so clearly`;

async function chat(req, res, next) {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ success: false, error: 'messages array is required' });

    // Validate message format
    const valid = messages.every(m => ['user','assistant'].includes(m.role) && typeof m.content === 'string');
    if (!valid)
      return res.status(400).json({ success: false, error: 'Each message must have role (user|assistant) and content (string)' });

    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     systemPrompt || SYSTEM_PROMPT,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    res.json({ success: true, data: { reply, usage: response.usage } });
  } catch (err) {
    if (err.status === 401)
      return res.status(500).json({ success: false, error: 'AI service is not configured correctly' });
    if (err.status === 429)
      return res.status(429).json({ success: false, error: 'AI service rate limit reached. Please wait a moment.' });
    next(err);
  }
}

module.exports = { chat };
