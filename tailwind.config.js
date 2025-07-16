/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#2B5F75', // Deep blue-gray
          light: '#3D7A94',
          dark: '#1A4A5C',
          foreground: '#FFFFFF',
        },
        // Secondary colors
        secondary: {
          DEFAULT: '#E8B96C', // Warm gold
          light: '#F5D4A3',
          dark: '#D4A04A',
          foreground: '#1A1A1A',
        },
        // Accent colors
        accent: {
          DEFAULT: '#7FB069', // Fresh green
          light: '#9BC88A',
          dark: '#5D8B4A',
          foreground: '#FFFFFF',
        },
        // Background colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          muted: '#F3F4F6',
        },
        // Text colors
        foreground: {
          DEFAULT: '#1A1A1A',
          muted: '#4B5563',
          subtle: '#6B7280',
        },
        // Border colors
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
          subtle: '#F3F4F6',
        },
        // Success, warning, error colors
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        error: {
          DEFAULT: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} 