// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplianceTerminal } from "./ApplianceTerminal";

describe("ApplianceTerminal", () => {
  it("renders the optional header metadata and custom classes", () => {
    const { container } = render(
      <ApplianceTerminal
        className="outer-shell"
        bodyClassName="inner-body"
        headerLabel="Signal Board"
        headerMeta="ready"
      >
        <span>Payload</span>
      </ApplianceTerminal>
    );

    expect(screen.getByText("Signal Board")).toBeTruthy();
    expect(screen.getByText("ready")).toBeTruthy();
    expect(screen.getByText("Payload")).toBeTruthy();
    expect(container.firstElementChild?.className).toContain("outer-shell");
    expect(container.querySelector(".inner-body")).toBeTruthy();
  });

  it("renders only the body when no header props are provided", () => {
    const { container } = render(
      <ApplianceTerminal>
        <span>Terminal body</span>
      </ApplianceTerminal>
    );

    expect(screen.getByText("Terminal body")).toBeTruthy();
    expect(container.querySelector(".font-appliance.tabular-nums")).toBeTruthy();
    expect(container.querySelector(".border-b")).toBeNull();
  });
});
