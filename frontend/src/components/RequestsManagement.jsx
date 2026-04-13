import { useState, useEffect } from 'react'
import axios from 'axios'
import { MdCheckCircle, MdCancel, MdDone, MdClose } from 'react-icons/md'

const COLORS = {
  bg: '#0D1117',
  bgCard: '#161B22',
  border: '#21262D',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  accent: '#2D7DD2',
  accentLight: '#58A6FF',
  success: '#3D8F3D',
  successBg: '#0D2B0D',
  danger: '#C53030',
  dangerBg: '#2B0D0D',
  warning: '#D29922',
  warningBg: '#2B1D00',
}

export default function RequestsManagement({ accessToken, onClose }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('PENDING')
  const [reviewingId, setReviewingId] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        filter === 'ALL' ? 'http://localhost:8888/api/requests' : `http://localhost:8888/api/requests?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      setRequests(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch requests')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (requestId, status) => {
    setReviewLoading(true)
    try {
      await axios.patch(
        `http://localhost:8888/api/requests/${requestId}/review`,
        { status },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      await fetchRequests()
      setReviewingId(null)
    } catch (err) {
      setError('Failed to review request')
    } finally {
      setReviewLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: COLORS.successBg, color: COLORS.success, label: 'Approved' }
      case 'REJECTED':
        return { bg: COLORS.dangerBg, color: COLORS.danger, label: 'Rejected' }
      case 'PENDING':
        return { bg: COLORS.warningBg, color: COLORS.warning, label: 'Pending' }
      default:
        return { bg: COLORS.bgCard, color: COLORS.textSecondary, label: status }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <h2 style={{ margin: 0, color: COLORS.textPrimary }}>Access Requests</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: COLORS.textSecondary,
            cursor: 'pointer',
            padding: '0',
          }}
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === status ? COLORS.accent : COLORS.bgCard,
              color: filter === status ? 'white' : COLORS.textSecondary,
              border: `1px solid ${filter === status ? COLORS.accent : COLORS.border}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}
          >
            {status} ({requests.filter(r => r.status === status || status === 'ALL').length})
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted }}>
            No requests found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map(req => {
              const statusInfo = getStatusColor(req.status)
              return (
                <div
                  key={req.request_id}
                  style={{
                    backgroundColor: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
                >
                  {/* Request Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', color: COLORS.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                        {req.full_name}
                      </h3>
                      <p style={{ margin: '0', color: COLORS.textMuted, fontSize: '12px' }}>
                        {req.email}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Request Details */}
                  <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: '13px', color: COLORS.textPrimary, marginBottom: '4px' }}>
                      <strong>Type:</strong> {req.type}
                    </div>
                    <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '4px' }}>
                      <strong>Department:</strong> {req.department || 'N/A'}
                    </div>
                    {req.description && (
                      <div style={{ fontSize: '13px', color: COLORS.textMuted }}>
                        <strong>Details:</strong> {req.description}
                      </div>
                    )}
                  </div>

                  {/* Request Meta */}
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '12px' }}>
                    <div>Requested: {new Date(req.created_at).toLocaleDateString()}</div>
                    {req.reviewed_by_name && (
                      <div>Reviewed by: {req.reviewed_by_name}</div>
                    )}
                  </div>

                  {/* Actions */}
                  {req.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleReview(req.request_id, 'APPROVED')}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: COLORS.successBg,
                          color: COLORS.success,
                          border: `1px solid ${COLORS.success}`,
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        disabled={reviewLoading}
                        onMouseEnter={(e) => !reviewLoading && (e.target.style.backgroundColor = COLORS.success, e.target.style.color = 'white')}
                        onMouseLeave={(e) => !reviewLoading && (e.target.style.backgroundColor = COLORS.successBg, e.target.style.color = COLORS.success)}
                      >
                        <MdDone size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(req.request_id, 'REJECTED')}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: COLORS.dangerBg,
                          color: COLORS.danger,
                          border: `1px solid ${COLORS.danger}`,
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        disabled={reviewLoading}
                        onMouseEnter={(e) => !reviewLoading && (e.target.style.backgroundColor = COLORS.danger, e.target.style.color = 'white')}
                        onMouseLeave={(e) => !reviewLoading && (e.target.style.backgroundColor = COLORS.dangerBg, e.target.style.color = COLORS.danger)}
                      >
                        <MdCancel size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
