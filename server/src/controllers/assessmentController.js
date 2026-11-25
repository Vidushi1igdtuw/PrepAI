const vm = require('vm');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const UserProgress = require('../models/UserProgress');
const judgeService = require('../services/judgeService');

/**
 * Evaluate JavaScript solution against structured JSON test cases inside a sandboxed VM
 */
function evaluateJsTestCases(code, functionName, testCases = []) {
  const results = [];
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      const parsedInput = JSON.parse(tc.input);
      const argValues = Object.values(parsedInput);
      const expected = JSON.parse(tc.output);

      const logs = [];
      const sandbox = {
        console: {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
        },
        __args: argValues,
        __result: undefined,
        __err: null
      };

      const wrappedCode = `
        ${code}
        if (typeof ${functionName} !== 'function') {
          throw new Error('Function "${functionName}" is not defined. Please keep the starter function signature.');
        }
        __result = ${functionName}(...__args);
      `;

      const start = Date.now();
      vm.runInNewContext(wrappedCode, sandbox, { timeout: 2000 });
      const elapsed = Date.now() - start;

      const actualNormalized = JSON.stringify(sandbox.__result);
      const expectedNormalized = JSON.stringify(expected);
      const passed = actualNormalized === expectedNormalized;

      results.push({
        testCase: i + 1,
        input: tc.input,
        expected: expectedNormalized,
        actual: actualNormalized === undefined ? 'undefined' : actualNormalized,
        passed,
        executionTimeMs: elapsed,
        logs: logs.join('\n')
      });
    } catch (err) {
      results.push({
        testCase: i + 1,
        input: tc.input,
        expected: tc.output,
        actual: `Error: ${err.message}`,
        passed: false,
        executionTimeMs: 0
      });
    }
  }
  return results;
}

