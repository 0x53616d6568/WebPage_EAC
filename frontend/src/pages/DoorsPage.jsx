import { useState, useEffect } from 'react'
import api from '../api/client'
import DoorFormModal from '../components/DoorFormModal'
import { MdEdit, MdDelete } from 'react-icons/md'

export default function DoorsPage() {
  const [doors, setDoors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedDoor, setSelectedDoor] = useState(null)
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    fetchDoors()
  }, [])

  const fetchDoors = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/doors')
      setDoors(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load doors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDoor = () => {
    setSelectedDoor(null)
    setShowModal(true)
  }

  const handleEditDoor = (door) => {
    setSelectedDoor(door)
    setShowModal(true)
  }

  const handleDeleteDoor = async (doorId) => {
    if (!window.confirm('Are you sure you want to delete this door?')) return
    
    try {
      await api.delete(`/doors/${doorId}`)
      setDoors(doors.filter(d => d.door_id !== doorId))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete door')
    }
  }

  const handleModalClose = (refreshNeeded = false) => {
    setShowModal(false)
    setSelectedDoor(null)
    if (refreshNeeded) {
      fetchDoors()
    }
  }

  const styles = {
    container: {
      padding: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#F0F6FC',
    },
    button: {
      backgroundColor: '#2D7DD2',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    card: {
      backgroundColor: '#161B22',
      border: '1px solid #21262D',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#0D1117',
      borderBottom: '1px solid #21262D',
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      color: '#6E7681',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #21262D',
      color: '#F0F6FC',
      fontSize: '14px',
    },
    emptyCell: {
      textAlign: 'center',
      padding: '32px 16px',
      color: '#6E7681',
    },
    actions: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      color: '#58A6FF',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'all 0.2s',
    },
    deleteBtn: {
      color: '#C53030',
    },
    errorMsg: {
      color: '#C53030',
      padding: '12px',
      backgroundColor: '#2B0D0D',
      borderRadius: '4px',
      marginBottom: '16px',
      border: '1px solid #C53030',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Doors Management</h1>
        <button 
          style={styles.button}
          onClick={handleAddDoor}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1E66BB'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2D7DD2'}
        >
          Add Door
        </button>
      </div>

      {error && <div style={styles.errorMsg}>{error}</div>}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Security Level</th>
              <th style={styles.th}>Face Auth</th>
              <th style={styles.th}>Fallback</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={styles.emptyCell}>Loading doors...</td>
              </tr>
            ) : doors.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyCell}>No doors found</td>
              </tr>
            ) : (
              doors.map((door) => (
                <tr key={door.door_id}>
                  <td style={styles.td}>{door.door_name}</td>
                  <td style={styles.td}>{door.location || '-'}</td>
                  <td style={styles.td}>{door.security_level || 1}</td>
                  <td style={styles.td}>{door.requires_face_auth ? '✓' : '-'}</td>
                  <td style={styles.td}>{door.fallback_method || 'PIN'}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleEditDoor(door)}
                        title="Edit door"
                      >
                        <MdEdit />
                      </button>
                      <button
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => handleDeleteDoor(door.door_id)}
                        title="Delete door"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <DoorFormModal
          door={selectedDoor}
          accessToken={accessToken}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

