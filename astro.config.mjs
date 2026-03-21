import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: 'https://jckl.dev',

  integrations: [
    tailwind({
      config: {
        // applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
    (await import("@playform/compress")).default({
      CSS: false,
      HTML: false,
      Image: false,
      JavaScript: false,
      SVG: {
        "svgo": {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // disable a default plugin
                  cleanupIds: false,
                  removeHiddenElems: false
                },
              },
            },
          ],
        },
      } 
    }),
  ],

  adapter: netlify(),
});
