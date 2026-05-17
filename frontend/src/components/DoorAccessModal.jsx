import { useState, useEffect } from 'react'
import { MdClose, MdSave } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function DoorAccessModal({ door, users, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Load current door access if available
    if (door?.users) {
      setSelectedUsers(door.users.map((u) => u.user_id))
    }
  }, [door])

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

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
          maxHeight: '80vh',
          padding: theme.spacing.xl,
          boxShadow: theme.shadows.xl,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
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
          >
            <MdClose />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: theme.colors.dangerLight,
              color: theme.colors.danger,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.lg,
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: theme.colors.successLight,
              color: theme.colors.success,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.lg,
              fontSize: '13px',
            }}
          >
            {success}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          {users.map((user) => (
            <label
              key={user.user_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing.md,
                backgroundColor: theme.colors.bgSecondary,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                border: selectedUsers.includes(user.user_id)
                  ? `2px solid ${theme.colors.primary}`
                  : `2px solid ${theme.colors.border}`,
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
                  }}
                >
                  ✓
                </div>
              )}
            </label>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.md,
              opacity: loading ? 0.7 : 1,
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
