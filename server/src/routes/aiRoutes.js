const express = require('express');
const router = express.Router();
const {
  getAIStatus,
  chat,
  generateNotes,
  generateRoadmap,
  evaluateInterview
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.get('/status', getAIStatus);
router.post('/chat', protect, aiLimiter, chat);
router.post('/notes', protect, aiLimiter, generateNotes);
router.post('/roadmap', protect, aiLimiter, generateRoadmap);
router.post('/evaluate', protect, aiLimiter, evaluateInterview);

module.exports = router;
