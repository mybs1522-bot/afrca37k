/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        glass: {
          100: 'rgba(255, 255, 255, 0.7)',
          200: 'rgba(255, 255, 255, 0.9)',
          300: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(0, 0, 0, 0.05)',
        },
        brand: {
          accent: '#3b82f6',
          primary: '#2563eb',
          dark: '#0f172a',
          success: '#10b981',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-lg': '0 0 40px rgba(37, 99, 235, 0.5)',
        'soft': '0 2px 40px rgba(0,0,0,0.06)',
        'lift': '0 20px 60px rgba(0,0,0,0.1)',
        'premium': '0 25px 80px -12px rgba(0,0,0,0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
