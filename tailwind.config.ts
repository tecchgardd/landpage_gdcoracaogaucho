import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './data/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        gaucho: {
          green: '#005b25',
          dark: '#020805',
          red: '#cf1616',
          gold: '#f6c545',
          cream: '#fff8ec'
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        premium: '0 24px 60px rgba(0,0,0,.25)'
      }
    }
  },
  plugins: []
};

export default config;
