const MockInterview = require('../models/MockInterview');
const UserProgress = require('../models/UserProgress');
const aiService = require('../services/aiService');
const companyQuestionBank = require('../seed/interviewQuestionsBank');

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// @desc    Start a new non-repeating, company-authentic mock interview
// @route   POST /api/interviews
// @access  Private
exports.startInterview = async (req, res, next) => {
  try {
    const {
      company = 'Google',
      role = 'Software Development Engineer',
      interviewType = 'Technical',
      difficulty = 'Medium',
      durationMinutes = 15
    } = req.body;

    // 1. Fetch previously asked questions for this user & company so we NEVER repeat
    const pastInterviews = await MockInterview.find({ user: req.user.id, company }).select('questions.question');
    const askedSet = new Set();
    pastInterviews.forEach((iv) => {
      (iv.questions || []).forEach((q) => {
        if (q.question) askedSet.add(q.question.trim().toLowerCase());
      });
    });

    // 2. Gather company-specific question pool
    const companyPool = companyQuestionBank[company] || companyQuestionBank.Google;

    // Filter out already asked questions
    let unseenPool = companyPool.filter(q => !askedSet.has(q.question.trim().toLowerCase()));

    // Prioritize matching interviewType if possible
    const typeLower = interviewType.toLowerCase();
    const matchingType = unseenPool.filter(q => {
      if (typeLower === 'hr') return q.type === 'hr';
      if (typeLower.includes('dsa')) return q.type === 'dsa' || q.type === 'technical';
      if (typeLower === 'mixed') return true;
      return q.type !== 'hr';
    });

    let selected = shuffleArray(matchingType.length >= 3 ? matchingType : unseenPool).slice(0, 3);

    // 3. If user has exhausted all static questions for this company, or we want fresh AI questions, ask AI Service
    if (selected.length < 3) {
      const needed = 3 - selected.length;
      const aiPrompt = `Generate ${needed} realistic, non-repeating ${interviewType} interview questions specifically in the style of ${company} for a ${role} (${difficulty} level). Do NOT repeat any of these questions: ${Array.from(askedSet).slice(0, 10).join(' | ')}. Return each question on a new line starting with "Q: ".`;
      try {
        const aiRes = await aiService.chat({
          messages: [{ role: 'user', content: aiPrompt }],
          mode: 'interview'
        });
        const lines = (aiRes.reply || '')
          .split('\n')
          .map(l => l.replace(/^Q\d*[:.]\s*/i, '').trim())
          .filter(l => l.length > 25 && !askedSet.has(l.toLowerCase()));

        lines.slice(0, needed).forEach((qText) => {
          selected.push({
            question: qText,
            type: typeLower === 'hr' ? 'hr' : 'technical',
            idealPoints: ['Clear problem breakdown', 'Optimal complexity / STAR structure', 'Edge case awareness']
          });
        });
      } catch {
        // Fallback to remaining pool if AI call fails
      }
    }

    // Final safety fallback if pool was completely exhausted
    if (selected.length === 0) {
      selected = shuffleArray(companyPool).slice(0, 3);
    }

    const questions = selected.map(q => ({
      question: q.question,
      type: q.type || 'technical',
      studentAnswer: '',
      idealPoints: q.idealPoints || []
    }));

    const interview = await MockInterview.create({
      user: req.user.id,
      company,
      role,
      interviewType,
      difficulty,
      durationMinutes,
      questions,
      status: 'in-progress'
    });

    res.status(201).json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's mock interviews
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
  try {
    const interviews = await MockInterview.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, interviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single interview details
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterviewById = async (req, res, next) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }
    res.json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit mock interview & trigger AI evaluation
// @route   POST /api/interviews/:id/submit
// @access  Private
exports.submitInterview = async (req, res, next) => {
  try {
    const { answers } = req.body;

    const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (answers && Array.isArray(answers)) {
      answers.forEach(a => {
        if (interview.questions[a.questionIndex]) {
          interview.questions[a.questionIndex].studentAnswer = a.answer;
        }
      });
    }

    // Evaluate with AI
    const evalResult = await aiService.evaluateInterview({
      role: interview.role,
      company: interview.company,
      interviewType: interview.interviewType,
      questions: interview.questions
    });

    interview.overallScore = evalResult.overallScore;
    interview.evaluation = evalResult.evaluation;
    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        $inc: { mockInterviewsCompleted: 1, learningHours: 0.5 },
        $push: {
          recentActivities: {
            $each: [
              {
                type: 'interview',
                title: `Completed ${interview.company} ${interview.role} Mock Interview (Score: ${interview.overallScore}/100)`,
                timestamp: new Date(),
                metadata: { interviewId: interview._id, score: interview.overallScore }
              }
            ],
            $slice: -15
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Interview evaluated successfully',
      interview
    });
  } catch (err) {
    next(err);
  }
};
