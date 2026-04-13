import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { MdLock } from 'react-icons/md'

// Mobile app colors
const COLORS = {
  bg: '#0D1117',
  bgCard: '#161B22',
  bgInput: '#161B22',
  border: '#21262D',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  accent: '#2D7DD2',
  accentLight: '#58A6FF',
  danger: '#C53030',
  dangerBg: '#2B0D0D',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await login(email, password)
    if (success) {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: COLORS.accentLight,
          }}>
            <MdLock size={48} />
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.textPrimary,
            marginBottom: '8px',
          }}>
            EAC Admin
          </div>
          <div style={{
            fontSize: '13px',
            color: COLORS.textSecondary,
          }}>
            Enterprise Access Control
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: COLORS.bgInput,
                color: COLORS.textPrimary,
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.accent
                e.target.style.boxShadow = `0 0 0 2px rgba(45, 125, 210, 0.2)`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.border
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: '8px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: COLORS.bgInput,
                color: COLORS.textPrimary,
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.accent
                e.target.style.boxShadow = `0 0 0 2px rgba(45, 125, 210, 0.2)`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.border
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: COLORS.dangerBg,
              border: `1px solid ${COLORS.danger}`,
              color: '#FF7875',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              animation: 'slideDown 0.3s ease-out',
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: loading ? '#30363D' : COLORS.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '8px',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = COLORS.accentLight)}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = COLORS.accent)}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${COLORS.border}`,
          fontSize: '11px',
          color: COLORS.textSecondary,
        }}>
          Enterprise Access Control System © 2026
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

