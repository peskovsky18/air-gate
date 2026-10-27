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
        tg: {
          bg: 'var(--tg-theme-bg-color, #ffffff)',
          text: 'var(--tg-theme-text-color, #000000)',
          hint: 'var(--tg-theme-hint-color, #8e8e93)',
          link: 'var(--tg-theme-link-color, #007aff)',
          button: 'var(--tg-theme-button-color, #007aff)',
          buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
          secondaryBg: 'var(--tg-theme-secondary-bg-color, #f2f2f7)',
          headerBg: 'var(--tg-theme-header-bg-color, #ffffff)',
          accent: '#007aff',
        },
        surface: {
          light: '#ffffff',
          dark: '#121214',
          cardLight: '#f8f9fa',
          cardDark: '#1c1c1e',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'sheet': '0 -10px 40px rgba(0, 0, 0, 0.15)',
        'float': '0 12px 36px -4px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
