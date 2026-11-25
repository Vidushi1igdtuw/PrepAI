const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: 'General'
  },
  category: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  incorrectCount: {
    type: Number,
    default: 0
  },
  unattemptedCount: {
    type: Number,
    default: 0
  },
  timeTakenSeconds: {
    type: Number,
    default: 0
  },
  answers: [
    {
      questionId: { type: String },
      questionTitle: { type: String },
      studentAnswer: { type: String },
      correctAnswer: { type: String },
      isCorrect: { type: Boolean },
      isMarkedForReview: { type: Boolean, default: false },
      explanation: { type: String }
    }
  ],
  topicPerformance: [
    {
      topic: { type: String },
      total: { type: Number },
      correct: { type: Number }
    }
  ],
  recommendations: [String],
  status: {
    type: String,
    enum: ['started', 'completed'],
    default: 'completed'
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
