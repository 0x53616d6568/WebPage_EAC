export default function LogsPage() {
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
      <h1 style={styles.title}>Access Logs</h1>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Door</th>
              <th style={styles.th}>Result</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={styles.emptyCell}>
                No logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

