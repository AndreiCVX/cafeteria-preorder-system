require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET is not set. Copy .env.example to .env first.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 } // 2 hours
  })
);

// Values available in every view
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.cartCount = Object.values(req.session.cart || {}).reduce((a, b) => a + b, 0);
  res.locals.errors = [];
  res.locals.old = {};

  // Helpers used by the views
  res.locals.path = req.originalUrl.split('?')[0];
  res.locals.openHour = parseInt(process.env.OPEN_HOUR || '7', 10);
  res.locals.closeHour = parseInt(process.env.CLOSE_HOUR || '17', 10);
  res.locals.peso = (n) => '\u20B1' + Number(n).toFixed(2);
  res.locals.hourLabel = (h) => `${((Number(h) + 11) % 12) + 1}:00 ${Number(h) >= 12 ? 'pm' : 'am'}`;
  res.locals.pickupTime = (s) => {
    const hh = parseInt(s.slice(11, 13), 10);
    return `${((hh + 11) % 12) + 1}:${s.slice(14, 16)} ${hh >= 12 ? 'pm' : 'am'}`;
  };
  res.locals.pickupDay = (s) => {
    const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    const d = s.slice(0, 10);
    const now = new Date();
    if (d === iso(now)) return 'Today';
    if (d === iso(new Date(now.getTime() + 864e5))) return 'Tomorrow';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  next();
});

app.use('/', authRoutes);
app.use('/', menuRoutes);
app.use('/', orderRoutes);

app.use((req, res) => {
  res.status(404).render('error', { code: 404, message: 'Page not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { code: 500, message: 'Something went wrong on our side.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cafeteria Pre-order System running at http://localhost:${PORT}`));