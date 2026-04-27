/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ofi-gold':       '#CCA23E',
        'ofi-gold-muted': 'rgba(204,162,62,0.15)',
        'ofi-bg':         '#000000',
        'ofi-surface':    '#0A0A0A',
        'ofi-surface-2':  '#111111',
        'ofi-border':     '#1F1F1F',
        'ofi-text':       '#FFFFFF',
        'ofi-text-sec':   '#A0A0A0',
        'ofi-text-muted': '#555555',
        'ofi-success':    '#22C55E',
        'ofi-warning':    '#F59E0B',
        'ofi-error':      '#EF4444',
        'ofi-info':       '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'ofi-sm': '8px',
        'ofi-md': '12px',
        'ofi-lg': '16px',
      },
      ringColor: {
        'ofi-gold': '#CCA23E',
      },
      boxShadow: {
        'ofi-gold': '0 0 0 3px rgba(204,162,62,0.25)',
        'ofi-card': '0 1px 3px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
