// sensor.service.js

const sensorRepository = require('../repositories/sensor.repository');

const getAllSensors = async () => {
  return sensorRepository.getAllSensors();
};

const searchByTime = async (startTime, endTime) => {
  return sensorRepository.searchByTime(startTime, endTime);
};

const saveSensorData = async (data) => {
  return sensorRepository.saveSensorData(data);
};

module.exports = {
  getAllSensors,
  searchByTime,
  saveSensorData
};
