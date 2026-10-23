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
