import pool from '../config/database.js'

export const getLogs = async (req, res) => {
  try {
    const { user_id, door_id, result, date_from, date_to, limit = 100, offset = 0 } = req.query

    let query = `
      SELECT l.log_id, u.full_name as user_name, d.door_name, l.result, l.method, l.timestamp, l.device_info, l.face_auth_result, l.face_confidence
      FROM access_logs l
      LEFT JOIN users u ON l.user_id = u.user_id
      LEFT JOIN doors d ON l.door_id = d.door_id
      WHERE 1=1
    `

    const params = []

    if (user_id) {
      query += ` AND l.user_id = ?`
      params.push(user_id)
    }

    if (door_id) {
      query += ` AND l.door_id = ?`
      params.push(door_id)
    }

    if (result) {
      query += ` AND l.result = ?`
      params.push(result)
    }

    if (date_from) {
      query += ` AND DATE(l.timestamp) >= ?`
      params.push(date_from)
    }

    if (date_to) {
      query += ` AND DATE(l.timestamp) <= ?`
      params.push(date_to)
    }

    query += ` ORDER BY l.timestamp DESC LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))

    const conn = await pool.getConnection()
    const [rows] = await conn.query(query, params)
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM access_logs l WHERE 1=1`
    const countParams = []
    if (user_id) { countQuery += ` AND l.user_id = ?`; countParams.push(user_id) }
    if (door_id) { countQuery += ` AND l.door_id = ?`; countParams.push(door_id) }
    if (result) { countQuery += ` AND l.result = ?`; countParams.push(result) }
    if (date_from) { countQuery += ` AND DATE(l.timestamp) >= ?`; countParams.push(date_from) }
    if (date_to) { countQuery += ` AND DATE(l.timestamp) <= ?`; countParams.push(date_to) }

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
      message: 'Logs retrieved successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getLogStats = async (req, res) => {
  try {
    const { date_from, date_to } = req.query

    let dateFilter = ''
    const params = []

    if (date_from) {
      dateFilter += ` AND DATE(l.timestamp) >= ?`
      params.push(date_from)
    }

    if (date_to) {
      dateFilter += ` AND DATE(l.timestamp) <= ?`
      params.push(date_to)
    }

    const conn = await pool.getConnection()

    // Total accesses
    const [totalCount] = await conn.query(
      `SELECT COUNT(*) as total FROM access_logs l WHERE 1=1 ${dateFilter}`,
      params
    )

    // Granted vs Denied
    const [resultStats] = await conn.query(
      `SELECT l.result, COUNT(*) as count FROM access_logs l WHERE 1=1 ${dateFilter} GROUP BY l.result`,
      params
    )

    // Most accessed doors
    const [topDoors] = await conn.query(
      `SELECT d.door_id, d.door_name, COUNT(*) as access_count
       FROM access_logs l
       LEFT JOIN doors d ON l.door_id = d.door_id
       WHERE 1=1 ${dateFilter}
       GROUP BY d.door_id, d.door_name
       ORDER BY access_count DESC LIMIT 5`,
      params
    )

    // Most active users
    const [topUsers] = await conn.query(
      `SELECT u.user_id, u.full_name, COUNT(*) as access_count
       FROM access_logs l
       LEFT JOIN users u ON l.user_id = u.user_id
       WHERE 1=1 ${dateFilter}
       GROUP BY u.user_id, u.full_name
       ORDER BY access_count DESC LIMIT 5`,
      params
    )

    conn.release()

    res.json({
      data: {
        total_accesses: totalCount[0].total,
        result_stats: resultStats,
        top_doors: topDoors,
        top_users: topUsers
      },
      message: 'Log statistics retrieved successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
