import { describe, expect, it } from "vitest";
import { projects } from "../data/ProjectData";
import {
  getProjectPreviewImageSources,
  getProjectPreviewPrefetchSources,
} from "./projectPreviewSources";
import { PROJECT_PREVIEW_IMAGE_SIZES } from "./projectPreviewImages";

describe("projectPreviewSources", () => {
  it("returns lead preview frames for a project with media", () => {
    expect(getProjectPreviewImageSources(projects[0], 2)).toEqual([
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/vulkan-renderer/1-960.avif",
        srcSet:
          "/generated/project-previews/vulkan-renderer/1-640.avif 640w, /generated/project-previews/vulkan-renderer/1-960.avif 960w, /vulkan-renderer/1.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/vulkan-renderer/2-960.avif",
        srcSet:
          "/generated/project-previews/vulkan-renderer/2-640.avif 640w, /generated/project-previews/vulkan-renderer/2-960.avif 960w, /vulkan-renderer/2.avif 1500w",
      },
    ]);
  });

  it("skips projects without preview media", () => {
    expect(getProjectPreviewImageSources(projects[6], 2)).toEqual([]);
  });

  it("preloads the active lead frames and visible desktop first frames", () => {
    expect(
      getProjectPreviewPrefetchSources({
        activeProjectIndex: 1,
        isDesktopLayout: true,
        projects,
        visibleProjects: projects.slice(0, 3),
      })
    ).toEqual([
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/tornado-vis/1-960.avif",
        srcSet:
          "/generated/project-previews/tornado-vis/1-640.avif 640w, /generated/project-previews/tornado-vis/1-960.avif 960w, /tornado-vis/1.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/tornado-vis/2-960.avif",
        srcSet:
          "/generated/project-previews/tornado-vis/2-640.avif 640w, /generated/project-previews/tornado-vis/2-960.avif 960w, /tornado-vis/2.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/tornado-vis/3-960.avif",
        srcSet:
          "/generated/project-previews/tornado-vis/3-640.avif 640w, /generated/project-previews/tornado-vis/3-960.avif 960w, /tornado-vis/3.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/vulkan-renderer/1-960.avif",
        srcSet:
          "/generated/project-previews/vulkan-renderer/1-640.avif 640w, /generated/project-previews/vulkan-renderer/1-960.avif 960w, /vulkan-renderer/1.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/proud-detectives/1-960.avif",
        srcSet:
          "/generated/project-previews/proud-detectives/1-640.avif 640w, /generated/project-previews/proud-detectives/1-960.avif 960w, /proud-detectives/1.avif 1500w",
      },
    ]);
  });

  it("preloads the active lead frames and adjacent mobile first frames", () => {
    expect(
      getProjectPreviewPrefetchSources({
        activeProjectIndex: 4,
        isDesktopLayout: false,
        projects,
        visibleProjects: [projects[4]!],
      })
    ).toEqual([
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/homework-latex/1-960.avif",
        srcSet:
          "/generated/project-previews/homework-latex/1-640.avif 640w, /generated/project-previews/homework-latex/1-960.avif 960w, /homework-latex/1.avif 1200w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/homework-latex/2-960.avif",
        srcSet:
          "/generated/project-previews/homework-latex/2-640.avif 640w, /generated/project-previews/homework-latex/2-960.avif 960w, /homework-latex/2.avif 1200w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/simple-lights/1-960.avif",
        srcSet:
          "/generated/project-previews/simple-lights/1-640.avif 640w, /generated/project-previews/simple-lights/1-960.avif 960w, /simple-lights/1.avif 1500w",
      },
      {
        sizes: PROJECT_PREVIEW_IMAGE_SIZES,
        src: "/generated/project-previews/jckl-website/1-960.avif",
        srcSet:
          "/generated/project-previews/jckl-website/1-640.avif 640w, /generated/project-previews/jckl-website/1-960.avif 960w, /jckl-website/1.avif 1000w",
      },
    ]);
  });
});
