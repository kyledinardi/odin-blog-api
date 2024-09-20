const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createComment = [
  passport.authenticate('jwt', { session: false }),
  body('text', 'Comment text must not be empty').trim().notEmpty(),

  asyncHandler(async (req, res, next) => {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postId, 10) },
    });

    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }

    const comment = {
      text: req.body.text,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty) {
      return res.json({ comment, errors: errors.array() });
    }

    const newComment = await prisma.comment.create({ data: comment });

    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: parseInt(req.user.id, 10) },
        data: { comments: { connect: { id: newComment.id } } },
      }),

      prisma.post.update({
        where: { id: post.id },
        data: { comments: { connect: { id: newComment.id } } },
      }),
    ]);

    newComment.user = user;

    return res.json({ comment: newComment, errors: null });
  }),
];

exports.updateComment = [
  passport.authenticate('jwt', { session: false }),
  body('text', 'Comment text must not be empty').trim().notEmpty(),

  asyncHandler(async (req, res, next) => {
    const [post, comment] = await Promise.all([
      prisma.post.findUnique({
        where: { id: parseInt(req.params.postId, 10) },
      }),

      prisma.comment.findUnique({
        where: { id: parseInt(req.params.commentId, 10) },
      }),
    ]);

    if (!post || !comment) {
      const err = new Error(`${!post ? 'Post' : 'Comment'} not found`);
      err.status = 404;
      return next(err);
    }

    if (req.user.id !== comment.userId) {
      const err = new Error('You cannot edit this comment');
      err.status = 403;
      return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty) {
      return res.json({ comment, errors: errors.array() });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment.id },
      data: { text: req.body.text },
      include: { user: true },
    });

    return res.json({ comment: updatedComment, errors: null });
  }),
];

exports.deleteComment = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res, next) => {
    const [post, comment] = await Promise.all([
      prisma.post.findUnique({
        where: { id: parseInt(req.params.postId, 10) },
      }),

      prisma.comment.findUnique({
        where: { id: parseInt(req.params.commentId, 10) },
        include: { user: true },
      }),
    ]);

    if (!post || !comment) {
      const err = new Error(`${!post ? 'Post' : 'Comment'} not found`);
      err.status = 404;
      return next(err);
    }

    if (req.user.id !== comment.user.id && !req.user.isAdmin) {
      const err = new Error('You cannot delete this comment');
      err.status = 403;
      return next(err);
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: comment.id },
    });

    return res.json({ comment: deletedComment });
  }),
];
