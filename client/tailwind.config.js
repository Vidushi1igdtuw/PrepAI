/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FFF9FC',
          white: '#FFFFFF',
          pink: '#FCE7F3',
          blush: '#F9D5E5',
          primary: '#E879A9',
          rose: '#C65B89',
          lavender: '#EDE9FE',
          lavenderAccent: '#A78BFA',
          peach: '#FFF0E8',
          border: '#F1E6EE',
          text: '#30263A',
          secondary: '#817487',
          muted: '#A99EAD',
          success: '#65B891',
          warning: '#F2B86B',
          error: '#E87979'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(198, 91, 137, 0.08)',
        'soft-lg': '0 10px 35px -8px rgba(198, 91, 137, 0.14)',
        'card': '0 2px 12px -2px rgba(48, 38, 58, 0.05)'
      }
    },
  },
  plugins: [],
}
