// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reactScanMocks = vi.hoisted(() => ({
  scan: vi.fn(),
}));

vi.mock("react-scan", () => ({
  scan: reactScanMocks.scan,
}));

import { ReactScanDebug } from "./ReactScanDebug";

describe("ReactScanDebug", () => {
  beforeEach(() => {
    reactScanMocks.scan.mockReset();
    window.__jcklReactScanStarted__ = undefined;
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    window.__jcklReactScanStarted__ = undefined;
  });

  it("starts react-scan when enabled through the query string", async () => {
    window.history.pushState({}, "", "/?react-scan");

    const { container } = render(<ReactScanDebug />);

    expect(container.textContent).toBe("");

    await waitFor(() => {
      expect(reactScanMocks.scan).toHaveBeenCalledWith({
        enabled: true,
        showToolbar: true,
        trackUnnecessaryRenders: true,
        _debug: "verbose",
      });
    });

    expect(window.__jcklReactScanStarted__).toBe(true);
  });

  it("does nothing when the flag is missing or react-scan was already started", async () => {
    render(<ReactScanDebug />);

    await Promise.resolve();
    expect(reactScanMocks.scan).not.toHaveBeenCalled();

    window.history.pushState({}, "", "/?react-scan");
    window.__jcklReactScanStarted__ = true;

    render(<ReactScanDebug />);

    await Promise.resolve();
    expect(reactScanMocks.scan).not.toHaveBeenCalled();
  });
});
