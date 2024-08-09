const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/:userId', authenticate, authorize(['customer', 'consultant', 'admin']), cartController.getCart);
router.post('/:userId', authenticate, authorize(['customer', 'consultant', 'admin']), cartController.postCart);
router.post('/clear/:userId', authenticate, authorize(['customer', 'consultant', 'admin']), cartController.clearCart);

module.exports = router;
