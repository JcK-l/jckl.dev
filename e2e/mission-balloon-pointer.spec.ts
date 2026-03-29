import { expect, test } from "@playwright/test";
import {
  getElementAtLocatorCenter,
  getSection,
  waitForE2EReady,
} from "./test-helpers";

test("a discovered ending balloon can be reopened with a real pointer click", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=ending-return-ready#about");
  await waitForE2EReady(page);

  const aboutSection = getSection(page, "about");
  await aboutSection.scrollIntoViewIfNeeded();
  await aboutSection.getByRole("button", { name: /return/i }).click();

  const missionSection = getSection(page, "crtMission");
  await missionSection.scrollIntoViewIfNeeded();

  const reopenButton = missionSection.getByRole("button", {
    name: /switch to the negative timeline/i,
  });

  await expect(reopenButton).toBeVisible({ timeout: 15_000 });

  const hitPoint = await getElementAtLocatorCenter(page, reopenButton);

  expect(hitPoint.interactiveAriaLabel).toBe("Switch to the negative timeline");

  await page.mouse.click(hitPoint.x, hitPoint.y);

  await expect(
    aboutSection.getByText(/message from loop witness/i)
  ).toBeVisible({
    timeout: 15_000,
  });
  await expect(aboutSection.getByText("Restless hello from the loop.")).toBeVisible({
    timeout: 15_000,
  });
});
