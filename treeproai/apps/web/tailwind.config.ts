import type { Config } from "tailwindcss";
import sharedConfig from "@treeproai/config/tailwind.preset.cjs";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  presets: [sharedConfig],
} satisfies Config;