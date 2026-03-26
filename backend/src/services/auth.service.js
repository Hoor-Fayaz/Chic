const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email is already registered');
    err.statusCode = 400;
    throw err;
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = signToken({ userId: user._id, role: user.role });

  return { user, token };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const passwordValid = await comparePassword(password, user.passwordHash);
  if (!passwordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (user.status === 'blocked') {
    const err = new Error('Your account is blocked');
    err.statusCode = 403;
    throw err;
  }

  const token = signToken({ userId: user._id, role: user.role });
  return { user, token };
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Incorrect current password');
    err.statusCode = 400;
    throw err;
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  return user;
}

async function getCurrentUser(userId) {
  return User.findById(userId).select('-passwordHash');
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  changePassword,
};

