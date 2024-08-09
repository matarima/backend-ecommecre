const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', authenticate, authorize(['admin']), categoryController.postCategory);

module.exports = router;
