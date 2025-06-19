import * as path from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "esbuild",
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@mui/material")) {
            return "vendor-mui";
          }
          if (id.includes("zod")) {
            return "vendor-zod";
          }
          if (id.includes("zustand")) {
            return "vendor-zustand";
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: "~/app", replacement: path.resolve(__dirname, "src") },
      { find: "~/assets", replacement: path.resolve(__dirname, "src/assets") },
      {
        find: "~/components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      { find: "~/hooks", replacement: path.resolve(__dirname, "src/hooks") },
      { find: "~/auth", replacement: path.resolve(__dirname, "src/auth") },
      { find: "~/api", replacement: path.resolve(__dirname, "src/api") },
      { find: "~/pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "~/routes", replacement: path.resolve(__dirname, "src/routes") },
      {
        find: "~/services",
        replacement: path.resolve(__dirname, "src/services"),
      },
      { find: "~/store", replacement: path.resolve(__dirname, "src/store") },
      { find: "~/theme", replacement: path.resolve(__dirname, "src/theme") },
      { find: "~/types", replacement: path.resolve(__dirname, "src/types") },
      { find: "~/utils", replacement: path.resolve(__dirname, "src/utils") },
    ],
  },
});
