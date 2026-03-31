import { expect, test, type Locator, type Page } from "@playwright/test";
import { dragLocator, getSection } from "../test-helpers";

const openProjectsSection = async (page: Page) => {
  await page.goto("/#projects");

  const projectsSection = getSection(page, "projects");
  await projectsSection.scrollIntoViewIfNeeded();
  await expect(
    projectsSection.getByRole("heading", { level: 1, name: /my projects/i })
  ).toBeVisible({ timeout: 15_000 });

  return projectsSection;
};

const expectProjectArchive = async ({
  description,
  projectHeading,
  projectsSection,
}: {
  description: RegExp;
  projectHeading: RegExp;
  projectsSection: Locator;
}) => {
  await expect(
    projectsSection.getByRole("heading", {
      level: 3,
      name: projectHeading,
    })
  ).toBeVisible({ timeout: 15_000 });
  await expect(projectsSection.getByText(description)).toBeVisible({
    timeout: 15_000,
  });
};

test("the public projects archive renders the first project module on both layouts", async ({
  page,
}) => {
  const projectsSection = await openProjectsSection(page);

  await expect(projectsSection.getByText(/project module 01/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(projectsSection.getByText(/preview reel/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(projectsSection.getByTestId("carousel-viewport")).toBeVisible({
    timeout: 15_000,
  });
  await expectProjectArchive({
    description: /graphics pipeline from opengl to vulkan/i,
    projectHeading: /vulkan-renderer/i,
    projectsSection,
  });
});

test("the public projects preview reel opens the active frame on both layouts", async ({
  page,
}) => {
  const projectsSection = await openProjectsSection(page);
  const previewReel = projectsSection.getByTestId("carousel-viewport");

  await previewReel.click({ position: { x: 40, y: 40 } });

  await expect(page.getByAltText("Preview")).toBeVisible({ timeout: 15_000 });
});

test("desktop navigation loads later project archives from the selector rail", async ({
  isMobile,
  page,
}) => {
  test.skip(
    isMobile,
    "Desktop selector coverage only applies to wide layouts."
  );

  const projectsSection = await openProjectsSection(page);

  await expect(
    projectsSection.getByRole("tablist", { name: /project navigation/i })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    projectsSection.getByRole("button", { name: /^show next project$/i })
  ).toHaveCount(0);

  await projectsSection.getByRole("tab", { name: /proud-detectives/i }).click();

  await expectProjectArchive({
    description: /android app inspired by cluedo/i,
    projectHeading: /proud-detectives/i,
    projectsSection,
  });

  const laterProjectTab = projectsSection.getByRole("tab", {
    name: /jckl\.dev/i,
  });
  const nextRoutesButton = projectsSection.getByRole("button", {
    name: /^show next project routes$/i,
  });

  if ((await laterProjectTab.count()) === 0) {
    await nextRoutesButton.click();
  }

  await laterProjectTab.click();

  await expectProjectArchive({
    description: /the website you're on right now/i,
    projectHeading: /jckl\.dev/i,
    projectsSection,
  });
});

test("mobile navigation uses buttons and swipe gestures to change project archives", async ({
  isMobile,
  page,
}) => {
  test.skip(
    !isMobile,
    "Mobile navigator coverage only applies to touch layouts."
  );

  const projectsSection = await openProjectsSection(page);

  await expect(
    projectsSection.getByRole("button", { name: /^show next project$/i })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    projectsSection.getByRole("button", { name: /^show previous project$/i })
  ).toBeDisabled();
  await expect(
    projectsSection.getByRole("tablist", { name: /project navigation/i })
  ).toHaveCount(0);

  await projectsSection
    .getByRole("button", { name: /^show next project$/i })
    .click();

  await expectProjectArchive({
    description: /turns tornado data into isolines/i,
    projectHeading: /tornado-vis/i,
    projectsSection,
  });

  await projectsSection
    .getByRole("button", { name: /^show previous project$/i })
    .click();

  await expectProjectArchive({
    description: /graphics pipeline from opengl to vulkan/i,
    projectHeading: /vulkan-renderer/i,
    projectsSection,
  });

  await dragLocator(
    page,
    projectsSection.getByTestId("project-overview-swipe-surface"),
    {
      start: { x: 0.82, y: 0.5 },
      end: { x: 0.18, y: 0.5 },
    }
  );

  await expectProjectArchive({
    description: /turns tornado data into isolines/i,
    projectHeading: /tornado-vis/i,
    projectsSection,
  });
});
