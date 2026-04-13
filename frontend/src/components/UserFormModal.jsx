import { useState, useEffect } from 'react'
import axios from 'axios'
import { MdClose } from 'react-icons/md'

const COLORS = {
  bg: '#0D1117',
  bgCard: '#161B22',
  border: '#21262D',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  accent: '#2D7DD2',
  accentLight: '#58A6FF',
  danger: '#C53030',
  dangerBg: '#2B0D0D',
  success: '#3D8F3D',
}

const ROLES = [
  { id: 1, name: 'Employee', label: 'Standard Employee' },
  { id: 2, name: 'Manager', label: 'Manager' },
  { id: 3, name: 'Administrator', label: 'Administrator' },
]

export default function UserFormModal({ user = null, accessToken, onClose }) {
  const isEditMode = !!user
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    role_id: 1,
    status: 'ACTIVE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        department: user.department || '',
        role_id: user.role_id || 1,
        status: user.status || 'ACTIVE',
      })
    } else {
      setFormData({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        role_id: 1,
        status: 'ACTIVE',
      })
    }
    setError('')
  }, [user, isEditMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.full_name || !formData.email || !formData.role_id) {
      setError('Name, email, and role are required')
      return
    }

    setLoading(true)
    try {
      if (!isEditMode) {
        // For new users, don't send password - backend generates & emails it
        const createData = {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role_id: formData.role_id,
        }
        await axios.post('http://localhost:8888/api/users', createData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      } else {
        const updateData = { ...formData }
        if (!updateData.password) delete updateData.password
        await axios.put(`http://localhost:8888/api/users/${user.user_id}`, updateData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      }
      onClose(true)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'sticky',
          top: 0,
          backgroundColor: COLORS.bgCard,
        }}>
          <h2 style={{ margin: 0, color: COLORS.textPrimary, fontSize: '18px', fontWeight: '600' }}>
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: COLORS.textSecondary,
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: COLORS.dangerBg,
              border: `1px solid ${COLORS.danger}`,
              color: COLORS.danger,
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Password - only shown when editing */}
          {isEditMode && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Password (leave empty to keep current)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New password (optional)"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  color: COLORS.textPrimary,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>
          )}

          {/* Info for new users */}
          {!isEditMode && (
            <div style={{
              backgroundColor: 'rgba(93, 172, 255, 0.1)',
              border: `1px solid ${COLORS.accent}`,
              color: COLORS.accentLight,
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              lineHeight: '1.5',
            }}>
              <strong>ℹ️ Password will be generated automatically</strong><br />
              A welcome email with login credentials will be sent to the user. They must change their password on first login.
            </div>
          )}

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="123-456-7890"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Department */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="IT, HR, Finance, etc."
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Role *
            </label>
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            >
              {ROLES.map(role => (
                <option key={role.id} value={role.id} style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.accent}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            >
              <option value="ACTIVE" style={{ backgroundColor: COLORS.bg }}>Active</option>
              <option value="INACTIVE" style={{ backgroundColor: COLORS.bg }}>Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: COLORS.border,
                color: COLORS.textPrimary,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              disabled={loading}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#30363D'}
              onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.border}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                backgroundColor: COLORS.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto',
              }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = COLORS.accentLight)}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = COLORS.accent)}
            >
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
