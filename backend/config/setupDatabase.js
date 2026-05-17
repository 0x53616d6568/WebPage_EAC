// Database schema setup - run once to create/update tables
import pool from './database.js'

export const setupDatabase = async () => {
  try {
    const conn = await pool.getConnection()
    
    console.log('✓ Database connection established')
  } catch (err) {
    console.error('Database setup error:', err)
  }
}
