import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0d0f14',
          2: '#12151c',
          3: '#181c25',
          4: '#1e2330',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          2: 'rgba(255,255,255,0.10)',
        },
        text: {
          DEFAULT: '#e8eaf0',
          muted: '#8892a4',
          dim: '#4d5566',
        },
        blue: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        green: '#10b981',
        red: '#ef4444',
        amber: '#f59e0b',
      },
      borderRadius: {
        card: '10px',
        pill: '20px',
      },
    },
  },
  plugins: [],
}

export default config
