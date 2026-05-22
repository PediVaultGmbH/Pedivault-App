const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.client  = null;
    this.model   = null;
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
      this.client  = new GoogleGenerativeAI(apiKey);
      this.model   = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.enabled = true;
      console.log('[AI] ✅ Connected to Google Gemini');
    } catch (err) {
      console.error('[AI] Init failed:', err.message);
    }
  }

  async chat(messages, childContext = null) {
    if (!this.enabled) return 'AI Assistant is not configured.';
    try {
      const systemPrompt = `You are PediVault AI, a helpful paediatric health assistant for parents.
You help parents understand their child's health records, vaccine schedules, growth data, and medications.
You are empathetic, clear, and always recommend consulting a real doctor for medical decisions.
${childContext ? `\nCurrent child context:\n${JSON.stringify(childContext, null, 2)}` : ''}
Always respond in a friendly, concise way. Use simple language parents can understand.
Never diagnose conditions. Always say "consult your paediatrician" for medical advice.`;

      const history = messages.slice(0, -1).map(m => ({
        role:  m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const chat = this.model.startChat({
        history,
        systemInstruction: systemPrompt,
      });

      const lastMessage = messages[messages.length - 1];
      const result      = await chat.sendMessage(lastMessage.content);
      return result.response.text();
    } catch (err) {
      console.error('[AI] chat failed:', err.message);
      return 'Sorry, I could not process your request. Please try again.';
    }
  }
}

module.exports = new AIService();
