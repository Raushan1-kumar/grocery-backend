const { db } = require('../config/firebase');

class Order {
  static async create(data) {
    return await db.collection('orders').add(data);
  }

  static async getAll(status, page = 1, limit = 20) {
    const start = (page - 1) * limit;
    return await db.collection('orders')
      .where('status', '==', status)
      .orderBy('timestamp', 'desc')
      .offset(start)
      .limit(limit)
      .get();
  }

  static async updateStatus(id, status) {
    return await db.collection('orders').doc(id).update({ status });
  }
}

module.exports = Order;