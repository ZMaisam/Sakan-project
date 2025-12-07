CREATE DATABASE IF NOT EXISTS sakan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE sakan;

CREATE TABLE IF NOT EXISTS renter (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  phone_num VARCHAR(20)  NOT NULL,
  email     VARCHAR(254) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  gender    ENUM('male','female') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  phone_num VARCHAR(20)  NOT NULL,
  email     VARCHAR(254) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  gender    ENUM('male','female') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  room_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  renter_id  INT UNSIGNED NOT NULL,
  title      TEXT NOT NULL,
  city       TEXT NOT NULL,
  street     TEXT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  image      TEXT,                -- comma-separated URLs
  gender     ENUM('any','male','female') NOT NULL DEFAULT 'any',
  serial_id  VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_renter
    FOREIGN KEY (renter_id) REFERENCES renter(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_rooms (
  room_id    INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  PRIMARY KEY(room_id, student_id),
  CONSTRAINT fk_saved_room  FOREIGN KEY(room_id)    REFERENCES rooms(room_id)   ON DELETE CASCADE,
  CONSTRAINT fk_saved_user  FOREIGN KEY(student_id) REFERENCES student(id) ON DELETE CASCADE
);
