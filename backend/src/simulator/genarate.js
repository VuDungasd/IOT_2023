// genarate.js — giả lập cảm biến, publish dữ liệu lên MQTT broker local
// Chạy: npm run simulator (cần chạy server trước để có broker)

const mqtt = require('mqtt');
const { MQTT_URL, SENSOR_TOPIC } = require('../config/mqtt');

const PUBLISH_INTERVAL_MS = 10000;

const client = mqtt.connect(MQTT_URL);
let timer;

const generateSensorData = () => {
  return {
    temperature: Number((Math.random() * 10 + 25).toFixed(2)),
    humidity: Number((Math.random() * 40 + 40).toFixed(2)),
    light: Number((Math.random() * 900 + 100).toFixed(2))
  };
};

const publishSensorData = () => {
  const data = generateSensorData();
  const payload = JSON.stringify(data);

  client.publish(SENSOR_TOPIC, payload, (error) => {
    if (error) {
      console.error('Failed to publish sensor data:', error.message);
    } else {
      console.log('Sensor data published successfully', data);
    }
  });
};

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Tránh tạo nhiều timer khi kết nối lại
  clearInterval(timer);

  // Gửi lần đầu, sau đó cứ 10s gửi lại
  publishSensorData();
  timer = setInterval(publishSensorData, PUBLISH_INTERVAL_MS);
});

// Dừng gửi khi mất kết nối ('close' bắn mỗi khi socket đóng)
client.on('close', () => {
  clearInterval(timer);
});

client.on('error', (error) => {
  console.error('MQTT Client error:', error.message);
});
