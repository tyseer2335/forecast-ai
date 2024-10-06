// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'logo-purple': '#6B6B84',
        'light-purple': '#AEB0FF',

        'light-grey': '#B0B1AF', // ACACAC
        'screen-black': '#191A1A',
        'mid-dark-grey': '#2E2E2E',
        'mid-light-grey': '#838383',
        // Sidebar
        'sidebar-bg': '#202222',
        'button-hover': '#3A3A3A',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },

    },
  },
  plugins: [],
}

