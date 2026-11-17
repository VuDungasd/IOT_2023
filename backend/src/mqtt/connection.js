// connection.js

// Giữ MQTT client dùng chung để device.service publish lệnh điều khiển
let mqttClient = null;

const setMqttClient = (client) => {
  mqttClient = client;
};

const getMqttClient = () => {
  if (!mqttClient || !mqttClient.connected) {
    throw new Error('MQTT Broker is not connected');
  }

  return mqttClient;
};

module.exports = {
  setMqttClient,
  getMqttClient
};
