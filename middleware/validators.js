const { body } = require('express-validator');

exports.register = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 }).withMessage('Password must be 8–72 characters.'),
  body('confirmPassword').custom((v, { req }) => v === req.body.password).withMessage('Passwords do not match.')
];

exports.login = [
  body('email').trim().notEmpty().withMessage('Email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];
