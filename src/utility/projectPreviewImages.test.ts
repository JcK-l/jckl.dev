import { describe, expect, it } from "vitest";
import {
  PROJECT_PREVIEW_IMAGE_SIZES,
  getProjectPreviewFrame,
  getProjectPreviewFrames,
} from "./projectPreviewImages";

describe("projectPreviewImages", () => {
  it("builds a responsive reel source for known project media", () => {
    expect(
      getProjectPreviewFrame({
        frameNumber: 1,
        imageFolder: "/tornado-vis",
      })
    ).toEqual({
      fullSizeSrc: "/tornado-vis/1.avif",
      sizes: PROJECT_PREVIEW_IMAGE_SIZES,
      src: "/generated/project-previews/tornado-vis/1-960.avif",
      srcSet:
        "/generated/project-previews/tornado-vis/1-640.avif 640w, /generated/project-previews/tornado-vis/1-960.avif 960w, /tornado-vis/1.avif 1500w",
    });
  });

  it("falls back to the original asset when no project preview metadata exists", () => {
    expect(
      getProjectPreviewFrame({
        frameNumber: 1,
        imageFolder: "/projects/unknown",
      })
    ).toEqual({
      fullSizeSrc: "/projects/unknown/1.avif",
      src: "/projects/unknown/1.avif",
    });
  });

  it("returns all reel frames for a project", () => {
    expect(
      getProjectPreviewFrames({
        imageFolder: "/homework-latex",
        numberImages: 2,
      })
    ).toEqual([
      {
        fullSizeSrc: "/homework-latex/1.avif",
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/homework-latex/1-960.avif",
        srcSet:
          "/generated/project-previews/homework-latex/1-640.avif 640w, /generated/project-previews/homework-latex/1-960.avif 960w, /homework-latex/1.avif 1200w",
      },
      {
        fullSizeSrc: "/homework-latex/2.avif",
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/homework-latex/2-960.avif",
        srcSet:
          "/generated/project-previews/homework-latex/2-640.avif 640w, /generated/project-previews/homework-latex/2-960.avif 960w, /homework-latex/2.avif 1200w",
      },
    ]);
  });
});
