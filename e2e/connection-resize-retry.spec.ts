import { expect, test } from "@playwright/test";
import {
  clearSelectedPhonewaveField,
  enterDigits,
  getConnectionOffset,
  getElementAtLocatorCenter,
} from "./test-helpers";

test("PhoneWave still accepts retries after a viewport resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#connection");

  const connectionSection = page.locator("section#connection");
  await connectionSection.scrollIntoViewIfNeeded();

  await expect(
    connectionSection.getByText("PhoneWave (name subject to change)")
  ).toBeVisible();

  const { years, months } = getConnectionOffset();
  const wrongYears = years > 0 ? years - 1 : years + 1;

  await connectionSection.getByRole("button", { name: /years/i }).click();
  await enterDigits(connectionSection, wrongYears);

  await connectionSection.getByRole("button", { name: /months/i }).click();
  await enterDigits(connectionSection, months);

  await connectionSection.getByRole("button", { name: "START" }).click();

  await expect(
    connectionSection.getByText(/outside target window/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(connectionSection.getByText(/offset not far enough/i)).toBeVisible({
    timeout: 15_000,
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await connectionSection.scrollIntoViewIfNeeded();

  const yearsButton = connectionSection.getByRole("button", { name: /years/i });
  const yearsHitPoint = await getElementAtLocatorCenter(page, yearsButton);

  expect(yearsHitPoint.interactiveTagName).toBe("BUTTON");

  await yearsButton.click();
  await clearSelectedPhonewaveField(connectionSection);
  await enterDigits(connectionSection, years);

  await connectionSection.getByRole("button", { name: "START" }).click();

  await expect(
    connectionSection.getByText(/inside target window/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    connectionSection.getByText(/linked phone input enabled/i)
  ).toBeVisible({ timeout: 15_000 });
});
