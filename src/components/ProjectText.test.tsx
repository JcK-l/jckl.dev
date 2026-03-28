// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./Carousel", () => ({
  Carousel: ({
    imageFolder,
    numberImages,
  }: {
    imageFolder: string;
    numberImages: number;
  }) => (
    <div
      data-testid="carousel"
      data-image-folder={imageFolder}
      data-number-images={String(numberImages)}
    />
  ),
}));

import { ProjectText } from "./ProjectText";

describe("ProjectText", () => {
  it("renders project metadata, preview carousel, and only the provided links", () => {
    render(
      <ProjectText
        projectId={2}
        totalProjects={12}
        title="Signal Decoder"
        description="Decodes a noisy input stream into readable output."
        imageFolder="/projects/signal-decoder"
        numberImages={4}
        githubLink="https://github.com/example/signal-decoder"
        demoLink="https://example.com/signal-decoder"
      />
    );

    expect(screen.getByText("Project Module 02")).toBeTruthy();
    expect(screen.getByText("02 / 12")).toBeTruthy();
    expect(screen.getByText("04 frames")).toBeTruthy();
    expect(screen.getByText("Signal Decoder")).toBeTruthy();
    expect(
      screen.getByText("Decodes a noisy input stream into readable output.")
    ).toBeTruthy();

    const carousel = screen.getByTestId("carousel");
    expect(carousel.dataset.imageFolder).toBe("/projects/signal-decoder");
    expect(carousel.dataset.numberImages).toBe("4");

    expect(screen.getByRole("link", { name: /repo/i }).getAttribute("href")).toBe(
      "https://github.com/example/signal-decoder"
    );
    expect(screen.getByRole("link", { name: /demo/i }).getAttribute("href")).toBe(
      "https://example.com/signal-decoder"
    );
    expect(screen.queryByRole("link", { name: /video/i })).toBeNull();
  });

  it("shows the offline fallback when no preview assets are available", () => {
    render(
      <ProjectText
        projectId={1}
        totalProjects={3}
        title="Offline Archive"
        description="A placeholder module with no media attached."
      />
    );

    expect(screen.getByText("Project Module 01")).toBeTruthy();
    expect(screen.getByText("01 / 03")).toBeTruthy();
    expect(screen.getByText("no frames")).toBeTruthy();
    expect(screen.getByText("Preview offline")).toBeTruthy();
    expect(screen.queryByTestId("carousel")).toBeNull();
    expect(screen.queryAllByRole("link").length).toBe(0);
  });
});
