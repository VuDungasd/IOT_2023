// subscriber.js

const mqtt = require('mqtt');
const sensorService = require('../services/sensor.service');
const { setMqttClient } = require('./connection');
const { MQTT_URL, SENSOR_TOPIC } = require('../config/mqtt');

const startSubscriber = async () => {
  // 1. Kết nối MQTT Broker
  const client = await mqtt.connectAsync(MQTT_URL, {
    clientId: 'iot-backend-subscriber',
    reconnectPeriod: 1000
  });

  // Dùng chung client này để device.service publish lệnh bật/tắt
  setMqttClient(client);

  // 2. Đăng ký sự kiện khi nhận message
  client.on('message', async (topic, message) => {
    if (topic !== SENSOR_TOPIC) return;

    try {
      // Buffer -> String -> JavaScript Object
      const data = JSON.parse(message.toString());

      // 3. Kiểm tra dữ liệu
      if (
        !Number.isFinite(data.temperature) ||
        !Number.isFinite(data.humidity) ||
        !Number.isFinite(data.light)
      ) {
        console.error('Invalid sensor data:', data);
        return;
      }

      console.log('Received sensor data:', data);

      // 4. Gọi Service để lưu database
      await sensorService.saveSensorData(data);

      console.log('Sensor data saved');
    } catch (error) {
      console.error('MQTT message error:', error.message);
    }
  });

  // 5. Xử lý lỗi kết nối
  client.on('error', (error) => {
    console.error('MQTT Client error:', error.message);
  });

  // 6. Subscribe topic cảm biến
  await client.subscribeAsync(SENSOR_TOPIC);

  console.log('Subscribed to:', SENSOR_TOPIC);

  return client;
};

module.exports = startSubscriber;
