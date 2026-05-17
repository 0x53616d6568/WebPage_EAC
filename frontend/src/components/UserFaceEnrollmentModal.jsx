import { useState } from 'react'
import { MdClose, MdCamera, MdUpload, MdCheckCircle, MdHourglassEmpty } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function UserFaceEnrollmentModal({ user, isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [faceFile, setFaceFile] = useState(null)
  const [facePreview, setFacePreview] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [progressStep, setProgressStep] = useState(0)

  // Progress steps: 0 = initial, 1 = uploaded, 2 = generating, 3 = saved, 4 = done
  const progressSteps = [
    { label: 'Face Uploaded', step: 1 },
    { label: 'Generating Embedding', step: 2 },
    { label: 'Embedding Saved', step: 3 },
    { label: 'Done', step: 4 },
  ]

  const handleFaceSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaceFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setFacePreview(event.target.result)
      }
      reader.readAsDataURL(file)
      setError('')
      setProgressStep(1) // Mark as uploaded
    }
  }

  const handleEnrollFace = async () => {
    if (!faceFile) {
      setError('Please select a face image')
      return
    }

    setEnrolling(true)
    setError('')
    setSuccess('')
    setProgressStep(2) // Generating embedding

    const formData = new FormData()
    formData.append('face_image', faceFile)

    try {
      await api.post(`/users/${user.user_id}/face-enrollment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProgressStep(3) // Embedding saved
      
      // Simulate final transition
      setTimeout(() => {
        setProgressStep(4) // Done
        setSuccess(`Face enrolled for ${user.full_name}!`)
        setTimeout(() => {
          if (onSuccess) onSuccess()
          onClose()
        }, 1000)
      }, 500)
    } catch (err) {
      setProgressStep(0) // Reset on error
      setEnrolling(false)
      setError(err.response?.data?.message || 'Error enrolling face')
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
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}
        >
          <h2 style={{ ...theme.typography.h3, color: theme.colors.textPrimary, margin: 0 }}>
            Enroll Face for {user.full_name}
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

        {/* Progress Steps */}
        {progressStep > 0 && (
          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{ marginBottom: theme.spacing.md }}>
              <p
                style={{
                  ...theme.typography.bodySmall,
                  fontWeight: 600,
                  color: theme.colors.textSecondary,
                  margin: 0,
                  marginBottom: theme.spacing.sm,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Enrollment Progress
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {progressSteps.map((item, idx) => {
                const isCompleted = progressStep > item.step
                const isActive = progressStep === item.step
                const isPending = progressStep < item.step

                return (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    {/* Circle Indicator */}
                    <div
                      style={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCompleted
                          ? theme.colors.success
                          : isActive
                          ? theme.colors.primary
                          : theme.colors.bgSecondary,
                        border: isPending ? `2px solid ${theme.colors.border}` : 'none',
                        transition: theme.transitions.normal,
                      }}
                    >
                      {isCompleted ? (
                        <MdCheckCircle size={20} style={{ color: 'white' }} />
                      ) : isActive ? (
                        <MdHourglassEmpty
                          size={18}
                          style={{
                            color: 'white',
                            animation: 'spin 2s linear infinite',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.colors.textTertiary,
                          }}
                        >
                          {item.step}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <p
                        style={{
                          ...theme.typography.body,
                          fontWeight: isActive ? 600 : 500,
                          color: isCompleted
                            ? theme.colors.success
                            : isActive
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                          margin: 0,
                          transition: theme.transitions.normal,
                        }}
                      >
                        {item.label}
                      </p>
                    </div>

                    {/* Connector Line */}
                    {idx < progressSteps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '33px',
                          marginTop: '32px',
                          width: '2px',
                          height: '24px',
                          backgroundColor: isCompleted ? theme.colors.success : theme.colors.border,
                          transition: theme.transitions.normal,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Image Preview */}
        {facePreview && (
          <div style={{ marginBottom: theme.spacing.lg }}>
            <img
              src={facePreview}
              alt="Face Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: theme.borderRadius.md,
              }}
            />
          </div>
        )}

        {/* Upload Area */}
        {!enrolling && (
          <div
            onClick={() => document.getElementById('face-upload').click()}
            style={{
              border: `2px dashed ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.xl,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
              cursor: 'pointer',
              backgroundColor: theme.colors.bgSecondary,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary
              e.currentTarget.style.backgroundColor = theme.colors.infoLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border
              e.currentTarget.style.backgroundColor = theme.colors.bgSecondary
            }}
          >
            <MdCamera size={40} style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }} />
            <p
              style={{
                ...theme.typography.body,
                color: theme.colors.textSecondary,
                margin: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Click to upload face image
            </p>
            <p
              style={{
                ...theme.typography.bodySmall,
                color: theme.colors.textTertiary,
                margin: 0,
              }}
            >
              JPG, PNG • Max 5MB
            </p>
            <input
              id="face-upload"
              type="file"
              accept="image/*"
              onChange={handleFaceSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
          }}
        >
          <button
            onClick={onClose}
            disabled={enrolling}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: theme.colors.bgSecondary,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontWeight: 600,
              cursor: enrolling ? 'not-allowed' : 'pointer',
              transition: theme.transitions.normal,
              opacity: enrolling ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!enrolling) {
                e.currentTarget.style.backgroundColor = theme.colors.bgHover
              }
            }}
            onMouseLeave={(e) => {
              if (!enrolling) {
                e.currentTarget.style.backgroundColor = theme.colors.bgSecondary
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleEnrollFace}
            disabled={!faceFile || enrolling}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: faceFile && !enrolling ? theme.colors.success : theme.colors.textTertiary,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontWeight: 600,
              cursor: faceFile && !enrolling ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.md,
              opacity: faceFile && !enrolling ? 1 : 0.6,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              if (faceFile && !enrolling) {
                e.currentTarget.style.backgroundColor = theme.colors.success
                e.currentTarget.style.opacity = 0.9
              }
            }}
            onMouseLeave={(e) => {
              if (faceFile && !enrolling) {
                e.currentTarget.style.backgroundColor = theme.colors.success
                e.currentTarget.style.opacity = 1
              }
            }}
          >
            <MdUpload size={18} />
            {enrolling ? 'Enrolling...' : 'Enroll Face'}
          </button>
        </div>

        {/* Inline Spinner Animation */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
