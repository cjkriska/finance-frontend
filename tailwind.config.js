/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}", "./src/*.{html,js}", "./src/**/*.js"],
  theme: {
    extend: {},
    colors: {
      'backgroundgreen': '#a3b18a',
      'navgreen': '#588157',
      'boxbeige': '#dad7cd'
    }
  },
  plugins: [],
}