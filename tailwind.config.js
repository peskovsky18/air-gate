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
        ios: {
          bg: '#F2F2F7',
          darkBg: '#000000',
          card: '#FFFFFF',
          darkCard: '#1C1C1E',
          cardHover: '#F7F7F9',
          darkCardHover: '#2C2C2E',
          secondaryBg: '#E5E5EA',
          darkSecondaryBg: '#2C2C2E',
          blue: '#0071E3',
          darkBlue: '#0A84FF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          label: '#000000',
          darkLabel: '#FFFFFF',
          secondaryLabel: '#8E8E93',
          tertiaryLabel: '#C7C7CC',
          separator: 'rgba(60, 60, 67, 0.12)',
          darkSeparator: 'rgba(84, 84, 88, 0.36)',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        normal: '0',
        wide: '0.015em',
      },
      boxShadow: {
        'ios-subtle': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'ios-modal': '0 12px 32px rgba(0,0,0,0.18)',
      }
    },
  },
  plugins: [],
}
