import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { MdGridView, MdPeople, MdLocationCity, MdAssignment, MdLogout, MdMenu, MdClose, MdDarkMode, MdLightMode, MdPerson } from 'react-icons/md'
import { getTheme } from '../theme/design-system'

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: MdGridView },
  { id: 'users', label: 'Users', icon: MdPeople },
  { id: 'doors', label: 'Doors', icon: MdLocationCity },
  { id: 'logs', label: 'Access Logs', icon: MdAssignment },
]

export default function ModernSidebar({ activeTab, setActiveTab, onProfileClick }) {
  const [isOpen, setIsOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const theme = getTheme(isDarkMode)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      <style>{`
        .nav-link {
          transition: ${theme.transitions.normal};
        }
        .nav-link:hover {
          background-color: ${theme.colors.bgHover};
        }
        .nav-link.active {
          background-color: ${theme.colors.primary};
          color: white;
        }
      `}</style>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block',
          },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 999,
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: theme.colors.textPrimary,
        }}
      >
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Sidebar */}
      <div
        style={{
          width: isOpen ? '280px' : '80px',
          backgroundColor: theme.colors.bgCard,
          borderRight: `1px solid ${theme.colors.border}`,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.normal,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo/Branding */}
        <div
          style={{
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.md,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            AC
          </div>
          {isOpen && (
            <p
              style={{
                ...theme.typography.caption,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.md} 0 0 0`,
              }}
            >
              Access Control
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: theme.spacing.lg,
            overflow: 'auto',
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="nav-link"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.md,
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: isActive ? theme.colors.primary : 'transparent',
                  color: isActive ? 'white' : theme.colors.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: theme.transitions.normal,
                }}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.lg,
          }}
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.md,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.bgSecondary,
              color: theme.colors.textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.bgHover
              e.currentTarget.style.color = theme.colors.textPrimary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.bgSecondary
              e.currentTarget.style.color = theme.colors.textSecondary
            }}
          >
            {isDarkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            {isOpen && <span>{isDarkMode ? 'Light' : 'Dark'}</span>}
          </button>

          {/* Profile Button */}
          {user && (
            <button
              onClick={onProfileClick}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.md,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.bgSecondary,
                color: theme.colors.textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: theme.transitions.normal,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.bgHover
                e.currentTarget.style.color = theme.colors.textPrimary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.bgSecondary
                e.currentTarget.style.color = theme.colors.textSecondary
              }}
            >
              <MdPerson size={20} />
              {isOpen && <span>Profile</span>}
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.dangerLight,
              color: theme.colors.danger,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.danger
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.dangerLight
              e.currentTarget.style.color = theme.colors.danger
            }}
          >
            <MdLogout size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
