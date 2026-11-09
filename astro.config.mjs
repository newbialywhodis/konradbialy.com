import { defineConfig } from "astro/config";
import { codeBlocks } from "./src/components/CodeBlocks/transformer";

export default defineConfig({
  site: "https://konradbialy.com",
  output: "static",
  markdown: {
    shikiConfig: {
      theme: "github-light",
      transformers: [codeBlocks],
    },
  },
});
