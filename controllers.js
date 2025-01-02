const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/analytics/:year?', analyticsController.analytics);
router.get('/years', analyticsController.getYears);

module.exports = router;
