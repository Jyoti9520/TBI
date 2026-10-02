/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Enterprise Blue Palette
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
        },
        surface: '#FFFFFF',

        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#1E40AF',
        },

        secondary: {
          accent: '#0EA5E9',
        },

        // Dark Neutrals for text and high-contrast elements
        dark: {
          DEFAULT: '#0F172A',
          secondary: '#1E293B',
          muted: '#334155',
        },

        // Backward-compatible slate colors mapping cleanly to the new palette
        slate: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          border: '#E2E8F0',
          hover: '#EFF6FF',
        },

        // Border colors
        border: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1',
          focus: '#2563EB',
        },

        // Semantic status
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
          info: '#2563EB',
        },

        // Replaced Brand / Legacy semantic aliases mapped directly to clean Modern Blue
        burgundy: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
          subtle: '#EFF6FF',
        },
        navy: {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        amber: {
          DEFAULT: '#0EA5E9',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        brand: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        hover: '0 4px 12px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        modal: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
    },
  },
  plugins: [],
};
