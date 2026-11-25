const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    enum: ['topic', 'text', 'document'],
    default: 'topic'
  },
  originalInput: {
    type: String,
    default: ''
  },
  noteFormat: {
    type: String,
    enum: [
      'Detailed notes',
      'Short notes',
      'Exam-oriented notes',
      'Revision notes',
      'Important definitions',
      'Key points',
      'MCQs',
      'Flashcards'
    ],
    default: 'Detailed notes'
  },
  content: {
    type: String,
    required: true
  },
  keyPoints: [String],
  definitions: [
    {
      term: String,
      definition: String
    }
  ],
  mcqs: [
    {
      question: String,
      options: [String],
      answer: String,
      explanation: String
    }
  ],
  flashcards: [
    {
      front: String,
      back: String
    }
  ],
  isSaved: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
