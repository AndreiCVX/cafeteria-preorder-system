const { validationResult } = require('express-validator');
const menuModel = require('../models/menuModel');

// ----- Customer -----
exports.browse = async (req, res, next) => {
  try {
    const search = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();
    const [items, categories] = await Promise.all([
      menuModel.listAvailable(search, category),
      menuModel.categories()
    ]);
    res.render('customer/menu', { items, categories, search, category });
  } catch (err) { next(err); }
};


// ----- Staff -----
exports.manage = async (req, res, next) => {
  try {
    res.render('staff/menu-manage', { items: await menuModel.listAll() });
  } catch (err) { next(err); }
};

exports.showNew = (req, res) => res.render('staff/menu-form', { item: null, action: '/staff/menu' });

exports.create = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render('staff/menu-form', {
        item: null, action: '/staff/menu', errors: result.array().map((e) => e.msg), old: req.body
      });
    }
    await menuModel.create(req.body);
    req.session.flash = { type: 'success', text: 'Menu item added.' };
    res.redirect('/staff/menu');
  } catch (err) { next(err); }
};

exports.showEdit = async (req, res, next) => {
  try {
    const item = await menuModel.findById(req.params.id);
    if (!item) return res.status(404).render('error', { code: 404, message: 'Menu item not found.' });
    res.render('staff/menu-form', { item, action: `/staff/menu/${item.id}` });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await menuModel.findById(req.params.id);
    if (!item) return res.status(404).render('error', { code: 404, message: 'Menu item not found.' });
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render('staff/menu-form', {
        item, action: `/staff/menu/${item.id}`, errors: result.array().map((e) => e.msg), old: req.body
      });
    }
    await menuModel.update(item.id, req.body);
    req.session.flash = { type: 'success', text: 'Menu item updated.' };
    res.redirect('/staff/menu');
  } catch (err) { next(err); }
};

exports.toggle = async (req, res, next) => {
  try {
    await menuModel.toggleAvailability(req.params.id);
    res.redirect('/staff/menu');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await menuModel.remove(req.params.id);
    req.session.flash = { type: 'success', text: 'Menu item deleted.' };
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      req.session.flash = {
        type: 'danger',
        text: 'This item is part of past orders and cannot be deleted. Mark it as sold out instead.'
      };
    } else return next(err);
  }
  res.redirect('/staff/menu');
};
