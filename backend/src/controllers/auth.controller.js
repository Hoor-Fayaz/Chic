const { success } = require('../utils/apiResponse');
const { registerUser, loginUser, getCurrentUser, changePassword: changePasswordService } = require('../services/auth.service');
const { signToken } = require('../utils/jwt');

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await registerUser({ name, email, password });

    setAuthCookie(res, token);
    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Registered successfully',
      201
    );
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    setAuthCookie(res, token);
    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Logged in successfully'
    );
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await getCurrentUser(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return success(res, { user }, 'Current user');
  } catch (err) {
    return next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePasswordService(req.user.id, { currentPassword, newPassword });
    return success(res, null, 'Password updated successfully');
  } catch (err) {
    return next(err);
  }
}

function logout(req, res) {
  res.clearCookie('accessToken');
  return success(res, null, 'Logged out');
}

async function oauthSuccess(req, res) {
  // Passport puts the user in req.user
  const user = req.user;
  const token = signToken({ userId: user._id, role: user.role });

  setAuthCookie(res, token);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  // Redirect to frontend with token in query for client-side storage
  return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
}

module.exports = {
  register,
  login,
  me,
  logout,
  changePassword,
  oauthSuccess,
};

