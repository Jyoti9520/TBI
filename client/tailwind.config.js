/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color Hunt Palette: #000000, #1F150C, #412D15, #E1DCC9
        background: '#FAF7F0',
        surface: '#FFFFFF',

        palette: {
          black: '#000000',
          espresso: '#1F150C',
          amberBrown: '#412D15',
          cream: '#E1DCC9',
        },

        // Primary Brand mapped to Deep Espresso & Black (#1F150C, #000000)
        navy: {
          DEFAULT: '#1F150C',
          50: '#FBF9F5',
          100: '#F4ECE0',
          200: '#E1DCC9', // Palette color #E1DCC9
          300: '#C2B79B',
          400: '#6B4C26',
          500: '#412D15', // Palette color #412D15
          600: '#322210',
          700: '#1F150C', // Primary #1F150C
          800: '#120C06',
          900: '#000000', // Black #000000
        },

        // Secondary / Rich Earth Brown mapped to #412D15
        teal: {
          DEFAULT: '#412D15',
          50: '#F9F6F0',
          100: '#EFE9DE',
          200: '#E1DCC9', // Palette color #E1DCC9
          300: '#BAA98B',
          400: '#634723',
          500: '#412D15', // Palette color #412D15
          600: '#332310',
          700: '#251A0C',
          800: '#171007',
          900: '#000000',
        },

        // Warm Cream / Sand Accent mapped to #E1DCC9
        amber: {
          DEFAULT: '#E1DCC9', // Palette color #E1DCC9
          50: '#FDFAF4',
          100: '#F6F2E7',
          200: '#ECE6D6',
          300: '#E1DCC9', // Primary cream
          400: '#CFC6A9',
          500: '#BDB189',
          600: '#948860',
          700: '#6E6441',
          800: '#484127',
          900: '#262211',
        },

        slate: {
          DEFAULT: '#1F150C',
          muted: '#6E645A',
          border: '#E6E0D2',
        },

        status: {
          success: '#2E6F40',
          warning: '#9C5B0E',
          error: '#BA2D2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(31, 21, 12, 0.08), 0 1px 2px 0 rgba(31, 21, 12, 0.04)',
        card: '0 2px 8px -1px rgba(31, 21, 12, 0.10), 0 2px 4px -1px rgba(31, 21, 12, 0.06)',
        hover: '0 12px 24px -3px rgba(31, 21, 12, 0.18), 0 4px 6px -2px rgba(31, 21, 12, 0.08)',
      },
    },
  },
  plugins: [],
};
