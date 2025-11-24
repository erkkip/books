/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
        display: ['Lexend Mega', 'sans-serif'],
      },
      colors: {
        'neo-white': '#FFFFFF',
        'neo-black': '#0e1111',
        'neo-yellow': '#FFD900',
        'neo-pink': '#FF90E8',
        'neo-green': '#28F48D',
        'neo-purple': '#9980FA',
        'neo-blue': '#4DA6FF',
        'neo-bg': '#f3f4f6',
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(14, 17, 17, 1)',
        'neo-sm': '3px 3px 0px 0px rgba(14, 17, 17, 1)',
        'neo-lg': '8px 8px 0px 0px rgba(14, 17, 17, 1)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'float': 'float 20s linear infinite',
        'toast-slide-up': 'toastSlideUp 0.3s ease-out forwards',
        'toast-slide-down': 'toastSlideDown 0.3s ease-in forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%': { transform: 'translateY(20vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-120vh) rotate(360deg)', opacity: '1' },
        },
        toastSlideUp: {
          '0%': { opacity: '0', transform: 'translate(-50%, 100%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        toastSlideDown: {
          '0%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '100%': { opacity: '0', transform: 'translate(-50%, 100%)' },
        }
      }
    }
  },
  plugins: [],
}
