const db = require('../config/db');

exports.listAvailable = async (search = '', category = '') => {
  let sql = 'SELECT * FROM menu_items WHERE is_available = 1';
  const params = [];
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  sql += ' ORDER BY category, name';
  const [rows] = await db.query(sql, params);
  return rows;
};

exports.categories = async () => {
  const [rows] = await db.query('SELECT DISTINCT category FROM menu_items ORDER BY category');
  return rows.map((r) => r.category);
};

exports.findByIds = async (ids) => {
  if (!ids.length) return [];
  const [rows] = await db.query('SELECT * FROM menu_items WHERE id IN (?)', [ids]);
  return rows;
};
