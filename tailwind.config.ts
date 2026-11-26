import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#1a0b2e", cream: "#f8f5ef", brand: "#fbbf12", violet: "#8b3dff" },
    fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"], serif: ["var(--font-playfair)", "serif"] },
  } },
  plugins: [],
};
export default config;
