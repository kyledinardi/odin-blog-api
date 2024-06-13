const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  return res.json(user);
});

exports.createUser = [
  asyncHandler(
    body('email')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Email must not be empty')
      .isEmail()
      .withMessage('Email must be a valid email address')
      .custom(async (value) => {
        const emailInDatabase = await User.findOne({ email: value }).exec();
        if (emailInDatabase) {
          throw new Error('A user already exists with this e-mail address');
        }
      }),
  ),
  body('password', 'Password must not be empty')
    .trim()
    .escape()
    .isLength({ min: 1 }),
  body('passwordConfirmation', 'Passwords did not match')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    
    if (errors.isEmpty()) {
      await user.save();
    }
    const response = { user, errors: errors ? errors.array() : [] };
    res.json(response);
  }),
];
