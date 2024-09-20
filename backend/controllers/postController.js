const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.postList = asyncHandler(async (req, res, next) => {
  const posts = await prisma.post.findMany({ orderBy: { timestamp: 'desc' } });
  return res.json({ posts });
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    prisma.post.findUnique({
      where: { id: parseInt(req.params.postId, 10) },
      include: { comments: true },
    }),

    prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId, 10) },
      include: { user: true },
    }),
  ]);

  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    return next(err);
  }

  return res.json({ post, comments });
});

exports.createPost = [
  passport.authenticate('jwt', { session: false }),
  body('title', 'Title must not be empty').trim().notEmpty(),
  body('text', 'Post text must not be empty').trim().notEmpty(),

  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      const err = new Error('You are not an admin');
      err.status = 403;
      return next(err);
    }

    const errors = validationResult(req);

    const post = {
      title: req.body.title,
      text: req.body.text,
      isPublished: req.body.isPublished,
    };

    if (!errors.isEmpty()) {
      return res.json({ post, errors: errors.array() });
    }

    const newPost = await prisma.post.create({ data: post });
    return res.json({ post: newPost, errors: null });
  }),
];

exports.updatePost = [
  passport.authenticate('jwt', { session: false }),
  body('title', 'Title must not be empty').trim().notEmpty(),
  body('text', 'Post text must not be empty').trim().notEmpty(),

  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      const err = new Error('You are not an admin');
      err.status = 403;
      return next(err);
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postId, 10) },
    });

    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ post, errors: errors.array() });
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },

      data: {
        title: req.body.title,
        text: req.body.text,
        isPublished: req.body.isPublished,
      },
    });

    return res.json({ post: updatedPost, errors: null });
  }),
];

exports.deletePost = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      const err = new Error('You are not an admin');
      err.status = 403;
      return next(err);
    }

    const [post] = await Promise.all([
      prisma.post.delete({
        where: { id: parseInt(req.params.postId, 10) },
      }),

      prisma.comment.deleteMany({
        where: { postId: parseInt(req.params.postId, 10) },
      }),
    ]);

    return res.json({ post });
  }),
];
