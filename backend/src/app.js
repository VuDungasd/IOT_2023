// app.js

const express = require('express');
const morgan = require('morgan');

const sensorRoutes = require('./routes/sensor.routes');
const deviceRoutes = require('./routes/device.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(sensorRoutes);
app.use(deviceRoutes);
app.use(historyRoutes);

// Middleware xử lý lỗi (bắt buộc đủ 4 tham số để Express nhận diện)
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: 'Internal server error'
  });
});

module.exports = app;
