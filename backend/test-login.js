import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root123',
  database: 'enterprise_access_control',
})

async function testLogin() {
  try {
    console.log('Testing login...')
    
    const email = 'admin@company.com'
    const plainPassword = 'password'
    
    const conn = await pool.getConnection()
    
    // Get user
    const [rows] = await conn.query(
      `SELECT user_id, full_name, email, password_hash, role_id, status 
       FROM users 
       WHERE email = ? AND status = 'ACTIVE'`,
      [email]
    )
    
    console.log('Query result:', rows.length > 0 ? 'User found' : 'No user found')
    
    if (rows.length === 0) {
      console.log('❌ User not found or not ACTIVE')
      conn.release()
      process.exit(1)
    }
    
    const user = rows[0]
    console.log('✓ User found:', user.full_name, user.email)
    console.log('  Password hash:', user.password_hash)
    
    // Test bcrypt
    const passwordMatch = await bcrypt.compare(plainPassword, user.password_hash)
    console.log('✓ Bcrypt compare result:', passwordMatch ? 'MATCH ✓' : 'NO MATCH ✗')
    
    if (!passwordMatch) {
      console.log('❌ Password does not match')
    } else {
      console.log('✓ Login would succeed!')
    }
    
    conn.release()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

testLogin()
