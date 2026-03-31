import { defineConfig, devices } from "@playwright/test";

const deployedBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const devCommand =
  process.platform === "win32"
    ? "npm.cmd run dev -- --host 127.0.0.1 --port 4321"
    : "npm run dev -- --host 127.0.0.1 --port 4321";
const mobileOnlySpecs = /.*\/mobile-.*\.spec\.ts/;
const responsiveCoreSpecs = [
  /.*\/production\/homepage-smoke\.spec\.ts/,
  /.*\/production\/connection-smoke\.spec\.ts/,
  /.*\/production\/projects-navigation\.spec\.ts/,
  /.*\/crt-power-on\.spec\.ts/,
  /.*\/contact-ending\.spec\.ts/,
  /.*\/phone-unlocked\.spec\.ts/,
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: deployedBaseUrl ?? "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: deployedBaseUrl
    ? undefined
    : {
        command: devCommand,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: "http://127.0.0.1:4321",
      },
  projects: [
    {
      name: "desktop-chromium",
      testIgnore: [mobileOnlySpecs],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile-chromium",
      testMatch: [mobileOnlySpecs, ...responsiveCoreSpecs],
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});
