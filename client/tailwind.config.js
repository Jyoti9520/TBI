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

        // Primary Brand Colors
        burgundy: {
          DEFAULT: '#7A0B1A',
          dark: '#5B0712',
          light: '#901222',
          subtle: '#FAF5F5',
        },

        // Palette mapping
        palette: {
          burgundy: '#7A0B1A',
          darkBurgundy: '#5B0712',
          ivory: '#FAF7F2',
          white: '#FFFFFF',
          textDark: '#243447',
          textMuted: '#647C98',
          amber: '#D99A2B',
          verifiedGreen: '#16A36A',
          cream: '#D9CAB3',
        },

        // Semantic & backward-compatible aliases
        navy: {
          DEFAULT: '#7A0B1A',
          50: '#FAF5F5',
          100: '#F4E8EA',
          200: '#D9CAB3',
          300: '#D99A2B',
          400: '#901222',
          500: '#7A0B1A',
          600: '#5B0712',
          700: '#48050E',
          800: '#35030A',
          900: '#220206',
        },

        teal: {
          DEFAULT: '#7A0B1A',
          500: '#7A0B1A',
        },

        // Amber Accent (#D99A2B)
        amber: {
          DEFAULT: '#D99A2B',
          50: '#FDF9F2',
          100: '#FAF1E2',
          200: '#F4DFC0',
          300: '#EDCC9A',
          400: '#E4B363',
          500: '#D99A2B',
          600: '#BA801F',
          700: '#966517',
          800: '#734B11',
          900: '#52340B',
        },

        // Dark text (#243447), Muted text (#647C98), and Border (#E5E9EF)
        slate: {
          DEFAULT: '#243447',
          muted: '#647C98',
          border: '#E2E8F0',
        },

        status: {
          success: '#16A36A',
          warning: '#D99A2B',
          error: '#7A0B1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
        brand: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(36, 52, 71, 0.05), 0 1px 2px 0 rgba(36, 52, 71, 0.03)',
        card: '0 2px 8px -1px rgba(36, 52, 71, 0.06), 0 2px 4px -1px rgba(36, 52, 71, 0.03)',
        hover: '0 10px 20px -3px rgba(36, 52, 71, 0.10), 0 4px 6px -2px rgba(36, 52, 71, 0.04)',
      },
    },
  },
  plugins: [],
};
