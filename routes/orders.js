const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['customer', 'consultant', 'admin']), orderController.postOrder);
router.get('/:userId', authenticate, authorize(['customer', 'consultant', 'admin']), orderController.getOrdersByUser);

module.exports = router;
