import { useState } from 'react'
import { MdClose, MdSave, MdSearch, MdCheckCircle } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function ManagerAssignmentModal({ user, managers, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [selectedManager, setSelectedManager] = useState(user?.manager_id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [attempted, setAttempted] = useState(false)

  const filteredManagers = managers.filter(manager =>
    manager.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async () => {
    setAttempted(true)
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
          maxWidth: '550px',
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
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
          >
            <MdClose />
          </button>
        </div>

        {error && attempted && (
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
            <div
              style={{
                minWidth: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: theme.colors.danger,
              }}
            />
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
          <p
            style={{
              ...theme.typography.body,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
              fontWeight: 600,
            }}
          >
            Employee
          </p>
          <div
            style={{
              backgroundColor: theme.colors.bgSecondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                ...theme.typography.body,
                color: theme.colors.textPrimary,
                fontWeight: 600,
                marginBottom: theme.spacing.sm,
              }}
            >
              {user?.full_name}
            </div>
            <div
              style={{
                ...theme.typography.bodySmall,
                color: theme.colors.textSecondary,
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>

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
            Search Managers ({filteredManagers.length + 1})
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

        <div style={{ marginBottom: theme.spacing.lg, flex: 1, minHeight: '200px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: theme.spacing.md,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}
          >
            Select a Manager
          </label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
              maxHeight: '300px',
              overflow: 'auto',
              padding: theme.spacing.md,
              backgroundColor: theme.colors.bgSecondary,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing.md,
                backgroundColor: selectedManager === '' ? `${theme.colors.primaryLight}20` : theme.colors.bg,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                border: selectedManager === '' ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
                transition: theme.transitions.normal,
              }}
            >
              <input
                type="radio"
                name="manager"
                value=""
                checked={selectedManager === ''}
                onChange={() => {
                  setSelectedManager('')
                  setAttempted(false)
                  setError('')
                }}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  marginRight: theme.spacing.md,
                  accentColor: theme.colors.primary,
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
                    marginTop: '2px',
                  }}
                >
                  Remove current manager
                </div>
              </div>
            </label>

            {filteredManagers.length > 0 ? (
              filteredManagers.map((manager) => (
                <label
                  key={manager.user_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: selectedManager === manager.user_id ? `${theme.colors.primaryLight}20` : theme.colors.bg,
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    border:
                      selectedManager === manager.user_id
                        ? `2px solid ${theme.colors.primary}`
                        : `1px solid ${theme.colors.border}`,
                    transition: theme.transitions.normal,
                  }}
                >
                  <input
                    type="radio"
                    name="manager"
                    value={manager.user_id}
                    checked={selectedManager === manager.user_id}
                    onChange={() => {
                      setSelectedManager(manager.user_id)
                      setAttempted(false)
                      setError('')
                    }}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      marginRight: theme.spacing.md,
                      accentColor: theme.colors.primary,
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
                        marginTop: '2px',
                      }}
                    >
                      {manager.email}
                    </div>
                  </div>
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
                No managers found matching "{searchTerm}"
              </div>
            )}
          </div>
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
            {loading ? 'Assigning...' : 'Assign Manager'}
          </button>
        </div>
      </div>
    </div>
  )
}
