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
        'submit-btn-bg': '#676767',
        'share-btn-bg': '#C6C7F8',
        'share-btn-text': '#193E45',
        'chat-message-text': '#B7B7B7',
        'header-bar-text': '#BBBBB9',
        'sidebar-bg': '#202222',
        'metrics-text': '#AEB0FF',
        'source-text': '#9A9A9A'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },

    },
  },
  plugins: [],
}

