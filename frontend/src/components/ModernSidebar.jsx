import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { MdGridView, MdPeople, MdLocationCity, MdAssignment, MdLogout, MdMenu, MdClose, MdChevronRight } from 'react-icons/md'
import { THEME } from '../theme/design-system'

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: MdGridView },
  { id: 'users', label: 'Users', icon: MdPeople },
  { id: 'doors', label: 'Doors', icon: MdLocationCity },
  { id: 'logs', label: 'Access Logs', icon: MdAssignment },
]

export default function ModernSidebar({ activeTab, setActiveTab }) {
  const [open, setOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        .nav-link {
          transition: ${THEME.transitions.normal};
        }

        .nav-link:hover {
          background-color: ${THEME.colors.bgSecondary};
          transform: translateX(4px);
        }

        .nav-link.active {
          background: linear-gradient(90deg, ${THEME.colors.primary}, transparent);
          color: ${THEME.colors.primary};
          border-left: 4px solid ${THEME.colors.primary};
        }
      `}</style>

      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'none',
          '@media (max-width: 768px)': { display: 'block' },
          position: 'fixed',
          top: THEME.spacing.lg,
          left: THEME.spacing.lg,
          zIndex: 50,
          backgroundColor: THEME.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: THEME.borderRadius.md,
          padding: THEME.spacing.md,
          cursor: 'pointer',
        }}
      >
        {open ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        style={{
          width: open ? '280px' : '80px',
          backgroundColor: THEME.colors.bgCard,
          borderRight: `1px solid ${THEME.colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          transition: THEME.transitions.normal,
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: THEME.spacing.lg,
            borderBottom: `1px solid ${THEME.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: THEME.spacing.md,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: THEME.borderRadius.md,
              background: `linear-gradient(135deg, ${THEME.colors.primary}, ${THEME.colors.primaryLight})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            🔐
          </div>
          {open && (
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: THEME.colors.textPrimary,
              }}>
                SecureApp
              </div>
              <div style={{
                fontSize: '10px',
                color: THEME.colors.textSecondary,
              }}>
                EAC System
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: THEME.spacing.md,
            display: 'flex',
            flexDirection: 'column',
            gap: THEME.spacing.sm,
            overflowY: 'auto',
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={isActive ? 'nav-link active' : 'nav-link'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: THEME.spacing.md,
                  padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                  borderRadius: THEME.borderRadius.md,
                  backgroundColor: isActive ? THEME.colors.infoLight : 'transparent',
                  color: isActive ? THEME.colors.primary : THEME.colors.textSecondary,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {open && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div
          style={{
            padding: THEME.spacing.lg,
            borderTop: `1px solid ${THEME.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: THEME.spacing.md,
          }}
        >
          {open && (
            <div>
              <div style={{
                fontSize: '12px',
                color: THEME.colors.textSecondary,
                marginBottom: THEME.spacing.xs,
              }}>
                Logged in as
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: THEME.colors.textPrimary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.full_name || 'Admin'}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: THEME.spacing.md,
              padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
              borderRadius: THEME.borderRadius.md,
              backgroundColor: THEME.colors.dangerLight,
              color: THEME.colors.danger,
              border: `1px solid ${THEME.colors.danger}`,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: THEME.transitions.normal,
              justifyContent: open ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = THEME.colors.danger
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = THEME.colors.dangerLight
              e.target.style.color = THEME.colors.danger
            }}
          >
            <MdLogout size={20} />
            {open && 'Logout'}
          </button>
        </div>
      </div>
    </>
  )
}
