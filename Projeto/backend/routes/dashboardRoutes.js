const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const autenticarToken = require('../middlewares/autenticarToken');

router.use(autenticarToken);

router.get('/', dashboardController.getDashboardData);

module.exports = router;
