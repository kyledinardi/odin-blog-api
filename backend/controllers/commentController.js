const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.createComment = [
  passport.authenticate('jwt', { session: false }),

  body('text', 'Comment text must not be empty')
    .trim()
    .escape()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const post = await Post.findById(req.params.postId).exec();

    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }

    const comment = new Comment({
      user: req.user.id,
      post: req.params.postId,
      timestamp: Date.now(),
      text: req.body.text,
    });

    if (errors.isEmpty()) {
      await comment.save();
    }

    const comments = await Comment.find({ post: req.params.postId }).populate('user').exec();
    const response = { comments, errors: errors ? errors.array() : [] };
    return res.json(response);
  }),
];

exports.updateComment = [
  passport.authenticate('jwt', { session: false }),

  body('text', 'Comment text must not be empty')
    .trim()
    .escape()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const post = await Post.findById(req.params.postId).exec();

    let comment = await Comment.findById(req.params.commentId)
      .populate('user')
      .exec();

    if (!post || !comment) {
      const err = new Error(`${!post ? 'Post' : 'Comment'} not found`);
      err.status = 404;
      return next(err);
    }

    if (req.user.id !== comment.user.id) {
      const err = new Error('You cannot edit this comment');
      err.status = 403;
      return next(err);
    }

    if (errors.isEmpty) {
      comment = await Comment.findByIdAndUpdate(comment.id, {
        text: req.body.text,
        _id: req.params.commentId,
      });
    }

    const comments = await Comment.find({ post: req.params.postId }).populate('user').exec();
    const response = { comments, errors: errors ? errors.array() : [] };
    return res.json(response);
  }),
];

exports.deleteComment = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res, next) => {
    const [post, comment] = await Promise.all([
      await Post.findById(req.params.postId).exec(),
      await Comment.findById(req.params.commentId).populate('user').exec(),
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

    await Comment.findByIdAndDelete(req.params.commentId).exec();
    const comments = await Comment.find({ post: req.params.postId }).populate('user').exec();
    return res.json(comments);
  }),
];
