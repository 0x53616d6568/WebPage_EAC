import { useState, useEffect } from 'react'
import api from '../api/client'
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

const DOOR_TYPES = [
  { value: 'BIOMETRIC', label: 'Biometric (Face Recognition)' },
  { value: 'BLE', label: 'BLE Token' },
  { value: 'RFID', label: 'RFID Card' },
  { value: 'PIN', label: 'PIN Code' },
  { value: 'MANUAL', label: 'Manual (No Auth)' },
]

const FALLBACK_METHODS = [
  { value: 'PIN', label: 'PIN Code' },
  { value: 'RFID', label: 'RFID Card' },
  { value: 'NONE', label: 'None' },
]

export default function DoorFormModal({ door = null, accessToken, onClose }) {
  const isEditMode = !!door
  const [formData, setFormData] = useState({
    door_name: '',
    location: '',
    security_level: 1,
    requires_face_auth: false,
    fallback_method: 'PIN',
    pi_device_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditMode && door) {
      setFormData({
        door_name: door.door_name || '',
        location: door.location || '',
        security_level: door.security_level || 1,
        requires_face_auth: door.requires_face_auth || false,
        fallback_method: door.fallback_method || 'PIN',
        pi_device_id: door.pi_device_id || '',
      })
    } else {
      setFormData({
        door_name: '',
        location: '',
        security_level: 1,
        requires_face_auth: false,
        fallback_method: 'PIN',
        pi_device_id: '',
      })
    }
    setError('')
  }, [door, isEditMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.door_name || !formData.location || !formData.pi_device_id) {
      setError('Door name, location, and Pi Device ID are required')
      return
    }

    setLoading(true)
    try {
      if (!isEditMode) {
        await api.post('/doors', formData)
      } else {
        await api.put(`/doors/${door.door_id}`, formData)
      }
      onClose(true)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save door')
    } finally {
      setLoading(false)
    }
  }

  if (!accessToken) return null

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
            {isEditMode ? 'Edit Door' : 'Add New Door'}
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

          {/* Door Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Door Name *
            </label>
            <input
              type="text"
              value={formData.door_name}
              onChange={(e) => setFormData({ ...formData, door_name: e.target.value })}
              placeholder="Main Entrance"
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

          {/* Location */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Building A - Floor 1"
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

          {/* Security Level */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Security Level (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.security_level}
              onChange={(e) => setFormData({ ...formData, security_level: parseInt(e.target.value) })}
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
            <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '4px' }}>
              1 = Low Security, 5 = High Security
            </div>
          </div>

          {/* Requires Face Auth */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="faceAuth"
              checked={formData.requires_face_auth}
              onChange={(e) => setFormData({ ...formData, requires_face_auth: e.target.checked })}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
              }}
            />
            <label htmlFor="faceAuth" style={{
              fontSize: '14px',
              color: COLORS.textPrimary,
              cursor: 'pointer',
              margin: 0,
            }}>
              Requires Face Recognition
            </label>
          </div>

          {/* Fallback Method */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Fallback Authentication Method
            </label>
            <select
              value={formData.fallback_method}
              onChange={(e) => setFormData({ ...formData, fallback_method: e.target.value })}
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
              {FALLBACK_METHODS.map(method => (
                <option key={method.value} value={method.value} style={{ backgroundColor: COLORS.bg }}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* PI Device ID */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Raspberry Pi Device ID (Optional)
            </label>
            <input
              type="text"
              value={formData.pi_device_id}
              onChange={(e) => setFormData({ ...formData, pi_device_id: e.target.value })}
              placeholder="PI001"
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
              {loading ? 'Saving...' : 'Save Door'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
