const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const UserProgress = require('../models/UserProgress');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });

    // Automatically initialize linked profile and clean zeroed progress records (no fake data)
    const profile = await UserProfile.create({
      user: user._id,
      targetRole: 'Software Development Engineer (SDE-1)'
    });

    const progress = await UserProgress.create({
      user: user._id,
      overallScore: 0,
      streakCount: 0,
      questionsSolved: 0,
      mockInterviewsCompleted: 0,
      mockOACompleted: 0,
      learningHours: 0,
      weeklyActivity: [
        { day: 'Mon', hours: 0, questions: 0 },
        { day: 'Tue', hours: 0, questions: 0 },
        { day: 'Wed', hours: 0, questions: 0 },
        { day: 'Thu', hours: 0, questions: 0 },
        { day: 'Fri', hours: 0, questions: 0 },
        { day: 'Sat', hours: 0, questions: 0 },
        { day: 'Sun', hours: 0, questions: 0 }
      ],
      recentActivities: [
        {
          type: 'account',
          title: 'Welcome to PrepAI! Account successfully created.',
          timestamp: new Date()
        }
      ]
    });

    // Fire-and-forget welcome email
    sendWelcomeEmail({ toEmail: user.email, toName: user.name }).catch((err) => {
      console.warn('[Auth] Welcome email failed:', err.message);
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnboarded: user.isOnboarded
      },
      profile,
      progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let profile = await UserProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await UserProfile.create({ user: user._id });
    }

    let progress = await UserProgress.findOne({ user: user._id });
    if (!progress) {
      progress = await UserProgress.create({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnboarded: user.isOnboarded
      },
      profile,
      progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await UserProfile.findOne({ user: req.user.id });
    const progress = await UserProgress.findOne({ user: req.user.id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt
      },
      profile,
      progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password — generates reset token and sends email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
    const emailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      toName: user.name,
      resetToken,
      resetUrl
    });

    res.json({
      success: true,
      message: emailResult.skipped
        ? 'SMTP not configured — use the development reset link below to reset your password.'
        : 'Password reset link has been dispatched to your email address.',
      ...(emailResult.skipped && config.nodeEnv !== 'production' ? { devResetUrl: `/reset-password?token=${resetToken}` } : {})
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};
