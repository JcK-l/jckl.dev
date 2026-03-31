import { expect, test } from "@playwright/test";
import {
  enterDigits,
  getConnectionOffset,
  getPhonewaveLiveScreen,
} from "./test-helpers";

test("PhoneWave reaches the target window and enables the relay", async ({
  page,
}) => {
  await page.goto("/#connection");

  const connectionSection = page.locator("section#connection");
  await connectionSection.scrollIntoViewIfNeeded();

  await expect(
    connectionSection.getByText("PhoneWave (name subject to change)")
  ).toBeVisible();

  const { years, months } = getConnectionOffset();

  await connectionSection.getByRole("button", { name: /years/i }).click();
  await enterDigits(connectionSection, years);

  await connectionSection.getByRole("button", { name: /months/i }).click();
  await enterDigits(connectionSection, months);

  await expect(connectionSection.getByText("READY")).toBeVisible();

  await connectionSection.getByRole("button", { name: "START" }).click();
  const phonewaveLiveScreen = getPhonewaveLiveScreen(connectionSection);

  await expect(
    phonewaveLiveScreen.getByText(/inside target window/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    phonewaveLiveScreen.getByText(/linked phone input enabled/i)
  ).toBeVisible({ timeout: 15_000 });
});
