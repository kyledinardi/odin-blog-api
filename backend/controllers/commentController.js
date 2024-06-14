const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.createComment = [
  body('text', 'Comment text must not be empty')
    .trim()
    .escape()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.postId).exec();

    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req);

    const comment = new Comment({
      user: req.user.id,
      post: req.params.postId,
      timestamp: Date.now(),
      text: req.body.text,
    });

    if (errors.isEmpty()) {
      await comment.save();
    }
    const response = { comment, errors: errors ? errors.array() : [] };
    return res.json(response);
  }),
];
