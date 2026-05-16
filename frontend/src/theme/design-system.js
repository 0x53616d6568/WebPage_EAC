/**
 * Global Design System for EAC
 * Color palette, typography, spacing, and animations
 */

export const THEME = {
  colors: {
    // Primary palette
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1E40AF',
    
    // Backgrounds
    bg: '#F8FAFC',
    bgSecondary: '#F1F5F9',
    bgCard: '#FFFFFF',
    bgCardHover: '#F8FAFC',
    
    // Dark mode
    darkBg: '#0F172A',
    darkBgSecondary: '#1E293B',
    darkBgCard: '#1E293B',
    
    // Text
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textLight: '#CBD5E1',
    
    // Dark mode text
    darkTextPrimary: '#F1F5F9',
    darkTextSecondary: '#CBD5E1',
    darkTextTertiary: '#94A3B8',
    
    // Semantic
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
    
    // Borders
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    darkBorder: '#334155',
    darkBorderLight: '#475569',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
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

export const DARK_THEME = {
  ...THEME,
  colors: {
    ...THEME.colors,
    bg: THEME.colors.darkBg,
    bgSecondary: THEME.colors.darkBgSecondary,
    bgCard: THEME.colors.darkBgCard,
    bgCardHover: THEME.colors.darkBgSecondary,
    textPrimary: THEME.colors.darkTextPrimary,
    textSecondary: THEME.colors.darkTextSecondary,
    textTertiary: THEME.colors.darkTextTertiary,
    border: THEME.colors.darkBorder,
    borderLight: THEME.colors.darkBorderLight,
  },
}

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
