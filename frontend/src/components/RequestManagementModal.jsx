import { useState, useEffect } from 'react'
import { MdClose, MdCheckCircle, MdCancelPresentation } from 'react-icons/md'
import api from '../api/client'
import { getTheme } from '../theme/design-system'

export default function RequestManagementModal({ isDarkMode, onClose, onSuccess }) {
  const theme = getTheme(isDarkMode)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('PENDING')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/requests?status=${filter}`)
      setRequests(response.data.data || response.data)
    } catch (err) {
      setError('Error loading requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId) => {
    setActionLoading(requestId)
    try {
      await api.patch(`/requests/${requestId}/review`, { status: 'APPROVED' })
      fetchRequests()
      onSuccess?.()
    } catch (err) {
      setError('Error approving request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDecline = async (requestId) => {
    setActionLoading(requestId)
    try {
      await api.patch(`/requests/${requestId}/review`, { status: 'DECLINED' })
      fetchRequests()
      onSuccess?.()
    } catch (err) {
      setError('Error declining request')
    } finally {
      setActionLoading(null)
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
          maxWidth: '700px',
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
            Access Requests
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

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          {['PENDING', 'APPROVED', 'DECLINED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                backgroundColor: filter === status ? theme.colors.primary : theme.colors.bgSecondary,
                color: filter === status ? 'white' : theme.colors.textPrimary,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {status}
            </button>
          ))}
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xxl, color: theme.colors.textSecondary }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xxl, color: theme.colors.textSecondary }}>
            No {filter.toLowerCase()} requests
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            {requests.map((req) => (
              <div
                key={req.request_id}
                style={{
                  padding: theme.spacing.lg,
                  backgroundColor: theme.colors.bgSecondary,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <div>
                    <div style={{
                      ...theme.typography.body,
                      fontWeight: 600,
                      color: theme.colors.textPrimary,
                      marginBottom: theme.spacing.xs,
                    }}>
                      {req.user_name} requested access to {req.door_name}
                    </div>
                    <div style={{
                      ...theme.typography.bodySmall,
                      color: theme.colors.textSecondary,
                      marginBottom: theme.spacing.xs,
                    }}>
                      Reason: {req.reason || 'N/A'}
                    </div>
                    <div style={{
                      ...theme.typography.bodySmall,
                      color: theme.colors.textTertiary,
                    }}>
                      {new Date(req.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                      backgroundColor:
                        req.status === 'APPROVED'
                          ? theme.colors.successLight
                          : req.status === 'DECLINED'
                          ? theme.colors.dangerLight
                          : theme.colors.warningLight,
                      color:
                        req.status === 'APPROVED'
                          ? theme.colors.success
                          : req.status === 'DECLINED'
                          ? theme.colors.danger
                          : theme.colors.warning,
                      borderRadius: theme.borderRadius.full,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {req.status}
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div
                    style={{
                      display: 'flex',
                      gap: theme.spacing.md,
                    }}
                  >
                    <button
                      onClick={() => handleApprove(req.request_id)}
                      disabled={actionLoading === req.request_id}
                      style={{
                        flex: 1,
                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                        backgroundColor: theme.colors.success,
                        color: 'white',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: theme.spacing.sm,
                        fontSize: '13px',
                        opacity: actionLoading === req.request_id ? 0.7 : 1,
                      }}
                    >
                      <MdCheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(req.request_id)}
                      disabled={actionLoading === req.request_id}
                      style={{
                        flex: 1,
                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                        backgroundColor: theme.colors.danger,
                        color: 'white',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: theme.spacing.sm,
                        fontSize: '13px',
                        opacity: actionLoading === req.request_id ? 0.7 : 1,
                      }}
                    >
                      <MdCancelPresentation size={16} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
