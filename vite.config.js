import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      },
    },
  };
});
