/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          muted: 'var(--color-surface-muted)',
          subtle: 'var(--color-surface-subtle)',
          glass: 'var(--color-surface-glass)',
        },
        content: {
          DEFAULT: 'var(--color-content)',
          muted: 'var(--color-content-muted)',
          subtle: 'var(--color-content-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
          subtle: 'var(--color-border-subtle)',
        },
        brand: {
          DEFAULT: 'var(--color-brand)',
          start: 'var(--color-brand-start)',
          end: 'var(--color-brand-end)',
          subtle: 'var(--color-brand-subtle)',
          border: 'var(--color-brand-border)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          fg: 'var(--color-primary-fg)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          disabled: 'var(--color-primary-disabled)',
          'disabled-fg': 'var(--color-primary-disabled-fg)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          subtle: 'var(--color-accent-subtle)',
          border: 'var(--color-accent-border)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          subtle: 'var(--color-success-subtle)',
          border: 'var(--color-success-border)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          subtle: 'var(--color-warning-subtle)',
          border: 'var(--color-warning-border)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          subtle: 'var(--color-danger-subtle)',
          'subtle-hover': 'var(--color-danger-subtle-hover)',
          border: 'var(--color-danger-border)',
        },
        focus: 'var(--color-focus)',
        overlay: 'var(--color-overlay)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        glass: 'var(--shadow-glass)',
        elevated: 'var(--shadow-elevated)',
        brand: 'var(--shadow-brand)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      ringOffsetColor: {
        surface: 'var(--color-focus-offset)',
      },
    },
  },
  plugins: [],
}
