import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const menuItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/doors', label: 'Doors' },
  { path: '/access-control', label: 'Access Control' },
  { path: '/logs', label: 'Logs' },
  { path: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const styles = {
    sidebar: {
      width: '256px',
      backgroundColor: '#161B22',
      borderRight: '1px solid #21262D',
      display: 'flex',
      flexDirection: 'column',
    },
    logo: {
      padding: '24px',
      borderBottom: '1px solid #21262D',
    },
    logoTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2D7DD2',
    },
    logoSubtitle: {
      fontSize: '12px',
      color: '#6E7681',
      marginTop: '4px',
    },
    userInfo: {
      padding: '16px',
      borderBottom: '1px solid #21262D',
    },
    userName: {
      fontSize: '14px',
      color: '#F0F6FC',
      fontWeight: '500',
    },
    userRole: {
      fontSize: '12px',
      color: '#6E7681',
    },
    nav: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    navLink: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      textDecoration: 'none',
      transition: 'all 0.2s',
      backgroundColor: isActive ? '#2D7DD2' : 'transparent',
      color: isActive ? 'white' : '#8B949E',
      fontSize: '14px',
    }),
    logout: {
      padding: '16px',
      borderTop: '1px solid #21262D',
    },
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      color: '#DA3633',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoTitle}>EAC</div>
        <div style={styles.logoSubtitle}>Admin Dashboard</div>
      </div>

      <div style={styles.userInfo}>
        <div style={styles.userName}>{user?.name || 'Admin'}</div>
        <div style={styles.userRole}>{user?.role || 'Administrator'}</div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={styles.navLink(location.pathname === item.path)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={styles.logout}>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0D1111'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

