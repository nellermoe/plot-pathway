
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9b87f5',
        secondary: '#7E69AB',
        accent: '#6E59A5',
        background: '#F1F0FB',
        text: '#1A1F2C',
      },
    },
  },
  plugins: [],
}
