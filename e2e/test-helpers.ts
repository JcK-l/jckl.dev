import type { Locator, Page } from "@playwright/test";

export const waitForE2EReady = async (page: Page) => {
  await page.waitForFunction(() => window.__jcklE2EReady__ === true);
};

export const getConnectionOffset = (currentDate = new Date()) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const totalMonths = (currentYear - 2023) * 12 + (currentMonth - 4);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
};

export const enterDigits = async (scope: Locator, value: number) => {
  const digits = value >= 10 ? String(value).split("") : [String(value)];

  for (const digit of digits) {
    await scope.getByRole("button", { exact: true, name: digit }).click();
  }
};

export const clearSelectedPhonewaveField = async (scope: Locator) => {
  await scope.getByRole("button", { name: /bksp/i }).click();
  await scope.getByRole("button", { name: /bksp/i }).click();
};

export const getElementAtLocatorCenter = async (
  page: Page,
  locator: Locator
) => {
  const box = await locator.boundingBox();

  if (box === null) {
    throw new Error("Could not resolve locator bounding box.");
  }

  const point = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };

  const elementData = await page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    const interactiveAncestor =
      element instanceof Element
        ? element.closest("button, [aria-label]")
        : null;

    return {
      ariaLabel: element?.getAttribute("aria-label"),
      interactiveAriaLabel: interactiveAncestor?.getAttribute("aria-label"),
      interactiveTagName: interactiveAncestor?.tagName ?? null,
      tagName: element?.tagName ?? null,
      textContent: element?.textContent?.trim() ?? null,
    };
  }, point);

  return {
    ...point,
    ...elementData,
  };
};

export const routeSentimentResponse = async (
  page: Page,
  sentiment: "negative" | "neutral" | "positive"
) => {
  await page.route("**/api/openai", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ sentiment }),
      contentType: "application/json",
      status: 200,
    });
  });
};

export const fillContactForm = async (
  page: Page,
  values: {
    name: string;
    email: string;
    message: string;
  }
) => {
  const contactSection = page.locator("section#contact");

  await contactSection.scrollIntoViewIfNeeded();
  await contactSection.getByLabel(/your name/i).fill(values.name);
  await contactSection.getByLabel(/your email/i).fill(values.email);
  await contactSection.getByLabel(/your message/i).fill(values.message);

  return contactSection;
};

export const submitContactForm = async (
  page: Page,
  values: {
    name: string;
    email: string;
    message: string;
  }
) => {
  const contactSection = await fillContactForm(page, values);

  await contactSection
    .getByRole("button", { name: /send d-mail/i })
    .click();

  return contactSection;
};

export const getSection = (page: Page, id: string): Locator => {
  return page.locator(`section#${id}`);
};
