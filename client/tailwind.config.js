/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Full Black & Orange Ecosystem Palette
        background: {
          DEFAULT: '#0a0a0c',
          secondary: '#111115',
        },
        surface: '#111115',

        primary: {
          DEFAULT: '#F97316', // Orange-500
          hover: '#EA580C',   // Orange-600
          light: '#271911',   // Dark Orange subtle
          dark: '#C2410C',    // Orange-700
        },

        secondary: {
          accent: '#FB923C', // Orange-400
        },

        // Dark Neutrals for text and high-contrast dark elements
        dark: {
          DEFAULT: '#FFFFFF',
          secondary: '#E2E8F0',
          muted: '#94A3B8',
        },

        // Backward-compatible slate colors mapping cleanly to dark theme
        slate: {
          DEFAULT: '#FFFFFF',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          border: '#27272a',
          hover: '#1c1c22',
          bg: '#141419',
        },

        // Border colors
        border: {
          DEFAULT: '#27272a',
          hover: '#3f3f46',
          focus: '#F97316',
        },

        // Semantic status
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#F97316',
        },

        // Replaced Brand / Legacy semantic aliases mapped directly to Orange
        burgundy: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C',
          subtle: '#FFF7ED',
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
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
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
