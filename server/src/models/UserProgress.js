const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  overallScore: {
    type: Number,
    default: 68
  },
  streakCount: {
    type: Number,
    default: 1
  },
  lastActiveDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  questionsSolved: {
    type: Number,
    default: 0
  },
  mockInterviewsCompleted: {
    type: Number,
    default: 0
  },
  mockOACompleted: {
    type: Number,
    default: 0
  },
  learningHours: {
    type: Number,
    default: 0
  },
  topicProgress: {
    dsa: { type: Number, default: 0 },
    dbms: { type: Number, default: 0 },
    os: { type: Number, default: 0 },
    cn: { type: Number, default: 0 },
    oops: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    webDev: { type: Number, default: 0 }
  },
  weeklyActivity: [
    {
      day: String,
      hours: Number,
      questions: Number
    }
  ],
  recentActivities: [
    {
      type: { type: String }, // 'chat', 'interview', 'assessment', 'challenge', 'notes', 'roadmap'
      title: { type: String },
      timestamp: { type: Date, default: Date.now },
      metadata: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
