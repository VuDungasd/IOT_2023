// sensor.routes.js

const express = require('express');
const sensorController = require('../controllers/sensor.controller');

const router = express.Router();

// Đường dẫn giữ nguyên như Client đang gọi
router.get('/data_tmp', sensorController.getAllSensors);
router.get('/api/search_data', sensorController.searchByTime);

module.exports = router;
