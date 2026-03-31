import { devices, expect, test, type Locator } from "@playwright/test";
import { dragLocator, getSection, waitForE2EReady } from "./test-helpers";

test.use({
  ...devices["Pixel 5"],
});

const getTranslateX = async (locator: Locator) => {
  return locator.evaluate((element) => {
    const transform = window.getComputedStyle(element).transform;

    if (transform === "none") {
      return 0;
    }

    const matrix3dMatch = transform.match(/^matrix3d\((.+)\)$/);

    if (matrix3dMatch) {
      const values = matrix3dMatch[1]?.split(",").map(Number) ?? [];

      return values[12] ?? 0;
    }

    const matrixMatch = transform.match(/^matrix\((.+)\)$/);

    if (matrixMatch) {
      const values = matrixMatch[1]?.split(",").map(Number) ?? [];

      return values[4] ?? 0;
    }

    return 0;
  });
};

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
  await expect
    .poll(async () =>
      getTranslateX(projectsSection.getByTestId("carousel-track"))
    )
    .toBeLessThan(-40);

  const previewReelBounds = await previewReel.boundingBox();

  if (previewReelBounds == null) {
    throw new Error("Could not resolve preview reel bounds.");
  }

  const startPoint = {
    x: previewReelBounds.x + previewReelBounds.width * 0.82,
    y: previewReelBounds.y + previewReelBounds.height * 0.5,
  };

  await page.mouse.move(startPoint.x, startPoint.y);
  await page.mouse.down();
  await page.mouse.move(
    previewReelBounds.x + previewReelBounds.width * 0.56,
    startPoint.y,
    { steps: 8 }
  );

  await expect
    .poll(async () =>
      getTranslateX(projectsSection.getByTestId("carousel-track"))
    )
    .toBeLessThan(-(previewReelBounds.width * 0.45));

  await page.mouse.move(
    previewReelBounds.x + previewReelBounds.width * 0.18,
    startPoint.y,
    { steps: 8 }
  );
  await page.mouse.up();

  await expect(projectsSection.getByText("03 / 05")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByAltText("Preview")).toHaveCount(0);
});
