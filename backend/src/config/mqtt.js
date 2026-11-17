// mqtt.js

// Hằng số MQTT dùng chung cho broker, subscriber, device service và simulator
const MQTT_HOST = '127.0.0.1';
const MQTT_PORT = 1883;

module.exports = {
  MQTT_HOST,
  MQTT_PORT,
  MQTT_URL: `mqtt://${MQTT_HOST}:${MQTT_PORT}`,
  SENSOR_TOPIC: 'mcu8266/tmp',
  LED_TOPIC: 'esp8266/led',
  FAN_TOPIC: 'esp8266/fan'
};
