import { expect, test } from "@playwright/test";
import {
  clickPhonePadButton,
  getSection,
  waitForE2EReady,
} from "./test-helpers";

test("the unlocked phone becomes available and accepts keypad input", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=final-unlocked#call");
  await waitForE2EReady(page);

  const callSection = getSection(page, "call");
  await callSection.scrollIntoViewIfNeeded();

  await expect(
    callSection.getByText(/dial a number on the phone to reveal a result/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    callSection.getByRole("button", { exact: true, name: "Call" })
  ).toBeVisible({ timeout: 15_000 });

  await clickPhonePadButton(callSection, "1");
  await expect(
    callSection.getByRole("button", { exact: true, name: "Cancel" })
  ).toBeVisible({ timeout: 15_000 });
  await clickPhonePadButton(callSection, "cancel");
  await expect(
    callSection.getByRole("button", { exact: true, name: "Cancel" })
  ).toHaveCount(0, {
    timeout: 15_000,
  });
});
