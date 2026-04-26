/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* Civil Intelligence System — extracted from Stitch project 2415833032549594604 */
      colors: {
        primary: {
          DEFAULT: '#004ac6',
          container: '#2563eb',
          fixed: '#dbe1ff',
          'fixed-dim': '#b4c5ff',
        },
        secondary: {
          DEFAULT: '#585f6c',
          container: '#dce2f3',
        },
        tertiary: {
          DEFAULT: '#943700',
          container: '#bc4800',
        },
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#d9d9e5',
          bright: '#faf8ff',
          container: '#ededf9',
          'container-high': '#e7e7f3',
          'container-highest': '#e1e2ed',
          'container-low': '#f3f3fe',
          'container-lowest': '#ffffff',
          variant: '#e1e2ed',
        },
        on: {
          surface: '#191b23',
          'surface-variant': '#434655',
          primary: '#ffffff',
          'primary-container': '#eeefff',
          secondary: '#ffffff',
          error: '#ffffff',
        },
        outline: {
          DEFAULT: '#737686',
          variant: '#c3c6d7',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        inverse: {
          surface: '#2e3039',
          'on-surface': '#f0f0fb',
          primary: '#b4c5ff',
        },
        background: '#faf8ff',
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
