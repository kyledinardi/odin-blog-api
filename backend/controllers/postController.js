const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');
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

  const response = { post, comments };

  res.json(response);
});
