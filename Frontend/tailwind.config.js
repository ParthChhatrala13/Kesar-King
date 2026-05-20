/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        mango: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        grove: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body:    ["'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        card:   "0 2px 16px 0 rgba(245,158,11,0.10)",
        cardHover: "0 8px 32px 0 rgba(245,158,11,0.18)",
        glass:  "0 4px 24px rgba(0,0,0,0.07)",
      },
      keyframes: {
        fadeIn:   { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" }},
        slideIn:  { "0%": { opacity: "0", transform: "translateX(-16px)" }, "100%": { opacity: "1", transform: "translateX(0)" }},
        popIn:    { "0%": { transform: "scale(0.92)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" }},
        shimmer:  { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" }},
        float:    { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" }},
        glowPulse:{ "0%, 100%": { opacity: "0.45", transform: "scale(1)" }, "50%": { opacity: "0.9", transform: "scale(1.05)" }},
        gradientShift: { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" }},
      },
      animation: {
        fadeIn:  "fadeIn 0.4s ease both",
        slideIn: "slideIn 0.35s ease both",
        popIn:   "popIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
        shimmer: "shimmer 1.4s infinite linear",
        float:   "float 8s ease-in-out infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        gradientShift: "gradientShift 10s ease infinite",
      },
    },
  },
  plugins: [],
};
