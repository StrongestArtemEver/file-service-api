const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);

router.post('/signin', authController.signin);

router.post('/signin/new_token', authController.refreshToken);

router.get('/logout', verifyToken, authController.logout);

module.exports = router;