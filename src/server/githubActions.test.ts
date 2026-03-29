import { describe, expect, it } from "vitest";
import { parsePlaywrightJobLog } from "./githubActions";

describe("parsePlaywrightJobLog", () => {
  it("extracts flaky test names from Playwright CI output", () => {
    const summary = parsePlaywrightJobLog(`
Running 6 tests using 6 workers

  ok 5 [chromium] › e2e/contact-ending.spec.ts:8:1 › contact submission enters ending mode and shows the delivered mail (8.4s)
  x  3 [chromium] › e2e/connection-resize-retry.spec.ts:9:1 › PhoneWave still accepts retries after a viewport resize (8.3s)

  1 flaky
    [chromium] › e2e/connection-resize-retry.spec.ts:9:1 › PhoneWave still accepts retries after a viewport resize
  5 passed (14.3s)
`);

    expect(summary.passedCount).toBe(5);
    expect(summary.flakyCount).toBe(1);
    expect(summary.flakyTests).toEqual([
      "[chromium] › e2e/connection-resize-retry.spec.ts:9:1 › PhoneWave still accepts retries after a viewport resize",
    ]);
  });

  it("extracts failed tests from Playwright CI output", () => {
    const summary = parsePlaywrightJobLog(`
Running 6 tests using 6 workers

  1) [chromium] › e2e/contact-ending.spec.ts:8:1 › contact submission enters ending mode and shows the delivered mail

  1 failed
    [chromium] › e2e/contact-ending.spec.ts:8:1 › contact submission enters ending mode and shows the delivered mail
  5 passed (15.0s)
`);

    expect(summary.failedCount).toBe(1);
    expect(summary.failedTests).toEqual([
      "[chromium] › e2e/contact-ending.spec.ts:8:1 › contact submission enters ending mode and shows the delivered mail",
    ]);
  });
});
