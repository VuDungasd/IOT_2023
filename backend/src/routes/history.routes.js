// history.routes.js

const express = require('express');
const historyController = require('../controllers/history.controller');

const router = express.Router();

router.get('/history', historyController.getAll);
router.get('/api/search_data_sensor', historyController.searchByTime);
router.get('/count_led_on', historyController.countLedOn);
router.get('/count_led_off', historyController.countLedOff);

module.exports = router;
