import { useState } from 'react'
import { MdClose, MdCamera, MdUpload } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function ProfileModal({ user, isDarkMode, onClose, onUpdate }) {
  const theme = getTheme(isDarkMode)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [faceFile, setFaceFile] = useState(null)
  const [enrollingFace, setEnrollingFace] = useState(false)
  const [facePreview, setFacePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.put(`/users/${user.user_id}`, formData)
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        if (onUpdate) onUpdate()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFaceSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaceFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setFacePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnrollFace = async () => {
    if (!faceFile) {
      setError('Please select a face image')
      return
    }

    setEnrollingFace(true)
    setError('')
    setSuccess('')

    const formDataFace = new FormData()
    formDataFace.append('face_image', faceFile)

    try {
      await api.post(`/users/${user.user_id}/face-enrollment`, formDataFace, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess('Face enrolled successfully!')
      setFaceFile(null)
      setFacePreview(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error enrolling face')
    } finally {
      setEnrollingFace(false)
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
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: theme.shadows.xl,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.spacing.xl,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ ...theme.typography.h3, color: theme.colors.textPrimary, margin: 0 }}>
            Edit Profile
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

        {/* Content */}
        <div style={{ padding: theme.spacing.xl }}>
          {error && (
            <div
              style={{
                backgroundColor: theme.colors.dangerLight,
                color: theme.colors.danger,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
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
              }}
            >
              {success}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing.sm,
                  ...theme.typography.body,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgSecondary,
                  color: theme.colors.textPrimary,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing.sm,
                  ...theme.typography.body,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgSecondary,
                  color: theme.colors.textPrimary,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.lg }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing.sm,
                  ...theme.typography.body,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgSecondary,
                  color: theme.colors.textPrimary,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: theme.spacing.lg,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {/* Face Enrollment Section */}
          <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: theme.spacing.lg }}>
            <h3 style={{ ...theme.typography.h4, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
              Face Recognition Enrollment
            </h3>

            {facePreview ? (
              <div style={{ marginBottom: theme.spacing.lg }}>
                <img
                  src={facePreview}
                  alt="Face Preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.md,
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: `2px dashed ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.xl,
                  textAlign: 'center',
                  marginBottom: theme.spacing.lg,
                  cursor: 'pointer',
                }}
              >
                <MdCamera size={32} style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }} />
                <p
                  style={{
                    ...theme.typography.body,
                    color: theme.colors.textSecondary,
                    margin: 0,
                  }}
                >
                  Click to upload face image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaceSelect}
                  style={{
                    display: 'none',
                  }}
                  id="face-input"
                />
              </div>
            )}

            <label htmlFor="face-input">
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  backgroundColor: theme.colors.infoLight,
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}`,
                  borderRadius: theme.borderRadius.md,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: theme.spacing.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.md,
                }}
                onClick={() => document.getElementById('face-input').click()}
              >
                <MdUpload size={18} />
                {faceFile ? 'Change Image' : 'Select Image'}
              </button>
            </label>

            {faceFile && (
              <button
                type="button"
                onClick={handleEnrollFace}
                disabled={enrollingFace}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  backgroundColor: theme.colors.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: enrollingFace ? 0.7 : 1,
                }}
              >
                {enrollingFace ? 'Enrolling Face...' : 'Enroll Face'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
