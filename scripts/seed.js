// Creates test accounts with bcrypt-hashed passwords.
// Run once after importing schema.sql:  npm run seed
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');

const accounts = [
  { name: 'Admin User', email: 'admin@cafeteria.test', password: 'Admin123!', role: 'admin' },
  { name: 'Cafeteria Staff', email: 'staff@cafeteria.test', password: 'Staff123!', role: 'staff' },
  { name: 'Test Customer', email: 'customer@cafeteria.test', password: 'Customer123!', role: 'customer' }
];

(async () => {
  try {
    for (const a of accounts) {
      const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [a.email]);
      if (rows.length) { console.log(`Skipped (exists): ${a.email}`); continue; }
      const hash = await bcrypt.hash(a.password, 12);
      await db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [a.name, a.email, hash, a.role]);
      console.log(`Created ${a.role}: ${a.email}`);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await db.end();
  }
})();