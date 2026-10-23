const router = require('express').Router();
const menu = require('../controllers/menuController');
const requireRole = require('../middleware/role');
const v = require('../middleware/validators');

// Customer
router.get('/menu', requireRole('customer', 'staff', 'admin'), menu.browse);

// Staff (admin allowed too)
const staff = requireRole('staff', 'admin');
router.get('/staff/menu', staff, menu.manage);
router.get('/staff/menu/new', staff, menu.showNew);
router.post('/staff/menu', staff, v.menuItem, menu.create);
router.get('/staff/menu/:id/edit', staff, menu.showEdit);
router.post('/staff/menu/:id', staff, v.menuItem, menu.update);
router.post('/staff/menu/:id/toggle', staff, menu.toggle);
router.post('/staff/menu/:id/delete', staff, menu.remove);

module.exports = router;