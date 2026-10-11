/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        canvas: 'var(--color-canvas)',
        'surface-1': 'var(--color-surface-1)',
        'surface-2': 'var(--color-surface-2)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        'accent-fg': 'var(--color-accent-fg)',
        tag: 'var(--color-tag)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        soft: 'var(--shadow-soft)',
      }
    },
  },
  plugins: [],
}
