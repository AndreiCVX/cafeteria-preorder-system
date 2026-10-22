const router = require('express').Router();
const auth = require('../controllers/authController');
const requireLogin = require('../middleware/auth');
const v = require('../middleware/validators');

router.get('/', auth.home);
router.get('/dashboard', requireLogin, auth.dashboard);
router.get('/register', auth.showRegister);
router.post('/register', v.register, auth.register);
router.get('/login', auth.showLogin);
router.post('/login', v.login, auth.login);
router.post('/logout', auth.logout);

module.exports = router;