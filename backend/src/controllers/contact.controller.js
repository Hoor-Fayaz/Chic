const Contact = require('../models/Contact');

/**
 * @desc    Submit a new contact message
 * @route   POST /api/v1/contacts
 * @access  Public
 */
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message',
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      data: newContact,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/v1/contacts
 * @access  Private/Admin
 */
exports.getContacts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/v1/contacts/:id/status
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
       return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
