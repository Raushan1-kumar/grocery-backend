const express = require('express');
const auth = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  updateOrderItems,
  deleteOrder,
} = require('../controllers/orderController');
const router = express.Router();

router.route('/')
  .post(auth, createOrder)
  .get(auth, getUserOrders);

router.route('/:orderId')
  .patch(auth, updateOrderStatus)
  .delete(auth, deleteOrder);

router.route('/:orderId/items')
  .patch(auth, updateOrderItems);

module.exports = router;
