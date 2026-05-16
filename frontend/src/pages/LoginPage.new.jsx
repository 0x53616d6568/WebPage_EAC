import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { MdLock, MdMail } from 'react-icons/md'
import { THEME } from '../theme/design-system'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${THEME.colors.primaryDark} 0%, ${THEME.colors.primary} 100%)`,
      padding: THEME.spacing.lg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .input-field {
          position: relative;
        }

        .input-field input {
          width: 100%;
          padding: 12px 16px;
          padding-left: 40px;
          border: 2px solid ${THEME.colors.border};
          border-radius: ${THEME.borderRadius.md};
          font-size: 14px;
          transition: ${THEME.transitions.normal};
          background-color: ${THEME.colors.bgCard};
          color: ${THEME.colors.textPrimary};
          box-sizing: border-box;
        }

        .input-field input:focus {
          outline: none;
          border-color: ${THEME.colors.primary};
          box-shadow: 0 0 0 3px ${THEME.colors.infoLight};
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: ${THEME.colors.textTertiary};
          pointer-events: none;
        }
      `}</style>

      <div className="login-card" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: THEME.colors.bgCard,
        borderRadius: THEME.borderRadius.xl,
        boxShadow: THEME.shadows.xl,
        padding: THEME.spacing.xxxl,
      }}>
        {/* Logo Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: THEME.spacing.xxxl,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: THEME.borderRadius.lg,
            background: `linear-gradient(135deg, ${THEME.colors.primary}, ${THEME.colors.primaryLight})`,
            marginBottom: THEME.spacing.lg,
          }}>
            <MdLock size={28} color="white" />
          </div>
          
          <h1 style={{
            ...THEME.typography.h3,
            color: THEME.colors.textPrimary,
            margin: 0,
            marginBottom: THEME.spacing.sm,
          }}>
            SecureApp
          </h1>
          
          <p style={{
            ...THEME.typography.body,
            color: THEME.colors.textSecondary,
            margin: 0,
          }}>
            Enterprise Access Control
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: THEME.spacing.lg,
        }}>
          {error && (
            <div style={{
              backgroundColor: THEME.colors.dangerLight,
              border: `1px solid ${THEME.colors.danger}`,
              borderRadius: THEME.borderRadius.md,
              padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
              color: THEME.colors.danger,
              fontSize: '14px',
              fontWeight: 500,
              animation: 'slideDown 0.3s ease-out',
            }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="input-field">
            <MdMail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-field">
            <MdLock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
              backgroundColor: loading ? THEME.colors.border : THEME.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: THEME.borderRadius.md,
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: THEME.transitions.normal,
              marginTop: THEME.spacing.md,
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = THEME.colors.primaryDark)}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = THEME.colors.primary)}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: THEME.spacing.xxl,
          paddingTop: THEME.spacing.lg,
          borderTop: `1px solid ${THEME.colors.border}`,
          textAlign: 'center',
          fontSize: '11px',
          color: THEME.colors.textTertiary,
        }}>
          Enterprise Access Control © 2026
        </div>
      </div>
    </div>
  )
}
