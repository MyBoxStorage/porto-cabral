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
        /* ─ Cor primária atualizada para azul royal da marca ─ */
        'pc-navy':       '#1a5fa8',   // azul royal
        'pc-navy-deep':  '#0e3d72',   // versão mais escura (hero overlay)
        'pc-navy-night': '#001432',   // footer — azul noturno profundo
        'pc-navy-mid':   '#2a72c0',   // versão mais clara (hover states)
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
