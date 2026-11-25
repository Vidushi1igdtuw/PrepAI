const axios = require('axios');
const config = require('../config/config');

class OllamaProvider {
  constructor() {
    this.baseURL = config.ollamaHost;
    this.model = config.ollamaModel;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000
    });
  }

  async isAvailable() {
    try {
      const res = await this.client.get('/api/tags', { timeout: 2000 });
      const models = res.data?.models || [];
      const hasModel = models.some(m => m.name && m.name.toLowerCase().includes(this.model.toLowerCase()));
      return { available: true, hasConfiguredModel: hasModel, models: models.map(m => m.name) };
    } catch (err) {
      return { available: false, error: err.message };
    }
  }

  async chat(messages, systemPrompt = '') {
    const formattedMessages = [];
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    messages.forEach(m => {
      formattedMessages.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      });
    });

    try {
      const response = await this.client.post('/api/chat', {
        model: this.model,
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      });

      return {
        content: response.data?.message?.content || '',
        provider: 'ollama',
        model: this.model,
        isFallback: false
      };
    } catch (error) {
      throw new Error(`Ollama Chat Error: ${error.message}`);
    }
  }

  async generate(prompt, systemPrompt = '') {
    try {
      const response = await this.client.post('/api/generate', {
        model: this.model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7
        }
      });

      return {
        content: response.data?.response || '',
        provider: 'ollama',
        model: this.model,
        isFallback: false
      };
    } catch (error) {
      throw new Error(`Ollama Generate Error: ${error.message}`);
    }
  }
}

module.exports = new OllamaProvider();
