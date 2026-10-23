const router = require('express').Router();
const order = require('../controllers/orderController');
const requireRole = require('../middleware/role');

// Customer
const customer = requireRole('customer');
router.post('/cart/add', customer, order.addToCart);
router.post('/cart/remove', customer, order.removeFromCart);
router.get('/cart', customer, order.showCart);
router.post('/orders', customer, order.placeOrder);
router.get('/orders', customer, order.history);
router.post('/orders/:id/cancel', customer, order.cancel);

// Staff
const staff = requireRole('staff', 'admin');
router.get('/staff/orders', staff, order.queue);
router.post('/staff/orders/:id/status', staff, order.updateStatus);

module.exports = router;