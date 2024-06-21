const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.createUser);
router.post('/login', authController.login);
router.post('/user', authController.getUser)

module.exports = router;
