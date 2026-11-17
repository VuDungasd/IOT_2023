// sensor.controller.js

const sensorService = require('../services/sensor.service');

// GET /data_tmp
const getAllSensors = async (req, res, next) => {
  try {
    const rows = await sensorService.getAllSensors();
    res.status(200).json({ action: rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/search_data?startTime=&endTime= (Unix seconds)
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
    const rows = await sensorService.searchByTime(start, end);
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSensors,
  searchByTime
};
