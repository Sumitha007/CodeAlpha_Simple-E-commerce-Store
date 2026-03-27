const User = require('../models/User');

exports.seedTestUsers = async (req, res) => {
  try {
    const testUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "Pass123",
        totalTimeSpent: 7200,
        leadOrigin: "Google",
        leadSource: "organic",
        hearAboutUs: "Search Engine",
        coursePreferences: ["Career Growth", "Skill Development"],
        leadProfile: "Working Professional",
        totalOrders: 3,
        totalSpent: 1500,
        leadQuality: "warm",
        tags: ["high-value", "regular"],
        lastNotableActivity: { activity: "Purchase", timestamp: new Date(Date.now() - 86400000) }
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "Pass123",
        totalTimeSpent: 14400,
        leadOrigin: "Facebook",
        leadSource: "paid",
        hearAboutUs: "Advertisement",
        coursePreferences: ["Salary Increase", "Certification", "Career Growth"],
        leadProfile: "Career Changer",
        totalOrders: 8,
        totalSpent: 4200,
        leadQuality: "hot",
        tags: ["very-active", "premium"],
        lastNotableActivity: { activity: "Course View", timestamp: new Date(Date.now() - 3600000) }
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "Pass123",
        totalTimeSpent: 3600,
        leadOrigin: "LinkedIn",
        leadSource: "referral",
        hearAboutUs: "Social Media",
        coursePreferences: ["Skill Development", "Cost Effective"],
        leadProfile: "Student",
        totalOrders: 1,
        totalSpent: 300,
        leadQuality: "cold",
        tags: ["new"],
        lastNotableActivity: { activity: "Account Created", timestamp: new Date(Date.now() - 604800000) }
      },
      {
        name: "Alice Williams",
        email: "alice@example.com",
        password: "Pass123",
        totalTimeSpent: 21600,
        leadOrigin: "Email",
        leadSource: "social",
        hearAboutUs: "Friend/Colleague",
        coursePreferences: ["Career Growth", "Salary Increase", "Industry Relevant"],
        leadProfile: "Working Professional",
        totalOrders: 15,
        totalSpent: 8900,
        leadQuality: "hot",
        tags: ["influencer", "vip", "buyer"],
        lastNotableActivity: { activity: "Purchase", timestamp: new Date(Date.now() - 1800000) }
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "Pass123",
        totalTimeSpent: 1800,
        leadOrigin: "Other",
        leadSource: "direct",
        hearAboutUs: "Other",
        coursePreferences: [],
        leadProfile: "Other",
        totalOrders: 0,
        totalSpent: 0,
        leadQuality: "cold",
        tags: ["inactive"],
        lastNotableActivity: { activity: "Account Created", timestamp: new Date(Date.now() - 1209600000) }
      }
    ];

    const created = await User.insertMany(testUsers, { ordered: false });
    res.status(200).json({
      message: 'Test users seeded successfully',
      count: created.length,
      users: created
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error seeding test users',
      error: error.message
    });
  }
};
