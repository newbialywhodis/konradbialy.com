import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://konradbialy.pl",
  output: "static",
  integrations: [react()],
});
