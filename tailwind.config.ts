import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#F97316',      // Warna oranye utama untuk tombol
        'brand-secondary': '#FED7AA',    // Warna peach untuk sidebar/kontainer
        'brand-background': '#FFF7ED', // Warna latar belakang utama (krem)
        'brand-text': '#44403C',          // Warna teks utama
      },
    },
  },
  plugins: [],
};
export default config;