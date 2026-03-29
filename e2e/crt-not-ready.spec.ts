import { expect, test } from "@playwright/test";
import { getSection, waitForE2EReady } from "./test-helpers";

test("an incomplete CRT setup does not unlock D-Mail mode", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=crt-incomplete#contact");
  await waitForE2EReady(page);

  const contactSection = getSection(page, "contact");
  await contactSection.scrollIntoViewIfNeeded();

  await expect(
    contactSection.getByRole("button", { name: /send message/i })
  ).toBeVisible({ timeout: 15_000 });

  const crtTrigger = page.getByRole("button", {
    name: /check crt cache relay/i,
  });
  await expect(crtTrigger).toBeVisible({ timeout: 15_000 });
  await crtTrigger.click();

  await expect(
    contactSection.getByRole("button", { name: /send message/i })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    contactSection.getByRole("button", { name: /send d-mail/i })
  ).toHaveCount(0);
  await expect(contactSection.getByText(/mail@jckl\.dev/i)).toBeVisible({
    timeout: 15_000,
  });
});
