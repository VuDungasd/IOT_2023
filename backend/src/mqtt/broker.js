// broker.js

const { Aedes } = require('aedes');
const net = require('node:net');
const { MQTT_HOST, MQTT_PORT } = require('../config/mqtt');

const startBroker = async () => {
  const broker = await Aedes.createBroker();
  const server = net.createServer(broker.handle);

  await new Promise((resolve, reject) => {
    server.once('error', reject);

    server.listen(MQTT_PORT, MQTT_HOST, () => {
      server.off('error', reject);
      console.log(`MQTT Broker running on ${MQTT_HOST}:${MQTT_PORT}`);
      resolve();
    });
  });

  server.on('error', (error) => {
    console.error('MQTT Broker error:', error.message);
  });

  return { broker, server };
};

module.exports = startBroker;
