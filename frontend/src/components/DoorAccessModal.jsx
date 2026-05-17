import { useState, useEffect } from 'react'
import { MdClose, MdSave, MdSearch, MdCheckCircle } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function DoorAccessModal({ door, users, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (door?.users) {
      setSelectedUsers(door.users.map((u) => u.user_id))
    }
  }, [door])

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post(`/doors/${door.door_id}/assign-access`, {
        user_ids: selectedUsers,
      })
      setSuccess('Access updated successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating access')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          maxWidth: '600px',
          width: '90%',
          maxHeight: '85vh',
          padding: theme.spacing.xl,
          boxShadow: theme.shadows.xl,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
            paddingBottom: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ ...theme.typography.h3, color: theme.colors.textPrimary, margin: 0 }}>
            Assign Access: {door?.door_name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.textSecondary,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
          >
            <MdClose />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: theme.colors.dangerLight,
              color: theme.colors.danger,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.lg,
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <div style={{ minWidth: '4px', height: '4px', borderRadius: '50%', backgroundColor: theme.colors.danger }} />
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: theme.colors.successLight,
              color: theme.colors.success,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.lg,
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <MdCheckCircle size={16} />
            {success}
          </div>
        )}

        <div style={{ marginBottom: theme.spacing.lg }}>
          <label
            style={{
              display: 'block',
              marginBottom: theme.spacing.md,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}
          >
            Search Users ({filteredUsers.length}/{users.length})
          </label>
          <div style={{ position: 'relative' }}>
            <MdSearch
              style={{
                position: 'absolute',
                left: theme.spacing.lg,
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.colors.textSecondary,
                fontSize: '18px',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 44px`,
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: theme.transitions.normal,
                cursor: 'text',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}40`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            maxHeight: '300px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <label
                key={user.user_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  backgroundColor: selectedUsers.includes(user.user_id) ? `${theme.colors.primaryLight}20` : theme.colors.bgSecondary,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  border: selectedUsers.includes(user.user_id)
                    ? `2px solid ${theme.colors.primary}`
                    : `1px solid ${theme.colors.border}`,
                  transition: theme.transitions.normal,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.user_id)}
                  onChange={() => handleToggleUser(user.user_id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    marginRight: theme.spacing.md,
                    accentColor: theme.colors.primary,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      ...theme.typography.body,
                      fontWeight: 600,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {user.full_name}
                  </div>
                  <div
                    style={{
                      ...theme.typography.bodySmall,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {user.email}
                  </div>
                </div>
                {selectedUsers.includes(user.user_id) && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: theme.colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    ✓
                  </div>
                )}
              </label>
            ))
          ) : (
            <div
              style={{
                padding: theme.spacing.lg,
                textAlign: 'center',
                color: theme.colors.textSecondary,
                ...theme.typography.body,
              }}
            >
              No users found matching "{searchTerm}"
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: theme.colors.bgSecondary,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.bgHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.bgSecondary
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.md,
              fontSize: '14px',
              opacity: loading ? 0.7 : 1,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.opacity = '1'
            }}
          >
            <MdSave size={18} />
            {loading ? 'Saving...' : 'Assign Access'}
          </button>
        </div>
      </div>
    </div>
  )
}
