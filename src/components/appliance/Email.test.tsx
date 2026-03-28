// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Email } from "./Email";

describe("Email", () => {
  it("renders nothing when the mail viewer is disabled", () => {
    const { container } = render(
      <Email
        name="Ada"
        email="ada@example.com"
        message="Hello there"
        date="Mar 28, 2026"
        isMail={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders the trimmed sender details, subject, and message content", async () => {
    const inboxDate = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date());
    const receivedDate = "Mar 28, 2026";

    render(
      <Email
        name="  Ada Lovelace  "
        email="ada@example.com"
        message={"Analytical Engine\nNotes"}
        date={receivedDate}
        isMail
      />
    );

    expect(screen.getByText("New email from Ada Lovelace")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(screen.getAllByText("ada@example.com")).toHaveLength(2);
    expect(screen.getByText("mail@jckl.dev")).toBeTruthy();
    expect(screen.getAllByText(receivedDate)).toHaveLength(1);
    expect(
      screen.getByText((_content, node) => {
        return node?.textContent === "Analytical Engine\nNotes";
      })
    ).toBeTruthy();

    await waitFor(() => {
      expect(screen.getAllByText(inboxDate).length).toBeGreaterThan(0);
    });
  });

  it("falls back to the default sender metadata when the name is blank", () => {
    render(
      <Email
        name="   "
        email="unknown@example.com"
        message="No signature"
        date="Mar 28, 2026"
        isMail
      />
    );

    expect(screen.getByText("New email")).toBeTruthy();
    expect(screen.getByText("?")).toBeTruthy();
    expect(screen.getByText("Unknown sender")).toBeTruthy();
  });
});
