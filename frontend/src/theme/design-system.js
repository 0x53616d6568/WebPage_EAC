/**
 * Global Design System for EAC
 * Supports light and dark modes dynamically
 */

export const getTheme = (isDarkMode) => {
  const isDark = isDarkMode === true

  return {
    isDarkMode: isDark,
    colors: {
      // Primary
      primary: '#2563EB',
      primaryDark: '#1D4ED8',
      primaryLight: '#DBEAFE',

      // Semantic
      success: '#10B981',
      successLight: '#D1FAE5',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      info: '#3B82F6',
      infoLight: '#DBEAFE',

      // Backgrounds
      bg: isDark ? '#0F172A' : '#F8FAFC',
      bgCard: isDark ? '#1E293B' : '#FFFFFF',
      bgSecondary: isDark ? '#334155' : '#F1F5F9',
      bgHover: isDark ? '#475569' : '#E2E8F0',
      bgCardHover: isDark ? '#334155' : '#F8FAFC',

      // Text
      textPrimary: isDark ? '#F1F5F9' : '#1E293B',
      textSecondary: isDark ? '#CBD5E1' : '#64748B',
      textTertiary: isDark ? '#94A3B8' : '#94A3B8',
      textLight: isDark ? '#64748B' : '#CBD5E1',

      // Borders
      border: isDark ? '#334155' : '#E2E8F0',
      borderLight: isDark ? '#475569' : '#F1F5F9',
    },

    spacing: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
    },

    typography: {
      h1: { fontSize: '32px', fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: '28px', fontWeight: 700, lineHeight: 1.3 },
      h3: { fontSize: '24px', fontWeight: 600, lineHeight: 1.4 },
      h4: { fontSize: '20px', fontWeight: 600, lineHeight: 1.4 },
      h5: { fontSize: '16px', fontWeight: 600, lineHeight: 1.5 },
      body: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
      bodySmall: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5 },
      caption: { fontSize: '11px', fontWeight: 500, lineHeight: 1.4 },
    },

    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    transitions: {
      fast: 'all 0.15s ease-in-out',
      normal: 'all 0.2s ease-in-out',
      slow: 'all 0.3s ease-in-out',
    },

    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
  }
}

// Default light theme for backward compatibility
export const THEME = getTheme(false)

export const DARK_THEME = getTheme(true)

export const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`
