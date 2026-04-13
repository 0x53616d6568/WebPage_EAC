/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EAC Brand Colors
        'eac-dark': '#0D1117',
        'eac-card': '#161B22',
        'eac-blue': '#2D7DD2',
        'eac-sky': '#58A6FF',
        'eac-text': '#F0F6FC',
        'eac-secondary': '#8B949E',
        'eac-muted': '#6E7681',
        'eac-border': '#21262D',
        'eac-success': '#3D8F3D',
        'eac-danger': '#DA3633',
        'eac-warning': '#9E6A03',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
