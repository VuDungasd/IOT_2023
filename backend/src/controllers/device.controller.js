// device.controller.js

const deviceService = require('../services/device.service');

// Tạo handler cho từng thiết bị vì đèn và quạt xử lý giống hệt nhau
const createStatusHandler = (deviceType, label) => async (req, res, next) => {
  if (typeof req.body?.status !== 'boolean') {
    return res.status(400).json({
      message: 'status must be boolean'
    });
  }

  try {
    await deviceService.updateStatus(deviceType, req.body.status);
    res.status(200).json({
      message: `${label} status updated successfully`
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/updateLightStatus
const updateLightStatus = createStatusHandler('led', 'Light');

// POST /api/updateFanStatus
const updateFanStatus = createStatusHandler('fan', 'Fan');

module.exports = {
  updateLightStatus,
  updateFanStatus
};
