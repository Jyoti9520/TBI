const express = require('express');
const router = express.Router();
const {
  createSuggestion,
  getSuggestions,
  updateSuggestionStatus
} = require('../controllers/suggestionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createSuggestion);
router.get('/', protect, getSuggestions);
router.put('/:id', protect, adminOnly, updateSuggestionStatus);

module.exports = router;
