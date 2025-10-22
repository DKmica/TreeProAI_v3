import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import componentTagger from "@dyad-sh/react-vite-component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), componentTagger()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});