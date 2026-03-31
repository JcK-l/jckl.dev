import { devices, expect, test } from "@playwright/test";
import { dragLocator, getSection, waitForE2EReady } from "./test-helpers";

test.use({
  ...devices["Pixel 5"],
});

test("the mobile preview reel swipes like the project cards without opening the modal", async ({
  page,
}) => {
  await page.goto("/#projects");
  await waitForE2EReady(page);

  const projectsSection = getSection(page, "projects");
  await projectsSection.scrollIntoViewIfNeeded();

  const previewReel = projectsSection.getByTestId("carousel-viewport");
  await expect(previewReel).toBeVisible({ timeout: 15_000 });
  await expect(projectsSection.getByText("01 / 05")).toBeVisible({
    timeout: 15_000,
  });

  await dragLocator(page, previewReel, {
    start: { x: 0.82, y: 0.5 },
    end: { x: 0.18, y: 0.5 },
  });

  await expect(projectsSection.getByText("02 / 05")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByAltText("Preview")).toHaveCount(0);
});
