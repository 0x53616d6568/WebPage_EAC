# SecureApp - Complete Integration Handout

> **Comprehensive guide to integrate and run the entire SecureApp ecosystem (React Admin, Express Backend, Face Microservice, IoT Door Controller, Mobile App)**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Components](#architecture--components)
3. [Technology Stack](#technology-stack)
4. [Directory Structure](#directory-structure)
5. [Environment Configuration (.env)](#environment-configuration-env)
6. [Setup Instructions](#setup-instructions)
7. [Running the Application](#running-the-application)
8. [API Integration Guide](#api-integration-guide)
9. [Database Schema](#database-schema)
10. [Key Services & Utilities](#key-services--utilities)
11. [Troubleshooting](#troubleshooting)
12. [Deployment Guide](#deployment-guide)

---

## Project Overview

**SecureApp** is an enterprise-grade access control management system with multi-platform support:

- **Admin Web Dashboard**: React/Next.js web interface for administrators
- **Mobile App**: React Native (Expo) for employees and managers
- **Express Backend**: Node.js REST API server
- **Face Recognition**: Python microservice for biometric authentication
- **IoT Integration**: ESP32 door controller with MQTT communication
- **Database**: MySQL/MariaDB for data persistence

### Key Features

- 👥 User & Access Management
- 🚪 Door Access Control (Biometric, BLE, RFID, PIN)
- 📊 Real-time Access Logs & Monitoring
- 🔐 JWT Authentication with Refresh Tokens
- 📧 Email Notifications (Gmail API)
- 🌐 MQTT-based IoT Communication
- 👤 Face Recognition Integration
- 📱 Mobile & Web Client Support

---

## Architecture & Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     SecureApp Ecosystem                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Admin Dashboard │    │   Mobile App     │                   │
│  │  (React/Next.js) │    │ (React Native)   │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           └───────────┬───────────┘                              │
│                       │                                          │
│           ┌───────────▼───────────┐                             │
│           │  Express Backend API  │                             │
│           │  (Node.js/Express)    │                             │
│           │  :3000                │                             │
│           └───────────┬───────────┘                             │
│                       │                                          │
│     ┌─────────────────┼─────────────────┬──────────────┐        │
│     │                 │                 │              │        │
│  ┌──▼──┐        ┌──────▼─────┐   ┌────▼────┐    ┌───▼──┐      │
│  │MySQL│        │Face Service│   │MQTT Broker  │ │Gmail │      │
│  │MySQL│        │(Python HF) │   │(HiveMQ)     │ │API   │      │
│  └─────┘        └────────────┘   └─────┬──────┘ └──────┘      │
│                                         │                       │
│                                    ┌────▼────┐                 │
│                                    │ESP32 IoT │                 │
│                                    │Controller│                 │
│                                    └──────────┘                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend - Admin Dashboard
- **Framework**: React 19 / Next.js 15 (optional for SSR)
- **Build Tool**: Vite / Create React App
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui, Headless UI
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons / Heroicons
- **Authentication**: JWT (localStorage)

### Frontend - Mobile App
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context (AuthContext, AlertContext, MQTTContext)
- **HTTP Client**: Axios
- **Local Storage**: AsyncStorage, SecureStore
- **Real-time**: MQTT Client
- **Biometric**: expo-local-authentication
- **Camera**: expo-camera
- **Notifications**: expo-notifications

### Backend - API Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0 / MariaDB
- **Database Driver**: mysql2
- **Authentication**: JWT (jsonwebtoken)
- **Encryption**: bcryptjs, crypto
- **Email**: Nodemailer + Gmail API (googleapis)
- **Real-time**: MQTT client
- **HTTP Client**: Axios
- **Utilities**: uuid, cors, dotenv

### Face Recognition Service
- **Language**: Python 3.8+
- **Framework**: Flask
- **Model Provider**: Hugging Face Spaces
- **ML Library**: transformers, torch
- **Database**: SQLite / file-based
- **Deployment**: Docker

### IoT - ESP32 Door Controller
- **MCU**: ESP32 Development Board
- **Language**: Arduino C++
- **Protocols**: MQTT, WiFi, Bluetooth
- **Components**: Door lock, camera, sensors
- **Communication**: MQTT to HiveMQ Cloud

---

## Directory Structure

```
SecureApp/
├── AccessControl/                    # React Native Mobile App
│   ├── src/
│   │   ├── screens/                 # Mobile screens (login, doors, logs, etc)
│   │   ├── navigation/              # React Navigation setup
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # AuthContext, MQTTContext, AlertContext
│   │   ├── services/                # API service (axios setup)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── constants/               # App constants, colors, endpoints
│   │   └── utils/                   # Helper functions
│   ├── App.js                       # Root component
│   ├── app.json                     # Expo configuration
│   └── package.json                 # Dependencies
│
├── backend/                          # Express.js API Server
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── controllers/                 # Business logic (userCtrl, doorCtrl, etc)
│   ├── routes/                      # API routes
│   ├── middleware/                  # Auth, error handling
│   ├── services/                    # Business services (emailService, mqttService)
│   ├── utils/                       # Helper utilities
│   ├── migrations/                  # Database migrations
│   ├── emails/                      # Email templates
│   ├── mqtt/                        # MQTT configuration
│   ├── scripts/                     # Utility scripts
│   ├── server.js                    # Main entry point
│   ├── package.json                 # Dependencies
│   ├── .env                         # Environment variables (KEEP SECURE)
│   └── Dockerfile                   # Docker configuration
│
├── face-microservice/                # Python Face Recognition Service
│   ├── app.py                       # Flask app entry point
│   ├── config.py                    # Service configuration
│   ├── models.py                    # ML models & utilities
│   ├── hf_inference_wrapper.py      # Hugging Face model wrapper
│   ├── face_database/               # Stored face embeddings
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker configuration
│   └── docker-compose.yml           # Docker Compose setup
│
├── esp-32-door-controller/           # IoT Door Controller
│   ├── ESP32_Door_Controller.ino     # Main firmware
│   ├── config.h                     # Configuration constants
│   ├── mqtt_integration.h           # MQTT communication
│   ├── door_control.h               # Door lock logic
│   ├── network_utils.h              # WiFi & networking
│   ├── camera_utils.h               # Camera integration
│   └── test_mqtt.ino                # MQTT testing sketch
│
├── EXAMPLE.env                       # Example environment variables
├── INTEGRATION_HANDOUT.md            # This file
└── [other documentation files]
```

---

## Environment Configuration (.env)

### Backend .env Setup

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# ═══════════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════════
PORT=3000
NODE_ENV=development  # or production
LOG_LEVEL=debug       # debug, info, warn, error

# ═══════════════════════════════════════════════════════════════
# DATABASE (MySQL/MariaDB)
# ═══════════════════════════════════════════════════════════════
DB_HOST=localhost                    # Or your cloud database host
DB_PORT=3306                         # Default MySQL port
DB_USER=root                         # Database username
DB_PASSWORD=your_password            # Database password
DB_NAME=enterprise_access_control    # Database name
DB_CONNECTION_LIMIT=10               # Connection pool size
DB_ENABLE_SSL=false                  # Set true for cloud databases (Aiven, AWS RDS)

# ═══════════════════════════════════════════════════════════════
# JWT AUTHENTICATION
# ═══════════════════════════════════════════════════════════════
# Generate secrets with: openssl rand -hex 32
JWT_SECRET=your_super_secret_jwt_key_generate_with_openssl_here
JWT_EXPIRES_IN=15m                   # Access token expiry (15 minutes)
JWT_REFRESH_SECRET=your_super_secret_refresh_key_generate_with_openssl_here
JWT_REFRESH_EXPIRES_IN=7d            # Refresh token expiry (7 days)

# ═══════════════════════════════════════════════════════════════
# ENCRYPTION & SECURITY
# ═══════════════════════════════════════════════════════════════
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=your_256_bit_encryption_key_for_tokens_and_data_here
BCRYPT_ROUNDS=10                     # Password hashing rounds (higher = slower but safer)

# ═══════════════════════════════════════════════════════════════
# EMAIL CONFIGURATION (Gmail API)
# ═══════════════════════════════════════════════════════════════
GMAIL_USER=your_email@gmail.com      # Gmail account for sending emails
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REFRESH_TOKEN=your_refresh_token_from_oauth_flow
GMAIL_SENDER_NAME=SecureApp Admin    # Display name in emails

# ═══════════════════════════════════════════════════════════════
# FACE RECOGNITION SERVICE
# ═══════════════════════════════════════════════════════════════
FACE_SERVICE_URL=https://your-username-face-model.hf.space
FACE_SERVICE_API_KEY=sk-face-your-actual-key-from-huggingface
FACE_CONFIDENCE_THRESHOLD=0.65       # Confidence threshold for face match (0-1)
FACE_SERVICE_TIMEOUT=30000           # Timeout in milliseconds

# ═══════════════════════════════════════════════════════════════
# MQTT CONFIGURATION (HiveMQ Cloud or Local)
# ═══════════════════════════════════════════════════════════════
# For HiveMQ Cloud:
MQTT_BROKER=mqtt://your-hivemq-broker.s1.eu.hivemq.cloud:8883
MQTT_USER=your_mqtt_user
MQTT_PASSWORD=your_mqtt_password_here
MQTT_CLIENT_ID=backend_server_client_id

# For local MQTT:
# MQTT_BROKER=mqtt://localhost:1883
# MQTT_USER=username (if required)
# MQTT_PASSWORD=password (if required)

# MQTT Topics (customize as needed)
MQTT_DOOR_CONTROL_TOPIC=devices/door/control
MQTT_DOOR_STATUS_TOPIC=devices/door/status
MQTT_FACE_AUTH_TOPIC=devices/door/face_auth
MQTT_ALERT_TOPIC=alerts/system

MQTT_RECONNECT_PERIOD=5000           # Reconnection attempt interval (ms)
MQTT_KEEPALIVE=60                    # MQTT keepalive interval (seconds)

# ═══════════════════════════════════════════════════════════════
# PI COMMUNICATION (Raspberry Pi)
# ═══════════════════════════════════════════════════════════════
PI_API_KEY=your_pi_secret_key_here
PI_API_BASE_URL=http://localhost:5000  # Or your Pi's IP

# ═══════════════════════════════════════════════════════════════
# CORS & SECURITY
# ═══════════════════════════════════════════════════════════════
CORS_ORIGIN=http://localhost:3001,http://localhost:3000,http://localhost:19000
# For production:
# CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

# ═══════════════════════════════════════════════════════════════
# EXTERNAL SERVICES
# ═══════════════════════════════════════════════════════════════
ENVIRONMENT=development              # development, staging, production
TIMEZONE=UTC
MAX_FILE_UPLOAD_SIZE=10MB
SESSION_TIMEOUT=3600000              # Session timeout in ms (1 hour)
```

### Frontend .env Setup

Create a `.env.local` file in the `AccessControl/` (Expo) or admin dashboard folder:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_MQTT_BROKER=mqtt://your-hivemq-broker.s1.eu.hivemq.cloud:8883
REACT_APP_FACE_SERVICE_URL=https://your-username-face-model.hf.space

# App Configuration
REACT_APP_APP_NAME=SecureApp
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=development

# Theme
REACT_APP_PRIMARY_COLOR=#2D7DD2
REACT_APP_DARK_BG=#0D1117
```

### Face Microservice .env Setup

Create a `.env` file in `face-microservice/`:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_PORT=5000
FLASK_DEBUG=True

# Hugging Face Configuration
HF_API_TOKEN=your_huggingface_api_token
HF_MODEL_NAME=face-embeddings-model-name

# Database
FACE_DB_PATH=./face_database/embeddings.db

# Confidence Threshold
CONFIDENCE_THRESHOLD=0.65

# Logging
LOG_LEVEL=DEBUG
```

---

## Setup Instructions

### Prerequisites

- **Node.js** v16+ (backend & frontend)
- **Python** 3.8+ (face microservice)
- **MySQL/MariaDB** 8.0+ (database)
- **Arduino IDE** or VSCode with Arduino extension (ESP32)
- **Git** for version control
- **Expo CLI** for mobile development: `npm install -g expo-cli`

### Step 1: Clone & Initialize Project

```bash
cd d:\SecureApp

# Create virtual environment for Python (if needed)
python -m venv .venv
.venv\Scripts\Activate.ps1  # On Windows PowerShell
# Or: source .venv/bin/activate  # On macOS/Linux

# Initialize Git
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

### Step 2: Database Setup

```bash
# Create database and tables
mysql -u root -p

# In MySQL CLI:
CREATE DATABASE enterprise_access_control CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enterprise_access_control;

# Import schema (if available)
SOURCE backend/migrations/schema.sql;

# Or manually create initial user table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  access_level INT DEFAULT 1,
  role ENUM('Admin', 'Manager', 'Employee') DEFAULT 'Employee',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

# Create initial admin user (run this once)
INSERT INTO users (name, email, password_hash, access_level, role) 
VALUES ('Admin User', 'admin@example.com', '$2b$10$...', 5, 'Admin');
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy ..\EXAMPLE.env .env

# Edit .env with your configuration
# - Database credentials
# - JWT secrets (generate new ones)
# - Gmail API keys
# - MQTT broker details
# - Face service URL

# Test database connection
node -e "require('./config/db').testConnection()"
```

### Step 4: Frontend (Mobile App) Setup

```bash
cd AccessControl

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env.local

# Start Expo
npm start
```

### Step 5: Face Microservice Setup

```bash
cd face-microservice

# Create Python virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
copy ..\EXAMPLE.env .env

# Test connection
python check_db_connection.py
```

### Step 6: ESP32 Setup (Optional for IoT)

```bash
# In Arduino IDE:
# 1. Install ESP32 Board Support
#    - Go to File > Preferences
#    - Add URL: https://dl.espressif.com/dl/package_esp32_index.json
#    - Go to Tools > Board > Boards Manager
#    - Search "esp32" and install

# 2. Open ESP32_Door_Controller.ino
# 3. Configure WiFi & MQTT in config.h
# 4. Select Board: ESP32 Dev Module
# 5. Select Port: COM[X]
# 6. Upload sketch
```

---

## Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
# Expected output: Server running on port 3000 [development]
```

#### Terminal 2: Start Face Microservice

```bash
cd face-microservice
python app.py
# Expected output: * Running on http://localhost:5000
```

#### Terminal 3: Start Mobile App

```bash
cd AccessControl
npm start
# Press 'w' for web, 'a' for Android, 'i' for iOS
```

#### Terminal 4: Start Admin Web Dashboard (if created)

```bash
cd admin-dashboard  # Create this folder first
npm start
# Expected: Running on http://localhost:3001
```

### Production Mode

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Face Microservice (with gunicorn)
cd face-microservice
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Use Docker Compose for orchestration
docker-compose up -d
```

---

## API Integration Guide

### Base URL Configuration

```javascript
// Frontend setup in axios
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Authentication Flow

#### 1. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response:
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Admin",
    "access_level": 5
  }
}
```

#### 2. Use Access Token

```bash
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 3. Refresh Token (when expired)

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

# Response:
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Core API Endpoints

#### Users Management

```bash
# List all users (with pagination & filtering)
GET /api/users?page=1&limit=10&role=Admin&search=john

# Get user by ID
GET /api/users/:id

# Create new user
POST /api/users
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "Manager",
  "access_level": 3,
  "department": "Sales"
}

# Update user
PUT /api/users/:id
{
  "name": "Jane Smith",
  "access_level": 4,
  "status": "active"
}

# Delete user (soft delete)
DELETE /api/users/:id
```

#### Door Management

```bash
# List all doors
GET /api/doors?location=floor1&type=biometric

# Get door details
GET /api/doors/:id

# Create door
POST /api/doors
{
  "name": "Main Entrance",
  "location": "Building A, Floor 1",
  "type": "biometric_face",
  "access_level_required": 2,
  "status": "active"
}

# Update door
PUT /api/doors/:id

# Delete door
DELETE /api/doors/:id
```

#### Access Control

```bash
# Assign user to door
POST /api/door-access
{
  "user_id": 5,
  "door_id": 3,
  "access_granted": true,
  "expires_at": "2026-12-31T23:59:59Z",
  "time_restrictions": {
    "enabled": true,
    "start_time": "09:00",
    "end_time": "17:00",
    "allowed_days": ["Mon", "Tue", "Wed", "Thu", "Fri"]
  }
}

# Get users with access to door
GET /api/door-access/users/:doorId

# Revoke access
DELETE /api/door-access/:id

# Update access rules
PUT /api/door-access/:id
```

#### Access Logs

```bash
# Get access logs with filters
GET /api/logs?user_id=5&door_id=3&result=GRANTED&date_from=2026-01-01&date_to=2026-12-31

# Get statistics
GET /api/logs/stats

# Export logs
POST /api/logs/export
{
  "format": "csv",  # csv, pdf, json
  "filters": { "date_from": "2026-01-01" }
}
```

#### System Preferences

```bash
# Get system settings
GET /api/preferences

# Update system settings
PUT /api/preferences
{
  "app_name": "SecureApp",
  "timezone": "UTC",
  "session_timeout": 3600,
  "theme": "dark"
}
```

---

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  access_level INT DEFAULT 1 (1=lowest, 5=highest),
  role ENUM('Admin', 'Manager', 'Employee', 'Guest'),
  status ENUM('active', 'inactive') DEFAULT 'active',
  department VARCHAR(100),
  phone VARCHAR(20),
  profile_photo_url VARCHAR(500),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL (soft delete)
);

CREATE UNIQUE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_status ON users(status);
```

#### doors
```sql
CREATE TABLE doors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  building VARCHAR(100),
  type ENUM('biometric_face', 'ble_token', 'rfid', 'pin_code', 'manual'),
  access_level_required INT DEFAULT 1,
  status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
  device_id VARCHAR(100),
  mqtt_topic VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_location ON doors(location);
CREATE INDEX idx_type ON doors(type);
CREATE INDEX idx_status ON doors(status);
```

#### door_access
```sql
CREATE TABLE door_access (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  door_id INT NOT NULL,
  access_granted BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NULL,
  time_restrictions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON door_access(user_id);
CREATE INDEX idx_door_id ON door_access(door_id);
CREATE INDEX idx_expires_at ON door_access(expires_at);
```

#### access_logs
```sql
CREATE TABLE access_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  door_id INT NOT NULL,
  result ENUM('GRANTED', 'DENIED') DEFAULT 'DENIED',
  method ENUM('face', 'ble', 'rfid', 'pin', 'manual', 'app'),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  device_info JSON,
  reason VARCHAR(255),
  face_confidence DECIMAL(3,2),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON access_logs(user_id);
CREATE INDEX idx_door_id ON access_logs(door_id);
CREATE INDEX idx_timestamp ON access_logs(timestamp);
CREATE INDEX idx_result ON access_logs(result);
```

#### system_preferences
```sql
CREATE TABLE system_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSON,
  description VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Key Services & Utilities

### Backend Services

#### 1. Authentication Service (`backend/services/authService.js`)

```javascript
// Generate JWT tokens
const tokens = await authService.generateTokens(userId);

// Verify access token
const decoded = await authService.verifyAccessToken(token);

// Refresh token
const newTokens = await authService.refreshTokens(refreshToken);
```

#### 2. Email Service (`backend/services/emailService.js`)

```javascript
// Send email via Gmail API
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Access Granted',
  template: 'accessGranted',
  data: { userName: 'John', doorName: 'Main Entrance' }
});
```

#### 3. MQTT Service (`backend/services/mqttService.js`)

```javascript
// Publish door control command
await mqttService.publish('devices/door/control', {
  action: 'UNLOCK',
  user_id: 1,
  duration: 5  // seconds
});

// Subscribe to door status
mqttService.subscribe('devices/door/status', (message) => {
  console.log('Door status:', message);
});
```

#### 4. Face Recognition Service (`backend/services/faceService.js`)

```javascript
// Authenticate user via face
const result = await faceService.authenticateByFace(imageBuffer);
// Returns: { authenticated: true/false, confidence: 0.85, user_id: 1 }

// Store face embedding
await faceService.storeFaceEmbedding(userId, faceImage);
```

### Frontend Services (Mobile/Web)

#### API Service (Axios Wrapper)

```javascript
// GET request
const users = await api.get('/users', { params: { page: 1 } });

// POST request
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Automatic token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newTokens = await refreshAccessToken();
      localStorage.setItem('accessToken', newTokens.accessToken);
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

#### Authentication Context (Mobile)

```javascript
// AuthContext provides:
const { user, login, logout, isLoading, isAuthenticated } = useAuth();

// Login
await login('user@example.com', 'password123');

// Logout
await logout();
```

#### MQTT Context (Mobile)

```javascript
// MQTTContext for real-time updates
const { connected, subscribe, publish } = useMQTT();

// Subscribe to door status
subscribe('devices/door/status', (message) => {
  console.log('Door updated:', message);
});

// Publish unlock request
publish('devices/door/control', { action: 'UNLOCK' });
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
```bash
# Check MySQL is running
mysql -u root -p

# If not running, start MySQL:
# Windows: net start MySQL80
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Verify credentials in .env
# Test connection:
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({...}); conn.ping((err) => console.log(err || 'OK'));"
```

#### 2. JWT Token Invalid/Expired

```
Error: JsonWebTokenError: invalid token
```

**Solution:**
```bash
# Generate new JWT secrets in .env
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For JWT_REFRESH_SECRET

# Restart backend server
npm run dev
```

#### 3. Face Service Not Responding

```
Error: Face service timeout
```

**Solution:**
```bash
# Check service is running
curl http://localhost:5000/health

# Restart service
# Terminal with face-microservice running: Ctrl+C
python app.py

# Or check Hugging Face endpoint URL is correct
curl https://your-username-face-model.hf.space/health
```

#### 4. MQTT Connection Failed

```
Error: MQTT connection refused
```

**Solution:**
```bash
# Check broker URL & credentials in .env
# If using HiveMQ Cloud:
# - Verify URL format: mqtt://[broker].s1.eu.hivemq.cloud:8883
# - Check username & password
# - Ensure connection port (8883 for TLS, 1883 for unencrypted)

# Test MQTT connection locally:
# npm install -g mqtt
mqtt sub -h [broker] -u [user] -P [password] devices/door/status
```

#### 5. CORS Error in Frontend

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```bash
# Update backend .env CORS_ORIGIN
# For development:
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:19000

# For production:
CORS_ORIGIN=https://yourdomain.com

# Restart backend
npm run dev
```

#### 6. Email Not Sending

```
Error: Authentication failed (invalid Gmail credentials)
```

**Solution:**
```bash
# Generate new Gmail OAuth credentials:
# 1. Go to Google Cloud Console
# 2. Create OAuth 2.0 credentials
# 3. Get Client ID, Client Secret
# 4. Run OAuth flow to get Refresh Token
# 5. Update .env with new credentials

# Test email service:
node backend/test-gmail-api.js
```

---

## Deployment Guide

### Local Deployment (Development)

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Face Service
cd face-microservice && python app.py

# Terminal 3: Mobile/Web
cd AccessControl && npm start
```

### Docker Deployment

#### 1. Build Docker Images

```bash
# Backend
docker build -t secureapp-backend:latest ./backend

# Face Service
docker build -t secureapp-face:latest ./face-microservice
```

#### 2. Docker Compose

```bash
# In root directory, create docker-compose.yml
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f face-service

# Stop
docker-compose down
```

### Cloud Deployment (AWS, Azure, GCP)

#### AWS Example (Elastic Beanstalk)

```bash
# Backend
cd backend
eb init -p node.js-18 secureapp-backend
eb create secureapp-backend-env
eb deploy

# Configure environment variables
eb setenv PORT=3000 NODE_ENV=production JWT_SECRET=xxx

# View logs
eb logs
```

#### Azure Container Instances

```bash
# Push to Azure Container Registry
az acr build --registry securerepo --image secureapp-backend:latest ./backend

# Deploy to ACI
az container create \
  --resource-group mygroup \
  --name secureapp-backend \
  --image securerepo.azurecr.io/secureapp-backend:latest \
  --environment-variables PORT=3000 NODE_ENV=production
```

### Database Backup & Migration

```bash
# Backup database
mysqldump -u root -p enterprise_access_control > backup.sql

# Restore from backup
mysql -u root -p enterprise_access_control < backup.sql

# Migrate to new server
# 1. Backup on old server: mysqldump -u root -p db_name > backup.sql
# 2. Copy backup.sql to new server
# 3. Import: mysql -u root -p < backup.sql
```

### Environment Setup for Production

```env
# production .env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn

DB_HOST=your-prod-db-host.rds.amazonaws.com
DB_PORT=3306
DB_USER=prod_user
DB_PASSWORD=very_secure_password_here
DB_NAME=enterprise_access_control

JWT_SECRET=generate_new_secure_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=generate_new_secure_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

ENCRYPTION_KEY=generate_new_encryption_key

FACE_SERVICE_URL=https://production-face-service.example.com
FACE_CONFIDENCE_THRESHOLD=0.70

MQTT_BROKER=mqtt://production-mqtt.example.com:8883
MQTT_USER=prod_mqtt_user
MQTT_PASSWORD=prod_mqtt_password

GMAIL_USER=noreply@example.com
GMAIL_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx

CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

SESSION_TIMEOUT=3600000
TIMEZONE=America/New_York
```

---

## Security Checklist

- [ ] Change all default passwords in `.env`
- [ ] Generate new JWT secrets (use `openssl rand -hex 32`)
- [ ] Enable HTTPS/TLS in production
- [ ] Setup firewall rules (only allow necessary ports)
- [ ] Enable database encryption at rest
- [ ] Setup rate limiting on API endpoints
- [ ] Implement CSRF protection
- [ ] Enable security headers (HSTS, CSP, X-Frame-Options)
- [ ] Regular security audits and penetration testing
- [ ] Keep dependencies updated (`npm audit`, `pip check`)
- [ ] Implement proper error handling (don't expose sensitive data)
- [ ] Setup monitoring and alerting for security events
- [ ] Backup database regularly
- [ ] Implement audit logging for all admin actions

---

## Monitoring & Logging

### Backend Logging

```javascript
// In server.js or middleware
const logger = require('./utils/logger');

// Log levels: debug, info, warn, error
logger.info('Server started on port 3000');
logger.warn('Database connection slow');
logger.error('Failed to authenticate user', { userId: 1, error: err });
```

### Health Check Endpoints

```bash
# Backend health
curl http://localhost:3000/health
# Response: { "status": "ok", "timestamp": "2026-05-16T10:30:00Z" }

# Database health
curl http://localhost:3000/api/health/database

# MQTT health
curl http://localhost:3000/api/health/mqtt

# Face service health
curl http://localhost:5000/health
```

### Monitoring Tools

- **PM2**: Process management for Node.js
  ```bash
  pm2 start backend/server.js --name "secureapp-backend"
  pm2 start face-microservice/app.py --name "face-service"
  ```

- **ELK Stack**: Elasticsearch, Logstash, Kibana for log aggregation
- **Prometheus + Grafana**: Metrics and dashboards
- **Sentry**: Error tracking and monitoring

---

## Support & Documentation

- **API Documentation**: [Swagger/OpenAPI] (to be generated)
- **Mobile App Documentation**: See `/AccessControl/README.md`
- **Face Service**: See `/face-microservice/README.md`
- **IoT Setup**: See `/esp-32-door-controller/README.md`

---

## Quick Reference Commands

```bash
# Backend
npm install                 # Install dependencies
npm run dev                # Start in development mode
npm start                  # Start in production
npm run migrate            # Run database migrations
npm test                   # Run tests

# Frontend
npm install                # Install dependencies
npm start                  # Start dev server (Expo)
npm run build              # Build for production
npm run lint               # Run ESLint

# Face Service
pip install -r requirements.txt  # Install dependencies
python app.py              # Start service
python check_db_connection.py    # Test database

# Database
mysql -u root -p           # Connect to MySQL
mysqldump -u root -p db > backup.sql  # Backup
mysql -u root -p db < backup.sql      # Restore

# Docker
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
docker ps                  # List running containers
```

---

## Changelog & Updates

### v1.0.0 (Current)
- ✅ Backend API setup
- ✅ User & Door management
- ✅ Access control system
- ✅ JWT authentication
- ✅ Face recognition integration
- ✅ MQTT-based door control
- ✅ Email notifications
- ✅ Access logging & monitoring
- 🔄 Mobile app (React Native/Expo)
- 🔄 Admin web dashboard (React/Next.js)

### Upcoming Features
- Real-time dashboard with WebSocket
- Advanced reporting & analytics
- Biometric enrollment management
- RFID & BLE tag integration
- Multi-factor authentication (MFA)
- SSO (Single Sign-On) integration
- Mobile push notifications
- Offline mode for mobile

---

## Contact & Support

For issues, questions, or contributions:

- **GitHub**: [SecureApp Repository]
- **Email**: support@secureapp.com
- **Documentation**: [Wiki/Docs]
- **Bug Reports**: [GitHub Issues]

---

**Last Updated**: May 16, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

