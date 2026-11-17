// device.service.js

const actionRepository = require('../repositories/action.repository');
const { getMqttClient } = require('../mqtt/connection');
const { LED_TOPIC, FAN_TOPIC } = require('../config/mqtt');

const devices = {
  led: { name: 'Led', topic: LED_TOPIC },
  fan: { name: 'Quat', topic: FAN_TOPIC }
};

const updateStatus = async (deviceType, enabled) => {
  const device = devices[deviceType];

  if (!device) {
    throw new Error('Unknown device type');
  }

  const status = enabled ? 'on' : 'off';
  const client = getMqttClient();

  // Gửi lệnh đến MQTT Broker
  await client.publishAsync(device.topic, status, { qos: 1 });

  // Ghi lịch sử lệnh điều khiển vào MySQL
  await actionRepository.createAction(device.name, status);

  return status;
};

module.exports = {
  updateStatus
};
