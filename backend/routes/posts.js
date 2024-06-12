const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.postList);
router.get('/:postId', postController.getPost);

router.post('/', postController.createPost);

module.exports = router;
