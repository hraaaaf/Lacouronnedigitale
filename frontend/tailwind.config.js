// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ⚠️ Ne pas définir `theme` ici en v4 — cela sera ignoré
  plugins: [],
}