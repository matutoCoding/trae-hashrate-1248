/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'security-normal': '#10b981',
        'security-internal': '#3b82f6',
        'security-core': '#f59e0b',
        'security-forbidden': '#ef4444',
      }
    },
  },
  plugins: [],
}
