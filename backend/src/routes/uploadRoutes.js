const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// POST /api/v1/uploads
// Allows admin to upload up to 50 images at once
router.post('/', protect, restrictTo('admin'), upload.array('images', 50), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    // req.files is populated by Multer-Cloudinary
    // mapped to an array of the secure URLs from Cloudinary
    const imageUrls = req.files.map(file => file.path);

    res.status(200).json({
      success: true,
      data: {
        urls: imageUrls
      }
    });


  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

module.exports = router;
