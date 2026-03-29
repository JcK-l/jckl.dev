import { expect, test } from "@playwright/test";
import {
  getSection,
  routeSentimentResponse,
  submitContactForm,
  waitForE2EReady,
} from "./test-helpers";

test("negative D-Mail redirects the experience into the rollback timeline", async ({
  page,
}) => {
  await routeSentimentResponse(page, "negative");

  await page.goto("/?e2e-seed=contact-ready#contact");
  await waitForE2EReady(page);

  await submitContactForm(page, {
    name: "Marty McFly",
    email: "marty@example.com",
    message: "This feels wrong somehow",
  });

  await expect(page.getByText(/message from marty mcfly/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("This feels wrong somehow")).toBeVisible({
    timeout: 15_000,
  });

  const connectionSection = getSection(page, "connection");
  await connectionSection.scrollIntoViewIfNeeded();

  await expect(
    connectionSection.getByText(/\[warning\] repeated rollback signatures detected/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    connectionSection.getByText(/state index cannot advance beyond the current checkpoint/i)
  ).toBeVisible({ timeout: 15_000 });
});
