// sensor.repository.js

const pool = require('../config/connectDB');

// Lấy 10 bản ghi cảm biến mới nhất
const getAllSensors = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM data_sensor ORDER BY id DESC LIMIT 10'
  );

  return rows;
};

// Tìm dữ liệu cảm biến theo thời gian (Unix seconds)
const searchByTime = async (startTime, endTime) => {
  const sql = `
    SELECT * FROM data_sensor
    WHERE created_at >= FROM_UNIXTIME(?)
      AND created_at <= FROM_UNIXTIME(?)
    ORDER BY created_at DESC
  `;

  const [rows] = await pool.query(sql, [startTime, endTime]);
  return rows;
};

// Lưu một bản ghi cảm biến nhận từ MQTT
const saveSensorData = async (data) => {
  const sql = `
    INSERT INTO data_sensor (temperature, humidity, light)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    data.temperature,
    data.humidity,
    data.light
  ]);

  return result.insertId;
};

module.exports = {
  getAllSensors,
  searchByTime,
  saveSensorData
};
