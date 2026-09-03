/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)"
        },
        rule: "var(--rule)",
        recovered: "var(--recovered)",
        "at-risk": "var(--at-risk)",
        breach: "var(--breach)",
        offline: "var(--offline)",
        accent: "var(--accent)"
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      borderRadius: {
        DEFAULT: "6px",
        card: "6px",
        badge: "3px",
        btn: "5px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 27, 24, 0.06)",
        drawer: "0 6px 20px rgba(27, 27, 24, 0.12)"
      }
    }
  },
  plugins: []
};
