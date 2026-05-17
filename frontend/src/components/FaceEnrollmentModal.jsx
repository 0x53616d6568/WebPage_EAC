import { useState } from 'react'
import api from '../api/client'
import { MdClose, MdCheckCircle, MdError, MdImage } from 'react-icons/md'

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
  successBg: '#0D2B0D',
  warning: '#D29922',
  warningBg: '#2B1D00',
}

export default function FaceEnrollmentModal({ user = null, accessToken, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  if (!user) return null

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload a JPEG or PNG image')
        return
      }

      if (file.size > maxSize) {
        setError('Image must be less than 5MB')
        return
      }

      setSelectedFile(file)
      setError('')

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('user_id', user.user_id)

      // Simulate upload progress (since we can't track real progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 90))
      }, 200)

      const response = await api.post(
        `/users/${user.user_id}/face-enrollment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      clearInterval(progressInterval)
      setUploadProgress(100)
      setSuccess(`Face enrollment successful! Confidence: ${response.data.confidence?.toFixed(1)}%`)
      setSelectedFile(null)
      setPreview(null)

      setTimeout(() => {
        onClose(true)
      }, 2000)
    } catch (err) {
      setUploadProgress(0)
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Face enrollment failed. Please try again.'
      )
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
        maxWidth: '480px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <div>
            <h2 style={{ margin: 0, color: COLORS.textPrimary, fontSize: '18px', fontWeight: '600' }}>
              Face Enrollment
            </h2>
            <p style={{ margin: '4px 0 0 0', color: COLORS.textMuted, fontSize: '13px' }}>
              {user.full_name}
            </p>
          </div>
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
            disabled={loading}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Instructions */}
          <div style={{
            backgroundColor: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: COLORS.textSecondary,
            lineHeight: '1.5',
          }}>
            <p style={{ margin: '0 0 8px 0' }}>📸 <strong>Face Enrollment Instructions:</strong></p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Upload a clear face photo</li>
              <li>Good lighting is recommended</li>
              <li>Face should be centered & fully visible</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: COLORS.dangerBg,
              border: `1px solid ${COLORS.danger}`,
              color: COLORS.danger,
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <MdError size={18} />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              backgroundColor: COLORS.successBg,
              border: `1px solid ${COLORS.success}`,
              color: COLORS.success,
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <MdCheckCircle size={18} />
              {success}
            </div>
          )}

          {/* Image Upload Area */}
          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '40px 24px',
            backgroundColor: COLORS.bg,
            border: `2px dashed ${COLORS.border}`,
            borderRadius: '8px',
            cursor: preview ? 'pointer' : loading ? 'default' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: '16px',
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={loading}
            />
            {preview ? (
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={preview} 
                  alt="preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <p style={{ margin: '0', color: COLORS.textSecondary, fontSize: '12px' }}>
                  Click to change
                </p>
              </div>
            ) : (
              <>
                <MdImage size={48} color={COLORS.textMuted} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0', color: COLORS.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                    Click to upload
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: COLORS.textMuted, fontSize: '12px' }}>
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </>
            )}
          </label>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                height: '4px',
                backgroundColor: COLORS.border,
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '4px',
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: COLORS.accent,
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s',
                }}></div>
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted, textAlign: 'center' }}>
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
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
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#30363D')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = COLORS.border)}
            >
              Close
            </button>
            <button
              onClick={handleUpload}
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
                opacity: loading || !preview ? 0.5 : 1,
                pointerEvents: loading || !preview ? 'none' : 'auto',
              }}
              disabled={loading || !preview}
              onMouseEnter={(e) => !loading && preview && (e.target.style.backgroundColor = COLORS.accentLight)}
              onMouseLeave={(e) => !loading && preview && (e.target.style.backgroundColor = COLORS.accent)}
            >
              {loading ? 'Enrolling...' : 'Enroll Face'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
