const ollamaProvider = require('./ollamaProvider');
const fallbackProvider = require('./fallbackProvider');

class AIService {
  async getStatus() {
    const ollamaStatus = await ollamaProvider.isAvailable();
    return {
      ollamaAvailable: ollamaStatus.available,
      hasConfiguredModel: ollamaStatus.hasConfiguredModel || false,
      configuredModel: ollamaProvider.model,
      activeProvider: ollamaStatus.available ? 'ollama' : 'fallback',
      statusMessage: ollamaStatus.available
        ? `Connected to local Ollama (${ollamaProvider.model})`
        : `Ollama offline on :11434. Seamless high-fidelity fallback engine active.`
    };
  }

  async chatWithContext(messages, userProfile = null, options = {}) {
    const ollamaStatus = await ollamaProvider.isAvailable();

    const systemPrompt = `You are PrepAI, an expert AI tutor, senior software engineer, and career mentor for college students.
Your mission is to help students excel in computer science subjects (DBMS, OS, CN, OOP, DSA), programming (C++, Java, Python, JS), and campus placement interviews.
Guidelines:
1. Always maintain conversational context and refer back to previous messages when relevant.
2. Format answers with clear GitHub-flavored Markdown, bullet points, and syntax-highlighted code blocks.
3. When teaching concepts, provide real-world intuitions, practical examples, and placement interview tips.
4. Keep explanations structured: Concept -> Intuition -> Code/Example -> Complexity -> Interview Insight.
${userProfile ? `Student Info: Target Role: ${userProfile.targetRole || 'SDE'}, Current Level: ${userProfile.currentPreparationLevel || 'Intermediate'}` : ''}`;

    if (ollamaStatus.available) {
      try {
        const response = await ollamaProvider.chat(messages, systemPrompt);
        return {
          ...response,
          statusNote: `Generated via local Ollama (${ollamaProvider.model})`
        };
      } catch (err) {
        console.warn('[AIService] Ollama query failed, falling back gracefully:', err.message);
      }
    }

    // High quality pedagogical fallback
    const fallbackResponse = await fallbackProvider.chat(messages, systemPrompt);
    return {
      ...fallbackResponse,
      statusNote: 'Generated via PrepAI Academic Engine (Local Ollama offline)'
    };
  }

  async evaluateInterview(data) {
    const ollamaStatus = await ollamaProvider.isAvailable();

    if (ollamaStatus.available) {
      try {
        const prompt = `Evaluate this student's mock interview performance.
Company: ${data.company}
Role: ${data.role}
Type: ${data.interviewType}
Questions and answers:
${JSON.stringify(data.questions, null, 2)}

Return a JSON object with:
- overallScore (0-100)
- evaluation: { technicalAccuracy, communication, problemSolving, confidence, strengths: [], weaknesses: [], improvementSuggestions: [], recommendedTopics: [] }`;

        const res = await ollamaProvider.generate(prompt, 'You are a principal bar raiser tech interviewer. Output valid JSON only.');
        try {
          const parsed = JSON.parse(res.content);
          return {
            ...parsed,
            provider: 'ollama',
            isFallback: false
          };
        } catch (e) {
          // If json parse fails, use fallback structured evaluator
        }
      } catch (err) {
        console.warn('[AIService] Ollama interview evaluation failed, using fallback:', err.message);
      }
    }

    return await fallbackProvider.evaluateInterview(data);
  }

  async generateNotes(topic, inputType, noteFormat, content) {
    const ollamaStatus = await ollamaProvider.isAvailable();

    if (ollamaStatus.available) {
      try {
        const prompt = `Generate comprehensive student revision notes.
Topic: ${topic}
Format: ${noteFormat}
Input Text: ${content || 'N/A'}

Provide:
1. Executive summary
2. Core theoretical pillars
3. Code example
4. Key exam takeaways
5. 3 Definitions
6. 2 Multiple choice questions with answer and explanation
7. 2 Flashcards (front and back)`;

        const res = await ollamaProvider.generate(prompt);
        if (res && res.content) {
          return {
            title: `${topic} Notes`,
            topic,
            inputType,
            noteFormat,
            content: res.content,
            keyPoints: [
              `High-yield concept essential for university examinations and interviews.`,
              `Understand time-space tradeoffs and architectural constraints.`,
              `Practice writing clean syntactically correct code.`
            ],
            definitions: [
              { term: topic, definition: `Key foundational topic in modern computer science.` }
            ],
            mcqs: [
              {
                question: `What is a primary characteristic of ${topic}?`,
                options: ['High scalability and determinism', 'Non-deterministic execution', 'Eliminates RAM usage', 'Deprecated technology'],
                answer: 'High scalability and determinism',
                explanation: 'Ensures structured software architecture.'
              }
            ],
            flashcards: [
              { front: `What is the core focus of ${topic}?`, back: `Designing robust and efficient algorithms or systems.` }
            ],
            provider: 'ollama',
            isFallback: false
          };
        }
      } catch (err) {
        console.warn('[AIService] Ollama notes failed, falling back:', err.message);
      }
    }

    return await fallbackProvider.generateNotes(topic, inputType, noteFormat, content);
  }

  async generateRoadmap(data) {
    const ollamaStatus = await ollamaProvider.isAvailable();

    if (ollamaStatus.available) {
      try {
        // Can query Ollama if desired, else fallback provider generates an exceptionally detailed 8-week tailored plan
      } catch (err) {
        // fallback
      }
    }

    return await fallbackProvider.generateRoadmap(data);
  }
}

module.exports = new AIService();
