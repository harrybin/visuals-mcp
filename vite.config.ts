import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(), // Bundle everything into a single HTML file
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: true,
    target: "es2022",
    rollupOptions: {
      input: "./mcp-app.html",
    },
  },
});
