/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient ease 8s infinite'
      },
      keyframes: {
        gradient: {
          "0% ": { backgroundPosition: '0% 50%' },
          "50%" : { backgroundPosition: '100% 50%' },
          "100%" : { backgroundPosition: '0% 50%' },
        }
      },
      fontSize: {
        //phone
        's-h1': '2.986rem',
        's-h2': '2.488rem',
        's-h3': '2.074rem',
        's-h4': '1.728rem',
        's-h5': '1.44rem',
        's-h6': '1.2rem',
        's-p':  '1rem',
        's-sm': '0.833rem',
        's-xsm': '0.694rem',
        //tablet      
        'm-h1': '5.61rem',
        'm-h2': '4.209rem',
        'm-h3': '3.157rem',
        'm-h4': '2.369rem',
        'm-h5': '1.777rem',
        'm-h6': '1.333rem',
        'm-p':  '1rem',
        'm-sm': '0.75rem',
        'm-xsm': '0.563rem',
        //desktop      
        'l-h1': '7.993rem',
        'l-h2': '5.653rem',
        'l-h3': '3.998rem',
        'l-h4': '2.827rem',
        'l-h5': '1.999rem',
        'l-h6': '1.414rem',
        'l-p':  '1rem',
        'l-sm': '0.707rem',
        'l-xsm': '0.5rem',
      },
      colors: {
        textColor: "var(--color-text-color)",
        bgColor: "var(--color-bg-color)",
        fgColor: "var(--color-fg-color)",
        fgColorShade: "var(--color-fg-color-shade)",
        titleColor: "var(--color-title-color)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        extra1: "var(--color-extra1)",
        extra2: "var(--color-extra2)",
        white: "var(--color-white)",
        yellow: "var(--color-yellow)",
        red: "var(--color-red)",
        transition1: "var(--color-transition1)",
        transition2 : "var(--color-transition2)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'desk': '1900px',
        'desk-l': '2540px',
        'desk-xl': '3800px',
      },
    },
  },
  plugins: [],
};