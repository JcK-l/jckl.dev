import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import reactComponentName from "react-scan/react-component-name/astro";

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
    reactComponentName(),
    react(),
    sitemap(),
    (await import("@playform/compress")).default({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
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
