const router = require('express').Router();
const menu = require('../controllers/menuController');
const requireRole = require('../middleware/role');

// Customer
router.get('/menu', requireRole('customer', 'staff', 'admin'), menu.browse);

module.exports = router;
