/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Satoshi', 'sans-serif'],
        'satoshi': ['Satoshi', 'sans-serif'],
        'urbanist': ['Urbanist', 'sans-serif'],
        'urbanist-bold': ['Urbanist', 'sans-serif'],
        'urbanist-semibold-italic': ['Urbanist-SemiBoldItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
