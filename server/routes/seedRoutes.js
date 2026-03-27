const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');

router.post('/seed-users', seedController.seedTestUsers);

module.exports = router;
