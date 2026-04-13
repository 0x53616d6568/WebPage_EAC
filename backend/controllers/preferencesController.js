import pool from '../config/database.js'

export const getPreferences = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT preference_key, preference_value, preference_type
      FROM preferences
      ORDER BY preference_key
    `)
    conn.release()

    // Convert array to object for easier consumption
    const preferences = {}
    rows.forEach(row => {
      let value = row.preference_value
      // Parse JSON values
      if (row.preference_type === 'json') {
        try {
          value = JSON.parse(value)
        } catch (e) {
          // If parsing fails, keep as string
        }
      } else if (row.preference_type === 'boolean') {
        value = value === '1' || value === 'true'
      } else if (row.preference_type === 'number') {
        value = parseInt(value)
      }
      preferences[row.preference_key] = value
    })

    res.json({ data: preferences, message: 'Preferences retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getPreferenceByKey = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
      SELECT preference_key, preference_value, preference_type
      FROM preferences
      WHERE preference_key = ?
    `, [req.params.key])
    conn.release()

    if (!rows.length) {
      return res.status(404).json({ error: 'Preference not found' })
    }

    const pref = rows[0]
    let value = pref.preference_value
    if (pref.preference_type === 'json') {
      try {
        value = JSON.parse(value)
      } catch (e) {
        // Keep as string
      }
    } else if (pref.preference_type === 'boolean') {
      value = value === '1' || value === 'true'
    } else if (pref.preference_type === 'number') {
      value = parseInt(value)
    }

    res.json({ data: { [pref.preference_key]: value }, message: 'Preference retrieved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updatePreference = async (req, res) => {
  try {
    const { preference_value, preference_type = 'string' } = req.body

    if (preference_value === undefined) {
      return res.status(400).json({ error: 'Preference value is required' })
    }

    let value = preference_value
    if (preference_type === 'json' && typeof value === 'object') {
      value = JSON.stringify(value)
    } else if (preference_type === 'boolean') {
      value = value ? '1' : '0'
    }

    const conn = await pool.getConnection()
    await conn.query(`
      INSERT INTO preferences (preference_key, preference_value, preference_type)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      preference_value = ?, preference_type = ?
    `, [req.params.key, value, preference_type, value, preference_type])
    conn.release()

    res.json({ message: 'Preference updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateMultiplePreferences = async (req, res) => {
  try {
    const preferences = req.body

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Invalid preferences object' })
    }

    const conn = await pool.getConnection()

    for (const [key, value] of Object.entries(preferences)) {
      let prefValue = value
      let prefType = 'string'

      if (typeof value === 'boolean') {
        prefValue = value ? '1' : '0'
        prefType = 'boolean'
      } else if (typeof value === 'number') {
        prefType = 'number'
      } else if (typeof value === 'object') {
        prefValue = JSON.stringify(value)
        prefType = 'json'
      }

      await conn.query(`
        INSERT INTO preferences (preference_key, preference_value, preference_type)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        preference_value = ?, preference_type = ?
      `, [key, prefValue, prefType, prefValue, prefType])
    }

    conn.release()

    res.json({ message: 'Preferences updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deletePreference = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query('DELETE FROM preferences WHERE preference_key = ?', [req.params.key])
    conn.release()

    res.json({ message: 'Preference deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
