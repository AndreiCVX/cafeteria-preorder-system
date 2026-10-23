const menuModel = require('../models/menuModel');
const orderModel = require('../models/orderModel');

const OPEN_HOUR = parseInt(process.env.OPEN_HOUR || '7', 10);
const CLOSE_HOUR = parseInt(process.env.CLOSE_HOUR || '17', 10);

// ---------- Cart (stored in the session) ----------
exports.addToCart = (req, res) => {
  const id = parseInt(req.body.menu_item_id, 10);
  const qty = parseInt(req.body.quantity, 10);
  if (!Number.isInteger(id) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
    req.session.flash = { type: 'danger', text: 'Quantity must be a whole number from 1 to 20.' };
    return res.redirect('/menu');
  }
  req.session.cart = req.session.cart || {};
  req.session.cart[id] = Math.min((req.session.cart[id] || 0) + qty, 20);
  req.session.flash = { type: 'success', text: 'Added to your order.' };
  res.redirect('/menu');
};

exports.removeFromCart = (req, res) => {
  if (req.session.cart) delete req.session.cart[req.body.menu_item_id];
  res.redirect('/cart');
};

async function buildCart(session) {
  const cart = session.cart || {};
  const ids = Object.keys(cart).map(Number);
  const menu = await menuModel.findByIds(ids);
  const lines = menu.map((m) => ({
    ...m,
    quantity: cart[m.id],
    subtotal: m.price * cart[m.id]
  }));
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  return { lines, total };
}

exports.showCart = async (req, res, next) => {
  try {
    res.render('customer/cart', { ...(await buildCart(req.session)), openHour: OPEN_HOUR, closeHour: CLOSE_HOUR, old: {} });
  } catch (err) { next(err); }
};

// ---------- Place order ----------
exports.placeOrder = async (req, res, next) => {
  try {
    const cart = await buildCart(req.session);
    const errors = [];
    const render = () => res.status(400).render('customer/cart', {
      ...cart, openHour: OPEN_HOUR, closeHour: CLOSE_HOUR, errors, old: req.body
    });

    if (!cart.lines.length) { errors.push('Your order is empty.'); return render(); }

    const unavailable = cart.lines.filter((l) => !l.is_available).map((l) => l.name);
    if (unavailable.length) {
      errors.push(`No longer available: ${unavailable.join(', ')}. Please remove them.`);
    }

    const raw = (req.body.pickup_time || '').trim();
    const pickup = new Date(raw);
    if (!raw || isNaN(pickup.getTime())) {
      errors.push('Please choose a valid pickup date and time.');
    } else {
      if (pickup.getTime() < Date.now() + 10 * 60 * 1000) {
        errors.push('Pickup time must be at least 10 minutes from now.');
      }
      const h = pickup.getHours() + pickup.getMinutes() / 60;
      if (h < OPEN_HOUR || h > CLOSE_HOUR) {
        errors.push(`The cafeteria is open ${OPEN_HOUR}:00–${CLOSE_HOUR}:00. Choose a pickup time within these hours.`);
      }
    }

    const notes = (req.body.notes || '').trim();
    if (notes.length > 255) errors.push('Notes must be 255 characters or fewer.');
    if (errors.length) return render();

    const mysqlDate = raw.replace('T', ' ') + (raw.length === 16 ? ':00' : '');
    const items = cart.lines.map((l) => ({
      menu_item_id: l.id, quantity: l.quantity, unit_price: Number(l.price)
    }));
    const orderId = await orderModel.create(req.session.user.id, mysqlDate, notes, items);
    req.session.cart = {};
    req.session.flash = { type: 'success', text: `Order #${orderId} placed! We will have it ready at your pickup time.` };
    res.redirect('/orders');
  } catch (err) { next(err); }
};

// ---------- Customer order history ----------
exports.history = async (req, res, next) => {
  try {
    const orders = await orderModel.listByUser(req.session.user.id);
    const items = await orderModel.itemsForOrders(orders.map((o) => o.id));
    res.render('customer/orders', { orders, items });
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const ok = await orderModel.cancelOwnPending(req.params.id, req.session.user.id);
    req.session.flash = ok
      ? { type: 'success', text: 'Order cancelled.' }
      : { type: 'danger', text: 'Only your own pending orders can be cancelled.' };
    res.redirect('/orders');
  } catch (err) { next(err); }
};

// ---------- Staff queue ----------
exports.queue = async (req, res, next) => {
  try {
    const status = ['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(req.query.status)
      ? req.query.status : '';
    const orders = await orderModel.listAll(status);
    const items = await orderModel.itemsForOrders(orders.map((o) => o.id));
    res.render('staff/orders-queue', { orders, items, status, transitions: orderModel.TRANSITIONS });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);
    const next_ = req.body.status;
    if (!order) return res.status(404).render('error', { code: 404, message: 'Order not found.' });
    if (!orderModel.TRANSITIONS[order.status].includes(next_)) {
      req.session.flash = { type: 'danger', text: `Cannot change an order from ${order.status} to ${next_}.` };
    } else {
      await orderModel.updateStatus(order.id, next_);
      req.session.flash = { type: 'success', text: `Order #${order.id} is now ${next_}.` };
    }
    res.redirect('/staff/orders');
  } catch (err) { next(err); }
};
