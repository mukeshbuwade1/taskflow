/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand / accent — coral-red from the Figma design
        primary: {
          50:  '#fff1f1',
          100: '#ffe2e2',
          200: '#ffcaca',
          300: '#ffa3a3',
          400: '#ff6b6b',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // Sidebar / nav dark navy
        sidebar: {
          DEFAULT: '#1a1b2e',
          light:   '#252640',
          border:  '#2e2f4a',
          text:    '#a0a3bd',
          active:  '#ef4444',
        },

        // Surface / page backgrounds
        surface: {
          bg:     '#f5f6fa',   // page canvas
          card:   '#ffffff',   // card background
          nav:    '#ffffff',   // top navbar
          input:  '#f9fafb',   // input fill
          hover:  '#f3f4f6',   // hover tint
        },

        // Semantic status colours
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fff1f1',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },

        // Priority badge tokens
        priority: {
          'low-bg':    '#dcfce7',
          'low-text':  '#15803d',
          'mid-bg':    '#fef3c7',
          'mid-text':  '#b45309',
          'high-bg':   '#ffe2e2',
          'high-text': '#b91c1c',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem',     { lineHeight: '1.5rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',   { lineHeight: '2rem' }],
        '3xl':['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
      },

      borderRadius: {
        sm:   '0.375rem',   // 6px
        DEFAULT: '0.5rem',  // 8px
        md:   '0.625rem',   // 10px
        lg:   '0.75rem',    // 12px
        xl:   '1rem',       // 16px
        '2xl':'1.25rem',    // 20px
        full: '9999px',
      },

      boxShadow: {
        card:  '0 1px 3px 0 rgba(0,0,0,.08), 0 1px 2px -1px rgba(0,0,0,.06)',
        'card-md': '0 4px 12px 0 rgba(0,0,0,.10)',
        'card-lg': '0 8px 24px 0 rgba(0,0,0,.12)',
        sidebar: '4px 0 16px 0 rgba(0,0,0,.20)',
        input:  '0 0 0 3px rgba(239,68,68,.18)',
      },

      spacing: {
        sidebar: '240px',
        navbar:  '64px',
      },

      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
