import type { Project } from "../data/ProjectData";
import type { PreloadImageDescriptor } from "./preloadImages";
import { getProjectPreviewFrame } from "./projectPreviewImages";

const ACTIVE_PROJECT_LEAD_FRAME_COUNT = 3;
const ADJACENT_PROJECT_LEAD_FRAME_COUNT = 1;

const dedupeSources = (sources: PreloadImageDescriptor[]) => {
  return sources.filter((source, index, allSources) => {
    return (
      allSources.findIndex((candidateSource) => {
        return candidateSource.src === source.src;
      }) === index
    );
  });
};

export const getProjectPreviewImageSources = (
  project: Pick<Project, "imageFolder" | "numberImages"> | undefined,
  frameCount = ADJACENT_PROJECT_LEAD_FRAME_COUNT
) => {
  const imageFolder = project?.imageFolder;
  const numberImages = project?.numberImages ?? 0;

  if (!imageFolder || numberImages === 0) {
    return [];
  }

  return Array.from(
    { length: Math.min(numberImages, frameCount) },
    (_, index) => {
      const { fullSizeSrc: fullSizeSource, ...frameSource } =
        getProjectPreviewFrame({
          frameNumber: index + 1,
          imageFolder,
        });

      void fullSizeSource;

      return frameSource;
    }
  );
};

export const getProjectPreviewPrefetchSources = ({
  activeProjectIndex,
  isDesktopLayout,
  projects,
  visibleProjects,
}: {
  activeProjectIndex: number;
  isDesktopLayout: boolean;
  projects: Project[];
  visibleProjects: Project[];
}) => {
  const activeProject = projects[activeProjectIndex];
  const adjacentProjects = isDesktopLayout
    ? visibleProjects
    : [
        projects[activeProjectIndex - 1],
        projects[activeProjectIndex + 1],
      ].filter((project): project is Project => project != null);

  return dedupeSources([
    ...getProjectPreviewImageSources(
      activeProject,
      ACTIVE_PROJECT_LEAD_FRAME_COUNT
    ),
    ...adjacentProjects.flatMap((project) =>
      getProjectPreviewImageSources(project)
    ),
  ]);
};
