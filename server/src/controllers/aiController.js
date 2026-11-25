const aiService = require('../services/aiService');
const Conversation = require('../models/Conversation');
const UserProfile = require('../models/UserProfile');
const UserProgress = require('../models/UserProgress');

// @desc    Check AI service status (Ollama / Fallback)
// @route   GET /api/ai/status
// @access  Public
exports.getAIStatus = async (req, res, next) => {
  try {
    const status = await aiService.getStatus();
    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
};

// @desc    Context-aware AI Chat
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res, next) => {
  try {
    const { conversationId, message, promptModifier } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const profile = await UserProfile.findOne({ user: req.user.id });
    let conversation;

    // Requirement:
    // 1. If conversationId is supplied, use existing conversation.
    // 2. If no conversationId is supplied, create EXACTLY ONE conversation on the first question,
    //    and automatically set the title using the first question!
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, user: req.user.id });
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
    } else {
      // Create title from first query (truncate to 50 chars cleanly)
      let title = message.trim();
      if (title.length > 45) {
        title = title.substring(0, 45) + '...';
      }
      conversation = new Conversation({
        user: req.user.id,
        title: title || 'New AI Discussion',
        messages: []
      });
    }

    // Append user message
    const userMsgObj = {
      role: 'user',
      content: promptModifier ? `[Instruction: ${promptModifier}]\n\n${message}` : message,
      timestamp: new Date()
    };
    conversation.messages.push(userMsgObj);

    // Call AI Service with full conversation history
    const aiResponse = await aiService.chatWithContext(conversation.messages, profile);

    // Append assistant response
    const assistantMsgObj = {
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date()
    };
    conversation.messages.push(assistantMsgObj);
    conversation.updatedAt = Date.now();

    await conversation.save();

    // Log progress activity
    await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          recentActivities: {
            $each: [
              {
                type: 'chat',
                title: `Asked AI Tutor: "${message.slice(0, 40)}..."`,
                timestamp: new Date(),
                metadata: { conversationId: conversation._id }
              }
            ],
            $slice: -15
          }
        }
      }
    );

    res.json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      message: assistantMsgObj,
      provider: aiResponse.provider,
      model: aiResponse.model,
      statusNote: aiResponse.statusNote
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate AI Notes
// @route   POST /api/ai/notes
// @access  Private
exports.generateNotes = async (req, res, next) => {
  try {
    const { topic, inputType, noteFormat, content } = req.body;

    if (!topic && !content) {
      return res.status(400).json({ success: false, message: 'Topic or content is required' });
    }

    const notes = await aiService.generateNotes(topic || 'Study Topic', inputType, noteFormat, content);

    res.json({
      success: true,
      notes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate personalized roadmap
// @route   POST /api/ai/roadmap
// @access  Private
exports.generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole, durationWeeks, dailyStudyHours, currentLevel, weakAreas } = req.body;

    const roadmapData = await aiService.generateRoadmap({
      targetRole: targetRole || 'Software Development Engineer',
      durationWeeks: durationWeeks || 8,
      dailyStudyHours: dailyStudyHours || 3,
      currentLevel: currentLevel || 'Intermediate',
      weakAreas: weakAreas || []
    });

    res.json({
      success: true,
      roadmap: roadmapData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Evaluate mock interview
// @route   POST /api/ai/evaluate
// @access  Private
exports.evaluateInterview = async (req, res, next) => {
  try {
    const { role, company, interviewType, questions } = req.body;

    const evaluation = await aiService.evaluateInterview({
      role,
      company,
      interviewType,
      questions
    });

    res.json({
      success: true,
      evaluation
    });
  } catch (err) {
    next(err);
  }
};
