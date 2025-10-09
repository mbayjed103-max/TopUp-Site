/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        dark: {
          100: "#1e1e2e",
          200: "#181825",
          300: "#11111b",
          400: "#0a0a0f",
        },
        neon: {
          purple: "#a855f7",
          blue: "#3b82f6",
          green: "#10b981",
          pink: "#ec4899",
          yellow: "#fbbf24",
          cyan: "#06b6d4",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(168, 85, 247, 0.5)",
        "neon-blue": "0 0 20px rgba(59, 130, 246, 0.5)",
        "neon-green": "0 0 20px rgba(16, 185, 129, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
