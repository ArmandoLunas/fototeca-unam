import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        unam: {
          navy: '#0f2743',
          slate: '#2b3b4f',
          footer: '#0b1c31',
        },
      },
    },
  },
  plugins: [],
};
export default config;