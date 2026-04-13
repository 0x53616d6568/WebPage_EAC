import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0D1117',
    },
    main: {
      flex: 1,
      overflowY: 'auto',
    },
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
