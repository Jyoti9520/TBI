const express = require('express');
const router = express.Router();
const {
  getInvestors,
  getInvestorById,
  getInvestorMeta,
  saveInvestor,
  unsaveInvestor,
  getSavedInvestors,
  createInvestor,
  updateInvestor,
  deleteInvestor
} = require('../controllers/investorController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/meta', getInvestorMeta);
router.get('/user/saved', protect, getSavedInvestors);
router.get('/', optionalAuth, getInvestors);
router.get('/:id', optionalAuth, getInvestorById);
router.post('/:id/save', protect, saveInvestor);
router.delete('/:id/save', protect, unsaveInvestor);

// Admin-only operations
router.post('/', protect, adminOnly, createInvestor);
router.put('/:id', protect, adminOnly, updateInvestor);
router.delete('/:id', protect, adminOnly, deleteInvestor);

module.exports = router;
