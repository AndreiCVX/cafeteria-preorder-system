// Blocks anyone who is not logged in
module.exports = function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'warning', text: 'Please log in to continue.' };
    return res.redirect('/login');
  }
  next();
};