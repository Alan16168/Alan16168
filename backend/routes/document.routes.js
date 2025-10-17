const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/upload', protect, authorize('admin'), documentController.uploadDocument);
router.get('/', protect, authorize('admin'), documentController.getAllDocuments);
router.delete('/:id', protect, authorize('admin'), documentController.deleteDocument);

module.exports = router;