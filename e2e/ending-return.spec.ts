import { expect, test } from "@playwright/test";
import { getSection, waitForE2EReady } from "./test-helpers";

test("a completed ending can return to the original timeline and be reopened from the mission balloons", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=ending-return-ready#about");
  await waitForE2EReady(page);

  const aboutSection = getSection(page, "about");
  await aboutSection.scrollIntoViewIfNeeded();

  await expect(
    aboutSection.getByRole("button", { name: /return/i })
  ).toBeVisible({ timeout: 15_000 });

  await aboutSection.getByRole("button", { name: /return/i }).click();

  await expect(aboutSection.getByText("Loop Witness")).toHaveCount(0, {
    timeout: 15_000,
  });

  const missionSection = getSection(page, "crtMission");
  await missionSection.scrollIntoViewIfNeeded();

  const reopenButton = missionSection.getByRole("button", {
    name: /switch to the negative timeline/i,
  });
  await expect(reopenButton).toBeVisible({ timeout: 15_000 });
  await reopenButton.focus();
  await page.keyboard.press("Enter");

  await expect(
    aboutSection.getByText(/message from loop witness/i)
  ).toBeVisible({
    timeout: 15_000,
  });
  await expect(aboutSection.getByText("Restless hello from the loop.")).toBeVisible({
    timeout: 15_000,
  });
});

test("returning on a narrow viewport keeps the mission section centered", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?e2e-seed=ending-return-ready#about");
  await waitForE2EReady(page);

  const aboutSection = getSection(page, "about");
  await aboutSection.scrollIntoViewIfNeeded();
  await aboutSection.getByRole("button", { name: /return/i }).click();

  const viewport = page.viewportSize();

  if (!viewport) {
    throw new Error("Viewport size was not available.");
  }

  const missionSection = getSection(page, "crtMission");

  await expect.poll(
    async () => {
      const box = await missionSection.boundingBox();

      if (box === null) {
        return Number.POSITIVE_INFINITY;
      }

      return Math.abs(box.y + box.height / 2 - viewport.height / 2);
    },
    { timeout: 15_000 }
  ).toBeLessThanOrEqual(8);

  await expect(
    missionSection.getByRole("button", {
      name: /switch to the negative timeline/i,
    })
  ).toBeVisible({ timeout: 15_000 });
});
