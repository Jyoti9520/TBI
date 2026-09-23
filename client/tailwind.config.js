/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        navy: {
          DEFAULT: '#123B5D',
          50: '#F0F6FA',
          100: '#DCEAF3',
          500: '#123B5D',
          600: '#0E2E4A',
          700: '#0A2237',
          800: '#061624'
        },
        teal: {
          DEFAULT: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0F766E',
          600: '#0D645D',
          700: '#0B524C'
        },
        amber: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706'
        },
        slate: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0'
        },
        status: {
          success: '#15803D',
          warning: '#D97706',
          error: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 2px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        hover: '0 10px 15px -3px rgba(18, 59, 93, 0.08), 0 4px 6px -2px rgba(18, 59, 93, 0.04)'
      }
    },
  },
  plugins: [],
};
