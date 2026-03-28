/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/env.d.ts",
        "src/data/PuzzleData.tsx",
        "src/data/PuzzleImage.tsx",
        "src/data/ProjectData.tsx",
        "src/data/crtImage.tsx",
        "src/data/heroImage.ts",
        "src/data/meImage.tsx",
      ],
    },
  },
});
