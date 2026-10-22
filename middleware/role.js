// Allows only the listed roles. Usage: requireRole('staff', 'admin')
module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.flash = { type: 'warning', text: 'Please log in to continue.' };
      return res.redirect('/login');
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        code: 403,
        message: 'You do not have permission to view this page.'
      });
    }
    next();
  };
};