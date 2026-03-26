const express = require('express');
const {
  getUsers,
  updateUserStatus,
} = require('../controllers/user.controller');

const { protect, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Admin only
router.get('/', protect, requireAdmin, getUsers);
router.patch('/:id/status', protect, requireAdmin, updateUserStatus);

module.exports = router;