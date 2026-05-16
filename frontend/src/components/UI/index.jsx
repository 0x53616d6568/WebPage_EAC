import { THEME } from '../theme/design-system'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  ...props
}) {
  const variants = {
    primary: {
      bg: THEME.colors.primary,
      text: 'white',
      hover: THEME.colors.primaryDark,
      border: 'none',
    },
    secondary: {
      bg: THEME.colors.bgSecondary,
      text: THEME.colors.textPrimary,
      hover: THEME.colors.border,
      border: `1px solid ${THEME.colors.border}`,
    },
    danger: {
      bg: THEME.colors.danger,
      text: 'white',
      hover: '#DC2626',
      border: 'none',
    },
    ghost: {
      bg: 'transparent',
      text: THEME.colors.primary,
      hover: THEME.colors.bgSecondary,
      border: `1px solid ${THEME.colors.border}`,
    },
  }

  const sizes = {
    sm: { padding: `${THEME.spacing.sm} ${THEME.spacing.md}`, fontSize: '12px' },
    md: { padding: `${THEME.spacing.md} ${THEME.spacing.lg}`, fontSize: '14px' },
    lg: { padding: `${THEME.spacing.lg} ${THEME.spacing.xl}`, fontSize: '16px' },
  }

  const style = variants[variant]
  const size_style = sizes[size]

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? THEME.colors.border : style.bg,
        color: disabled ? THEME.colors.textTertiary : style.text,
        border: style.border,
        borderRadius: THEME.borderRadius.md,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: THEME.transitions.normal,
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...size_style,
      }}
      onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = style.hover)}
      onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = style.bg)}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}

export function Card({ children, padding = true, hoverable = false, ...props }) {
  return (
    <div
      style={{
        backgroundColor: THEME.colors.bgCard,
        border: `1px solid ${THEME.colors.border}`,
        borderRadius: THEME.borderRadius.lg,
        padding: padding ? THEME.spacing.xl : 0,
        boxShadow: THEME.shadows.sm,
        transition: THEME.transitions.normal,
        ...(hoverable && {
          cursor: 'pointer',
          '&:hover': {
            boxShadow: THEME.shadows.md,
            borderColor: THEME.colors.primary,
          },
        }),
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ children, variant = 'info', ...props }) {
  const variants = {
    success: { bg: THEME.colors.successLight, text: THEME.colors.success },
    warning: { bg: THEME.colors.warningLight, text: THEME.colors.warning },
    danger: { bg: THEME.colors.dangerLight, text: THEME.colors.danger },
    info: { bg: THEME.colors.infoLight, text: THEME.colors.info },
  }

  const style = variants[variant]

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: `${THEME.spacing.xs} ${THEME.spacing.md}`,
        borderRadius: THEME.borderRadius.full,
        fontSize: '12px',
        fontWeight: 600,
        display: 'inline-block',
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.spacing.sm }}>
      {label && (
        <label style={{
          fontSize: '14px',
          fontWeight: 600,
          color: THEME.colors.textPrimary,
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
          borderRadius: THEME.borderRadius.md,
          border: `1px solid ${error ? THEME.colors.danger : THEME.colors.border}`,
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: THEME.transitions.normal,
          backgroundColor: THEME.colors.bgCard,
          color: THEME.colors.textPrimary,
        }}
        onFocus={(e) => e.target.style.borderColor = THEME.colors.primary}
        onBlur={(e) => e.target.style.borderColor = error ? THEME.colors.danger : THEME.colors.border}
        {...props}
      />
      {error && (
        <span style={{
          fontSize: '12px',
          color: THEME.colors.danger,
        }}>
          {error}
        </span>
      )}
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div style={{
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: `2px solid ${THEME.colors.border}`,
      borderTop: `2px solid ${THEME.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }} />
  )
}

export function Divider() {
  return (
    <div style={{
      height: '1px',
      backgroundColor: THEME.colors.border,
      width: '100%',
    }} />
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: THEME.spacing.xxl,
      gap: THEME.spacing.lg,
    }}>
      <div>
        <h1 style={{
          ...THEME.typography.h2,
          color: THEME.colors.textPrimary,
          margin: 0,
          marginBottom: subtitle ? THEME.spacing.md : 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            ...THEME.typography.body,
            color: THEME.colors.textSecondary,
            margin: 0,
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function Table({ columns, data, loading }) {
  return (
    <Card>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}>
        <thead>
          <tr style={{
            borderBottom: `1px solid ${THEME.colors.border}`,
            backgroundColor: THEME.colors.bgSecondary,
          }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: THEME.spacing.lg,
                textAlign: 'left',
                ...THEME.typography.caption,
                color: THEME.colors.textSecondary,
                fontWeight: 600,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{
                padding: THEME.spacing.xl,
                textAlign: 'center',
                color: THEME.colors.textTertiary,
              }}>
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{
                padding: THEME.spacing.xl,
                textAlign: 'center',
                color: THEME.colors.textTertiary,
              }}>
                No data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} style={{
                borderBottom: `1px solid ${THEME.colors.border}`,
              }}>
                {columns.map((col) => (
                  <td key={col.key} style={{
                    padding: THEME.spacing.lg,
                    color: THEME.colors.textPrimary,
                    ...THEME.typography.body,
                  }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  )
}
