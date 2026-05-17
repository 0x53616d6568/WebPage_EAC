import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import api from '../api/client'
import { MdGridView, MdPeople, MdLocationCity, MdAssignment, MdRefresh, MdAdd, MdEdit, MdDelete, MdFace, MdLock, MdCheckCircle } from 'react-icons/md'
import { getTheme } from '../theme/design-system'
import ModernSidebar from '../components/ModernSidebar'
import UserFormModal from '../components/UserFormModal'
import DoorFormModal from '../components/DoorFormModal'
import RequestsManagement from '../components/RequestsManagement'
import ProfileModal from '../components/ProfileModal'
import UserFaceEnrollmentModal from '../components/UserFaceEnrollmentModal'
import EditUserModal from '../components/EditUserModal'
import DoorAccessModal from '../components/DoorAccessModal'
import EditDoorModal from '../components/EditDoorModal'
import RequestManagementModal from '../components/RequestManagementModal'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, accessToken } = useAuthStore()
  const { isDarkMode } = useThemeStore()
  const theme = getTheme(isDarkMode)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [doors, setDoors] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [doorModalOpen, setDoorModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [faceEnrollmentModalOpen, setFaceEnrollmentModalOpen] = useState(false)
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [doorAccessModalOpen, setDoorAccessModalOpen] = useState(false)
  const [editDoorModalOpen, setEditDoorModalOpen] = useState(false)
  const [requestManagementModalOpen, setRequestManagementModalOpen] = useState(false)
  const [selectedUserForFace, setSelectedUserForFace] = useState(null)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null)
  const [selectedDoorForAccess, setSelectedDoorForAccess] = useState(null)
  const [selectedDoorForEdit, setSelectedDoorForEdit] = useState(null)
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
      backgroundColor: theme.colors.bg,
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
          background-color: ${theme.colors.bgSecondary};
        }
        
        .action-btn {
          padding: 6px 12px;
          border-radius: ${theme.borderRadius.md};
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: ${theme.transitions.normal};
        }
        
        .action-btn-edit {
          background-color: ${theme.colors.infoLight};
          color: ${theme.colors.primary};
        }
        
        .action-btn-edit:hover {
          background-color: ${theme.colors.primary};
          color: white;
        }
        
        .action-btn-delete {
          background-color: ${theme.colors.dangerLight};
          color: ${theme.colors.danger};
        }
        
        .action-btn-delete:hover {
          background-color: ${theme.colors.danger};
          color: white;
        }
      `}</style>

      {/* Sidebar */}
      <ModernSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: theme.colors.bgCard,
          borderBottom: `1px solid ${theme.colors.border}`,
          padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{
                ...theme.typography.h2,
                color: theme.colors.textPrimary,
                margin: 0,
                marginBottom: theme.spacing.sm,
              }}>
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'users' ? 'Users Management' :
                 activeTab === 'doors' ? 'Doors Management' :
                 activeTab === 'requests' ? 'Access Requests' :
                 'Access Logs'}
              </h1>
              <p style={{
                ...theme.typography.body,
                color: theme.colors.textSecondary,
                margin: 0,
              }}>
                Welcome back, {user?.full_name}
              </p>
            </div>
            {activeTab !== 'overview' && activeTab !== 'logs' && activeTab !== 'requests' && (
              <button style={{
                ...theme.typography.body,
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                transition: theme.transitions.normal,
              }}
              onClick={() => activeTab === 'users' ? setUserModalOpen(true) : setDoorModalOpen(true)}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.primaryDark}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.primary}
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
          padding: theme.spacing.xxl,
          backgroundColor: theme.colors.bg,
        }}>
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: theme.spacing.lg,
                marginBottom: theme.spacing.xxl,
              }}>
                {[
                  { label: 'Total Users', value: users.length, icon: MdPeople, color: theme.colors.primary },
                  { label: 'Active Doors', value: doors.length, icon: MdLocationCity, color: theme.colors.success },
                  { label: 'Access Logs', value: logs.length, icon: MdAssignment, color: theme.colors.warning },
                  { label: 'Pending Requests', value: 0, icon: MdCheckCircle, color: theme.colors.info, action: () => setRequestManagementModalOpen(true) },
                ].map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div key={idx} className="stat-card" onClick={stat.action} style={{
                      backgroundColor: theme.colors.bgCard,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing.xl,
                      boxShadow: theme.shadows.sm,
                      cursor: stat.action ? 'pointer' : 'default',
                      transition: theme.transitions.normal,
                    }}
                    onMouseEnter={(e) => {
                      if (stat.action) e.currentTarget.style.borderColor = stat.color
                    }}
                    onMouseLeave={(e) => {
                      if (stat.action) e.currentTarget.style.borderColor = theme.colors.border
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}>
                        <div>
                          <p style={{
                            ...theme.typography.bodySmall,
                            color: theme.colors.textSecondary,
                            margin: 0,
                            marginBottom: theme.spacing.md,
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
                backgroundColor: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                boxShadow: theme.shadows.sm,
              }}>
                <h2 style={{
                  ...theme.typography.h4,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  marginBottom: theme.spacing.lg,
                }}>
                  Quick Actions
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: theme.spacing.lg,
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
                        padding: theme.spacing.lg,
                        backgroundColor: theme.colors.bgSecondary,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        color: theme.colors.textPrimary,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: theme.transitions.normal,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.colors.primary
                        e.target.style.color = 'white'
                        e.target.style.borderColor = theme.colors.primary
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = theme.colors.bgSecondary
                        e.target.style.color = theme.colors.textPrimary
                        e.target.style.borderColor = theme.colors.border
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
                backgroundColor: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: theme.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: theme.colors.bgSecondary,
                      borderBottom: `1px solid ${theme.colors.border}`,
                    }}>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Name</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Email</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Role</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'center',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${theme.colors.border}`,
                      }}>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textPrimary,
                          ...theme.typography.body,
                        }}>
                          {u.full_name}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textSecondary,
                          ...theme.typography.body,
                        }}>
                          {u.email}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textPrimary,
                          ...theme.typography.body,
                        }}>
                          {u.role || 'User'}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          textAlign: 'center',
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: theme.spacing.md,
                            justifyContent: 'center',
                          }}>
                            <button 
                              className="action-btn" 
                              style={{
                                backgroundColor: theme.colors.infoLight,
                                color: theme.colors.primary,
                              }}
                              onClick={() => {
                                setSelectedUserForEdit(u)
                                setEditUserModalOpen(true)
                              }}
                              title="Edit User"
                            >
                              <MdEdit size={14} />
                            </button>
                            <button 
                              className="action-btn" 
                              style={{
                                backgroundColor: theme.colors.infoLight,
                                color: theme.colors.primary,
                              }}
                              onClick={() => {
                                setSelectedUserForFace(u)
                                setFaceEnrollmentModalOpen(true)
                              }}
                              title="Enroll Face"
                            >
                              <MdFace size={14} />
                            </button>
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
                    padding: theme.spacing.xxl,
                    textAlign: 'center',
                    color: theme.colors.textTertiary,
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
                backgroundColor: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: theme.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: theme.colors.bgSecondary,
                      borderBottom: `1px solid ${theme.colors.border}`,
                    }}>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Name</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Location</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Status</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'center',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doors.map((d, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${theme.colors.border}`,
                      }}>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textPrimary,
                          ...theme.typography.body,
                        }}>
                          {d.door_name}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textSecondary,
                          ...theme.typography.body,
                        }}>
                          {d.location}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textPrimary,
                          ...theme.typography.body,
                        }}>
                          <span style={{
                            backgroundColor: theme.colors.successLight,
                            color: theme.colors.success,
                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                            borderRadius: theme.borderRadius.full,
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {d.status || 'Active'}
                          </span>
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          textAlign: 'center',
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: theme.spacing.md,
                            justifyContent: 'center',
                          }}>
                            <button 
                              className="action-btn" 
                              style={{
                                backgroundColor: theme.colors.infoLight,
                                color: theme.colors.primary,
                              }}
                              onClick={() => {
                                setSelectedDoorForEdit(d)
                                setEditDoorModalOpen(true)
                              }}
                              title="Edit Door"
                            >
                              <MdEdit size={14} />
                            </button>
                            <button 
                              className="action-btn" 
                              style={{
                                backgroundColor: theme.colors.infoLight,
                                color: theme.colors.primary,
                              }}
                              onClick={() => {
                                setSelectedDoorForAccess(d)
                                setDoorAccessModalOpen(true)
                              }}
                              title="Assign Access"
                            >
                              <MdLock size={14} />
                            </button>
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
                    padding: theme.spacing.xxl,
                    textAlign: 'center',
                    color: theme.colors.textTertiary,
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
                backgroundColor: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
                boxShadow: theme.shadows.sm,
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: theme.colors.bgSecondary,
                      borderBottom: `1px solid ${theme.colors.border}`,
                    }}>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>User</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Door</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Result</th>
                      <th style={{
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontWeight: 600,
                      }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="table-row" style={{
                        borderBottom: `1px solid ${theme.colors.border}`,
                      }}>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textPrimary,
                          ...theme.typography.body,
                        }}>
                          {log.user_id}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textSecondary,
                          ...theme.typography.body,
                        }}>
                          {log.door_id}
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          ...theme.typography.body,
                        }}>
                          <span style={{
                            backgroundColor: log.result === 'GRANTED' ? theme.colors.successLight : theme.colors.dangerLight,
                            color: log.result === 'GRANTED' ? theme.colors.success : theme.colors.danger,
                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                            borderRadius: theme.borderRadius.full,
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {log.result}
                          </span>
                        </td>
                        <td style={{
                          padding: theme.spacing.lg,
                          color: theme.colors.textTertiary,
                          ...theme.typography.body,
                        }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && (
                  <div style={{
                    padding: theme.spacing.xxl,
                    textAlign: 'center',
                    color: theme.colors.textTertiary,
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

      {profileModalOpen && user && (
        <ProfileModal
          user={user}
          isDarkMode={isDarkMode}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={() => {
            setProfileModalOpen(false)
            window.location.reload()
          }}
        />
      )}

      {faceEnrollmentModalOpen && selectedUserForFace && (
        <UserFaceEnrollmentModal
          user={selectedUserForFace}
          isDarkMode={isDarkMode}
          onClose={() => {
            setFaceEnrollmentModalOpen(false)
            setSelectedUserForFace(null)
          }}
          onSuccess={() => {
            fetchUsers()
          }}
        />
      )}

      {editUserModalOpen && selectedUserForEdit && (
        <EditUserModal
          user={selectedUserForEdit}
          isDarkMode={isDarkMode}
          onClose={() => {
            setEditUserModalOpen(false)
            setSelectedUserForEdit(null)
          }}
          onSuccess={() => {
            fetchUsers()
          }}
        />
      )}

      {doorAccessModalOpen && selectedDoorForAccess && (
        <DoorAccessModal
          door={selectedDoorForAccess}
          users={users}
          isDarkMode={isDarkMode}
          onClose={() => {
            setDoorAccessModalOpen(false)
            setSelectedDoorForAccess(null)
          }}
          onSuccess={() => {
            fetchDoors()
          }}
        />
      )}

      {editDoorModalOpen && selectedDoorForEdit && (
        <EditDoorModal
          door={selectedDoorForEdit}
          isDarkMode={isDarkMode}
          onClose={() => {
            setEditDoorModalOpen(false)
            setSelectedDoorForEdit(null)
          }}
          onSuccess={() => {
            fetchDoors()
          }}
        />
      )}

      {requestManagementModalOpen && (
        <RequestManagementModal
          isDarkMode={isDarkMode}
          onClose={() => setRequestManagementModalOpen(false)}
          onSuccess={() => {
            // Optionally refresh data
          }}
        />
      )}
    </div>
  )
}
