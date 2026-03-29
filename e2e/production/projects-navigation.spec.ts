import { expect, test } from "@playwright/test";
import { getSection } from "../test-helpers";

test("the public project selector swaps the visible project content", async ({
  page,
}) => {
  await page.goto("/#projects");

  const projectsSection = getSection(page, "projects");
  await projectsSection.scrollIntoViewIfNeeded();

  await projectsSection
    .getByRole("tab", { name: /proud-detectives/i })
    .click();

  await expect(
    projectsSection.getByRole("heading", {
      level: 3,
      name: /proud-detectives/i,
    })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    projectsSection.getByText(/android app inspired by cluedo/i)
  ).toBeVisible({ timeout: 15_000 });

  const laterProjectTab = projectsSection.getByRole("tab", {
    name: /jckl\.dev/i,
  });
  const nextRoutesButton = projectsSection.getByRole("button", {
    name: /show next project routes/i,
  });

  if ((await laterProjectTab.count()) === 0) {
    await nextRoutesButton.click();
  }

  await laterProjectTab.click();

  await expect(
    projectsSection.getByRole("heading", {
      level: 3,
      name: /jckl\.dev/i,
    })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    projectsSection.getByText(/the website you're on right now/i)
  ).toBeVisible({ timeout: 15_000 });
});
