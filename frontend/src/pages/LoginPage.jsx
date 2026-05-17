import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { getTheme } from '../theme/design-system'
import { MdLock, MdMail, MdArrowForward } from 'react-icons/md'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { isDarkMode, setDarkMode } = useThemeStore()
  
  // Force dark mode on login page
  useEffect(() => {
    if (!isDarkMode) {
      setDarkMode(true)
    }
  }, [])

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

  // Get dark theme
  const theme = getTheme(true)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.bgSecondary} 100%)`,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      position: 'relative',
      overflow: 'hidden',
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

        .login-card {
          animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 16px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background-color: ${theme.colors.bgCard};
          border: 1px solid ${theme.colors.border};
          border-radius: 10px;
          font-size: 14px;
          color: ${theme.colors.textPrimary};
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .input-field::placeholder {
          color: ${theme.colors.textSecondary};
        }

        .input-field:focus {
          outline: none;
          border-color: ${theme.colors.primary};
          box-shadow: 0 0 0 3px ${theme.colors.primaryLight}40;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: ${theme.colors.primary};
          pointer-events: none;
          font-size: 18px;
        }

        .submit-btn {
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: inherit;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px ${theme.colors.primary}40;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-msg {
          background-color: ${theme.colors.dangerLight};
          border: 1px solid ${theme.colors.danger};
          color: ${theme.colors.danger};
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
          animation: slideDown 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
          margin-bottom: 16px;
          box-shadow: 0 8px 20px ${theme.colors.primary}30;
        }
      `}</style>

      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors.primary}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors.primary}05 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div className="login-card" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: theme.colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.border}`,
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div className="logo-icon">
            <MdLock size={32} color="white" />
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: 4,
          }}>
            SecureApp
          </h1>
          
          <p style={{
            fontSize: '12px',
            color: theme.colors.textSecondary,
            margin: 0,
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Enterprise Access Control
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-msg">
              <div style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: theme.colors.danger,
                flexShrink: 0,
              }} />
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="input-wrapper">
            <MdMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="input-field"
            />
          </div>

          {/* Password Input */}
          <div className="input-wrapper">
            <MdLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
            style={{
              marginTop: '8px',
            }}
          >
            {loading ? '⏳ Signing in' : <>Sign In <MdArrowForward size={16} /></>}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
          fontSize: '11px',
          color: theme.colors.textSecondary,
          letterSpacing: '0.3px',
        }}>
          © 2026 SecureApp. All rights reserved.
        </div>
      </div>
    </div>
  )
}
