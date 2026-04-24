import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        vaultx: {
          black: "#000000",
          white: "#FFFFFF",
        },
        brand: {
          primary: "#ff6b35",
          primaryHover: "rgba(255, 107, 53, 0.15)",
          surface: "rgba(255, 255, 255, 0.05)",
          surfaceSecondary: "rgba(0, 0, 0, 0.5)",
          border: "rgba(255, 255, 255, 0.1)",
          borderSecondary: "rgba(255, 107, 53, 0.2)",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255, 255, 255, 0.6)",
          textMuted: "rgba(255, 255, 255, 0.4)",
          textCaption: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
