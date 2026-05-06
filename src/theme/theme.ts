export const theme = {
  colors: {
    primary: {
      light: '#6366f1', // Indigo 500
      DEFAULT: '#4f46e5', // Indigo 600
      dark: '#4338ca', // Indigo 700
    },
    accent: {
      light: '#f472b6', // Pink 400
      DEFAULT: '#ec4899', // Pink 500
      dark: '#db2777', // Pink 600
    },
    background: {
      dark: '#0f172a', // Slate 900
      light: '#f8fafc', // Slate 50
    },
    card: {
      dark: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glassmorphism
      light: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      dark: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
      },
      light: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
    surface: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
  },
  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 15px rgba(79, 70, 229, 0.4)',
  },
};
