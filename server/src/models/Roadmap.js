const mongoose = require('mongoose');

const roadmapTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Concept' },
  estimatedHours: { type: Number, default: 2 },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const roadmapWeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  focus: { type: String, required: true },
  milestone: { type: String, default: '' },
  tasks: [roadmapTaskSchema]
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  targetRole: {
    type: String,
    required: true,
    default: 'Software Development Engineer'
  },
  currentSkills: [String],
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  durationWeeks: {
    type: Number,
    default: 8
  },
  dailyStudyHours: {
    type: Number,
    default: 3
  },
  weakAreas: [String],
  weeklySchedule: [roadmapWeekSchema],
  completionPercentage: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roadmapSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
