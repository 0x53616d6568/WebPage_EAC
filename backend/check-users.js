import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n')
    
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

    // Check users table with correct column names
    const [users] = await connection.execute(
      'SELECT user_id, full_name, email, phone, role_id, status FROM users ORDER BY user_id'
    )
    
    console.log('📊 Users in database:')
    console.log('=====================================')
    if (users.length === 0) {
      console.log('❌ No users found in database!')
    } else {
      users.forEach((user, idx) => {
        console.log(`\n${idx + 1}. ${user.full_name}`)
        console.log(`   User ID: ${user.user_id}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Phone: ${user.phone || 'N/A'}`)
        console.log(`   Role ID: ${user.role_id}`)
        console.log(`   Status: ${user.status}`)
      })
      
      console.log('\n' + '='.repeat(37))
      console.log(`\n✅ Total: ${users.length} users found`)
      console.log('\n💡 Try logging in with one of these email addresses')
      console.log('   Password: Check your database records or reset it')
    }
    
    await connection.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkUsers()
