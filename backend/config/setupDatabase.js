// Database schema setup - run once to create/update tables
import pool from './config/database.js'

export const setupDatabase = async () => {
  try {
    const conn = await pool.getConnection()
    
    // Add manager_id column to users if it doesn't exist
    try {
      await conn.query(`
        ALTER TABLE users ADD COLUMN manager_id INT,
        ADD FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE SET NULL
      `)
      console.log('✓ Added manager_id column to users table')
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ manager_id column already exists')
      } else {
        console.error('Error adding manager_id:', err.message)
      }
    }

    // Create face_embeddings table if it doesn't exist
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS face_embeddings (
          embedding_id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL UNIQUE,
          face_image LONGBLOB NOT NULL,
          file_name VARCHAR(255),
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id)
        )
      `)
      console.log('✓ face_embeddings table created/exists')
    } catch (err) {
      console.error('Error creating face_embeddings table:', err.message)
    }

    // Create door_access table if it doesn't exist
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS door_access (
          access_id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          door_id INT NOT NULL,
          access_granted TINYINT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (door_id) REFERENCES doors(door_id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_door (user_id, door_id),
          INDEX idx_door_id (door_id)
        )
      `)
      console.log('✓ door_access table created/exists')
    } catch (err) {
      console.error('Error creating door_access table:', err.message)
    }

    conn.release()
    console.log('✓ Database setup completed successfully')
  } catch (err) {
    console.error('Database setup error:', err)
  }
}
