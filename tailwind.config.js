/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#71BBD9',   // голубой
        accent:  '#F2AE30',   // жёлтый-оранжевый
        danger:  '#D9483B',   // красный
        dark:    '#73261F',   // тёмно-бордовый
        light:   '#B0FB3B'    // лайм
      }
    }
  },
  plugins: []
}