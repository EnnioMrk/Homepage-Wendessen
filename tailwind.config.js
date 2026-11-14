/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#23476b',
                    light: '#3b6288',
                    dark: '#1a3550',
                    darker: '#142a40',
                    foreground: '#f1f2ee',
                },
                secondary: {
                    DEFAULT: '#1b2f27',
                    light: '#243b31',
                    dark: '#142420',
                    foreground: '#e6e9e2',
                },
                accent: {
                    DEFAULT: '#c2a24b',
                    light: '#d4b969',
                    dark: '#8f7530',
                    foreground: '#161a17',
                },
                background: {
                    DEFAULT: '#e9ebe6',
                    secondary: '#f1f2ee',
                    muted: '#dfe2dc',
                },
                foreground: {
                    DEFAULT: '#161a17',
                    muted: '#39423b',
                    subtle: '#5d665f',
                },
                border: {
                    DEFAULT: '#c4c8c0',
                    strong: '#969d94',
                    subtle: '#dfe2dc',
                },
                success: {
                    DEFAULT: '#2c6444',
                    light: '#d9e6dc',
                    dark: '#1f4a31',
                },
                warning: {
                    DEFAULT: '#8a5a12',
                    light: '#efe4cd',
                    dark: '#6b460c',
                },
                error: {
                    DEFAULT: '#9e2b25',
                    light: '#f0dcd8',
                    dark: '#7e211c',
                },
                destructive: {
                    DEFAULT: '#9e2b25',
                    foreground: '#ffffff',
                },
                card: {
                    DEFAULT: '#f1f2ee',
                    foreground: '#161a17',
                },
                popover: {
                    DEFAULT: '#f1f2ee',
                    foreground: '#161a17',
                },
                muted: {
                    DEFAULT: '#dfe2dc',
                    foreground: '#5d665f',
                },
                input: '#969d94',
                ring: '#23476b',
            },
            borderRadius: {
                none: '0',
                sm: '0',
                DEFAULT: '0',
                md: '0',
                lg: '0',
                xl: '0',
                '2xl': '0',
                '3xl': '0',
                full: '0',
            },
            boxShadow: {
                sm: 'none',
                DEFAULT: 'none',
                md: 'none',
                lg: 'none',
                xl: 'none',
                '2xl': 'none',
                inner: 'none',
            },
            fontFamily: {
                sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
                serif: ['Literata', 'Georgia', 'serif'],
            },
        },
    },
    plugins: [],
};
