import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AIUISDKReact",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@buildlayer/ai-core"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@buildlayer/ai-core": "BuildLayerAICore",
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.mjs",
  },
});
