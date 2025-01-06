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
      // fontSize: {
      //   sm: ["13px", "17px"],
      //   base: ["16px", "24px"],
      //   lg: ["20px", "28px"],
      //   xl: ["24px", "32px"],
      // },
      colors: {
        primary: "#231942",
        secondary: "#5e548e",
        tertiary: "#9F86C0",
        extra1: "#BE95C4",
        extra2: "#E0B1CB",
        white: "#F7F5FB",
        yellow: "#FFDD4A",
        red: "#AC3931"
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};