const User = require('../models/User');
const Order = require('../models/Order');

// ML Model - Lead Quality Prediction
// Predicts if user is Hot 🔥 / Warm ⚡ / Cold ❄️
const predictLeadQuality = (userData) => {
  // Scoring system
  let score = 0;

  // Time spent scoring (0-40 points)
  const timeSpentHours = userData.totalTimeSpent / 3600;
  if (timeSpentHours > 5) score += 40;
  else if (timeSpentHours > 2) score += 30;
  else if (timeSpentHours > 1) score += 20;
  else if (timeSpentHours > 0.5) score += 10;

  // Purchase behavior scoring (0-40 points)
  if (userData.totalOrders > 5) score += 40;
  else if (userData.totalOrders > 3) score += 30;
  else if (userData.totalOrders > 1) score += 20;
  else if (userData.totalOrders > 0) score += 10;

  // Spending amount scoring (0-20 points)
  const totalSpent = userData.totalSpent || 0;
  if (totalSpent > 5000) score += 20;
  else if (totalSpent > 2000) score += 15;
  else if (totalSpent > 1000) score += 10;
  else if (totalSpent > 500) score += 5;

  // Recency scoring (0-10 points) - based on last activity
  const lastActivityTime = new Date(userData.lastActivity);
  const daysSinceActivity = (Date.now() - lastActivityTime) / (1000 * 60 * 60 * 24);

  if (daysSinceActivity < 1) score += 10;
  else if (daysSinceActivity < 7) score += 7;
  else if (daysSinceActivity < 30) score += 3;

  // Determine lead quality
  if (score >= 80) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
};

// Get all users with analytics
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    // Enhance user data with predicted lead quality
    const usersWithPredictions = users.map(user => {
      const userData = user.toObject();
      const predictedQuality = predictLeadQuality(userData);
      
      return {
        ...userData,
        predictedLeadQuality: predictedQuality,
        totalTimeSpentFormatted: formatTime(userData.totalTimeSpent),
        lastActivityFormatted: formatDate(userData.lastActivity),
        totalSpentFormatted: `$${userData.totalSpent?.toFixed(2) || '0.00'}`
      };
    });

    res.status(200).json({
      users: usersWithPredictions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get single user details with full analytics
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user orders
    const orders = await Order.find({ user: userId }).sort({ date: -1 });

    const userData = user.toObject();
    const predictedQuality = predictLeadQuality(userData);

    const userDetails = {
      ...userData,
      predictedLeadQuality: predictedQuality,
      totalTimeSpentFormatted: formatTime(userData.totalTimeSpent),
      lastActivityFormatted: formatDate(userData.lastActivity),
      totalSpentFormatted: `$${userData.totalSpent?.toFixed(2) || '0.00'}`,
      orders: orders.map(order => ({
        id: order._id,
        total: order.total,
        createdAt: order.date,
        items: order.products
      }))
    };

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};

// Analyze user with ML - returns lead quality prediction
exports.analyzeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user.toObject();
    const predictedQuality = predictLeadQuality(userData);

    // Return detailed analysis
    const analysis = {
      userId: user._id,
      email: user.email,
      name: user.name,
      
      // Metrics
      metrics: {
        totalTimeSpent: userData.totalTimeSpent,
        totalTimeSpentFormatted: formatTime(userData.totalTimeSpent),
        totalOrders: userData.totalOrders,
        totalSpent: userData.totalSpent,
        totalSpentFormatted: `$${userData.totalSpent?.toFixed(2) || '0.00'}`,
        lastActivity: userData.lastActivity,
        lastActivityFormatted: formatDate(userData.lastActivity)
      },

      // ML Prediction
      prediction: {
        leadQuality: predictedQuality,
        emoji: getLeadQualityEmoji(predictedQuality),
        confidence: calculateConfidence(predictedQuality, userData),
        reasoning: generateReasoningText(predictedQuality, userData)
      },

      // Additional Info
      profile: {
        leadSource: userData.leadSource,
        tags: userData.tags,
        createdAt: userData.createdAt
      }
    };

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing user', error: error.message });
  }
};

// Update lead quality manually (admin override)
exports.updateUserLeadQuality = async (req, res) => {
  try {
    const { userId } = req.params;
    const { leadQuality, tags, leadSource } = req.body;

    const updatePayload = {
      updatedAt: Date.now()
    };

    if (leadQuality) updatePayload.leadQuality = leadQuality;
    if (Array.isArray(tags)) updatePayload.tags = tags;
    if (leadSource) updatePayload.leadSource = leadSource;

    const user = await User.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User lead quality updated',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Count by lead quality
    const hotUsers = await User.countDocuments({ leadQuality: 'hot' });
    const warmUsers = await User.countDocuments({ leadQuality: 'warm' });
    const coldUsers = await User.countDocuments({ leadQuality: 'cold' });

    // Total orders and revenue
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find().select('total');
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Lead sources breakdown
    const leadSources = await User.aggregate([
      { $group: { _id: '$leadSource', count: { $sum: 1 } } }
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .select('-password')
      .sort({ lastActivity: -1 })
      .limit(5);

    res.status(200).json({
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        averageOrderValue: totalOrders ? (totalRevenue / totalOrders).toFixed(2) : '0.00'
      },
      leadQualityDistribution: {
        hot: hotUsers,
        warm: warmUsers,
        cold: coldUsers
      },
      leadSourceBreakdown: leadSources,
      recentActivity: recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Helper functions
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getLeadQualityEmoji(quality) {
  const emojis = {
    hot: '🔥',
    warm: '⚡',
    cold: '❄️'
  };
  return emojis[quality] || '❓';
}

function calculateConfidence(prediction, userData) {
  // Confidence based on data availability
  let confidence = 0.5;

  if (userData.totalTimeSpent > 0) confidence += 0.15;
  if (userData.totalOrders > 0) confidence += 0.15;
  if (userData.totalSpent > 0) confidence += 0.1;
  if (userData.tags?.length > 0) confidence += 0.05;
  if (userData.leadSource !== 'direct') confidence += 0.1;

  return (confidence * 100).toFixed(0) + '%';
}

function generateReasoningText(prediction, userData) {
  const reasons = [];

  const timeSpentHours = userData.totalTimeSpent / 3600;
  if (prediction === 'hot') {
    if (timeSpentHours > 5) reasons.push('High time spent on platform');
    if (userData.totalOrders > 5) reasons.push('Multiple purchase history');
    if (userData.totalSpent > 5000) reasons.push('High lifetime value');
  } else if (prediction === 'warm') {
    if (timeSpentHours > 1) reasons.push('Moderate engagement');
    if (userData.totalOrders > 1) reasons.push('Has made purchases');
    if (Date.now() - new Date(userData.lastActivity) < 7 * 24 * 60 * 60 * 1000) 
      reasons.push('Recent activity');
  } else {
    if (timeSpentHours < 0.5) reasons.push('Low engagement');
    if (userData.totalOrders === 0) reasons.push('No purchase history');
    if (Date.now() - new Date(userData.lastActivity) > 30 * 24 * 60 * 60 * 1000) 
      reasons.push('Inactive for 30+ days');
  }

  return reasons.length > 0 ? reasons : ['Insufficient data for detailed analysis'];
}
