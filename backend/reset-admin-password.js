import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

async function checkAdminUser() {
  try {
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
    })

    // Get admin user details
    const [admin] = await connection.execute(
      'SELECT user_id, full_name, email, password_hash, status, role_id FROM users WHERE email = ?',
      ['admin@company.com']
    )
    
    if (admin.length === 0) {
      console.log('❌ Admin user not found')
      return
    }

    const user = admin[0]
    console.log('👤 Admin User Details:')
    console.log('=====================================')
    console.log(`User ID: ${user.user_id}`)
    console.log(`Name: ${user.full_name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Status: ${user.status}`)
    console.log(`Role ID: ${user.role_id}`)
    console.log(`Password Hash Length: ${user.password_hash?.length || 0}`)
    
    // Check if status is active
    if (user.status !== 'ACTIVE') {
      console.log(`\n⚠️  User status is "${user.status}", but login requires "ACTIVE"`)
      console.log('Updating status to ACTIVE...')
      await connection.execute(
        'UPDATE users SET status = ? WHERE user_id = ?',
        ['ACTIVE', user.user_id]
      )
      console.log('✅ Status updated to ACTIVE')
    } else {
      console.log('\n✅ User status is ACTIVE')
    }
    
    // Let's reset the password to a known value
    console.log('\n🔐 Resetting password to "password123"...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    await connection.execute(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, user.user_id]
    )
    console.log('✅ Password reset successfully')
    console.log('\n📝 Use these credentials to login:')
    console.log('Email: admin@company.com')
    console.log('Password: password123')
    
    await connection.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkAdminUser()
