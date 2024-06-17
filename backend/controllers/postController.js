const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.postList = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ isPublished: true })
    .sort({ timestamp: 1 })
    .exec();

  res.json(posts);
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.postId).exec(),
    Comment.find({ post: req.params.postId })
      .populate('user')
      .sort({ timestamp: 1 })
      .exec(),
  ]);

  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    return next(err);
  }

  const response = { post, comments };
  return res.json(response);
});

exports.createPost = [
  passport.authenticate('jwt', { session: false }),

  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Post text must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      const err = new Error('You are not an admin');
      err.status = 403;
      return next(err);
    }

    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      timestamp: Date.now(),
      text: req.body.text,
      isPublished: req.body.isPublished === 'on',
    });

    if (errors.isEmpty()) {
      await post.save();
    }
    const response = { post, errors: errors ? errors.array() : [] };
    return res.json(response);
  }),
];

exports.updatePost = [
  passport.authenticate('jwt', { session: false }),
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Post text must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      const err = new Error('You are not an admin');
      err.status = 403;
      return next(err);
    }

    const errors = validationResult(req);
    let post = await Post.findById(req.params.postId).exec();

    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }

    if (errors.isEmpty()) {
      post = await Post.findByIdAndUpdate(post.id, {
        title: req.body.title,
        text: req.body.text,
        isPublished: req.body.isPublished === 'on',
        _id: req.params.postId,
      }).exec();
    }

    const response = { post, errors: errors ? errors.array() : [] };
    return res.json(response);
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
    
    const [post, comments] = await Promise.all([
      Post.findById(req.params.postId).exec(),
      Comment.find({ post: req.params.postId }).exec(),
    ]);

    await Promise.all([
      Post.findByIdAndDelete(req.params.postId).exec(),
      Comment.deleteMany({ post: req.params.postId }).exec(),
    ]);

    const response = { post, comments };
    return res.json(response);
  }),
];
