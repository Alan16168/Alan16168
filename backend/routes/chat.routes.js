const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/message', protect, chatController.sendMessage);
router.get('/history/:sessionId', protect, chatController.getChatHistory);
router.get('/sessions', protect, chatController.getChatSessions);
router.delete('/session/:sessionId', protect, chatController.deleteChatSession);

module.exports = router;
