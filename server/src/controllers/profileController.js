const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user.id }).populate('user', 'name email role');
    if (!profile) {
      profile = await UserProfile.create({ user: req.user.id });
    }
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile / complete onboarding
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      college,
      degree,
      branch,
      currentYear,
      graduationYear,
      skills,
      programmingLanguages,
      areasOfInterest,
      targetRole,
      preparationGoals,
      currentPreparationLevel,
      bio,
      socialLinks,
      name
    } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user.id, { name, isOnboarded: true });
    } else {
      await User.findByIdAndUpdate(req.user.id, { isOnboarded: true });
    }

    let profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new UserProfile({ user: req.user.id });
    }

    if (college !== undefined) profile.college = college;
    if (degree !== undefined) profile.degree = degree;
    if (branch !== undefined) profile.branch = branch;
    if (currentYear !== undefined) profile.currentYear = currentYear;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (programmingLanguages !== undefined) profile.programmingLanguages = Array.isArray(programmingLanguages) ? programmingLanguages : programmingLanguages.split(',').map(s => s.trim());
    if (areasOfInterest !== undefined) profile.areasOfInterest = Array.isArray(areasOfInterest) ? areasOfInterest : areasOfInterest.split(',').map(s => s.trim());
    if (targetRole !== undefined) profile.targetRole = targetRole;
    if (preparationGoals !== undefined) profile.preparationGoals = preparationGoals;
    if (currentPreparationLevel !== undefined) profile.currentPreparationLevel = currentPreparationLevel;
    if (bio !== undefined) profile.bio = bio;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;

    profile.updatedAt = Date.now();
    await profile.save();

    const updatedUser = await User.findById(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isOnboarded: updatedUser.isOnboarded
      }
    });
  } catch (err) {
    next(err);
  }
};
