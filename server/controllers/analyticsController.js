const User = require('../models/User');

// Track user activity from frontend sessions.
exports.trackActivity = async (req, res) => {
  try {
    const { email, sessionSeconds = 0, leadSource, tags = [] } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const update = {
      $inc: { totalTimeSpent: Math.max(0, Number(sessionSeconds) || 0) },
      $set: { lastActivity: new Date(), updatedAt: new Date() }
    };

    if (leadSource) {
      update.$set.leadSource = leadSource;
    }

    if (Array.isArray(tags) && tags.length > 0) {
      update.$addToSet = { tags: { $each: tags } };
    }

    const user = await User.findOneAndUpdate(
      { email },
      update,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Activity tracked',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to track activity', error: error.message });
  }
};
