// action.repository.js

const pool = require('../config/connectDB');

// Lưu lịch sử bật/tắt thiết bị
const createAction = async (name, status) => {
  const sql = `
    INSERT INTO action_history (name, status)
    VALUES (?, ?)
  `;

  const [result] = await pool.query(sql, [name, status]);
  return result.insertId;
};

// Lấy toàn bộ lịch sử
const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM action_history ORDER BY id DESC'
  );

  return rows;
};

// Tìm lịch sử theo thời gian (Unix seconds)
const searchByTime = async (startTime, endTime) => {
  const sql = `
    SELECT * FROM action_history
    WHERE created_at >= FROM_UNIXTIME(?)
      AND created_at <= FROM_UNIXTIME(?)
    ORDER BY created_at DESC
  `;

  const [rows] = await pool.query(sql, [startTime, endTime]);
  return rows;
};

// Đếm số lần bật/tắt LED
const countLed = async (status) => {
  const sql = `
    SELECT COUNT(*) AS count
    FROM action_history
    WHERE name = ? AND status = ?
  `;

  const [rows] = await pool.query(sql, ['Led', status]);
  return rows;
};

module.exports = {
  createAction,
  findAll,
  searchByTime,
  countLed
};
