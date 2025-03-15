import kobaltePlugin from '@kobalte/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        contentShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        skeletonFade: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        },
        slideIn: {
          from: { transform: 'translateY(calc(-100%))' },
          to: { transform: 'translateY(0)'}
        }
      },
      animation: {
        'content-show': 'contentShow 250ms ease-out',
        'content-hide': 'contentHide 250ms ease-in forwards',
        'skeleton-fade': 'skeletonFade 1500ms linear infinite',
        'slide-in': 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
  },
  plugins: [
    kobaltePlugin
  ],
}

