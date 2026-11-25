const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    enum: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Deloitte', 'General'],
    default: 'General'
  },
  oaSet: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  category: {
    type: String,
    enum: ['DSA', 'Programming', 'Aptitude', 'Logical reasoning', 'Technical MCQs', 'Core CS subjects'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  type: {
    type: String,
    enum: ['mcq', 'coding'],
    default: 'mcq'
  },
  description: {
    type: String,
    required: true
  },
  options: [
    {
      label: String,
      text: String
    }
  ],
  correctAnswer: {
    type: String
  },
  functionName: {
    type: String,
    default: 'solve'
  },
  starterCode: {
    cpp: String,
    java: String,
    python: String,
    javascript: String
  },
  sampleTestCases: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  hiddenTestCases: [
    {
      input: String,
      output: String
    }
  ],
  explanation: {
    type: String
  },
  tags: [String]
});

module.exports = mongoose.model('Question', questionSchema);
