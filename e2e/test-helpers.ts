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

export const getElementAtLocatorPoint = async (
  page: Page,
  locator: Locator,
  ratios: { x: number; y: number } = { x: 0.5, y: 0.5 }
) => {
  const box = await locator.boundingBox();

  if (box === null) {
    throw new Error("Could not resolve locator bounding box.");
  }

  const point = {
    x: box.x + box.width * ratios.x,
    y: box.y + box.height * ratios.y,
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

export const getElementAtLocatorCenter = async (
  page: Page,
  locator: Locator
) => {
  return getElementAtLocatorPoint(page, locator);
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

export const routeSentimentFailure = async (
  page: Page,
  errorMessage = "Temporal relay offline"
) => {
  await page.route("**/api/openai", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ error: errorMessage }),
      contentType: "application/json",
      status: 500,
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

  await contactSection.getByRole("button", { name: /send d-mail/i }).click();

  return contactSection;
};

export const getSection = (page: Page, id: string): Locator => {
  return page.locator(`section#${id}`);
};

export const getPhonewaveLiveScreen = (scope: Locator) => {
  return scope.getByTestId("phonewave-screen-live");
};

export const dragLocator = async (
  page: Page,
  locator: Locator,
  {
    end,
    start,
    steps = 12,
  }: {
    end: { x: number; y: number };
    start: { x: number; y: number };
    steps?: number;
  }
) => {
  const box = await locator.boundingBox();

  if (box === null) {
    throw new Error("Could not resolve locator bounding box.");
  }

  const startPoint = {
    x: box.x + box.width * start.x,
    y: box.y + box.height * start.y,
  };
  const endPoint = {
    x: box.x + box.width * end.x,
    y: box.y + box.height * end.y,
  };

  await page.mouse.move(startPoint.x, startPoint.y);
  await page.mouse.down();
  await page.mouse.move(endPoint.x, endPoint.y, { steps });
  await page.mouse.up();
};

export const clickPhonePadButton = async (scope: Locator, id: string) => {
  const accessibleLabelById: Record<string, string> = {
    call: "Call",
    cancel: "Cancel",
    hashtag: "Hash",
    star: "Star",
  };
  const label = accessibleLabelById[id] ?? id;
  const button = scope.getByRole("button", { exact: true, name: label });

  if (id === "call" || id === "cancel") {
    await button.dispatchEvent("click");
    return;
  }

  await button.focus();
  await button.press("Enter");
};
