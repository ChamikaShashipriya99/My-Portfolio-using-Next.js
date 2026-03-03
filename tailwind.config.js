/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "sm": "100%",
                "md": "768px",
                "lg": "1024px",
                "xl": "1200px",
                "2xl": "1366px",
                "3xl": "1440px",
                "4xl": "1680px",
                "5xl": "1920px",
                // Container capped at 1920px even for larger screens
                "2k": "1920px",
                "3k": "1920px",
                "5k": "1920px",
            },
        },
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1200px',
            '2xl': '1366px',
            '3xl': '1440px',
            '4xl': '1680px',
            '5xl': '1920px',
            '2k': '2560px',
            '3k': '3200px',
            '5k': '5120px',
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
            },
        },
    },
    plugins: [],
}
