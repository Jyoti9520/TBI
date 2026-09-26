const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
