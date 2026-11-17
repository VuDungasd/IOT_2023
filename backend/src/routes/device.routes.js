// device.routes.js

const express = require('express');
const deviceController = require('../controllers/device.controller');

const router = express.Router();

router.post('/api/updateLightStatus', deviceController.updateLightStatus);
router.post('/api/updateFanStatus', deviceController.updateFanStatus);

module.exports = router;
