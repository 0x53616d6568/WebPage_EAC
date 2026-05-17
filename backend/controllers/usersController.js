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

    // Generate temporary password
    const generateTempPassword = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
      return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    const conn = await pool.getConnection()
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
      res.status(500).json({ error: 'Server error' })
    }
  }
}

export const updateUser = async (req, res) => {
  try {
    const { full_name, email, phone, department, role_id, status, password } = req.body
    const userId = req.params.user_id

    const conn = await pool.getConnection()
    
    // If password is provided, hash it and update it too
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      await conn.query(
        `UPDATE users SET full_name = ?, email = ?, phone = ?, department = ?, role_id = ?, status = ?, password_hash = ? 
         WHERE user_id = ?`,
        [full_name, email, phone || null, department || null, role_id, status || 'ACTIVE', passwordHash, userId]
      )
    } else {
      await conn.query(
        `UPDATE users SET full_name = ?, email = ?, phone = ?, department = ?, role_id = ?, status = ? 
         WHERE user_id = ?`,
        [full_name, email, phone || null, department || null, role_id, status || 'ACTIVE', userId]
      )
    }
    conn.release()

    res.json({ message: 'User updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
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
    const { manager_id } = req.body
    const userId = req.params.user_id

    const conn = await pool.getConnection()
    
    // Verify manager exists and has manager role
    if (manager_id) {
      const [managerRows] = await conn.query(
        'SELECT user_id FROM users WHERE user_id = ? AND role_id IN (SELECT role_id FROM roles WHERE role_name LIKE "%Manager%" OR role_name LIKE "%Supervisor%")',
        [manager_id]
      )
      
      if (!managerRows.length) {
        conn.release()
        return res.status(400).json({ error: 'Invalid manager selected' })
      }
    }

    // Update user's manager_id
    await conn.query(
      'UPDATE users SET manager_id = ? WHERE user_id = ?',
      [manager_id || null, userId]
    )
    conn.release()

    res.json({ message: 'Manager assigned successfully' })
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

    // Store face embedding file reference (could be file path, S3 URL, or base64 encoded)
    const faceData = Buffer.from(req.file.buffer).toString('base64')
    const fileName = `${userId}_${Date.now()}.jpg`
    
    // Insert or update face_embeddings table
    await conn.query(`
      INSERT INTO face_embeddings (user_id, face_image, file_name, uploaded_at)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        face_image = VALUES(face_image),
        file_name = VALUES(file_name),
        uploaded_at = NOW()
    `, [userId, faceData, fileName])
    
    conn.release()

    res.json({ message: 'Face enrolled successfully', fileName })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
