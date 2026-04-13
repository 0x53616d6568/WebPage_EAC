import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('💬 Login attempt:', email)
    
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({ error: 'Email and password required' })
    }

    const conn = await pool.getConnection()
    console.log('✓ DB connection established')
    
    // Get user with ACTIVE status only
    const [rows] = await conn.query(
      `SELECT user_id, full_name, email, password_hash, role_id, department, avatar_url, status 
       FROM users 
       WHERE email = ? AND status = 'ACTIVE'`,
      [email]
    )
    console.log('✓ User query complete, found:', rows.length, 'user(s)')
    
    if (rows.length === 0) {
      console.log('❌ User not found or inactive')
      conn.release()
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = rows[0]
    console.log('✓ User:', user.full_name, user.email)
    
    // Verify password with bcrypt
    console.log('🔐 Testing password...')
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log('✓ Password match result:', passwordMatch)
    
    if (!passwordMatch) {
      console.log('❌ Password mismatch')
      conn.release()
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Get role name and access level
    const [roleRows] = await conn.query(
      'SELECT role_name, access_level FROM roles WHERE role_id = ?',
      [user.role_id]
    )
    conn.release()
    console.log('✓ Role query complete')

    const roleName = roleRows.length > 0 ? roleRows[0].role_name : 'User'
    const accessLevel = roleRows.length > 0 ? roleRows[0].access_level : 1

    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role_id: user.role_id,
      role_name: roleName,
      access_level: accessLevel,
      full_name: user.full_name,
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET || 'your-secret-key', { 
      expiresIn: '50m' 
    })
    console.log('✅ Login successful! Token generated')

    res.json({
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        role_name: roleName,
        department: user.department,
        avatar_url: user.avatar_url,
        status: user.status,
      },
    })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    console.error('Stack:', err.stack)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
}

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      'SELECT user_id, full_name, email FROM users WHERE email = ? AND status = "ACTIVE"',
      [email]
    )
    conn.release()

    if (rows.length === 0) {
      // Don't reveal if email exists (security best practice)
      return res.json({ message: 'If an account exists, a password reset email has been sent' })
    }

    const user = rows[0]
    const resetToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    )

    const resetLink = `http://localhost:8888/reset-password?token=${resetToken}`

    try {
      await sendPasswordResetEmail(user.email, user.full_name, resetLink)
      console.log('✅ Password reset email sent to:', user.email)
    } catch (emailErr) {
      console.error('⚠️ Failed to send reset email:', emailErr.message)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    res.json({ message: 'If an account exists, a password reset email has been sent' })
  } catch (err) {
    console.error('❌ Password reset error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.user_id

    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      'SELECT user_id, full_name, email FROM users WHERE user_id = ?',
      [userId]
    )
    conn.release()

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = rows[0]

    // Generate a new temporary password
    const generateTempPassword = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
      return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    const tempPassword = generateTempPassword()
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    // Update user with new temporary password
    const connUpdate = await pool.getConnection()
    await connUpdate.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [passwordHash, userId]
    )
    connUpdate.release()

    // Send welcome email with new temporary password
    try {
      await sendWelcomeEmail(user.email, user.full_name, tempPassword)
      console.log('✅ Verification email resent to:', user.email)
      res.json({ message: 'Verification email has been resent successfully' })
    } catch (emailErr) {
      console.error('⚠️ Failed to send verification email:', emailErr.message)
      res.status(500).json({ error: 'Failed to send email' })
    }
  } catch (err) {
    console.error('❌ Resend verification error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
