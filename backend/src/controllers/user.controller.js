const { success } = require('../utils/apiResponse');
const {
  listUsers,
  updateUserStatus,
} = require('../services/user.service');

async function getUsers(req, res, next) {
  try {
    const result = await listUsers(req.query);
    return success(res, result);
  } catch (err) {
    return next(err);
  }
}

async function updateUserStatusHandler(req, res, next) {
  try {
    const { status } = req.body;
    const user = await updateUserStatus(req.params.id, status);
    return success(res, { user }, 'User status updated');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUsers,
  updateUserStatus: updateUserStatusHandler,
};