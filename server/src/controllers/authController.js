const { Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ where: { email: normalizedEmail } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'USER'
    });

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'local',
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'local',
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile'
    });
  }
};

// @desc    Logout user / invalidate session
// @route   POST /api/auth/logout
// @access  Public / Private
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Google Sign-In / OAuth exchange (real ID token verification)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token credential is required. Fake or unverified sign-in requests are not permitted.'
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId || undefined
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid, malformed, or expired Google authentication credential'
      });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication credential did not contain a valid email address'
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || 'Google User';
    const avatar = payload.picture || null;

    // Locate existing user by email or googleId
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          ...(googleId ? [{ googleId }] : [])
        ]
      }
    });

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Link Google metadata if missing or previously local
      let updated = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (user.authProvider === 'local') {
        user.authProvider = 'google';
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    } else {
      // First-time Google user - create new account with high-entropy random password
      const crypto = require('crypto');
      const securePassword = crypto.randomBytes(32).toString('hex');

      user = await User.create({
        name: name.trim(),
        email,
        password: securePassword,
        role: 'USER',
        authProvider: 'google',
        googleId,
        avatar,
        isActive: true
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Signed in with Google successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || avatar,
        authProvider: user.authProvider || 'google',
        token
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during Google authentication'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  googleAuth
};
