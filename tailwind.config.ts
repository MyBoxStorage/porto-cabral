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
        /* ─ Cor primária: azul real da marca #0074bf ─ */
        'pc-navy':       '#0074bf',   // azul real da marca
        'pc-navy-deep':  '#005fa3',   // versão mais escura
        'pc-navy-night': '#001432',   // footer — azul noturno profundo (mantido)
        'pc-navy-mid':   '#0087d9',   // versão mais clara (hover states)
        'pc-gold':       '#D4A843',
        'pc-gold-light': '#FECE65',
        'pc-surface':    '#fef9f1',
        'pc-surface-2':  '#f2ede5',
        'pc-text':       '#1d1c17',
        'pc-muted':      '#43474f',
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
