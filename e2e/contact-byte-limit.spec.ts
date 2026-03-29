import { expect, test } from "@playwright/test";
import { fillContactForm, waitForE2EReady } from "./test-helpers";

const oversizedMessage = "1234567890123456789012345678901234567";

test("contact blocks D-Mail messages above the 36 byte limit", async ({
  page,
}) => {
  await page.goto("/?e2e-seed=contact-ready#contact");
  await waitForE2EReady(page);

  const contactSection = await fillContactForm(page, {
    name: "Clara Oswald",
    email: "clara@example.com",
    message: oversizedMessage,
  });

  const messageField = contactSection.getByLabel(/your message/i);
  await expect(messageField).toHaveValue(oversizedMessage);

  const validationMessage = await messageField.evaluate((element) => {
    return (element as HTMLTextAreaElement).validationMessage;
  });

  expect(validationMessage).toBe("Can only send 36 bytes to the target year.");

  await contactSection
    .getByRole("button", { name: /send d-mail/i })
    .click();

  await expect(page.getByText(/another timeline is open/i)).toHaveCount(0);
});
