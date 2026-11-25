const Roadmap = require('../models/Roadmap');
const UserProgress = require('../models/UserProgress');
const aiService = require('../services/aiService');

// @desc    Get active roadmap for user
// @route   GET /api/roadmaps
// @access  Private
exports.getRoadmaps = async (req, res, next) => {
  try {
    let roadmap = await Roadmap.findOne({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });

    if (!roadmap) {
      // Auto-generate a personalized default 8-week roadmap if none exists yet
      const generated = await aiService.generateRoadmap({
        targetRole: 'Software Development Engineer',
        durationWeeks: 8,
        dailyStudyHours: 3,
        currentLevel: 'Intermediate'
      });

      roadmap = await Roadmap.create({
        user: req.user.id,
        targetRole: generated.targetRole,
        durationWeeks: generated.durationWeeks,
        dailyStudyHours: generated.dailyStudyHours,
        experienceLevel: generated.experienceLevel,
        weeklySchedule: generated.weeklySchedule,
        completionPercentage: 0
      });
    }

    res.json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

// @desc    Create / Regenerate roadmap
// @route   POST /api/roadmaps
// @access  Private
exports.createRoadmap = async (req, res, next) => {
  try {
    const { targetRole, durationWeeks, dailyStudyHours, currentLevel, weakAreas } = req.body;

    // Archive previous active roadmaps
    await Roadmap.updateMany({ user: req.user.id }, { isActive: false });

    const generated = await aiService.generateRoadmap({
      targetRole: targetRole || 'Software Development Engineer',
      durationWeeks: Number(durationWeeks) || 8,
      dailyStudyHours: Number(dailyStudyHours) || 3,
      currentLevel: currentLevel || 'Intermediate',
      weakAreas: weakAreas || []
    });

    const roadmap = await Roadmap.create({
      user: req.user.id,
      targetRole: generated.targetRole,
      durationWeeks: generated.durationWeeks,
      dailyStudyHours: generated.dailyStudyHours,
      experienceLevel: generated.experienceLevel,
      weeklySchedule: generated.weeklySchedule,
      completionPercentage: 0,
      isActive: true
    });

    await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          recentActivities: {
            $each: [
              {
                type: 'roadmap',
                title: `Generated new ${roadmap.durationWeeks}-Week ${roadmap.targetRole} Roadmap`,
                timestamp: new Date()
              }
            ],
            $slice: -15
          }
        }
      }
    );

    res.status(201).json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle task completion status inside roadmap
// @route   PUT /api/roadmaps/:id/tasks/:taskId
// @access  Private
exports.toggleTask = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    let taskFound = false;
    let totalTasks = 0;
    let completedTasks = 0;

    for (const week of roadmap.weeklySchedule) {
      for (const t of week.tasks) {
        if (t.id === req.params.taskId) {
          t.isCompleted = !t.isCompleted;
          t.completedAt = t.isCompleted ? new Date() : null;
          taskFound = true;
        }
        totalTasks++;
        if (t.isCompleted) completedTasks++;
      }
    }

    if (!taskFound) {
      return res.status(404).json({ success: false, message: 'Task ID not found in roadmap' });
    }

    roadmap.completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    roadmap.updatedAt = Date.now();
    await roadmap.save();

    res.json({
      success: true,
      completionPercentage: roadmap.completionPercentage,
      roadmap
    });
  } catch (err) {
    next(err);
  }
};
