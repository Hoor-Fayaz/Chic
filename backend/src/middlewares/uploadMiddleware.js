const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chic_boutique_products', // folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1800, crop: 'limit' }] // basic optimization
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
