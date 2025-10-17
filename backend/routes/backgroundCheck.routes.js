const express = require('express');
const router = express.Router();
const backgroundCheckController = require('../controllers/backgroundCheck.controller');
const { protect, checkPremiumAccess } = require('../middleware/auth.middleware');

router.post('/request', protect, checkPremiumAccess, backgroundCheckController.requestBackgroundCheck);
router.get('/status/:checkId', protect, checkPremiumAccess, backgroundCheckController.getCheckStatus);
router.get('/history', protect, checkPremiumAccess, backgroundCheckController.getCheckHistory);
router.get('/download/:checkId', protect, checkPremiumAccess, backgroundCheckController.downloadReport);

module.exports = router;