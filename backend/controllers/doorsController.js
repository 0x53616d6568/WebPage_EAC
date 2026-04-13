import pool from '../config/database.js'

export const getAllDoors = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      'SELECT door_id, door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id FROM doors ORDER BY door_id'
    )
    conn.release()
    res.json({ data: rows, message: 'Doors retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getDoorById = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      'SELECT door_id, door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id FROM doors WHERE door_id = ?',
      [req.params.door_id]
    )
    conn.release()
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Door not found' })
    }
    
    res.json({ data: rows[0], message: 'Door retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createDoor = async (req, res) => {
  try {
    const { door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id } = req.body

    if (!door_name || !location) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const conn = await pool.getConnection()
    const result = await conn.query(
      `INSERT INTO doors (door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [door_name, location, security_level || 1, requires_face_auth || 0, fallback_method || 'PIN', pi_device_id || null]
    )
    conn.release()

    res.status(201).json({ data: { door_id: result[0].insertId }, message: 'Door created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateDoor = async (req, res) => {
  try {
    const { door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id } = req.body

    const conn = await pool.getConnection()
    await conn.query(
      `UPDATE doors SET door_name = ?, location = ?, security_level = ?, requires_face_auth = ?, fallback_method = ?, pi_device_id = ? 
       WHERE door_id = ?`,
      [door_name, location, security_level, requires_face_auth, fallback_method, pi_device_id, req.params.door_id]
    )
    conn.release()

    res.json({ message: 'Door updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteDoor = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query('DELETE FROM doors WHERE door_id = ?', [req.params.door_id])
    conn.release()

    res.json({ message: 'Door deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getAccessRules = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT dar.rule_id, dar.door_id, dar.role_id, r.role_name, dar.allowed_from, dar.allowed_until, dar.days_of_week
      FROM door_access_rules dar
      LEFT JOIN roles r ON dar.role_id = r.role_id
      WHERE dar.door_id = ?
    `, [req.params.door_id])
    conn.release()

    res.json({ data: rows, message: 'Access rules retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const setAccessRule = async (req, res) => {
  try {
    const { role_id, allowed_from, allowed_until, days_of_week } = req.body

    if (!role_id) {
      return res.status(400).json({ error: 'Role ID is required' })
    }

    const conn = await pool.getConnection()
    const result = await conn.query(
      `INSERT INTO door_access_rules (role_id, door_id, allowed_from, allowed_until, days_of_week)
       VALUES (?, ?, ?, ?, ?)`,
      [role_id, req.params.door_id, allowed_from || '00:00', allowed_until || '23:59', days_of_week || 'MON,TUE,WED,THU,FRI,SAT,SUN']
    )
    conn.release()

    res.status(201).json({ data: { rule_id: result[0].insertId }, message: 'Access rule created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteAccessRule = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query('DELETE FROM door_access_rules WHERE rule_id = ?', [req.params.rule_id])
    conn.release()

    res.json({ message: 'Access rule deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
