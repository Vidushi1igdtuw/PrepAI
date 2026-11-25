const Conversation = require('../models/Conversation');

// @desc    Get all conversations for logged in student
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .select('title category updatedAt createdAt messages')
      .sort({ updatedAt: -1 });

    // Format list with message count and snippet
    const formatted = conversations.map(c => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      messageCount: c.messages.length,
      lastMessageSnippet: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.slice(0, 80) : '',
      updatedAt: c.updatedAt,
      createdAt: c.createdAt
    }));

    res.json({ success: true, conversations: formatted });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single conversation with full message history
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
exports.createConversation = async (req, res, next) => {
  try {
    const { title, messages, category } = req.body;

    const conversation = await Conversation.create({
      user: req.user.id,
      title: title || 'New Conversation',
      messages: messages || [],
      category: category || 'General'
    });

    res.status(201).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
};

// @desc    Update conversation (title or messages)
// @route   PUT /api/conversations/:id
// @access  Private
exports.updateConversation = async (req, res, next) => {
  try {
    const { title, messages, category } = req.body;

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (title) conversation.title = title;
    if (messages) conversation.messages = messages;
    if (category) conversation.category = category;
    conversation.updatedAt = Date.now();

    await conversation.save();

    res.json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete conversation from MongoDB
// @route   DELETE /api/conversations/:id
// @access  Private
exports.deleteConversation = async (req, res, next) => {
  try {
    const result = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
};
