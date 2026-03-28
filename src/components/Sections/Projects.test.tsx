// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { projects } from "../../data/ProjectData";
import { $endingState } from "../../stores/endingStore";
import { createDefaultEndingState } from "../../test/factories";

vi.mock("../ProjectText", () => ({
  ProjectText: ({
    projectId,
    title,
    totalProjects,
  }: {
    projectId: number;
    title: string;
    totalProjects: number;
  }) => (
    <div
      data-testid="project-text"
      data-project-id={String(projectId)}
      data-total-projects={String(totalProjects)}
    >
      {title}
    </div>
  ),
}));

import Projects from "./Projects";

describe("Projects", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
  });

  it("defaults to the first project and switches the active project when a tab is selected", () => {
    render(<Projects />);

    const firstProject = projects[0];
    const secondProject = projects[1];

    expect(screen.getByRole("heading", { name: "My Projects" })).toBeTruthy();
    expect(screen.getByTestId("project-text").dataset.projectId).toBe(
      String(firstProject?.id)
    );
    expect(screen.getByTestId("project-text").textContent).toBe(
      firstProject?.title
    );
    expect(screen.getByText("01 active")).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: /vulkan-renderer/i }).getAttribute(
        "aria-selected"
      )
    ).toBe("true");

    fireEvent.click(
      screen.getByRole("tab", { name: new RegExp(secondProject?.title ?? "", "i") })
    );

    expect(screen.getByTestId("project-text").dataset.projectId).toBe(
      String(secondProject?.id)
    );
    expect(screen.getByTestId("project-text").textContent).toBe(
      secondProject?.title
    );
    expect(screen.getByText("02 active")).toBeTruthy();
    expect(
      screen
        .getByRole("tab", { name: /tornado-vis/i })
        .getAttribute("aria-selected")
    ).toBe("true");
  });

  it("adds the positive-ending headline flourish when the positive ending is selected", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );

    render(<Projects />);

    expect(screen.getByRole("heading", { name: "My Projects!" })).toBeTruthy();
  });

  it("hides the section when the negative ending is active", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "negative",
      })
    );

    const { container } = render(<Projects />);
    const root = container.firstElementChild as HTMLElement | null;

    expect(root).toBeTruthy();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("pointer-events-none");
    expect(root?.className).toContain("invisible");
  });
});
