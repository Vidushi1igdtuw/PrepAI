const express = require('express');
const router = express.Router();
const {
  startInterview,
  getInterviews,
  getInterviewById,
  submitInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', startInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.post('/:id/submit', submitInterview);

module.exports = router;
