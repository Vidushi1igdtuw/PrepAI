const express = require('express');
const router = express.Router();
const {
  getStudyMaterials,
  getStudyMaterialById,
  toggleBookmark,
  toggleComplete
} = require('../controllers/studyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.post('/:id/bookmark', toggleBookmark);
router.post('/:id/complete', toggleComplete);

module.exports = router;
