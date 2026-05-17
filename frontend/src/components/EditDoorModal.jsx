import { useState } from 'react'
import { MdClose, MdSave } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function EditDoorModal({ door, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [formData, setFormData] = useState({
    door_name: door?.door_name || '',
    location: door?.location || '',
    security_level: door?.security_level || 1,
    fallback_method: door?.fallback_method || 'PIN',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.put(`/doors/${door.door_id}`, formData)
      setSuccess('Door settings updated successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating door')
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
          padding: theme.spacing.xl,
          boxShadow: theme.shadows.xl,
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
            Edit Door: {door?.door_name}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.sm,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}>
              Door Name
            </label>
            <input
              type="text"
              name="door_name"
              value={formData.door_name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.bgSecondary,
                color: theme.colors.textPrimary,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.sm,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.bgSecondary,
                color: theme.colors.textPrimary,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.sm,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}>
              Security Level
            </label>
            <select
              name="security_level"
              value={formData.security_level}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.bgSecondary,
                color: theme.colors.textPrimary,
                boxSizing: 'border-box',
              }}
            >
              <option value="1">Level 1 - Basic</option>
              <option value="2">Level 2 - Standard</option>
              <option value="3">Level 3 - High</option>
              <option value="4">Level 4 - Very High</option>
              <option value="5">Level 5 - Maximum</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.sm,
              ...theme.typography.body,
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}>
              Fallback Method
            </label>
            <select
              name="fallback_method"
              value={formData.fallback_method}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.bgSecondary,
                color: theme.colors.textPrimary,
                boxSizing: 'border-box',
              }}
            >
              <option value="PIN">PIN Code</option>
              <option value="RFID">RFID Card</option>
              <option value="MANUAL">Manual Override</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
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
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
