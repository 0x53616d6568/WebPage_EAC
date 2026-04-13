/**
 * OAuth Token Generator for Gmail
 * 
 * Usage:
 * 1. Replace CLIENT_ID and CLIENT_SECRET below with your values
 * 2. Run: node get-oauth-token.js
 * 3. Click the authorization link
 * 4. Paste the code you receive
 * 5. Add the GMAIL_REFRESH_TOKEN to your .env file
 */

import { google } from 'googleapis'
import readline from 'readline'

// OAuth credentials from environment variables
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || ''
const REDIRECT_URL = process.env.GMAIL_REDIRECT_URL || 'http://localhost:8888/api/auth/google/callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env file')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
)

const scopes = ['https://www.googleapis.com/auth/gmail.send']

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('\n' + '='.repeat(60))
console.log('Gmail OAuth2 Token Generator')
console.log('='.repeat(60) + '\n')

// Check if credentials are configured
if (CLIENT_ID === 'YOUR_CLIENT_ID.apps.googleusercontent.com' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET') {
  console.error('❌ Error: Please update CLIENT_ID and CLIENT_SECRET in this file')
  console.error('   Get them from: https://console.cloud.google.com/credentials')
  rl.close()
  process.exit(1)
}

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
})

console.log('📌 Step 1: Click the link below to authorize the app:')
console.log('-'.repeat(60))
console.log(authUrl)
console.log('-'.repeat(60) + '\n')

console.log('📌 Step 2: You will be redirected to a URL like:')
console.log('   http://localhost:8888/api/auth/google/callback?code=...')
console.log('\n📌 Step 3: Copy the CODE from the redirect URL (the long string)\n')

rl.question('Paste the authorization code here: ', async (code) => {
  if (!code || code.trim().length === 0) {
    console.error('\n❌ Error: No authorization code provided')
    rl.close()
    process.exit(1)
  }

  try {
    console.log('\n⏳ Exchanging code for tokens...')
    const { tokens } = await oauth2Client.getToken(code.trim())

    console.log('\n' + '='.repeat(60))
    console.log('✅ Success! Authorization Complete')
    console.log('='.repeat(60) + '\n')

    console.log('Copy these values to your .env file:\n')
    console.log('-'.repeat(60))
    console.log('GMAIL_USER=your-email@gmail.com')
    console.log('GMAIL_CLIENT_ID=' + CLIENT_ID)
    console.log('GMAIL_CLIENT_SECRET=' + CLIENT_SECRET)
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token)
    console.log('GMAIL_REDIRECT_URL=http://localhost:8888/api/auth/google/callback')
    console.log('-'.repeat(60) + '\n')

    console.log('📋 Complete .env snippet:')
    console.log(`
# Gmail OAuth2 Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=${CLIENT_ID}
GMAIL_CLIENT_SECRET=${CLIENT_SECRET}
GMAIL_REFRESH_TOKEN=${tokens.refresh_token}
GMAIL_REDIRECT_URL=http://localhost:8888/api/auth/google/callback
    `)

    console.log('ℹ️  Next steps:')
    console.log('1. Replace "your-email@gmail.com" with your actual Gmail address')
    console.log('2. Paste these lines into WebPage/backend/.env')
    console.log('3. Restart your backend server')
    console.log('4. Test by creating a new user - they should receive a welcome email\n')

    rl.close()
  } catch (err) {
    console.error('\n❌ Error getting token:', err.message)
    if (err.message.includes('invalid_grant')) {
      console.error('\n⚠️  The authorization code may have expired.')
      console.error('   Please try again and act quickly after authorizing.')
    }
    rl.close()
    process.exit(1)
  }
})

// Handle Ctrl+C
rl.on('close', () => {
  process.exit(0)
})
