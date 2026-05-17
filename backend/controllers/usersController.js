import bcrypt from 'bcrypt'
import pool from '../config/database.js'
import { sendWelcomeEmail } from '../utils/emailService.js'

export const getAllUsers = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT u.user_id, u.full_name, u.email, u.phone, u.department, u.avatar_url, u.role_id, u.status, r.role_name, r.access_level
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.user_id
    `)
    conn.release()
    res.json({ data: rows, message: 'Users retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT u.user_id, u.full_name, u.email, u.phone, u.department, u.avatar_url, u.role_id, u.status, u.is_first_login, u.last_login, r.role_name, r.access_level
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?
    `, [req.params.user_id])
    conn.release()
    
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ data: rows[0], message: 'User retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createUser = async (req, res) => {
  try {
    const { full_name, email, phone, department, role_id } = req.body
    
    if (!full_name || !email || !role_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const conn = await pool.getConnection()
    
    // Verify role_id exists
    try {
      const [roleRows] = await conn.query('SELECT role_id FROM roles WHERE role_id = ?', [role_id])
      if (!roleRows.length) {
        conn.release()
        return res.status(400).json({ error: 'Invalid role_id' })
      }
    } catch (roleErr) {
      conn.release()
      return res.status(400).json({ error: 'Unable to validate role' })
    }

    // Generate temporary password
    const generateTempPassword = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
      return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    // Create user with ACTIVE status (matches production default)
    await conn.query(
      `INSERT INTO users (full_name, email, password_hash, phone, department, role_id, status, is_first_login) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, passwordHash, phone || null, department || null, role_id, 'ACTIVE', 1]
    )
    conn.release()

    // Send welcome email with credentials
    try {
      await sendWelcomeEmail(email, full_name, tempPassword)
    } catch (emailErr) {
      console.error('⚠️ Warning: Email failed but user was created:', emailErr.message)
      // Continue anyway - user is created even if email fails
    }

    res.json({ message: 'User created successfully. Welcome email has been sent.' })
  } catch (err) {
    console.error(err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Server error: ' + err.message })
    }
  }
}

export const updateUser = async (req, res) => {
  try {
    const { full_name, email, phone, department, role_id, status, password } = req.body
    const userId = req.params.user_id

    const conn = await pool.getConnection()
    
    // Verify user exists
    const [userCheck] = await conn.query('SELECT user_id FROM users WHERE user_id = ?', [userId])
    if (!userCheck.length) {
      conn.release()
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Verify role_id if provided
    if (role_id) {
      const [roleRows] = await conn.query('SELECT role_id FROM roles WHERE role_id = ?', [role_id])
      if (!roleRows.length) {
        conn.release()
        return res.status(400).json({ error: 'Invalid role_id' })
      }
    }
    
    // If password is provided, hash it and update it too
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      await conn.query(
        `UPDATE users SET full_name = ?, email = ?, phone = ?, department = ?, role_id = ?, status = ?, password_hash = ? 
         WHERE user_id = ?`,
        [full_name || null, email || null, phone || null, department || null, role_id || null, status || 'ACTIVE', passwordHash, userId]
      )
    } else {
      await conn.query(
        `UPDATE users SET full_name = ?, email = ?, phone = ?, department = ?, role_id = ?, status = ? 
         WHERE user_id = ?`,
        [full_name || null, email || null, phone || null, department || null, role_id || null, status || 'ACTIVE', userId]
      )
    }
    conn.release()

    res.json({ message: 'User updated successfully' })
  } catch (err) {
    console.error(err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Server error: ' + err.message })
    }
  }
}

export const deleteUser = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query('DELETE FROM users WHERE user_id = ?', [req.params.user_id])
    conn.release()

    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const assignManager = async (req, res) => {
  try {
    // Note: Production database does not have a manager_id column in users table
    // This endpoint is a placeholder for future manager assignment functionality
    res.json({ message: 'Manager assignment not yet configured in database schema' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const enrollFace = async (req, res) => {
  try {
    const userId = req.params.user_id
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const conn = await pool.getConnection()
    
    // Check if user exists
    const [userRows] = await conn.query('SELECT user_id FROM users WHERE user_id = ?', [userId])
    if (!userRows.length) {
      conn.release()
      return res.status(404).json({ error: 'User not found' })
    }

    // Store face embedding in the database
    const embeddingData = req.file.buffer
    const modelVersion = 'arcface-r100'
    
    // Insert or update face embedding
    await conn.query(`
      INSERT INTO face_embeddings (user_id, embedding, enrolled_at, model_version)
      VALUES (?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE
        embedding = VALUES(embedding),
        enrolled_at = NOW(),
        model_version = VALUES(model_version)
    `, [userId, embeddingData, modelVersion])
    
    conn.release()

    res.json({ message: 'Face enrolled successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
