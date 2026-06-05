/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
          }
        }
      },
    },
    plugins: [],
  }