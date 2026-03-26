// backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded.userId || decoded.id;
    req.user = { id: uid, _id: uid, role: decoded.role };
    // Optional: fetch full user
    // req.user = await User.findById(decoded.id).select('_id role email');
    next();
  } catch (err) {
    console.error('protect middleware:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

const requireAdmin = (req, res, next) => {
  // Optional role check if you store role in req.user
  next();
};

module.exports = { protect, requireAdmin };