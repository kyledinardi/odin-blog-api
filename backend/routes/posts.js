const express = require('express');
const postController = require('../controllers/postController')

const router = express.Router();

router.get('/', postController.postList);
router.get('/:postId', postController.getPost);

module.exports = router;
