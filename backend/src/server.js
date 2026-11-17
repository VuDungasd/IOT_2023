// server.js

// Nạp .env trước mọi require khác để connectDB đọc được biến môi trường
require('dotenv').config();

const app = require('./app');
const startBroker = require('./mqtt/broker');
const startSubscriber = require('./mqtt/subscriber');

const PORT = process.env.PORT || 8081;

const main = async () => {
  await startBroker();
  await startSubscriber();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
