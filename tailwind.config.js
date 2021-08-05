const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  important: true,
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens :{
        'xs' : '400px',
        ...defaultTheme.screens
      },
      transitionDuration: {
        '1500': '1.5s',
        '2000': '2s',
       },
      keyframes: {
        fadeIn : {
          '0%' : {transform: 'translateX(-20px)', opacity: '0%'},
          '100%' : {transform: 'translateX(0px)', opacity: '100%'}
        },
        saturating: {
          '0%' : {opacity: '0%'},
          '100%' : {opacity: '100%'},
        }
      },
      animation: {
        'fade-in': 'fadeIn 1.5s  forwards',
        'saturate': 'saturating 1.5s  forwards'
      }
    },
  },
  variants: {
    extend: {
      textColor: ['group-hover']
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
