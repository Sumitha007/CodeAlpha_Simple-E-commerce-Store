const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminController = require('../controllers/adminController');

// Admin Authentication Routes
router.post('/auth/register', adminAuthController.registerAdmin);
router.post('/auth/login', adminAuthController.adminLogin);
router.get('/profile', adminAuthController.verifyAdminToken, adminAuthController.getAdminProfile);

// Admin Dashboard Routes (protected)
router.get('/dashboard/stats', adminAuthController.verifyAdminToken, adminController.getDashboardStats);
router.get('/users', adminAuthController.verifyAdminToken, adminController.getAllUsers);
router.get('/users/:userId', adminAuthController.verifyAdminToken, adminController.getUserDetails);
router.post('/users/:userId/analyze', adminAuthController.verifyAdminToken, adminController.analyzeUser);
router.put('/users/:userId/update-quality', adminAuthController.verifyAdminToken, adminController.updateUserLeadQuality);

module.exports = router;
