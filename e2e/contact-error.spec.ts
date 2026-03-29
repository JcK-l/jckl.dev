import { expect, test } from "@playwright/test";
import {
  routeSentimentFailure,
  submitContactForm,
  waitForE2EReady,
} from "./test-helpers";

test("contact surfaces API failures without entering ending mode", async ({
  page,
}) => {
  await routeSentimentFailure(page, "Temporal relay offline");

  await page.goto("/?e2e-seed=contact-ready#contact");
  await waitForE2EReady(page);

  const contactSection = await submitContactForm(page, {
    name: "Amelia Pond",
    email: "amelia@example.com",
    message: "Please forward this safely.",
  });

  await expect(contactSection.getByText("Temporal relay offline")).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    contactSection.getByRole("button", { name: /send d-mail/i })
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/another timeline is open/i)).toHaveCount(0);
});
