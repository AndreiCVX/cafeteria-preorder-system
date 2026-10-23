const router = require('express').Router();
const users = require('../controllers/userController');
const reports = require('../controllers/reportController');
const requireRole = require('../middleware/role');

// Every route in this file is admin-only
router.use(requireRole('admin'));

router.get('/users', users.list);
router.post('/users/:id/role', users.changeRole);
router.post('/users/:id/toggle', users.toggleActive);
router.get('/reports', reports.show);

module.exports = router;