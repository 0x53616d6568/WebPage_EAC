import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { MdLock, MdMail, MdCheckCircle } from 'react-icons/md'

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

  // Luxury color palette
  const luxuryColors = {
    darkBg: '#0F1419',
    darkCard: '#1A1F2E',
    gold: '#D4AF37',
    goldLight: '#E8C547',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B8C1',
    accentBlue: '#2E5090',
    accentBlueDark: '#1A2F52',
    error: '#FF6B6B',
    errorBg: '#2C1414',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${luxuryColors.darkBg} 0%, ${luxuryColors.accentBlueDark} 50%, ${luxuryColors.darkBg} 100%)`,
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 10px 40px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 10px 40px rgba(0, 0, 0, 0.3);
          }
        }

        .login-container {
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-field {
          position: relative;
          margin-bottom: 20px;
        }

        .input-field input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.05);
          color: ${luxuryColors.textPrimary};
          box-sizing: border-box;
          backdrop-filter: blur(10px);
        }

        .input-field input::placeholder {
          color: ${luxuryColors.textSecondary};
        }

        .input-field input:focus {
          outline: none;
          border-color: ${luxuryColors.gold};
          background-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1), inset 0 0 20px rgba(212, 175, 55, 0.05);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: ${luxuryColors.gold};
          pointer-events: none;
          font-size: 18px;
        }

        .sign-in-btn {
          background: linear-gradient(135deg, ${luxuryColors.gold} 0%, ${luxuryColors.goldLight} 100%);
          transition: all 0.3s ease;
        }

        .sign-in-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .sign-in-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${luxuryColors.accentBlue}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${luxuryColors.accentBlue}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div className="login-container" style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: luxuryColors.darkCard,
        borderRadius: '20px',
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.15)`,
        padding: '48px 40px',
        border: `1px solid rgba(212, 175, 55, 0.15)`,
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${luxuryColors.gold} 0%, ${luxuryColors.goldLight} 100%)`,
            marginBottom: 20,
            boxShadow: `0 10px 30px rgba(212, 175, 55, 0.3)`,
          }}>
            <MdLock size={36} color={luxuryColors.darkBg} />
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: luxuryColors.textPrimary,
            margin: 0,
            marginBottom: 8,
            letterSpacing: '-0.5px',
          }}>
            SecureApp
          </h1>
          
          <p style={{
            fontSize: '13px',
            color: luxuryColors.gold,
            margin: 0,
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}>
            ENTERPRISE ACCESS CONTROL
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {error && (
            <div style={{
              backgroundColor: luxuryColors.errorBg,
              border: `1px solid ${luxuryColors.error}`,
              borderRadius: '12px',
              padding: '12px 16px',
              color: luxuryColors.error,
              fontSize: '13px',
              fontWeight: 500,
              animation: 'slideDown 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: luxuryColors.error,
              }} />
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="input-field">
            <MdMail className="input-icon" />
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
            <MdLock className="input-icon" />
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
            className="sign-in-btn"
            style={{
              width: '100%',
              padding: '14px 16px',
              color: luxuryColors.darkBg,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.8 : 1,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {loading ? '⏳ Signing in...' : '🔓 Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 36,
          paddingTop: 20,
          borderTop: `1px solid rgba(212, 175, 55, 0.1)`,
          textAlign: 'center',
          fontSize: '11px',
          color: luxuryColors.textSecondary,
          letterSpacing: '0.3px',
        }}>
          © 2026 SecureApp. All rights reserved.
        </div>
      </div>
    </div>
  )
}
