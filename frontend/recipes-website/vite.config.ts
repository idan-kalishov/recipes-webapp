import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), ...tailwindcss()] as PluginOption[],

  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const ext = path.extname(assetInfo.name ?? ""); 
          const name = path.basename(assetInfo.name ?? "", ext); 
          return `assets/${name}${ext}`; 
        },
      },
    },
  },
});