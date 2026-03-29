import { expect, test } from "@playwright/test";
import { getSection, waitForE2EReady } from "./test-helpers";

test("powering the ready CRT switches contact into D-Mail mode", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=crt-ready#contact");
  await waitForE2EReady(page);

  const contactSection = getSection(page, "contact");
  await contactSection.scrollIntoViewIfNeeded();

  await expect(
    contactSection.getByRole("button", { name: /send message/i })
  ).toBeVisible({ timeout: 15_000 });

  const crtTrigger = page.getByRole("button", {
    name: /power on crt cache relay/i,
  });
  await expect(crtTrigger).toBeVisible({ timeout: 15_000 });
  await crtTrigger.click();

  await expect(
    contactSection.getByRole("button", { name: /send d-mail/i })
  ).toBeVisible({ timeout: 15_000 });
  await expect(contactSection.getByText(/dev\.jckl@mail/i)).toBeVisible({
    timeout: 15_000,
  });
});
