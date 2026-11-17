// history.service.js

const actionRepository = require('../repositories/action.repository');

const getAll = async () => {
  return actionRepository.findAll();
};

const searchByTime = async (startTime, endTime) => {
  return actionRepository.searchByTime(startTime, endTime);
};

const countLed = async (status) => {
  return actionRepository.countLed(status);
};

module.exports = {
  getAll,
  searchByTime,
  countLed
};
