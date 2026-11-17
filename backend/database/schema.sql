-- Schema cho backend IOT_2023. Chạy: mysql -u root -p < database/schema.sql
CREATE DATABASE IF NOT EXISTS IOT_2023;
USE IOT_2023;

-- Dữ liệu cảm biến (khớp bảng đang có trong DB local)
CREATE TABLE IF NOT EXISTS data_sensor (
  id INT NOT NULL AUTO_INCREMENT,
  temperature FLOAT DEFAULT NULL,
  humidity FLOAT DEFAULT NULL,
  light FLOAT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Lịch sử bật/tắt thiết bị: name = 'Led' | 'Quat', status = 'on' | 'off'
CREATE TABLE IF NOT EXISTS action_history (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
