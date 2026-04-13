import dotenv from 'dotenv'

// Load environment variables FIRST before importing other modules
dotenv.config()

async function testEmailSending() {
  // Import after env is loaded
  const { sendWelcomeEmail } = await import('./utils/emailService.js')
  try {
    console.log('🧪 Testing Email Sending to sameehourabi@gmail.com\n')

    const email = 'sameehourabi@gmail.com'
    const fullName = 'Test User'
    const tempPassword = 'TempPass123!@#'

    console.log('📧 Sending welcome email to:', email)
    console.log('👤 Full Name:', fullName)
    console.log('🔐 Temp Password:', tempPassword)
    console.log()

    const result = await sendWelcomeEmail(email, fullName, tempPassword)

    console.log('\n✅ Email sent successfully!')
    console.log('📬 Message ID:', result.messageId)
    console.log('\n🎉 Check your email inbox for the welcome message!')

  } catch (error) {
    console.error('❌ Error sending email:', error.message)
    console.error('\nFull error details:')
    console.error(error)
    process.exit(1)
  }
}

testEmailSending()
