const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getStats,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  importDataset
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// All routes require Admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.post('/import', upload.single('file'), importDataset);

module.exports = router;
