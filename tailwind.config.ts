import type { Config } from 'tailwindcss';

const config: Config = {
  // relative: true evita perder classes no HMR do Windows (o caminho alterna entre C: e c:)
  content: { relative: true, files: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'] },
  theme: {
    extend: {
      colors: {
        gaucho: {
          green: '#005b25',
          dark: '#020805',
          red: '#cf1616',
          gold: '#f6c545',
          cream: '#fff8ec',
          night: '#06110b',
          ink: '#0b1a12',
          leather: '#7a4a24',
          paper: '#f4ecdc',
          snow: '#fdfaf3',
          brushgreen: '#14913f',
          brushred: '#e2261d',
          brushgold: '#f3c614'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        label: ['var(--font-label)', 'Arial Narrow', 'sans-serif'],
        script: ['var(--font-script)', 'cursive']
      },
      boxShadow: {
        premium: '0 24px 60px rgba(0,0,0,.25)'
      }
    }
  },
  plugins: []
};

export default config;
