// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'logo-purple': '#6B6B84',
        'light-purple': '#AEB0FF',

        'light-grey': '#B0B1AF',
        'screen-black': '#191A1A',
        'mid-dark-grey': '#2E2E2E',
        'mid-light-grey': '#838383',
        // Sidebar
        'sidebar-bg': '#202222',
        'button-hover': '#3A3A3A',

        // Prompt Bar
        'submit-btn-bg': '#676767',

        // Chat
        'share-btn-bg': '#C6C7F8',
        'share-btn-hover-bg': '#E0E1FB',
        'share-btn-text': '#193E45',
        'chat-message-text': '#B7B7B7',
        'header-bar-text': '#BBBBB9',
        'sidebar-bg': '#202222',
        'metrics-text': '#AEB0FF',
        'source-text': '#9A9A9A',
        'query-options-menu-bg': '#282C2C',
        'query-options-input-bg': '#444444',
        'query-options-input-border-bg': '#6979FB',
        'query-options-date-picker-color': '#4A4E4E',
        'query-options-date-picker-active-color': '#AEB0FF',
        'query-options-date-picker-bg': '#4A4A50',
        'query-options-date-picker-active-bg': '#6A6CDB',
        'prompt-bar-date-bg': '#767680',
        'error-message-box-border-bg': '#F56565',
        'error-message-box-bg': '#4B1E1E',
        'heatmap-green-bg': 'rgba(83, 168, 102, 0.7)',
        'heatmap-yellow-bg': 'rgba(253, 209, 120, 0.7)',
        'heatmap-purple-bg': 'rgba(174, 176, 255, 0.7)',
        'heatmap-red-bg': 'rgba(255, 26, 0, 0.7)'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },

    },
  },
  plugins: [],
}

