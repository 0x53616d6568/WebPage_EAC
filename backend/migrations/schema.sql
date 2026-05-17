-- SecureApp Database Schema
-- Created: May 16, 2026

-- Create Database
CREATE DATABASE IF NOT EXISTS enterprise_access_control CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enterprise_access_control;

-- ═══════════════════════════════════════════════════════════════
-- Roles Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  access_level INT DEFAULT 1,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Users Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  avatar_url VARCHAR(500),
  role_id INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  is_first_login TINYINT DEFAULT 1,
  last_login TIMESTAMP NULL,
  manager_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE SET NULL,
  KEY idx_email (email),
  KEY idx_role_id (role_id),
  KEY idx_status (status),
  KEY idx_manager_id (manager_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Doors Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS doors (
  door_id INT PRIMARY KEY AUTO_INCREMENT,
  door_name VARCHAR(255),
  name VARCHAR(255),
  location VARCHAR(500),
  building VARCHAR(100),
  type VARCHAR(50) DEFAULT 'biometric_face',
  security_level INT DEFAULT 1,
  access_level_required INT DEFAULT 1,
  requires_face_auth TINYINT DEFAULT 0,
  fallback_method VARCHAR(50) DEFAULT 'NONE',
  pi_device_id VARCHAR(100),
  device_id VARCHAR(100),
  mqtt_topic VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE',
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
  access_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  door_id INT NOT NULL,
  access_granted TINYINT DEFAULT 1,
  expires_at TIMESTAMP NULL,
  time_restrictions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (door_id) REFERENCES doors(door_id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_door_id (door_id),
  KEY idx_expires_at (expires_at),
  UNIQUE KEY unique_user_door (user_id, door_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Access Logs Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS access_logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  door_id INT NOT NULL,
  result VARCHAR(50) DEFAULT 'DENIED',
  method VARCHAR(50) DEFAULT 'face',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  device_info JSON,
  reason VARCHAR(255),
  face_auth_result VARCHAR(50),
  face_confidence DECIMAL(3,2),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (door_id) REFERENCES doors(door_id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_door_id (door_id),
  KEY idx_timestamp (timestamp),
  KEY idx_result (result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Requests Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS requests (
  request_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  reviewed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
  KEY idx_user_id (user_id),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Preferences Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preference_key VARCHAR(255) UNIQUE NOT NULL,
  preference_value LONGTEXT,
  preference_type VARCHAR(50) DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
-- Face Embeddings Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS face_embeddings (
  embedding_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  face_image LONGBLOB NOT NULL,
  file_name VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Initial Data
-- ═══════════════════════════════════════════════════════════════

-- Create default roles
INSERT INTO roles (role_name, access_level, description) 
VALUES 
  ('Employee', 1, 'Standard employee with basic access'),
  ('Manager', 2, 'Manager with team oversight'),
  ('Administrator', 5, 'Full system access')
ON DUPLICATE KEY UPDATE role_name=role_name;

-- Create initial admin user (password: admin123 - bcrypt hash)
INSERT INTO users (full_name, email, password_hash, role_id, status, is_first_login) 
VALUES ('Admin User', 'admin@example.com', '$2b$10$8zVYh8sYaLn0B9B7c3K7R.kHp.W1F5G8H9I0J1K2L3M4N5O6P7Q8R9', 3, 'ACTIVE', 1)
ON DUPLICATE KEY UPDATE email=email;

-- Create sample doors
INSERT INTO doors (name, location, building, type, access_level_required, status, mqtt_topic)
VALUES 
  ('Main Entrance', 'Building A, Floor 1', 'Building A', 'biometric_face', 1, 'ACTIVE', 'devices/door/main'),
  ('Server Room', 'Building B, Floor 3', 'Building B', 'biometric_face', 4, 'ACTIVE', 'devices/door/server'),
  ('Conference Room A', 'Building A, Floor 2', 'Building A', 'pin_code', 2, 'ACTIVE', 'devices/door/conf_a')
ON DUPLICATE KEY UPDATE name=name;

COMMIT;
