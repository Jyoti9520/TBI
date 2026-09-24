/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme mapped to Color Hunt palette: #F9E8A2, #B4E1EB, #95BDD7, #78A4CB
        background: '#F5F9FC',
        surface: '#FFFFFF',

        palette: {
          yellow: '#F9E8A2',
          ice: '#B4E1EB',
          slate: '#95BDD7',
          blue: '#78A4CB',
        },

        navy: {
          DEFAULT: '#274B6D',
          50: '#F2F7FA',
          100: '#E4F0F7',
          200: '#B4E1EB', // Palette color #B4E1EB
          300: '#95BDD7', // Palette color #95BDD7
          400: '#78A4CB', // Palette color #78A4CB
          500: '#5282AA',
          600: '#3A678D',
          700: '#274B6D',
          800: '#19334C',
          900: '#0F2133',
        },

        teal: {
          DEFAULT: '#5282AA',
          50: '#F4FAFC',
          100: '#E5F3F7',
          200: '#B4E1EB', // Palette color #B4E1EB
          300: '#A1CEE0',
          400: '#95BDD7', // Palette color #95BDD7
          500: '#78A4CB', // Palette color #78A4CB
          600: '#5282AA',
          700: '#3A678D',
          800: '#274B6D',
        },

        amber: {
          DEFAULT: '#F9E8A2', // Palette color #F9E8A2
          50: '#FEFDF7',
          100: '#FDF9E7',
          200: '#F9E8A2', // Palette color #F9E8A2
          300: '#F5DC73',
          400: '#ECCB44',
          500: '#CFA71B',
          600: '#A8830E',
          700: '#7F6005',
        },

        slate: {
          DEFAULT: '#142535',
          muted: '#5F7991',
          border: '#D4E4F0',
        },

        status: {
          success: '#1B8251',
          warning: '#C47A11',
          error: '#D32F2F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(120, 164, 203, 0.12), 0 1px 2px 0 rgba(120, 164, 203, 0.08)',
        card: '0 2px 8px -1px rgba(120, 164, 203, 0.15), 0 2px 4px -1px rgba(120, 164, 203, 0.08)',
        hover: '0 12px 20px -3px rgba(120, 164, 203, 0.22), 0 4px 6px -2px rgba(120, 164, 203, 0.10)',
      },
    },
  },
  plugins: [],
};
