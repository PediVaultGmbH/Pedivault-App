/**
 * src/api/ai.api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * AI health assistant — routes through YOUR backend, which holds the
 * Anthropic API key. Never call Anthropic directly from the frontend.
 */
import api from './client';

/**
 * Send a message to the AI health assistant.
 * @param {{ childId: string, messages: Array<{role,content}>, systemPrompt: string }} payload
 * @returns {{ reply: string }}
 */
export const chatWithAI = (payload) =>
  api.post('/ai/chat', payload);
