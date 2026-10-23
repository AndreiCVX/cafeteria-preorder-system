const userModel = require('../models/userModel');

exports.list = async (req, res, next) => {
  try {
    res.render('admin/users', { users: await userModel.list() });
  } catch (err) { next(err); }
};

exports.changeRole = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const role = req.body.role;
    if (!Number.isInteger(id)) {
      req.session.flash = { type: 'danger', text: 'User not found.' };
    } else if (!['customer', 'staff', 'admin'].includes(role)) {
      req.session.flash = { type: 'danger', text: 'Invalid role.' };
    } else if (id === req.session.user.id) {
      req.session.flash = { type: 'danger', text: 'You cannot change your own role.' };
    } else {
      await userModel.setRole(id, role);
      req.session.flash = { type: 'success', text: 'Role updated.' };
    }
    res.redirect('/admin/users');
  } catch (err) { next(err); }
};

exports.toggleActive = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      req.session.flash = { type: 'danger', text: 'User not found.' };
    } else if (id === req.session.user.id) {
      req.session.flash = { type: 'danger', text: 'You cannot deactivate your own account.' };
    } else {
      const user = await userModel.findById(id);
      if (user) await userModel.setActive(id, !user.is_active);
      req.session.flash = { type: 'success', text: 'Account status updated.' };
    }
    res.redirect('/admin/users');
  } catch (err) { next(err); }
};