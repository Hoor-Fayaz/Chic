const User = require('../models/User');

async function listUsers(query) {
  const { page = 1, limit = 10, role, status } = query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
}

async function updateUserStatus(id, status) {
  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).select('-passwordHash');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

module.exports = {
  listUsers,
  updateUserStatus,
};