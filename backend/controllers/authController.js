const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createUser = [
  asyncHandler(
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email must not be empty')
      .isEmail()
      .withMessage('Email must be a valid email address')

      .custom(async (value) => {
        const emailInDatabase = await prisma.user.findUnique({
          where: { email: value },
        });

        if (emailInDatabase) {
          throw new Error('A user already exists with this email address');
        }
      }),
  ),

  body('password', 'Password must not be empty').trim().notEmpty(),

  body('passwordConfirmation', 'Passwords did not match')
    .trim()
    .custom((value, { req }) => value === req.body.password),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        user: { email: req.body.email, password: req.body.password },
        errors: errors.array(),
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: { email: req.body.email, passwordHash: hashedPassword },
    });

    return res.json({ user, errors: null });
  }),
];

exports.login = (req, res, next) => [
  body('email').trim(),
  body('password').trim(),

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = new Error(info ? info.message : 'User not found');
      error.status = 403;
      return next(error);
    }

    req.login(user, { session: false }, (err2) => {
      if (err2) {
        return next(err2);
      }

      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.json({ user, token });
    });

    return null;
  })(req, res, next),
];

exports.getUser = (req, res, next) =>
  res.json({ user: jwt.verify(req.body.token, process.env.JWT_SECRET) });
