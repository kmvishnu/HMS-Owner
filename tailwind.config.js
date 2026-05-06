/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        accent: {
          light: '#f472b6',
          DEFAULT: '#ec4899',
          dark: '#db2777',
        },
        background: {
          dark: '#0f172a',
          light: '#f8fafc',
        },
        surface: {
          dark: '#1e293b',
          light: '#ffffff',
        }
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(79, 70, 229, 0.4)',
      },
      backgroundImage: {
        'gradient-futuristic': 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
}
