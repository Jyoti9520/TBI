const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user routes require authentication

router.get('/favorites', getFavorites);
router.post('/favorites/:tbiId', addFavorite);
router.delete('/favorites/:tbiId', removeFavorite);
router.put('/profile', updateProfile);

module.exports = router;
