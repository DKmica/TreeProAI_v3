import type { Config } from "tailwindcss";
import sharedConfig from "@treeproai/config/tailwind.preset.cjs";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;