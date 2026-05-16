-- SecureApp Database Schema
-- Created: May 16, 2026

-- Create Database
CREATE DATABASE IF NOT EXISTS enterprise_access_control CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enterprise_access_control;

-- ═══════════════════════════════════════════════════════════════
-- Users Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  access_level INT DEFAULT 1,
  role ENUM('Admin', 'Manager', 'Employee', 'Guest') DEFAULT 'Employee',
  status ENUM('active', 'inactive') DEFAULT 'active',
  department VARCHAR(100),
  phone VARCHAR(20),
  profile_photo_url VARCHAR(500),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_email (email),
  KEY idx_role (role),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Doors Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS doors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  building VARCHAR(100),
  type ENUM('biometric_face', 'ble_token', 'rfid', 'pin_code', 'manual') DEFAULT 'biometric_face',
  access_level_required INT DEFAULT 1,
  status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
  device_id VARCHAR(100),
  mqtt_topic VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_location (location),
  KEY idx_type (type),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Door Access Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS door_access (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  door_id INT NOT NULL,
  access_granted BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NULL,
  time_restrictions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_door_id (door_id),
  KEY idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Access Logs Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS access_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  door_id INT NOT NULL,
  result ENUM('GRANTED', 'DENIED') DEFAULT 'DENIED',
  method ENUM('face', 'ble', 'rfid', 'pin', 'manual', 'app') DEFAULT 'face',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  device_info JSON,
  reason VARCHAR(255),
  face_confidence DECIMAL(3,2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_door_id (door_id),
  KEY idx_timestamp (timestamp),
  KEY idx_result (result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- System Preferences Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS system_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSON,
  description VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Initial Data
-- ═══════════════════════════════════════════════════════════════

-- Create initial admin user (password: admin123 - bcrypt hash)
INSERT INTO users (name, email, password_hash, access_level, role, status) 
VALUES ('Admin User', 'admin@example.com', '$2b$10$8zVYh8sYaLn0B9B7c3K7R.kHp.W1F5G8H9I0J1K2L3M4N5O6P7Q8R9', 5, 'Admin', 'active')
ON DUPLICATE KEY UPDATE email=email;

-- Create sample doors
INSERT INTO doors (name, location, building, type, access_level_required, status, mqtt_topic)
VALUES 
  ('Main Entrance', 'Building A, Floor 1', 'Building A', 'biometric_face', 1, 'active', 'devices/door/main'),
  ('Server Room', 'Building B, Floor 3', 'Building B', 'biometric_face', 4, 'active', 'devices/door/server'),
  ('Conference Room A', 'Building A, Floor 2', 'Building A', 'pin_code', 2, 'active', 'devices/door/conf_a')
ON DUPLICATE KEY UPDATE name=name;

COMMIT;
