// ... (previous imports and createOrder, getUserOrders) ...

// @desc    Update order status (e.g., Cancel)
// @route   PATCH /api/orders/:orderId
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { userId } = req.user; // User making the request

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Option 1: Only allow user to cancel their own order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    // Option 2 (future): Allow admin to update any order (check isAdmin here)

    // Only allow status to change to 'Cancelled' if currently 'Processing'
    if (status === 'Cancelled' && order.status !== 'Processing') {
      return res.status(400).json({ message: 'Cannot cancel a delivered or already cancelled order' });
    }

    // You can add more validations here (e.g., only admin can mark as 'Delivered')

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating order' });
  }
};

// ... (export updateOrderStatus)
module.exports = { createOrder, getUserOrders, updateOrderStatus };
