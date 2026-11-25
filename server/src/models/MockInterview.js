const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    default: 'Google'
  },
  role: {
    type: String,
    required: true,
    default: 'Software Development Engineer'
  },
  interviewType: {
    type: String,
    enum: ['Technical', 'HR', 'Mixed', 'DSA-focused', 'Core CS subjects'],
    default: 'Technical'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  durationMinutes: {
    type: Number,
    default: 15
  },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, default: 'technical' },
      studentAnswer: { type: String, default: '' },
      aiFeedback: { type: String, default: '' },
      score: { type: Number, default: 0 },
      idealPoints: [String]
    }
  ],
  overallScore: {
    type: Number,
    default: 0
  },
  evaluation: {
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    improvementSuggestions: [String],
    recommendedTopics: [String]
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
