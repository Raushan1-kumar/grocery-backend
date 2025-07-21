const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Processing', 'Delivered', 'Cancelled'], default: 'Processing' },
  date: { type: Date, default: () => new Date() },
  // Optional: Shipping address, payment method, etc.
  // shippingAddress: String,
  // paymentMethod: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
