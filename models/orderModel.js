const db = require('../config/db');

// items: [{ menu_item_id, quantity, unit_price }]
exports.create = async (userId, pickupTime, notes, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const [r] = await conn.query(
      'INSERT INTO orders (user_id, pickup_time, notes, total) VALUES (?, ?, ?, ?)',
      [userId, pickupTime, notes || null, total.toFixed(2)]
    );
    for (const i of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [r.insertId, i.menu_item_id, i.quantity, i.unit_price]
      );
    }
    await conn.commit();
    return r.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.listByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
};

exports.itemsForOrders = async (orderIds) => {
  if (!orderIds.length) return {};
  const [rows] = await db.query(
    `SELECT oi.*, m.name FROM order_items oi
     JOIN menu_items m ON m.id = oi.menu_item_id
     WHERE oi.order_id IN (?)`, [orderIds]);
  const grouped = {};
  rows.forEach((r) => { (grouped[r.order_id] = grouped[r.order_id] || []).push(r); });
  return grouped;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
  return rows[0];
};

// Customers can only cancel their OWN order while it is still pending
exports.cancelOwnPending = async (orderId, userId) => {
  const [r] = await db.query(
    "UPDATE orders SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'pending'",
    [orderId, userId]
  );
  return r.affectedRows === 1;
};
