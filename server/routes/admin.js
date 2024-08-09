const express = require('express');
const adminController = require('../controllers/admin');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();


router.get('/stats', authenticate, authorize(['admin']), adminController.getDashboardStats);
router.get('/orders', authenticate, authorize(['admin']), adminController.getRecentOrders);
router.get('/rooms', authenticate, authorize(['admin']), adminController.getRooms);
router.get('/messages/:roomId', authenticate, authorize(['admin']), adminController.getRoomId);
router.post('/messages/:roomId', authenticate, authorize(['admin']), adminController.postRoomId);

module.exports = router;