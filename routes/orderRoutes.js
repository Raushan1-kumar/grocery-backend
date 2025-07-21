const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

// Update order status (e.g., Cancel)
router.route('/:orderId')
  .patch(protect, updateOrderStatus); // Use PATCH for partial updates

module.exports = router;
