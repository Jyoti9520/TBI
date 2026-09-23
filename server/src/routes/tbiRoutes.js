const express = require('express');
const router = express.Router();
const {
  getTbis,
  getTbiById,
  searchTbis,
  getSuggestions,
  getNearbyTbis,
  createTbi,
  updateTbi,
  deleteTbi
} = require('../controllers/tbiController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public with optional auth for favorite status
router.get('/', optionalAuth, getTbis);
router.get('/search', optionalAuth, searchTbis);
router.get('/suggestions', getSuggestions);
router.get('/nearby', getNearbyTbis);
router.get('/:id', optionalAuth, getTbiById);

// Admin-only endpoints
router.post('/', protect, adminOnly, createTbi);
router.put('/:id', protect, adminOnly, updateTbi);
router.delete('/:id', protect, adminOnly, deleteTbi);

module.exports = router;
