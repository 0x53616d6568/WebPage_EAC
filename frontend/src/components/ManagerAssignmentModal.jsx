import { useState, useEffect } from 'react'
import { MdClose, MdSave } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function ManagerAssignmentModal({ user, managers, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [selectedManager, setSelectedManager] = useState(user?.manager_id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!selectedManager) {
      setError('Please select a manager')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.put(`/users/${user.user_id}/manager`, {
        manager_id: selectedManager,
      })
      setSuccess('Manager assigned successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning manager')
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
          maxWidth: '500px',
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
            Assign Manager
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

        <div style={{ marginBottom: theme.spacing.lg }}>
          <p style={{
            ...theme.typography.body,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.md,
            fontWeight: 600,
          }}>
            Employee: {user?.full_name}
          </p>
          <p style={{
            ...theme.typography.bodySmall,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}>
            Email: {user?.email}
          </p>
        </div>

        <div style={{ marginBottom: theme.spacing.lg }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.md,
            ...theme.typography.body,
            fontWeight: 600,
            color: theme.colors.textPrimary,
          }}>
            Select Manager
          </label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
              maxHeight: '300px',
              overflow: 'auto',
              padding: theme.spacing.md,
              backgroundColor: theme.colors.bgSecondary,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              backgroundColor: theme.colors.bg,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              border: !selectedManager
                ? `2px solid ${theme.colors.primary}`
                : `2px solid ${theme.colors.border}`,
              transition: theme.transitions.normal,
            }}>
              <input
                type="radio"
                name="manager"
                value=""
                checked={!selectedManager}
                onChange={() => setSelectedManager('')}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  marginRight: theme.spacing.md,
                }}
              />
              <div>
                <div
                  style={{
                    ...theme.typography.body,
                    fontWeight: 600,
                    color: theme.colors.textPrimary,
                  }}
                >
                  No Manager
                </div>
                <div
                  style={{
                    ...theme.typography.bodySmall,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Remove current manager
                </div>
              </div>
            </label>

            {managers.map((manager) => (
              <label
                key={manager.user_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.bg,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  border: selectedManager === manager.user_id
                    ? `2px solid ${theme.colors.primary}`
                    : `2px solid ${theme.colors.border}`,
                  transition: theme.transitions.normal,
                }}
              >
                <input
                  type="radio"
                  name="manager"
                  value={manager.user_id}
                  checked={selectedManager === manager.user_id}
                  onChange={() => setSelectedManager(manager.user_id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    marginRight: theme.spacing.md,
                  }}
                />
                <div>
                  <div
                    style={{
                      ...theme.typography.body,
                      fontWeight: 600,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {manager.full_name}
                  </div>
                  <div
                    style={{
                      ...theme.typography.bodySmall,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {manager.email}
                  </div>
                </div>
              </label>
            ))}
          </div>
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
            {loading ? 'Assigning...' : 'Assign Manager'}
          </button>
        </div>
      </div>
    </div>
  )
}
