const StudyMaterial = require('../models/StudyMaterial');
const UserProgress = require('../models/UserProgress');

// @desc    Get all study materials with search and filters
// @route   GET /api/study
// @access  Private
exports.getStudyMaterials = async (req, res, next) => {
  try {
    const { category, search, difficulty } = req.query;

    let filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const materials = await StudyMaterial.find(filter).sort({ createdAt: -1 });

    const formatted = materials.map(m => ({
      _id: m._id,
      title: m.title,
      category: m.category,
      topic: m.topic,
      difficulty: m.difficulty,
      summary: m.summary,
      readTimeMinutes: m.readTimeMinutes,
      keyTakeaways: m.keyTakeaways,
      tags: m.tags,
      isBookmarked: m.bookmarkedBy ? m.bookmarkedBy.includes(req.user.id) : false,
      isCompleted: m.completedBy ? m.completedBy.includes(req.user.id) : false
    }));

    res.json({ success: true, count: formatted.length, materials: formatted });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single study material with full content
// @route   GET /api/study/:id
// @access  Private
exports.getStudyMaterialById = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const isBookmarked = material.bookmarkedBy ? material.bookmarkedBy.includes(req.user.id) : false;
    const isCompleted = material.completedBy ? material.completedBy.includes(req.user.id) : false;

    res.json({
      success: true,
      material: {
        ...material.toObject(),
        isBookmarked,
        isCompleted
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle bookmark on study resource
// @route   POST /api/study/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const index = material.bookmarkedBy.indexOf(req.user.id);
    let bookmarked = false;
    if (index === -1) {
      material.bookmarkedBy.push(req.user.id);
      bookmarked = true;
    } else {
      material.bookmarkedBy.splice(index, 1);
      bookmarked = false;
    }

    await material.save();

    res.json({
      success: true,
      isBookmarked: bookmarked,
      message: bookmarked ? 'Added to your bookmarks' : 'Removed from bookmarks'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark resource as completed
// @route   POST /api/study/:id/complete
// @access  Private
exports.toggleComplete = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const index = material.completedBy.indexOf(req.user.id);
    let completed = false;
    if (index === -1) {
      material.completedBy.push(req.user.id);
      completed = true;

      await UserProgress.findOneAndUpdate(
        { user: req.user.id },
        {
          $inc: { learningHours: Math.round((material.readTimeMinutes / 60) * 10) / 10 },
          $push: {
            recentActivities: {
              $each: [
                {
                  type: 'study',
                  title: `Completed study module: ${material.title}`,
                  timestamp: new Date()
                }
              ],
              $slice: -15
            }
          }
        }
      );
    } else {
      material.completedBy.splice(index, 1);
      completed = false;
    }

    await material.save();

    res.json({
      success: true,
      isCompleted: completed,
      message: completed ? 'Module marked as completed!' : 'Module marked as in-progress'
    });
  } catch (err) {
    next(err);
  }
};
