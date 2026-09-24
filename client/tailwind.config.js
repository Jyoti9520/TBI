/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color Hunt Palette: #F9E8A2, #B4E1EB, #95BDD7, #78A4CB
        background: '#F4F9FD',
        surface: '#FFFFFF',

        palette: {
          yellow: '#F9E8A2',
          ice: '#B4E1EB',
          slate: '#95BDD7',
          blue: '#78A4CB',
        },

        // Primary Blue mapped directly to #78A4CB
        navy: {
          DEFAULT: '#78A4CB',
          50: '#F2F8FC',
          100: '#E0F0F8',
          200: '#B4E1EB', // Palette color #B4E1EB
          300: '#95BDD7', // Palette color #95BDD7
          400: '#78A4CB', // Palette color #78A4CB
          500: '#78A4CB', // Primary #78A4CB
          600: '#5F8FB8',
          700: '#48769D',
          800: '#2E5578',
          900: '#1B3650',
        },

        // Secondary Soft Cerulean mapped to #95BDD7 and #B4E1EB
        teal: {
          DEFAULT: '#95BDD7',
          50: '#F4F9FC',
          100: '#E3F2F8',
          200: '#B4E1EB', // Palette color #B4E1EB
          300: '#A3CEE2',
          400: '#95BDD7', // Palette color #95BDD7
          500: '#95BDD7',
          600: '#7AA4C0',
          700: '#5C87A3',
          800: '#3D627B',
          900: '#234054',
        },

        // Warm Cream / Accent Yellow mapped to #F9E8A2
        amber: {
          DEFAULT: '#F9E8A2', // Palette color #F9E8A2
          50: '#FEFDF8',
          100: '#FDF9E7',
          200: '#FAF2CC',
          300: '#F9E8A2', // Primary
          400: '#F4DB6F',
          500: '#E6C63B',
          600: '#C2A31B',
          700: '#967D0C',
          800: '#6C5804',
          900: '#4A3B02',
        },

        slate: {
          DEFAULT: '#1A2E40',
          muted: '#5A758E',
          border: '#C8DEF0',
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
        subtle: '0 1px 3px 0 rgba(120, 164, 203, 0.16), 0 1px 2px 0 rgba(120, 164, 203, 0.08)',
        card: '0 2px 8px -1px rgba(120, 164, 203, 0.18), 0 2px 4px -1px rgba(120, 164, 203, 0.10)',
        hover: '0 12px 24px -3px rgba(120, 164, 203, 0.28), 0 4px 6px -2px rgba(120, 164, 203, 0.12)',
      },
    },
  },
  plugins: [],
};
