/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* Civil Intelligence System — extracted from Stitch project 2415833032549594604 */
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          container: 'rgb(var(--color-primary-container) / <alpha-value>)',
          fixed: 'rgb(var(--color-primary-fixed) / <alpha-value>)',
          'fixed-dim': 'rgb(var(--color-primary-fixed-dim) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          container: 'rgb(var(--color-secondary-container) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--color-tertiary) / <alpha-value>)',
          container: 'rgb(var(--color-tertiary-container) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          dim: 'rgb(var(--color-surface-dim) / <alpha-value>)',
          bright: 'rgb(var(--color-surface-bright) / <alpha-value>)',
          container: 'rgb(var(--color-surface-container) / <alpha-value>)',
          'container-high': 'rgb(var(--color-surface-container-high) / <alpha-value>)',
          'container-highest': 'rgb(var(--color-surface-container-highest) / <alpha-value>)',
          'container-low': 'rgb(var(--color-surface-container-low) / <alpha-value>)',
          'container-lowest': 'rgb(var(--color-surface-container-lowest) / <alpha-value>)',
          variant: 'rgb(var(--color-surface-variant) / <alpha-value>)',
        },
        on: {
          surface: 'rgb(var(--color-on-surface) / <alpha-value>)',
          'surface-variant': 'rgb(var(--color-on-surface-variant) / <alpha-value>)',
          primary: 'rgb(var(--color-on-primary) / <alpha-value>)',
          'primary-container': 'rgb(var(--color-on-primary-container) / <alpha-value>)',
          secondary: 'rgb(var(--color-on-secondary) / <alpha-value>)',
          error: 'rgb(var(--color-on-error) / <alpha-value>)',
        },
        outline: {
          DEFAULT: 'rgb(var(--color-outline) / <alpha-value>)',
          variant: 'rgb(var(--color-outline-variant) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          container: 'rgb(var(--color-error-container) / <alpha-value>)',
        },
        inverse: {
          surface: 'rgb(var(--color-inverse-surface) / <alpha-value>)',
          'on-surface': 'rgb(var(--color-inverse-on-surface) / <alpha-value>)',
          primary: 'rgb(var(--color-inverse-primary) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'body-base': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'tabular': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      spacing: {
        'unit': '4px',
        'container-margin': '24px',
        'gutter': '16px',
        'comp-px': '12px',
        'comp-py': '8px',
        'sidebar': '240px',
      },
      boxShadow: {
        'level-2': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
