const express = require('express');
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contact.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/v1/contacts
 * @desc Log a new contact message
 */
router.post('/', submitContact);

/**
 * @route GET /api/v1/contacts
 * @desc Admin: Get all contacts
 */
router.get('/', protect, requireAdmin, getContacts);

/**
 * @route PUT /api/v1/contacts/:id/status
 * @desc Admin: Update contact status
 */
router.put('/:id/status', protect, requireAdmin, updateContactStatus);

module.exports = router;
