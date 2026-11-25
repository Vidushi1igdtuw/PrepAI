const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation
} = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
