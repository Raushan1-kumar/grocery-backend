// const Order = require('../models/order');
// const Product = require('../models/product');

// class OrderController {
//   static async placeOrder(req, res) {
//     try {
//       const { customer, items } = req.body; // items: [{ product_id, quantity }]

//       // Validate stock
//       for (const item of items) {
//         const product = await Product.getById(item.product_id);
//         if (!product.exists || product.data().stock < item.quantity) {
//           return res.status(400).json({ error: `Insufficient stock for ${item.product_id}` });
//         }
//       }

//       // Create order
//       const orderData = {
//         customer,
//         items,
//         status: 'pending',
//         timestamp: new Date()
//       };
//       const orderRef = await Order.create(orderData);

//       // Update stock
//       const batch = db.batch();
//       items.forEach(item => {
//         const productRef = db.collection('products').doc(item.product_id);
//         batch.update(productRef, { stock: firebase.firestore.FieldValue.increment(-item.quantity) });
//       });
//       await batch.commit();

//       res.status(201).json({ order_id: orderRef.id });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async getOrders(req, res) {
//     try {
//       const { status, page = 1, limit = 20 } = req.query;
//       const snapshot = await Order.getAll(status, parseInt(page), parseInt(limit));
//       const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       res.json(orders);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async updateOrderStatus(req, res) {
//     try {
//       const { orderId } = req.params;
//       const { status } = req.body; // e.g., 'pending', 'complete'
//       await Order.updateStatus(orderId, status);
//       res.json({ message: 'Order status updated' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = OrderController;