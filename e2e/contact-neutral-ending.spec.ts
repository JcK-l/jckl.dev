import { expect, test } from "@playwright/test";
import {
  getSection,
  routeSentimentResponse,
  submitContactForm,
  waitForE2EReady,
} from "./test-helpers";

test("neutral D-Mail keeps the relay in its cold-start state", async ({
  page,
}) => {
  await routeSentimentResponse(page, "neutral");

  await page.goto("/?e2e-seed=contact-ready#contact");
  await waitForE2EReady(page);

  await submitContactForm(page, {
    name: "River Song",
    email: "river@example.com",
    message: "Keep the line steady.",
  });

  await expect(page.getByText(/message from river song/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Keep the line steady.")).toBeVisible({
    timeout: 15_000,
  });

  const connectionSection = getSection(page, "connection");
  await connectionSection.scrollIntoViewIfNeeded();

  await expect(
    connectionSection.getByText(/\[boot\] temporal relay not yet initialized/i)
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    connectionSection.getByText(
      /\[status\] first stable offset has not been registered/i
    )
  ).toBeVisible({ timeout: 15_000 });
});
