import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'
import { MdGridView, MdPeople, MdLocationCity, MdAssignment, MdRefresh, MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { THEME } from '../theme/design-system'
import ModernSidebar from '../components/ModernSidebar'
import UserFormModal from '../components/UserFormModal'
import DoorFormModal from '../components/DoorFormModal'
import RequestsManagement from '../components/RequestsManagement'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, accessToken } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [doors, setDoors] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [doorModalOpen, setDoorModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editingDoor, setEditingDoor] = useState(null)

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
    try {
      const response = await api.get('/users')
      setUsers(response.data.data || response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const fetchDoors = async () => {
    try {
      const response = await api.get('/doors')
      setDoors(response.data.data || response.data)
    } catch (err) {
      console.error('Error fetching doors:', err)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs')
      setLogs(response.data.data || response.data)
    } catch (err) {
      console.error('Error fetching logs:', err)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('Delete this user?')) {
      try {
        await api.delete(`/users/${userId}`)
        fetchUsers()
      } catch (err) {
        alert('Error deleting user')
      }
    }
  }

  const handleDeleteDoor = async (doorId) => {
    if (confirm('Delete this door?')) {
      try {
        await api.delete(`/doors/${doorId}`)
        fetchDoors()
      } catch (err) {
        alert('Error deleting door')
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: THEME.colors.bg,
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .stat-card {
          animation: fadeIn 0.6s ease-out;
        }
        
        .table-row {
          transition: background-color 0.2s ease;
        }
        
        .table-row:hover {
          background-color: ${THEME.colors.bgSecondary};
        }
        
        .action-btn {
          padding: 6px 12px;
          border-radius: ${THEME.borderRadius.md};
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: ${THEME.transitions.normal};
        }
        
        .action-btn-edit {
          background-color: ${THEME.colors.infoLight};
          color: ${THEME.colors.primary};
        }
        
        .action-btn-edit:hover {
          background-color: ${THEME.colors.primary};
          color: white;
        }
        
        .action-btn-delete {
          background-color: ${THEME.colors.dangerLight};
          color: ${THEME.colors.danger};
        }
        
        .action-btn-delete:hover {
          background-color: ${THEME.colors.danger};
          color: white;
        }
      `}</style>

      {/* Sidebar */}
      <ModernSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: THEME.colors.bgCard,
          borderBottom: `1px solid ${THEME.colors.border}`,
          padding: `${THEME.spacing.lg} ${THEME.spacing.xxl}`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{
                ...THEME.typography.h2,
                color: THEME.colors.textPrimary,
                margin: 0,
                marginBottom: THEME.spacing.sm,
              }}>
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'users' ? 'Users Management' :
                 activeTab === 'doors' ? 'Doors Management' :
                 'Access Logs'}
              </h1>
              <p style={{
                ...THEME.typography.body,
                color: THEME.colors.textSecondary,
                margin: 0,
              }}>
                Welcome back, {user?.full_name}
              </p>
            </div>
            {activeTab !== 'overview' && activeTab !== 'logs' && (
              <button style={{
                ...THEME.typography.body,
                backgroundColor: THEME.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: THEME.borderRadius.md,
                padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: THEME.spacing.md,
                transition: THEME.transitions.normal,
              }}
              onClick={() => activeTab === 'users' ? setUserModalOpen(true) : setDoorModalOpen(true)}
              onMouseEnter={(e) => e.target.style.backgroundColor = THEME.colors.primaryDark}
              onMouseLeave={(e) => e.target.style.backgroundColor = THEME.colors.primary}
              >
                <MdAdd size={20} />
                Add {activeTab === 'users' ? 'User' : 'Door'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: THEME.spacing.xxl,
        }}>
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: THEME.spacing.lg,
                marginBottom: THEME.spacing.xxl,
              }}>
                {[
                  { label: 'Total Users', value: users.length, icon: MdPeople, color: THEME.colors.primary },
                  { label: 'Active Doors', value: doors.length, icon: MdLocationCity, color: THEME.colors.success },
                  { label: 'Access Logs', value: logs.length, icon: MdAssignment, color: THEME.colors.warning },
                ].map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div key={idx} className="stat-card" style={{
                      backgroundColor: THEME.colors.bgCard,
                      border: `1px solid ${THEME.colors.border}`,
                      borderRadius: THEME.borderRadius.lg,
                      padding: THEME.spacing.xl,
                      boxShadow: THEME.shadows.sm,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}>
                        <div>
                          <p style={{
                            ...THEME.typography.bodySmall,
                            color: THEME.colors.textSecondary,
                            margin: 0,
                            marginBottom: THEME.spacing.md,
                          }}>
                            {stat.label}
                          </p>
                          <h3 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: stat.color,
                            margin: 0,
                          }}>
                            {stat.value}
                          </h3>
                        </div>
                        <div style={{
                          fontSize: '32px',
                          color: stat.color,
                          opacity: 0.3,
                        }}>
                          <Icon size={40} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quick Links */}
              <div style={{
                backgroundColor: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius.lg,
                padding: THEME.spacing.xl,
                boxShadow: THEME.shadows.sm,
              }}>
                <h2 style={{
                  ...THEME.typography.h4,
                  color: THEME.colors.textPrimary,
                  margin: 0,
                  marginBottom: THEME.spacing.lg,
                }}>
                  Quick Actions
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: THEME.spacing.lg,
                }}>
                  {[
                    { label: 'Manage Users', action: () => setActiveTab('users') },
                    { label: 'Manage Doors', action: () => setActiveTab('doors') },
                    { label: 'View Logs', action: () => setActiveTab('logs') },
                  ].map((link, i) => (
                    <button
                      key={i}
                      onClick={link.action}
                      style={{
                        padding: THEME.spacing.lg,
                        backgroundColor: THEME.colors.bgSecondary,
                        border: `1px solid ${THEME.colors.border}`,
                        borderRadius: THEME.borderRadius.md,
                        color: THEME.colors.textPrimary,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: THEME.transitions.normal,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = THEME.colors.primary
                        e.target.style.color = 'white'
                        e.target.style.borderColor = THEME.colors.primary
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = THEME.colors.bgSecondary
                        e.target.style.color = THEME.colors.textPrimary
                        e.target.style.borderColor = THEME.colors.border
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
            <div>
              <div style={{
                backgroundColor: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: THEME.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: THEME.colors.bgSecondary,
                      borderBottom: `1px solid ${THEME.colors.border}`,
                    }}>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Name</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Email</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Role</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'center',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${THEME.colors.border}`,
                      }}>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textPrimary,
                          ...THEME.typography.body,
                        }}>
                          {u.full_name}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textSecondary,
                          ...THEME.typography.body,
                        }}>
                          {u.email}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textPrimary,
                          ...THEME.typography.body,
                        }}>
                          {u.role || 'User'}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          textAlign: 'center',
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: THEME.spacing.md,
                            justifyContent: 'center',
                          }}>
                            <button className="action-btn action-btn-delete" onClick={() => handleDeleteUser(u.user_id)}>
                              <MdDelete size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div style={{
                    padding: THEME.spacing.xxl,
                    textAlign: 'center',
                    color: THEME.colors.textTertiary,
                  }}>
                    No users found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'doors' && (
            <div>
              <div style={{
                backgroundColor: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: THEME.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: THEME.colors.bgSecondary,
                      borderBottom: `1px solid ${THEME.colors.border}`,
                    }}>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Name</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Location</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Status</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'center',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doors.map((d, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${THEME.colors.border}`,
                      }}>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textPrimary,
                          ...THEME.typography.body,
                        }}>
                          {d.door_name}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textSecondary,
                          ...THEME.typography.body,
                        }}>
                          {d.location}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textPrimary,
                          ...THEME.typography.body,
                        }}>
                          <span style={{
                            backgroundColor: THEME.colors.successLight,
                            color: THEME.colors.success,
                            padding: `${THEME.spacing.xs} ${THEME.spacing.md}`,
                            borderRadius: THEME.borderRadius.full,
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {d.status || 'Active'}
                          </span>
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          textAlign: 'center',
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: THEME.spacing.md,
                            justifyContent: 'center',
                          }}>
                            <button className="action-btn action-btn-delete" onClick={() => handleDeleteDoor(d.door_id)}>
                              <MdDelete size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {doors.length === 0 && (
                  <div style={{
                    padding: THEME.spacing.xxl,
                    textAlign: 'center',
                    color: THEME.colors.textTertiary,
                  }}>
                    No doors found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <div style={{
                backgroundColor: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: THEME.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: THEME.colors.bgSecondary,
                      borderBottom: `1px solid ${THEME.colors.border}`,
                    }}>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>User</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Door</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Result</th>
                      <th style={{
                        padding: THEME.spacing.lg,
                        textAlign: 'left',
                        ...THEME.typography.caption,
                        color: THEME.colors.textSecondary,
                        fontWeight: 600,
                      }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${THEME.colors.border}`,
                      }}>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textPrimary,
                          ...THEME.typography.body,
                        }}>
                          {log.user_id}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textSecondary,
                          ...THEME.typography.body,
                        }}>
                          {log.door_id}
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          ...THEME.typography.body,
                        }}>
                          <span style={{
                            backgroundColor: log.result === 'GRANTED' ? THEME.colors.successLight : THEME.colors.dangerLight,
                            color: log.result === 'GRANTED' ? THEME.colors.success : THEME.colors.danger,
                            padding: `${THEME.spacing.xs} ${THEME.spacing.md}`,
                            borderRadius: THEME.borderRadius.full,
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {log.result}
                          </span>
                        </td>
                        <td style={{
                          padding: THEME.spacing.lg,
                          color: THEME.colors.textTertiary,
                          ...THEME.typography.body,
                        }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && (
                  <div style={{
                    padding: THEME.spacing.xxl,
                    textAlign: 'center',
                    color: THEME.colors.textTertiary,
                  }}>
                    No logs found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <RequestsManagement accessToken={accessToken} onClose={() => setActiveTab('overview')} />
          )}
        </div>
      </div>

      {userModalOpen && (
        <UserFormModal
          onClose={(updated) => {
            setUserModalOpen(false)
            setEditingUser(null)
            if (updated) fetchUsers()
          }}
          onSave={fetchUsers}
        />
      )}

      {doorModalOpen && (
        <DoorFormModal
          onClose={(updated) => {
            setDoorModalOpen(false)
            setEditingDoor(null)
            if (updated) fetchDoors()
          }}
          onSave={fetchDoors}
        />
      )}
    </div>
  )
}
