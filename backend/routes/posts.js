const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', postController.postList);
router.get('/:postId', postController.getPost);

router.post('/', postController.createPost);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);

router.post('/:postId/comments', commentController.createComment);
router.put('/:postId/comments/:commentId', commentController.updateComment);

module.exports = router;
