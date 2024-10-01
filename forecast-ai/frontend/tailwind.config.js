// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'light-purple': '#6B6B84',
        'title-light-grey': '#B0B1AF',
        'screen-black': '#191A1A',
        'mid-dark-grey': '#2E2E2E',
        'mid-light-grey': '#838383',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },

    },
  },
  plugins: [],
}

