const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const {
      leadOrigin,
      leadSource,
      hearAboutUs,
      coursePreferences,
      leadProfile
    } = req.body;

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        leadOrigin: leadOrigin || undefined,
        leadSource: leadSource || undefined,
        hearAboutUs: hearAboutUs || undefined,
        coursePreferences: coursePreferences || undefined,
        leadProfile: leadProfile || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const user = await User.findOne({ email: userEmail }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

exports.updateNotableActivity = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { activity } = req.body;

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        lastNotableActivity: {
          activity: activity || 'Activity Recorded',
          timestamp: new Date()
        },
        lastActivity: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Notable activity updated',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating notable activity',
      error: error.message
    });
  }
};
