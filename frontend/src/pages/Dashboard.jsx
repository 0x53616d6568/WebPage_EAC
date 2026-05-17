import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'
import { MdGridView, MdPeople, MdLocationCity, MdAssignment, MdLogout, MdRefresh, MdCheckCircle, MdHighlightOff, MdAdd, MdEdit, MdDelete, MdFace, MdAssignmentInd } from 'react-icons/md'
import UserFormModal from '../components/UserFormModal'
import DoorFormModal from '../components/DoorFormModal'
import FaceEnrollmentModal from '../components/FaceEnrollmentModal'
import RequestsManagement from '../components/RequestsManagement'

// Mobile app colors
const COLORS = {
  bg: '#0D1117',
  bgCard: '#161B22',
  bgInput: '#161B22',
  border: '#21262D',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  accent: '#2D7DD2',
  accentLight: '#58A6FF',
  success: '#3D8F3D',
  successBg: '#0D2B0D',
  warning: '#D29922',
  warningBg: '#2B1D00',
  danger: '#C53030',
  dangerBg: '#2B0D0D',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, accessToken } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [doors, setDoors] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !accessToken) {
      navigate('/login')
    }
  }, [user, accessToken, navigate])

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers()
    if (activeTab === 'doors' && doors.length === 0) fetchDoors()
    if (activeTab === 'logs' && logs.length === 0) fetchLogs()
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users')
      setUsers(response.data.data || response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers([])
    }
    setLoading(false)
  }

  const fetchDoors = async () => {
    setLoading(true)
    try {
      const response = await api.get('/doors')
      setDoors(response.data.data || response.data)
    } catch (err) {
      console.error('Error fetching doors:', err)
      setDoors([])
    }
    setLoading(false)
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await api.get('/logs')
      setLogs((response.data.data || response.data).slice(0, 100))
    } catch (err) {
      console.error('Error fetching logs:', err)
      setLogs([])
    }
    setLoading(false)
  }

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDoorModal, setShowDoorModal] = useState(false)
  const [showFaceModal, setShowFaceModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Edit states
  const [editingUser, setEditingUser] = useState(null)
  const [editingDoor, setEditingDoor] = useState(null)
  const [enrollingUser, setEnrollingUser] = useState(null)

  // Delete handlers
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8888/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setUsers(users.filter(u => u.user_id !== userId))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user: ' + (error.response?.data?.message || error.message))
    }
  }

  const deleteDoor = async (doorId) => {
    try {
      await axios.delete(`http://localhost:8888/api/doors/${doorId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setDoors(doors.filter(d => d.door_id !== doorId))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting door:', error)
      alert('Failed to delete door: ' + (error.response?.data?.message || error.message))
    }
  }

  // Modal handlers
  const handleUserModalClose = (hasChanges) => {
    setShowUserModal(false)
    setEditingUser(null)
    if (hasChanges) fetchUsers()
  }

  const handleDoorModalClose = (hasChanges) => {
    setShowDoorModal(false)
    setEditingDoor(null)
    if (hasChanges) fetchDoors()
  }

  const handleFaceModalClose = (hasChanges) => {
    setShowFaceModal(false)
    setEnrollingUser(null)
    if (hasChanges) fetchUsers()
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: MdGridView },
    { id: 'users', label: 'Users', icon: MdPeople },
    { id: 'doors', label: 'Doors', icon: MdLocationCity },
    { id: 'logs', label: 'Access Logs', icon: MdAssignment },
    { id: 'requests', label: 'Requests', icon: MdAssignmentInd },
  ]

  // Delete confirmation modal
  const DeleteConfirmModal = () => {
    if (!deleteConfirm) return null
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        <div style={{
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%'
        }}>
          <h2 style={{ color: COLORS.textPrimary, marginBottom: '12px', margin: '0 0 12px 0' }}>
            Delete {deleteConfirm.type}?
          </h2>
          <p style={{ color: COLORS.textSecondary, marginBottom: '24px', margin: '0 0 24px 0' }}>
            Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteConfirm(null)}
              style={{
                padding: '8px 16px',
                backgroundColor: COLORS.bgInput,
                color: COLORS.textPrimary,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirm.type === 'user') {
                  deleteUser(deleteConfirm.id)
                } else {
                  deleteDoor(deleteConfirm.id)
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: COLORS.danger,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: COLORS.bgCard,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.accentLight,
            marginBottom: '4px',
          }}>
            EAC
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Enterprise Access Control</div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === item.id ? COLORS.accent : 'transparent',
                  color: activeTab === item.id ? 'white' : COLORS.textSecondary,
                  fontWeight: activeTab === item.id ? '600' : '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.backgroundColor = '#30363D'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User Info */}
        <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Logged in as</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary }}>{user?.full_name}</div>
            <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>{user?.role_name}</div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: COLORS.dangerBg,
              color: '#FF7875',
              border: `1px solid ${COLORS.danger}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = COLORS.danger
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = COLORS.dangerBg
              e.target.style.color = '#FF7875'
            }}
          >
            <MdLogout size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          backgroundColor: COLORS.bgCard,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: '20px 32px',
        }}>
          <h1 style={{ margin: 0, color: COLORS.textPrimary, fontSize: '24px', fontWeight: '600' }}>
            {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                {[
                  { label: 'Total Users', value: users.length || '0', icon: MdPeople, color: COLORS.accent },
                  { label: 'Active Doors', value: doors.length || '0', icon: MdLocationCity, color: COLORS.success },
                  { label: 'Access Logs', value: logs.length || '0', icon: MdAssignment, color: COLORS.warning },
                  { label: 'Admin Access', value: user?.access_level === 5 ? 'Yes' : 'No', icon: MdGridView, color: COLORS.accentLight },
                ].map((stat, i) => {
                  const StatIcon = stat.icon
                  return (
                    <div key={i} style={{
                      backgroundColor: COLORS.bgCard,
                      padding: '24px',
                      borderRadius: '12px',
                      border: `1px solid ${COLORS.border}`,
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px', color: stat.color }}>
                        <StatIcon size={32} />
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px', fontWeight: '500' }}>{stat.label}</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ backgroundColor: COLORS.bgCard, padding: '24px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                <h2 style={{ margin: '0 0 16px 0', color: COLORS.textPrimary, fontSize: '16px', fontWeight: '600' }}>Quick Links</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'Manage Users', action: () => setActiveTab('users') },
                    { label: 'Manage Doors', action: () => setActiveTab('doors') },
                    { label: 'View Logs', action: () => setActiveTab('logs') },
                    { label: 'Review Requests', action: () => setActiveTab('requests') },
                  ].map((link, i) => (
                    <button
                      key={i}
                      onClick={link.action}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#30363D',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        color: COLORS.textSecondary,
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = COLORS.accent
                        e.target.style.color = 'white'
                        e.target.style.borderColor = COLORS.accent
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#30363D'
                        e.target.style.color = COLORS.textSecondary
                        e.target.style.borderColor = COLORS.border
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UsersSection users={users} loading={loading} accessToken={accessToken} onRefresh={fetchUsers} />
          )}

          {activeTab === 'doors' && (
            <DoorsSection doors={doors} loading={loading} accessToken={accessToken} onRefresh={fetchDoors} />
          )}

          {activeTab === 'logs' && (
            <LogsSection logs={logs} loading={loading} accessToken={accessToken} />
          )}

          {activeTab === 'requests' && (
            <RequestsManagement accessToken={accessToken} />
          )}
        </div>
      </div>
    </div>
  )
}

function UsersSection({ users, loading, accessToken, onRefresh }) {
  const [showUserModal, setShowUserModal] = useState(false)
  const [showFaceModal, setShowFaceModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [enrollingUser, setEnrollingUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8888/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      onRefresh()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: COLORS.textPrimary }}>Users Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onRefresh}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.bgInput,
              color: COLORS.textSecondary,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = COLORS.bgCard
              e.target.style.color = COLORS.textPrimary
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = COLORS.bgInput
              e.target.style.color = COLORS.textSecondary
            }}
          >
            <MdRefresh size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingUser(null)
              setShowUserModal(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.accentLight}
            onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.accent}
          >
            <MdAdd size={16} />
            Add User
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: COLORS.bgCard,
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
          }}>
            <thead>
              <tr style={{ backgroundColor: '#30363D', borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Department</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Role</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px' }}>{u.full_name}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textSecondary, fontSize: '14px' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textSecondary, fontSize: '14px' }}>{u.department || '-'}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#1A3A5C', color: COLORS.accentLight, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                      {u.role_name}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px' }}>
                    <span style={{
                      backgroundColor: u.status === 'ACTIVE' ? COLORS.successBg : COLORS.dangerBg,
                      color: u.status === 'ACTIVE' ? COLORS.success : COLORS.danger,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setEditingUser(u)
                        setShowUserModal(true)
                      }}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'transparent',
                        color: COLORS.accent,
                        border: `1px solid ${COLORS.accent}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px',
                      }}
                      title="Edit user"
                    >
                      <MdEdit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setEnrollingUser(u)
                        setShowFaceModal(true)
                      }}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'transparent',
                        color: COLORS.warning,
                        border: `1px solid ${COLORS.warning}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px',
                      }}
                      title="Enroll face"
                    >
                      <MdFace size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: u.user_id, name: u.full_name, type: 'user' })}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'transparent',
                        color: COLORS.danger,
                        border: `1px solid ${COLORS.danger}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Delete user"
                    >
                      <MdDelete size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUserModal && (
        <UserFormModal
          user={editingUser}
          accessToken={accessToken}
          onClose={() => {
            setShowUserModal(false)
            setEditingUser(null)
            onRefresh()
          }}
        />
      )}

      {showFaceModal && (
        <FaceEnrollmentModal
          user={enrollingUser}
          accessToken={accessToken}
          onClose={() => {
            setShowFaceModal(false)
            setEnrollingUser(null)
            onRefresh()
          }}
        />
      )}

      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ color: COLORS.textPrimary, margin: '0 0 12px 0' }}>Delete User?</h2>
            <p style={{ color: COLORS.textSecondary, margin: '0 0 24px 0' }}>
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.bgInput,
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.danger,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DoorsSection({ doors, loading, accessToken, onRefresh }) {
  const [showDoorModal, setShowDoorModal] = useState(false)
  const [editingDoor, setEditingDoor] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const deleteDoor = async (doorId) => {
    try {
      await axios.delete(`http://localhost:8888/api/doors/${doorId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      onRefresh()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting door:', error)
      alert('Failed to delete door')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: COLORS.textPrimary }}>Doors Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onRefresh}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.bgInput,
              color: COLORS.textSecondary,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = COLORS.bgCard
              e.target.style.color = COLORS.textPrimary
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = COLORS.bgInput
              e.target.style.color = COLORS.textSecondary
            }}
          >
            <MdRefresh size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingDoor(null)
              setShowDoorModal(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.accentLight}
            onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.accent}
          >
            <MdAdd size={16} />
            Add Door
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {doors.map((d, i) => (
            <div key={i} style={{
              backgroundColor: COLORS.bgCard,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: COLORS.textPrimary, fontSize: '16px', fontWeight: '600' }}>{d.door_name}</h3>
              <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '12px' }}>📍 {d.location}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  backgroundColor: '#1A3A5C',
                  color: COLORS.accentLight,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                  Level {d.security_level}
                </span>
                {d.requires_face_auth && (
                  <span style={{
                    backgroundColor: COLORS.warningBg,
                    color: COLORS.warning,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    Face Auth
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '16px' }}>Method: {d.fallback_method}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setEditingDoor(d)
                    setShowDoorModal(true)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: COLORS.accent,
                    border: `1px solid ${COLORS.accent}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  <MdEdit size={14} style={{ marginRight: '4px' }} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({ id: d.door_id, name: d.door_name, type: 'door' })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: COLORS.danger,
                    border: `1px solid ${COLORS.danger}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  <MdDelete size={14} style={{ marginRight: '4px' }} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDoorModal && (
        <DoorFormModal
          door={editingDoor}
          accessToken={accessToken}
          onClose={() => {
            setShowDoorModal(false)
            setEditingDoor(null)
            onRefresh()
          }}
        />
      )}

      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ color: COLORS.textPrimary, margin: '0 0 12px 0' }}>Delete Door?</h2>
            <p style={{ color: COLORS.textSecondary, margin: '0 0 24px 0' }}>
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.bgInput,
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteDoor(deleteConfirm.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: COLORS.danger,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LogsSection({ logs, loading, accessToken }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: COLORS.textPrimary }}>Access Logs</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: COLORS.bgCard,
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
          }}>
            <thead>
              <tr style={{ backgroundColor: '#30363D', borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>User</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Door</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Result</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Method</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px' }}>{log.user_name || 'Unknown'}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textSecondary, fontSize: '14px' }}>{log.door_name || 'Unknown'}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textPrimary, fontSize: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: log.result === 'GRANTED' ? COLORS.successBg : COLORS.dangerBg,
                      color: log.result === 'GRANTED' ? COLORS.success : COLORS.danger,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {log.result === 'GRANTED' ? <MdCheckCircle size={14} /> : <MdHighlightOff size={14} />}
                      {log.result}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: COLORS.textSecondary, fontSize: '14px' }}>{log.method || 'Unknown'}</td>
                  <td style={{ padding: '12px 16px', color: COLORS.textMuted, fontSize: '12px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

