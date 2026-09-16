/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0C10',
        card: '#1F2833',
        accent: {
          cyan: '#00FFFF',
          amber: '#FFD700'
        },
        text: {
          primary: '#E0E6ED',
          secondary: '#C5C6C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
