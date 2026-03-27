const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  
  // Lead Information (10 Core Fields)
  leadOrigin: {
    type: String,
    enum: ['Google', 'Facebook', 'LinkedIn', 'Instagram', 'Twitter', 'Email', 'Referral', 'Direct', 'Other'],
    default: 'Direct'
  },
  leadSource: {
    type: String,
    enum: ['organic', 'paid', 'referral', 'direct', 'social', 'email', 'other'],
    default: 'direct'
  },
  hearAboutUs: {
    type: String,
    enum: ['Search Engine', 'Social Media', 'Friend/Colleague', 'Advertisement', 'Content Marketing', 'Other'],
    default: 'Other'
  },
  coursePreferences: {
    type: [String],
    default: []
    // Expected values: 'Career Growth', 'Skill Development', 'Certification', 'Salary Increase', 'Job Security', 'Cost Effective', 'Industry Relevant'
  },
  leadProfile: {
    type: String,
    enum: ['Student', 'Working Professional', 'Career Changer', 'Entrepreneur', 'Other'],
    default: 'Other'
  },
  
  // User Analytics Tracking
  totalTimeSpent: {
    type: Number,
    default: 0  // in seconds
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastNotableActivity: {
    activity: {
      type: String,
      default: 'Account Created'
      // Examples: 'Course View', 'Purchase', 'Video Watch', 'Quiz Attempt', 'Wishlist Addition'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  leadQuality: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'cold'
  },
  tags: {
    type: [String],
    default: []
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
