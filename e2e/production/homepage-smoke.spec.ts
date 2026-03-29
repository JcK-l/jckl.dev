import { expect, test } from "@playwright/test";
import { getSection } from "../test-helpers";

test("the public homepage sections render on the live site", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /i'm joshua/i })
  ).toBeVisible({ timeout: 15_000 });

  const projectsSection = getSection(page, "projects");
  await projectsSection.scrollIntoViewIfNeeded();
  await expect(
    projectsSection.getByRole("heading", { level: 1, name: /my projects/i })
  ).toBeVisible({ timeout: 15_000 });

  const connectionSection = getSection(page, "connection");
  await connectionSection.scrollIntoViewIfNeeded();
  await expect(
    connectionSection.getByText(/phonewave \(name subject to change\)/i)
  ).toBeVisible({ timeout: 15_000 });

  const contactSection = getSection(page, "contact");
  await contactSection.scrollIntoViewIfNeeded();
  await expect(
    contactSection.getByRole("button", { name: /send message|send d-mail/i })
  ).toBeVisible({ timeout: 15_000 });
});
