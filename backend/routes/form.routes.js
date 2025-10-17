const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

router.get('/', formController.getAllForms);
router.get('/categories', formController.getFormCategories);
router.get('/:id', formController.getFormById);

module.exports = router;