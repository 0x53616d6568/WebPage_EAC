import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

// Load environment variables
dotenv.config()

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
})

async function testEmailSending() {
  try {
    console.log('🧪 Testing Email Sending with OAuth2...\n')
    console.log('📧 Gmail User:', process.env.GMAIL_USER)
    console.log('🔑 Client ID:', process.env.GMAIL_CLIENT_ID?.substring(0, 20) + '...')
    console.log('🔄 Refresh Token:', process.env.GMAIL_REFRESH_TOKEN?.substring(0, 20) + '...\n')

    // Step 1: Refresh access token
    console.log('Step 1️⃣  - Refreshing OAuth2 access token...')
    const { credentials } = await oauth2Client.refreshAccessToken()
    console.log('✅ Access token refreshed successfully')
    console.log('   - Token Type:', credentials.token_type)
    console.log('   - Expiry:', new Date(credentials.expiry_date).toLocaleString())
    console.log('   - Access Token:', credentials.access_token?.substring(0, 30) + '...\n')

    // Step 2: Create transporter with explicit access token
    console.log('Step 2️⃣  - Creating Gmail SMTP transporter with explicit access token...')
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        xoauth2: credentials.access_token,
      },
    })
    console.log('✅ Transporter created successfully\n')

    // Step 3: Verify connection
    console.log('Step 3️⃣  - Verifying SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified!\n')

    // Step 4: Send test email
    console.log('Step 4️⃣  - Sending test email...')
    const testEmail = 'sameehourabi@gmail.com'
    console.log('   Recipient:', testEmail)
    
    const result = await transporter.sendMail({
      from: `"EAC System" <${process.env.GMAIL_USER}>`,
      to: testEmail,
      subject: '✅ EAC Email Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0D1117; padding: 20px; border-radius: 8px; color: #F0F6FC;">
            <h2 style="margin: 0 0 16px 0; color: #2D7DD2;">✅ Email Service is Working!</h2>
            
            <p>Great news! Your Gmail OAuth2 configuration is correctly set up.</p>
            
            <div style="background-color: #161B22; padding: 16px; border-radius: 6px; border: 1px solid #21262D; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Test Email Details:</strong></p>
              <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 0;"><strong>Status:</strong> Successfully sent via Gmail OAuth2</p>
            </div>
            
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #21262D; font-size: 12px; color: #8B949E;">
              Your email service is ready to send welcome emails and password reset notifications!
            </p>
          </div>
        </div>
      `,
    })

    console.log('✅ Test email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log()
    console.log('🎉 Email service is fully operational!')
    console.log('   You can now create users and they will receive welcome emails.')
    
  } catch (error) {
    console.error('❌ Error during email test:', error.message)
    console.error('\nFull error details:')
    console.error(error)
    process.exit(1)
  }
}

testEmailSending()
