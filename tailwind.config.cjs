/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontSize: {
				sm: ['14px', '20px'],
				base: ['16px', '24px'],
				lg: ['20px', '28px'],
				xl: ['24px', '32px'],
			},
			fontFamily: {
				sans: ['DM Sans', 'sans-serif'],
				heading: ['Poppins', 'sans-serif']
			},
		},
	},
	plugins: [],
}
