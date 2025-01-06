import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://jckl.dev',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false,
    },
  }), react(), sitemap(), playformCompress()],
});