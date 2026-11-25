const express = require('express');
const router = express.Router();
const {
  getNotes,
  saveNote,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotes);
router.post('/', saveNote);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
