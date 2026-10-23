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

exports.listAll = async () => {
  const [rows] = await db.query('SELECT * FROM menu_items ORDER BY category, name');
  return rows;
};

exports.categories = async () => {
  const [rows] = await db.query('SELECT DISTINCT category FROM menu_items ORDER BY category');
  return rows.map((r) => r.category);
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0];
};

exports.findByIds = async (ids) => {
  if (!ids.length) return [];
  const [rows] = await db.query('SELECT * FROM menu_items WHERE id IN (?)', [ids]);
  return rows;
};

exports.create = ({ name, description, category, price }) =>
  db.query('INSERT INTO menu_items (name, description, category, price) VALUES (?, ?, ?, ?)',
    [name, description, category, price]);

exports.update = (id, { name, description, category, price }) =>
  db.query('UPDATE menu_items SET name = ?, description = ?, category = ?, price = ? WHERE id = ?',
    [name, description, category, price, id]);

exports.remove = (id) => db.query('DELETE FROM menu_items WHERE id = ?', [id]);

exports.toggleAvailability = (id) =>
  db.query('UPDATE menu_items SET is_available = 1 - is_available WHERE id = ?', [id]);
