const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { adminAuth } = require('../middleware/auth');

router.post('/', OrderController.placeOrder);
router.get('/', adminAuth, OrderController.getOrders);
router.patch('/:orderId', adminAuth, OrderController.updateOrderStatus);

module.exports = router;