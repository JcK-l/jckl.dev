import { devices, expect, test } from "@playwright/test";
import { getSection, waitForE2EReady } from "./test-helpers";

test.use({
  ...devices["Pixel 5"],
});

test("the mobile preview reel advances through its native scroll position without opening the modal", async ({
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

  await previewReel.evaluate((element) => {
    const viewport = element as HTMLDivElement;
    const viewportWidth =
      viewport.clientWidth || viewport.getBoundingClientRect().width;

    viewport.scrollTo({
      behavior: "auto",
      left: viewportWidth,
    });
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }));
  });

  await expect(projectsSection.getByText("02 / 05")).toBeVisible({
    timeout: 15_000,
  });

  await previewReel.evaluate((element) => {
    const viewport = element as HTMLDivElement;
    const viewportWidth =
      viewport.clientWidth || viewport.getBoundingClientRect().width;

    viewport.scrollTo({
      behavior: "auto",
      left: viewportWidth * 2,
    });
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }));
  });

  await expect(projectsSection.getByText("03 / 05")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByAltText("Preview")).toHaveCount(0);
});
