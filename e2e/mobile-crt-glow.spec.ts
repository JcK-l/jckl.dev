import { devices, expect, test } from "@playwright/test";
import { getSection, waitForE2EReady } from "./test-helpers";

test.use({
  ...devices["Pixel 5"],
});

test("the contact CRT keeps its ready glow styling on mobile", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=crt-ready#contact");
  await waitForE2EReady(page);

  const contactSection = getSection(page, "contact");
  await contactSection.scrollIntoViewIfNeeded();

  await expect(
    page.getByRole("button", { name: /power on crt cache relay/i })
  ).toBeVisible({ timeout: 15_000 });

  const glowState = await page
    .locator(".crt-trigger-visual-shell")
    .evaluate((node) => {
      const visualShell = node as HTMLElement;
      const halo = visualShell.querySelector(".crt-trigger-halo");
      const image = visualShell.querySelector(".crt-trigger-image");
      const screen = visualShell.querySelector(".crt-trigger-screen");
      const haloStyle = halo ? getComputedStyle(halo) : null;
      const imageStyle = image ? getComputedStyle(image) : null;
      const screenStyle = screen ? getComputedStyle(screen) : null;

      return {
        haloOpacity: haloStyle?.opacity ?? "",
        imageFilter: imageStyle?.filter ?? "",
        screenFilter: screenStyle?.filter ?? "",
        state: visualShell.dataset.state ?? "",
      };
    });

  expect(glowState.state).toBe("ready");
  expect(Number(glowState.haloOpacity)).toBeGreaterThan(0.4);
  expect(glowState.imageFilter).not.toBe("none");
  expect(glowState.screenFilter).not.toBe("none");
});
