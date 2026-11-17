// history.controller.js

const historyService = require('../services/history.service');

// GET /history
const getAll = async (req, res, next) => {
  try {
    const rows = await historyService.getAll();
    res.status(200).json({ sensor: rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/search_data_sensor?startTime=&endTime= (Unix seconds)
const searchByTime = async (req, res, next) => {
  const { startTime, endTime } = req.query;
  const start = Number(startTime);
  const end = Number(endTime);

  if (
    !startTime || !endTime ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 || start > end
  ) {
    return res.status(400).json({
      message: 'Invalid startTime or endTime (Unix seconds)'
    });
  }

  try {
    const rows = await historyService.searchByTime(start, end);
    // Client (Status.js) đọc response.data.rows
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};

// GET /count_led_on
const countLedOn = async (req, res, next) => {
  try {
    const rows = await historyService.countLed('on');
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};

// GET /count_led_off
const countLedOff = async (req, res, next) => {
  try {
    const rows = await historyService.countLed('off');
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  searchByTime,
  countLedOn,
  countLedOff
};