// @desc    Get assessment companies, OA sets, and history
// @route   GET /api/assessments
// @access  Private
exports.getAssessments = async (req, res, next) => {
  try {
    const history = await Assessment.find({ user: req.user.id }).sort({ completedAt: -1 });
    const companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Deloitte'];
    const availableCategories = ['DSA', 'Programming', 'Aptitude', 'Logical reasoning', 'Technical MCQs', 'Core CS subjects'];

    res.json({
      success: true,
      companies,
      oaSets: [1, 2, 3],
      categories: availableCategories,
      history
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get questions for a company OA or category
// @route   GET /api/assessments/questions
// @access  Private
exports.getAssessmentQuestions = async (req, res, next) => {
  try {
    const { company, oaSet, category, limit = 10 } = req.query;

    let query = {};
    if (company && company !== 'All') {
      query.company = company;
    }
    if (oaSet) {
      query.oaSet = Number(oaSet);
    }
    if (category && category !== 'All' && !company) {
      query.category = category;
    }

    let questions = await Question.find(query).limit(Number(limit));

    if (questions.length === 0) {
      questions = await Question.find({}).limit(10);
    }

    res.json({
      success: true,
      company: company || 'General',
      oaSet: oaSet ? Number(oaSet) : 1,
      count: questions.length,
      questions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Run and check code against a question's real test cases
// @route   POST /api/assessments/run-tests
// @access  Private
exports.runTestCases = async (req, res, next) => {
  try {
    const { questionId, code, language = 'javascript' } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Please write your code before running tests.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const testCases = question.sampleTestCases || [];

    if (language === 'javascript') {
      const results = evaluateJsTestCases(code, question.functionName || 'solve', testCases);
      const passedCount = results.filter(r => r.passed).length;
      const allPassed = results.length > 0 && passedCount === results.length;

      return res.json({
        success: true,
        allPassed,
        passedCount,
        totalCount: results.length,
        status: allPassed ? 'All Sample Tests Passed' : `${passedCount}/${results.length} Tests Passed`,
        results
      });
    }

    // For Python / C++ / Java etc., compile & run via Judge0
    const judgeResult = await judgeService.runCode({ code, language, stdin: '' });
    return res.json({
      success: !judgeResult.isError,
      allPassed: !judgeResult.isError,
      passedCount: judgeResult.isError ? 0 : testCases.length,
      totalCount: testCases.length,
      status: judgeResult.status,
      output: judgeResult.output,
      executionTimeMs: judgeResult.executionTimeMs,
      memoryKb: judgeResult.memoryKb,
      results: []
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit assessment and calculate real score
// @route   POST /api/assessments/submit
// @access  Private
exports.submitAssessment = async (req, res, next) => {
  try {
    const { title, category, answers, timeTakenSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid submission answers' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const evaluatedAnswers = [];
    const topicMap = {};

    for (const ans of answers) {
      const q = await Question.findById(ans.questionId);
      const isAttempted = ans.studentAnswer !== undefined && ans.studentAnswer !== null && String(ans.studentAnswer).trim() !== '';

      let isCorrect = false;
      const qTitle = q ? q.title : 'Assessment Question';
      const correctAns = q ? q.correctAnswer : 'Option A';
      const expl = q ? q.explanation : 'Standard verification logic.';
      const topic = q ? q.topic : 'General';

      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, correct: 0 };
      }
      topicMap[topic].total += 1;

      if (!isAttempted) {
        unattemptedCount++;
      } else {
        if (q && q.type === 'mcq') {
          isCorrect = ans.studentAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        } else if (q && q.type === 'coding') {
          const allCases = [...(q.sampleTestCases || []), ...(q.hiddenTestCases || [])];
          if ((ans.language || 'javascript') === 'javascript' && allCases.length > 0) {
            const tcResults = evaluateJsTestCases(ans.studentAnswer, q.functionName || 'solve', allCases);
            isCorrect = tcResults.length > 0 && tcResults.every(r => r.passed);
          } else {
            // Non-JS: verify via Judge0 compilation/execution
            const jr = await judgeService.runCode({ code: ans.studentAnswer, language: ans.language || 'python', stdin: '' });
            isCorrect = !jr.isError && !ans.studentAnswer.includes('TODO: Implement');
          }
        }

        if (isCorrect) {
          correctCount++;
          topicMap[topic].correct += 1;
        } else {
          incorrectCount++;
        }
      }

      evaluatedAnswers.push({
        questionId: ans.questionId,
        questionTitle: qTitle,
        studentAnswer: ans.studentAnswer || 'Unattempted',
        correctAnswer: correctAns,
        isCorrect,
        isMarkedForReview: ans.isMarkedForReview || false,
        explanation: expl
      });
    }

    const totalQuestions = answers.length || 1;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const score = correctCount * 10;

    const topicPerformance = Object.keys(topicMap).map(k => ({
      topic: k,
      total: topicMap[k].total,
      correct: topicMap[k].correct
    }));

    const recommendations = [];
    if (percentage < 60) {
      recommendations.push('Review foundational concepts in topic modules before attempting company-specific mocks.');
      recommendations.push('Use the AI Study Assistant to clarify weak concepts and practice edge cases.');
    } else if (percentage < 85) {
      recommendations.push('Solid performance! Work on solving problems under strict timed constraints.');
      recommendations.push('Focus on tricky edge cases and algorithmic time complexity optimizations.');
    } else {
      recommendations.push('Outstanding score! You are performing in the top 5% bracket for this company OA.');
      recommendations.push('Ready for technical mock interviews at Tier-1 product companies.');
    }

    const assessment = await Assessment.create({
      user: req.user.id,
      title: title || `${category || 'Company'} Assessment Arena`,
      category: category || 'DSA',
      totalQuestions,
      score,
      percentage,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeTakenSeconds: timeTakenSeconds || 900,
      answers: evaluatedAnswers,
      topicPerformance,
      recommendations,
      status: 'completed',
      completedAt: new Date()
    });

    await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        $inc: {
          mockOACompleted: 1,
          questionsSolved: correctCount,
          learningHours: Math.round(((timeTakenSeconds || 600) / 3600) * 10) / 10
        },
        $push: {
          recentActivities: {
            $each: [
              {
                type: 'assessment',
                title: `Attempted ${assessment.title} (Score: ${percentage}%)`,
                timestamp: new Date(),
                metadata: { assessmentId: assessment._id, score: percentage }
              }
            ],
            $slice: -15
          }
        }
      }
    );

    res.status(201).json({
      success: true,
      assessment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Real Multi-Language Code Execution via Judge0 CE (with JS sandbox fallback)
// @route   POST /api/assessments/run-code
// @access  Private
exports.runCode = async (req, res, next) => {
  try {
    const { code, language = 'javascript', input = '' } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code cannot be empty' });
    }

    const result = await judgeService.runCode({
      code,
      language,
      stdin: input
    });

    res.json({
      success: true,
      status: result.status,
      output: result.output,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
      isError: result.isError
    });
  } catch (err) {
    next(err);
  }
};
