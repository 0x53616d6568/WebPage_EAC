export default function SettingsPage() {
  const styles = {
    container: {
      padding: '32px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#F0F6FC',
      marginBottom: '24px',
    },
    card: {
      backgroundColor: '#161B22',
      border: '1px solid #21262D',
      borderRadius: '8px',
      padding: '24px',
    },
    text: {
      color: '#6E7681',
    },
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>
      <div style={styles.card}>
        <p style={styles.text}>System settings coming soon...</p>
      </div>
    </div>
  )
}

