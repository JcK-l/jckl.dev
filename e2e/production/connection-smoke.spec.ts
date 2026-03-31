import { expect, test } from "@playwright/test";
import {
  enterDigits,
  getConnectionOffset,
  getPhonewaveLiveScreen,
  getSection,
} from "../test-helpers";

test("PhoneWave still reaches the target window on the production-safe subset", async ({
  page,
}) => {
  await page.goto("/#connection");

  const connectionSection = getSection(page, "connection");
  await connectionSection.scrollIntoViewIfNeeded();

  await expect(
    connectionSection.getByText(/phonewave \(name subject to change\)/i)
  ).toBeVisible({ timeout: 15_000 });

  const { years, months } = getConnectionOffset();

  await connectionSection.getByRole("button", { name: /years/i }).click();
  await enterDigits(connectionSection, years);

  await connectionSection.getByRole("button", { name: /months/i }).click();
  await enterDigits(connectionSection, months);

  await expect(connectionSection.getByText("READY")).toBeVisible({
    timeout: 15_000,
  });

  await connectionSection.getByRole("button", { name: "START" }).click();
  const phonewaveLiveScreen = getPhonewaveLiveScreen(connectionSection);

  await expect(
    phonewaveLiveScreen.getByText(/inside target window/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    phonewaveLiveScreen.getByText(/linked phone input enabled/i)
  ).toBeVisible({ timeout: 15_000 });
});
