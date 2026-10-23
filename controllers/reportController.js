const orderModel = require('../models/orderModel');

const iso = (d) => d.toISOString().slice(0, 10);

exports.show = async (req, res, next) => {
  try {
    const today = new Date();
    const monthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const valid = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
    let from = valid(req.query.from) ? req.query.from : iso(monthAgo);
    let to = valid(req.query.to) ? req.query.to : iso(today);
    const errors = [];
    if (from > to) { errors.push('"From" date must not be after "To" date.'); from = iso(monthAgo); to = iso(today); }
    const { summary, top } = await orderModel.report(from, to);
    res.render('admin/reports', { summary, top, from, to, errors });
  } catch (err) { next(err); }
};