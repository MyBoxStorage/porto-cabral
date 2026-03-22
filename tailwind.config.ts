import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './emails/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pc-navy':     '#002451',
        'pc-navy-mid': '#1a3a6b',
        'pc-gold':     '#D4A843',
        'pc-gold-light':'#FECE65',
        'pc-surface':  '#fef9f1',
        'pc-surface-2':'#f2ede5',
        'pc-text':     '#1d1c17',
        'pc-muted':    '#43474f',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        accent:  ['"Josefin Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
