const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Data Structures and Algorithms',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'OOP',
      'Programming Languages',
      'Web Development',
      'Artificial Intelligence',
      'Machine Learning',
      'Aptitude',
      'Interview Preparation'
    ],
    required: true,
    index: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  readTimeMinutes: {
    type: Number,
    default: 10
  },
  keyTakeaways: [String],
  tags: [String],
  codeSnippets: [
    {
      language: String,
      title: String,
      code: String
    }
  ],
  cheatSheetSummary: [String],
  frequentlyAskedInterviewQuestions: [
    {
      question: String,
      answer: String
    }
  ],
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  completedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
