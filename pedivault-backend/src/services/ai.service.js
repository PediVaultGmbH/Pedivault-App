const { GoogleGenAI } = require('@google/genai');

class AIService {
  constructor() {
    this.client  = null;
    this.enabled = false;
    this.init();
  }

  init() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.log('[AI] No Gemini API key — AI features disabled');
        return;
      }
      this.client  = new GoogleGenAI({ apiKey });
      this.enabled = true;
      console.log('[AI] ✅ Connected to Google Gemini');
    } catch (err) {
      console.error('[AI] Init failed:', err.message);
    }
  }

  async chat(messages, childContext = null) {
    if (!this.enabled) return 'AI Assistant is not configured.';
    try {
      const systemText = `You are PediVault AI, a helpful paediatric health assistant for parents. You help parents understand their child's health records, vaccine schedules, growth data, and medications. You are empathetic, clear, and always recommend consulting a real doctor for medical decisions.${childContext ? ` Current child: ${childContext.name}, born ${childContext.dateOfBirth}, ${childContext.gender}, blood type ${childContext.bloodType || 'unknown'}.` : ''} Always respond in a friendly, concise way. Never diagnose conditions. Always recommend consulting a paediatrician for medical advice.`;

      const contents = messages.map(m => ({
        role:  m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await this.client.models.generateContent({
        model:             'gemini-2.5-flash',
        systemInstruction: systemText,
        contents,
      });

      return response.text;
    } catch (err) {
      console.error('[AI] chat failed:', err.message);
      if (err.message?.includes('503') || err.message?.includes('UNAVAILABLE')) {
        return 'The AI service is temporarily busy due to high demand. Please try again in a few seconds.';
      }
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        return 'AI rate limit reached. Please wait a moment and try again.';
      }
      return 'Sorry, I could not process your request. Please try again.';
    }
  }
}

module.exports = new AIService();
