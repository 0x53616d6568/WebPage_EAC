#!/usr/bin/env node
/**
 * Service Connectivity Test Script
 * Tests all external service connections
 */

import axios from 'axios';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const results = {
  timestamp: new Date().toISOString(),
  tests: {}
};

// ═══════════════════════════════════════════════════════════════
// Test Database Connection
// ═══════════════════════════════════════════════════════════════
async function testDatabase() {
  try {
    console.log('\n🔍 Testing Database Connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    });

    const [rows] = await connection.execute('SELECT 1');
    await connection.end();

    console.log('✅ Database connection successful');
    results.tests.database = {
      status: 'success',
      message: 'Connected to Aiven MySQL database'
    };
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    results.tests.database = {
      status: 'failed',
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// Test Face Service
// ═══════════════════════════════════════════════════════════════
async function testFaceService() {
  try {
    console.log('\n🔍 Testing Face Recognition Service...');
    const response = await axios.get('http://localhost:5000/health', { timeout: 5000 });
    console.log('✅ Face service is running');
    results.tests.faceService = {
      status: 'success',
      message: 'Face microservice is healthy',
      version: response.data.version
    };
  } catch (error) {
    console.error('❌ Face service health check failed:', error.message);
    results.tests.faceService = {
      status: 'failed',
      error: error.message,
      hint: 'Make sure face microservice is running on port 5000'
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// Test MQTT Connection
// ═══════════════════════════════════════════════════════════════
async function testMQTT() {
  try {
    console.log('\n🔍 Testing MQTT Broker Connection...');
    // Note: mqtt client connection test would require mqtt.js library
    // For now, we'll do a simple hostname resolution check
    
    const brokerUrl = new URL(process.env.MQTT_BROKER);
    console.log(`📍 MQTT Broker: ${brokerUrl.hostname}:${brokerUrl.port}`);
    console.log('⚠️  Full MQTT test requires starting the backend server');
    
    results.tests.mqtt = {
      status: 'pending',
      message: 'MQTT configuration loaded (full test requires backend running)',
      broker: brokerUrl.hostname,
      port: brokerUrl.port,
      user: process.env.MQTT_USER
    };
  } catch (error) {
    console.error('❌ MQTT configuration error:', error.message);
    results.tests.mqtt = {
      status: 'failed',
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// Test Gmail Configuration
// ═══════════════════════════════════════════════════════════════
async function testGmailConfig() {
  try {
    console.log('\n🔍 Checking Gmail Configuration...');
    
    const requiredEnvVars = [
      'GMAIL_USER',
      'GMAIL_CLIENT_ID',
      'GMAIL_CLIENT_SECRET',
      'GMAIL_REFRESH_TOKEN'
    ];

    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length === 0) {
      console.log('✅ Gmail configuration is complete');
      results.tests.gmail = {
        status: 'success',
        message: 'All Gmail OAuth credentials configured',
        user: process.env.GMAIL_USER
      };
    } else {
      console.warn('⚠️  Missing Gmail env vars:', missing);
      results.tests.gmail = {
        status: 'warning',
        message: 'Some Gmail credentials missing',
        missing: missing
      };
    }
  } catch (error) {
    console.error('❌ Gmail configuration error:', error.message);
    results.tests.gmail = {
      status: 'failed',
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// Display Results
// ═══════════════════════════════════════════════════════════════
function displayResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONNECTIVITY TEST RESULTS');
  console.log('='.repeat(60));
  
  Object.entries(results.tests).forEach(([service, result]) => {
    const status = result.status === 'success' ? '✅' : 
                   result.status === 'warning' ? '⚠️ ' : '❌';
    console.log(`\n${status} ${service.toUpperCase()}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Message: ${result.message || result.error}`);
    
    if (result.hint) {
      console.log(`   Hint: ${result.hint}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Next Steps:');
  console.log('   Terminal 1: npm run dev          (Backend)');
  console.log('   Terminal 2: python app.py        (Face Service)');
  console.log('   Terminal 3: npm run dev          (Frontend)');
  console.log('\n');
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('\n🚀 SecureApp Service Connectivity Test\n');
  
  await testDatabase();
  await testFaceService();
  await testMQTT();
  await testGmailConfig();
  
  displayResults();
}

main().catch(console.error);
