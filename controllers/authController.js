const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

exports.home = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
};

exports.dashboard = (req, res) => {
  const role = req.session.user.role;
  if (role === 'admin') return res.redirect('/admin/reports');
  if (role === 'staff') return res.redirect('/staff/orders');
  res.redirect('/menu');
};

exports.showRegister = (req, res) => res.render('auth/register');

exports.register = async (req, res, next) => {
  try {
    const result = validationResult(req);
    const old = { name: req.body.name, email: req.body.email };
    if (!result.isEmpty()) {
      return res.status(400).render('auth/register', { errors: result.array().map((e) => e.msg), old });
    }
    const { name, email, password } = req.body;
    if (await userModel.findByEmail(email)) {
      return res.status(400).render('auth/register', { errors: ['That email is already registered.'], old });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await userModel.create({ name, email, passwordHash }); // role is always 'customer' here
    req.session.flash = { type: 'success', text: 'Account created. You can now log in.' };
    res.redirect('/login');
  } catch (err) { next(err); }
};

exports.showLogin = (req, res) => res.render('auth/login');

exports.login = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render('auth/login', {
        errors: result.array().map((e) => e.msg), old: { email: req.body.email }
      });
    }
    const user = await userModel.findByEmail(req.body.email.trim().toLowerCase());
    const ok = user && user.is_active && (await bcrypt.compare(req.body.password, user.password_hash));
    if (!ok) {
      return res.status(401).render('auth/login', {
        errors: ['Invalid email or password.'], old: { email: req.body.email }
      });
    }
    // New session id on login (prevents session fixation)
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.redirect('/dashboard');
    });
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};