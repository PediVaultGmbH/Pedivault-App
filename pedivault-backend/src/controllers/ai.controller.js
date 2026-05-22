// src/controllers/ai.controller.js
const aiService = require('../services/ai.service');

const SYSTEM_PROMPT = `You are PediVault's AI health assistant — a knowledgeable, empathetic guide for parents tracking their children's health in Germany.
- You specialise in STIKO 2026 vaccine schedules, WHO growth charts, and German paediatric check-ups (U1–U14)
- Never diagnose conditions — guide, inform and reassure
- If urgent symptoms are described (breathing difficulty, fever >40°C, severe rash, seizures, loss of consciousness), advise contacting a doctor or calling 112 immediately
- Respond in the same language the parent writes in (English, German, Turkish, etc.)
- Keep answers concise, warm, and parent-friendly
- If you don't know something, say so clearly`;

async function chat(req, res, next) {
  try {
    const { messages, childContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ success: false, error: 'messages array is required' });

    const valid = messages.every(m => ['user','assistant'].includes(m.role) && typeof m.content === 'string');
    if (!valid)
      return res.status(400).json({ success: false, error: 'Each message must have role (user|assistant) and content (string)' });

    const reply = await aiService.chat(messages, childContext);

    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
