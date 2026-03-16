import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content_script: resolve(__dirname, "contents/text_select_detector.js"),
        service_worker: resolve(__dirname, "service/message_sender.js"),
        options: resolve(__dirname, "options/options.js"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
