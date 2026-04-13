import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
)

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
})

// Create transporter using Gmail service with OAuth2 credentials
export const createTransporter = async () => {
  try {
    console.log('🔄 Refreshing OAuth2 access token...')
    console.log('📧 GMAIL_USER:', process.env.GMAIL_USER)
    
    const { credentials } = await oauth2Client.refreshAccessToken()
    
    console.log('✅ Access token refreshed successfully')
    console.log('� Token details:')
    console.log('   - Access Token:', credentials.access_token?.substring(0, 30) + '...')
    console.log('   - Token Type:', credentials.token_type)
    console.log('   - Expiry:', new Date(credentials.expiry_date))
    
    // Store new credentials
    oauth2Client.setCredentials(credentials)

    console.log('🔌 Creating Gmail SMTP transporter with OAuth2...')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: credentials.access_token,
        accessTokenExpires: credentials.expiry_date,
      },
    })

    console.log('✨ Transporter created successfully')
    return transporter
  } catch (err) {
    console.error('❌ Error creating email transporter:', err.message)
    console.error('Full error:', err)
    throw err
  }
}

// Send welcome email
export const sendWelcomeEmail = async (email, fullName, tempPassword) => {
  try {
    const transporter = await createTransporter()

    const mailOptions = {
      from: `"EAC System" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to EAC System - Your Account is Ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0D1117; padding: 20px; border-radius: 8px; color: #F0F6FC;">
            <h2 style="margin: 0 0 16px 0; color: #2D7DD2;">Welcome to the Enterprise Access Control System!</h2>
            
            <p>Hello <strong>${fullName}</strong>,</p>
            
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div style="background-color: #161B22; padding: 16px; border-radius: 6px; border: 1px solid #21262D; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong></p>
              <p style="margin: 0 0 16px 0; font-family: monospace; word-break: break-all;">${email}</p>
              
              <p style="margin: 0 0 8px 0;"><strong>Temporary Password:</strong></p>
              <p style="margin: 0; font-family: monospace; font-size: 14px; word-break: break-all;">${tempPassword}</p>
            </div>
            
            <p><strong>⚠️ Important:</strong> You will be required to change your password on your first login for security purposes.</p>
            
            <div style="background-color: rgba(93, 172, 255, 0.1); padding: 12px; border-left: 4px solid #2D7DD2; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #58A6FF;">
                <strong>Next Steps:</strong><br>
                1. Visit the login portal<br>
                2. Use your email and temporary password<br>
                3. Change your password when prompted<br>
                4. Access the system with your new password
              </p>
            </div>
            
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #21262D; font-size: 12px; color: #8B949E;">
              If you didn't request this account or have any questions, please contact your administrator.<br>
              <strong>Do not share this email or your credentials with anyone.</strong>
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent to:', email)
    return result
  } catch (err) {
    console.error('❌ Error sending welcome email:', err)
    throw err
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email, fullName, resetLink) => {
  try {
    const transporter = await createTransporter()

    const mailOptions = {
      from: `"EAC System" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - EAC System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0D1117; padding: 20px; border-radius: 8px; color: #F0F6FC;">
            <h2 style="margin: 0 0 16px 0; color: #2D7DD2;">Password Reset Request</h2>
            
            <p>Hello <strong>${fullName}</strong>,</p>
            
            <p>You requested a password reset for your EAC account. Click the button below to reset your password:</p>
            
            <div style="margin: 24px 0;">
              <a href="${resetLink}" style="background-color: #2D7DD2; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #8B949E;">${resetLink}</p>
            
            <p><strong>Note:</strong> This link will expire in 1 hour.</p>
            
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #21262D; font-size: 12px; color: #8B949E;">
              If you didn't request this password reset, please ignore this email.<br>
              If you have any concerns, contact your administrator immediately.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent to:', email)
    return result
  } catch (err) {
    console.error('❌ Error sending password reset email:', err)
    throw err
  }
}
