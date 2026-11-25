const Note = require('../models/Note');
const UserProgress = require('../models/UserProgress');

// @desc    Get user notes
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: notes.length, notes });
  } catch (err) {
    next(err);
  }
};

// @desc    Save new generated or manual note
// @route   POST /api/notes
// @access  Private
exports.saveNote = async (req, res, next) => {
  try {
    const { title, topic, inputType, noteFormat, content, keyPoints, definitions, mcqs, flashcards, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Note title and content are required' });
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      topic: topic || title,
      inputType: inputType || 'topic',
      noteFormat: noteFormat || 'Detailed notes',
      content,
      keyPoints: keyPoints || [],
      definitions: definitions || [],
      mcqs: mcqs || [],
      flashcards: flashcards || [],
      tags: tags || []
    });

    await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          recentActivities: {
            $each: [
              {
                type: 'notes',
                title: `Saved AI Notes for "${title}"`,
                timestamp: new Date(),
                metadata: { noteId: note._id }
              }
            ],
            $slice: -15
          }
        }
      }
    );

    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// @desc    Update note content or title
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, keyPoints, tags } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (keyPoints) note.keyPoints = keyPoints;
    if (tags) note.tags = tags;
    note.updatedAt = Date.now();

    await note.save();

    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    const result = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};
