/**
 * App Theme Configuration
 * Clean, cohesive color palette with dark mode support
 */

export const colors = {
  // Primary palette - Rich blue
  primary: {
    main: '#3B82F6', // Vibrant blue
    light: '#60A5FA',
    dark: '#2563EB',
    bg: '#EFF6FF',
    gradient: ['#3B82F6', '#2563EB'],
  },

  // Secondary - Purple accent
  secondary: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    bg: '#F5F3FF',
  },

  // Category colors
  categories: {
    finance: {
      main: '#10B981',
      light: '#34D399',
      bg: '#D1FAE5',
    },
    economics: {
      main: '#F59E0B',
      light: '#FBBF24',
      bg: '#FEF3C7',
    },
    geopolitics: {
      main: '#EF4444',
      light: '#F87171',
      bg: '#FEE2E2',
    },
    technology: {
      main: '#3B82F6',
      light: '#60A5FA',
      bg: '#DBEAFE',
    },
    science: {
      main: '#8B5CF6',
      light: '#A78BFA',
      bg: '#EDE9FE',
    },
    culture: {
      main: '#EC4899',
      light: '#F472B6',
      bg: '#FCE7F3',
    },
  },

  // Success (for correct answers)
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    bg: '#D1FAE5',
  },

  // Error (for incorrect answers)
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    bg: '#FEE2E2',
  },

  // Neutrals
  neutral: {
    white: '#FFFFFF',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
  },

  // Dark mode
  dark: {
    bg: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    border: '#475569',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    heading: 32,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export type Theme = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
};

export const lightTheme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  ...lightTheme,
  isDark: true,
};

/**
 * Get category color
 */
export const getCategoryColor = (category: string): { main: string; light: string; bg: string } => {
  const categoryKey = category.toLowerCase() as keyof typeof colors.categories;
  return colors.categories[categoryKey] || colors.categories.technology;
};
