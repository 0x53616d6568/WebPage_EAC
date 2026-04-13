export default function UsersPage() {
  const styles = {
    container: {
      padding: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#F0F6FC',
    },
    button: {
      backgroundColor: '#2D7DD2',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    card: {
      backgroundColor: '#161B22',
      border: '1px solid #21262D',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#0D1117',
      borderBottom: '1px solid #21262D',
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      color: '#6E7681',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #21262D',
      color: '#F0F6FC',
      fontSize: '14px',
    },
    emptyCell: {
      textAlign: 'center',
      padding: '32px 16px',
      color: '#6E7681',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Users Management</h1>
        <button 
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1E66BB'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2D7DD2'}
        >
          Add User
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={styles.emptyCell}>
                No users found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

