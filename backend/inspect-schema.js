import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function inspectSchema() {
  try {
    console.log('🔍 Inspecting database schema...\n')
    
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

    // Get column information for users table
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = DATABASE()"
    )
    
    console.log('📋 Users table columns:')
    console.log('=====================================')
    if (columns.length === 0) {
      console.log('❌ Users table not found!')
    } else {
      columns.forEach((col, idx) => {
        console.log(`${idx + 1}. ${col.COLUMN_NAME} (${col.COLUMN_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`)
      })
    }
    
    // Try to get users count
    console.log('\n📊 User count:')
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM users')
    console.log(`Total users: ${count[0].count}`)
    
    await connection.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

inspectSchema()
