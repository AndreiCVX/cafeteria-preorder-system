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

module.exports = router;
