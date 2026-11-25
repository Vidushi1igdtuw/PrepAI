const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentQuestions,
  submitAssessment,
  runCode,
  runTestCases
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');
const { codeRunLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/', getAssessments);
router.get('/questions', getAssessmentQuestions);
router.post('/submit', submitAssessment);
router.post('/run-code', codeRunLimiter, runCode);
router.post('/run-tests', codeRunLimiter, runTestCases);

module.exports = router;
