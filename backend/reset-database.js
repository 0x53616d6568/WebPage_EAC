import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resetDatabase = async () => {
  let connection
  try {
    // Connect to MySQL without selecting a database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123',
      multipleStatements: true,
    })

    console.log('✓ Connected to MySQL server')

    // Drop existing database
    console.log('🗑️  Dropping existing database...')
    await connection.query('DROP DATABASE IF EXISTS enterprise_access_control')
    console.log('✓ Database dropped')

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'migrations', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📝 Creating new database and tables...')
    await connection.query(schemaSql)
    console.log('✓ Database and tables created successfully')

    // Verify tables
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'enterprise_access_control' ORDER BY TABLE_NAME"
    )
    
    console.log('\n✅ Database setup completed!\n')
    console.log('📊 Created tables:')
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`)
    })

    console.log('\n✓ Initial data inserted:')
    console.log('   - 3 Roles (Employee, Manager, Administrator)')
    console.log('   - 1 Admin User (admin@example.com, password: admin123)')
    console.log('   - 3 Sample Doors')
    
    console.log('\n🎯 Next steps:')
    console.log('   1. Start the backend: npm run dev')
    console.log('   2. Test user creation in the admin panel')
    console.log('   3. Verify face enrollment works')
    console.log('   4. Test manager assignment')

  } catch (err) {
    console.error('❌ Database reset failed:', err.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

resetDatabase()
