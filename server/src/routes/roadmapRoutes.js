const express = require('express');
const router = express.Router();
const {
  getRoadmaps,
  createRoadmap,
  toggleTask
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getRoadmaps);
router.post('/', createRoadmap);
router.put('/:id/tasks/:taskId', toggleTask);

module.exports = router;
