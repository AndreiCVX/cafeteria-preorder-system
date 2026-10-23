const db = require('../config/db');

// Allowed status changes (staff)
const TRANSITIONS = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed'],
  completed: [],
  cancelled: []
};
exports.TRANSITIONS = TRANSITIONS;

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

exports.listAll = async (statusFilter = '') => {
  let sql = `SELECT o.*, u.name AS customer_name FROM orders o JOIN users u ON u.id = o.user_id`;
  const params = [];
  if (statusFilter) { sql += ' WHERE o.status = ?'; params.push(statusFilter); }
  sql += ' ORDER BY o.pickup_time ASC';
  const [rows] = await db.query(sql, params);
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

exports.updateStatus = (id, status) => db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

exports.report = async (from, to) => {
  const [[summary]] = await db.query(
    `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total), 0) AS total_sales
     FROM orders WHERE status <> 'cancelled' AND DATE(created_at) BETWEEN ? AND ?`, [from, to]);
  const [top] = await db.query(
    `SELECT m.name, SUM(oi.quantity) AS qty, SUM(oi.quantity * oi.unit_price) AS revenue
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN menu_items m ON m.id = oi.menu_item_id
     WHERE o.status <> 'cancelled' AND DATE(o.created_at) BETWEEN ? AND ?
     GROUP BY m.id, m.name ORDER BY qty DESC LIMIT 5`, [from, to]);
  return { summary, top };
};