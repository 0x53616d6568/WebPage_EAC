import pool from '../config/database.js'

export const getMyRequests = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT r.request_id, r.user_id, r.type, r.description, r.status, r.reviewed_by, r.created_at, u.full_name as reviewed_by_name
      FROM requests r
      LEFT JOIN users u ON r.reviewed_by = u.user_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.user_id])
    conn.release()

    res.json({ data: rows, message: 'Your requests retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getAllRequests = async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query

    let query = `
      SELECT r.request_id, r.user_id, r.type, r.description, r.status, r.reviewed_by, r.created_at,
             u.full_name, u.department, rev.full_name as reviewed_by_name
      FROM requests r
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN users rev ON r.reviewed_by = rev.user_id
      WHERE 1=1
    `

    const params = []

    if (status) {
      query += ` AND r.status = ?`
      params.push(status)
    }

    query += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))

    const conn = await pool.getConnection()
    const [rows] = await conn.query(query, params)

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM requests WHERE 1=1`
    const countParams = []
    if (status) { countQuery += ` AND status = ?`; countParams.push(status) }

    const [countResult] = await conn.query(countQuery, countParams)
    conn.release()

    res.json({
      data: rows,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(countResult[0].total / parseInt(limit))
      },
      message: 'All requests retrieved successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getRequestById = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT r.request_id, r.user_id, r.type, r.description, r.status, r.reviewed_by, r.created_at,
             u.full_name, u.department, u.email, rev.full_name as reviewed_by_name
      FROM requests r
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN users rev ON r.reviewed_by = rev.user_id
      WHERE r.request_id = ?
    `, [req.params.request_id])
    conn.release()

    if (!rows.length) {
      return res.status(404).json({ error: 'Request not found' })
    }

    res.json({ data: rows[0], message: 'Request retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createRequest = async (req, res) => {
  try {
    const { type, description } = req.body

    if (!type) {
      return res.status(400).json({ error: 'Request type is required' })
    }

    const conn = await pool.getConnection()
    const result = await conn.query(
      `INSERT INTO requests (user_id, type, description, status)
       VALUES (?, ?, ?, ?)`,
      [req.user.user_id, type, description || null, 'PENDING']
    )
    conn.release()

    res.status(201).json({ data: { request_id: result[0].insertId }, message: 'Request created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const reviewRequest = async (req, res) => {
  try {
    const { status } = req.body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' })
    }

    const conn = await pool.getConnection()
    await conn.query(
      `UPDATE requests SET status = ?, reviewed_by = ? WHERE request_id = ?`,
      [status, req.user.user_id, req.params.request_id]
    )
    conn.release()

    res.json({ message: `Request ${status.toLowerCase()} successfully` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
