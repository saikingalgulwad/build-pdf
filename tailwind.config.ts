import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B1021',
        card: '#121A33',
        border: '#26355D',
        accent: '#6AA9FF'
      }
    }
  },
  plugins: []
};

export default config;
