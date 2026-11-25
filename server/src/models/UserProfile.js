const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  college: {
    type: String,
    default: '',
    trim: true
  },
  degree: {
    type: String,
    default: 'B.Tech / B.E.',
    trim: true
  },
  branch: {
    type: String,
    default: 'Computer Science & Engineering',
    trim: true
  },
  currentYear: {
    type: String,
    default: '3rd Year',
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Other']
  },
  graduationYear: {
    type: Number,
    default: 2026
  },
  skills: {
    type: [String],
    default: ['Data Structures', 'Algorithms', 'SQL', 'React', 'Node.js']
  },
  programmingLanguages: {
    type: [String],
    default: ['C++', 'Python', 'JavaScript']
  },
  areasOfInterest: {
    type: [String],
    default: ['Software Engineering', 'Full Stack Development', 'AI / ML']
  },
  targetRole: {
    type: String,
    default: 'Software Development Engineer (SDE-1)',
    trim: true
  },
  preparationGoals: {
    type: String,
    default: 'Crack Tier-1 Product Company campus placement within 6 months'
  },
  currentPreparationLevel: {
    type: String,
    default: 'Intermediate',
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: 'Passionate student preparing for top tech roles.'
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
