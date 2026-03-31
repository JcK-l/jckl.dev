// @vitest-environment jsdom

import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { projects } from "../../data/ProjectData";
import { $endingState } from "../../stores/endingStore";
import { createDefaultEndingState } from "../../test/factories";

vi.mock("../ProjectText", () => ({
  ProjectText: ({
    mobileNavigator,
    onMobileOverviewSwipe,
    projectId,
    title,
    totalProjects,
  }: {
    mobileNavigator?: ReactNode;
    onMobileOverviewSwipe?: (direction: -1 | 1) => void;
    projectId: number;
    title: string;
    totalProjects: number;
  }) => (
    <div>
      <div
        data-testid="project-text"
        data-project-id={String(projectId)}
        data-total-projects={String(totalProjects)}
      >
        {title}
      </div>
      <div
        data-testid="project-overview-swipe-surface"
      >
        <button
          type="button"
          data-testid="project-overview-swipe-prev"
          onClick={() => onMobileOverviewSwipe?.(-1)}
        >
          prev
        </button>
        <button
          type="button"
          data-testid="project-overview-swipe-next"
          onClick={() => onMobileOverviewSwipe?.(1)}
        >
          next
        </button>
      </div>
      {mobileNavigator}
    </div>
  ),
}));

import Projects from "./Projects";

const mockProjectSelectorGeometry = ({
  viewportHeight,
  tabHeight = 76,
}: {
  viewportHeight: number;
  tabHeight?: number;
}) => {
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function () {
      if (
        this instanceof HTMLElement &&
        this.dataset.testid === "project-selector-viewport"
      ) {
        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: viewportHeight,
          width: 320,
          height: viewportHeight,
          toJSON: () => ({}),
        } as DOMRect;
      }

      if (
        this instanceof HTMLElement &&
        this.getAttribute("role") === "tab"
      ) {
        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: tabHeight,
          width: 320,
          height: tabHeight,
          toJSON: () => ({}),
        } as DOMRect;
      }

      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        toJSON: () => ({}),
      } as DOMRect;
    });
};

describe("Projects", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });
  });

  it("defaults to the first project and switches the active desktop route when a tab is selected", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const rectSpy = mockProjectSelectorGeometry({ viewportHeight: 420 });

    render(<Projects />);

    const firstProject = projects[0];
    const secondProject = projects[1];

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: /vulkan-renderer/i })
      ).toBeTruthy();
    });

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

    rectSpy.mockRestore();
  });

  it("shows the mobile project controls on smaller widths without the desktop route pager", async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /show next project routes/i })
      ).toBeNull();
    });

    expect(
      screen.getByRole("button", { name: /show next project/i })
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /show next project/i }));

    expect(screen.getByTestId("project-text").dataset.projectId).toBe("2");
    expect(screen.getByTestId("project-text").textContent).toBe("tornado-vis");
  });

  it("advances the mobile project card on a horizontal swipe", async () => {
    render(<Projects />);

    await screen.findByTestId("project-overview-swipe-surface");

    fireEvent.click(screen.getByTestId("project-overview-swipe-next"));

    expect(screen.getByTestId("project-text").dataset.projectId).toBe("2");
    expect(screen.getByTestId("project-text").textContent).toBe("tornado-vis");
  });

  it("can swipe back to the previous mobile project card", async () => {
    render(<Projects />);

    await screen.findByTestId("project-overview-swipe-surface");

    fireEvent.click(screen.getByTestId("project-overview-swipe-next"));
    expect(screen.getByTestId("project-text").dataset.projectId).toBe("2");
    expect(screen.getByTestId("project-text").textContent).toBe("tornado-vis");

    fireEvent.click(screen.getByTestId("project-overview-swipe-prev"));
    expect(screen.getByTestId("project-text").dataset.projectId).toBe("1");
    expect(screen.getByTestId("project-text").textContent).toBe("vulkan-renderer");
  });

  it("pages the selector rail and loads projects beyond the first desktop route bank", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const rectSpy = mockProjectSelectorGeometry({ viewportHeight: 420 });

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /show next project routes/i })
      ).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /show next project routes/i })
    );

    expect(
      screen.getByRole("tab", { name: /jckl\.dev/i }).getAttribute("aria-selected")
    ).toBe("true");
    expect(screen.getByTestId("project-text").dataset.projectId).toBe("6");
    expect(screen.getByTestId("project-text").textContent).toBe("jckl.dev");

    rectSpy.mockRestore();
  });

  it("shows more than five desktop routes when the selector height can fit them", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const rectSpy = mockProjectSelectorGeometry({ viewportHeight: 560 });

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /jckl\.dev/i })).toBeTruthy();
    });

    expect(screen.queryByRole("tab", { name: /online-chess/i })).toBeNull();
    expect(
      screen.getByRole("button", { name: /show next project routes/i })
    ).toBeTruthy();

    rectSpy.mockRestore();
  });

  it("keeps a later route paged out when the measured selector cards are taller than the fallback estimate", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const rectSpy = mockProjectSelectorGeometry({
      viewportHeight: 500,
      tabHeight: 84,
    });

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /show next project routes/i })
      ).toBeTruthy();
    });

    expect(screen.queryByRole("tab", { name: /jckl\.dev/i })).toBeNull();
    expect(screen.queryByRole("tab", { name: /online-chess/i })).toBeNull();

    rectSpy.mockRestore();
  });

  it("can load the appended online chess project from the later desktop route bank", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const rectSpy = mockProjectSelectorGeometry({ viewportHeight: 420 });

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /show next project routes/i })
      ).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /show next project routes/i })
    );
    expect(screen.queryByRole("tab", { name: /homework-latex/i })).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: /online-chess/i }));

    expect(screen.getByTestId("project-text").dataset.projectId).toBe("7");
    expect(screen.getByTestId("project-text").textContent).toBe("online-chess");

    rectSpy.mockRestore();
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
