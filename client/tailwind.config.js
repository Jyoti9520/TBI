/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coolors Palette: #5E0B15, #90323D, #D9CAB3, #BC8034, #8C7A6B
        background: '#FAF7F2',
        surface: '#FFFFFF',

        palette: {
          burgundy: '#5E0B15',
          wine: '#90323D',
          cream: '#D9CAB3',
          gold: '#BC8034',
          taupe: '#8C7A6B',
        },

        // Primary Brand mapped to Deep Burgundy (#5E0B15) and Wine (#90323D)
        navy: {
          DEFAULT: '#5E0B15',
          50: '#FAF5F5',
          100: '#F4E8EA',
          200: '#D9CAB3', // Palette Cream
          300: '#BC8034', // Palette Gold
          400: '#90323D', // Palette Wine
          500: '#5E0B15', // Palette Burgundy
          600: '#4E0911',
          700: '#3E070E',
          800: '#2E050A',
          900: '#1F0307',
        },

        // Secondary / Rich Wine mapped to #90323D
        teal: {
          DEFAULT: '#90323D',
          50: '#FAF3F4',
          100: '#F5E6E8',
          200: '#D9CAB3',
          300: '#BC8034',
          400: '#A63B48',
          500: '#90323D',
          600: '#7A2A34',
          700: '#5E0B15',
          800: '#47161C',
          900: '#2E050A',
        },

        // Golden Amber / Ochre Accent mapped to #BC8034
        amber: {
          DEFAULT: '#BC8034',
          50: '#FDF9F3',
          100: '#FAF2E6',
          200: '#D9CAB3',
          300: '#D1B487',
          400: '#C79A5E',
          500: '#BC8034',
          600: '#A66F2A',
          700: '#8B5C20',
          800: '#6F4818',
          900: '#523410',
        },

        slate: {
          DEFAULT: '#5E0B15',
          muted: '#8C7A6B',
          border: '#D9CAB3',
        },

        status: {
          success: '#2E6F40',
          warning: '#BC8034',
          error: '#90323D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(94, 11, 21, 0.06), 0 1px 2px 0 rgba(94, 11, 21, 0.04)',
        card: '0 2px 8px -1px rgba(94, 11, 21, 0.08), 0 2px 4px -1px rgba(94, 11, 21, 0.04)',
        hover: '0 12px 24px -3px rgba(94, 11, 21, 0.16), 0 4px 6px -2px rgba(94, 11, 21, 0.06)',
      },
    },
  },
  plugins: [],
};
