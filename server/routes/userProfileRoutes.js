const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Get user profile
router.get('/profile/:userEmail', userProfileController.getUserProfile);

// Update user profile (all 10 fields)
router.put('/profile/:userEmail', userProfileController.updateUserProfile);

// Update notable activity
router.post('/profile/:userEmail/notable-activity', userProfileController.updateNotableActivity);

module.exports = router;
