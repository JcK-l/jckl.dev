import { expect, test } from "@playwright/test";
import {
  routeSentimentResponse,
  submitContactForm,
  waitForE2EReady,
} from "./test-helpers";

test("contact submission enters ending mode and shows the delivered mail", async ({
  page,
}) => {
  await routeSentimentResponse(page, "positive");

  await page.goto("/?e2e-seed=contact-ready#contact");
  await waitForE2EReady(page);

  await submitContactForm(page, {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Playwright says hi",
  });

  await expect(page.getByText(/new email from ada lovelace/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Playwright says hi")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(/another timeline is open/i)).toBeVisible({
    timeout: 15_000,
  });
});
