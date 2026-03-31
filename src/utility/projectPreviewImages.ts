import { projects } from "../data/ProjectData";
import type { PreloadImageDescriptor } from "./preloadImages";

const PROJECT_PREVIEW_VARIANT_WIDTHS = [640, 960] as const;

export const PROJECT_PREVIEW_IMAGE_SIZES =
  "(min-width: 1280px) 56vw, (min-width: 768px) calc(100vw - 8rem), calc(100vw - 4.5rem)";

type ProjectPreviewMetadata = {
  height: number;
  width: number;
};

export type ProjectPreviewFrame = PreloadImageDescriptor & {
  fullSizeSrc: string;
};

const projectPreviewMetadataByFolder = new Map<string, ProjectPreviewMetadata>(
  projects.flatMap((project) => {
    if (
      project.imageFolder == null ||
      project.previewImageWidth == null ||
      project.previewImageHeight == null
    ) {
      return [];
    }

    return [
      [
        project.imageFolder,
        {
          height: project.previewImageHeight,
          width: project.previewImageWidth,
        },
      ] as const,
    ];
  })
);

const normalizeProjectImageFolder = (imageFolder: string) =>
  imageFolder.replace(/^\/+/, "");

const getProjectPreviewVariantSource = ({
  frameNumber,
  imageFolder,
  width,
}: {
  frameNumber: number;
  imageFolder: string;
  width: number;
}) =>
  `/generated/project-previews/${normalizeProjectImageFolder(
    imageFolder
  )}/${frameNumber}-${width}.avif`;

export const getProjectPreviewOriginalSource = ({
  frameNumber,
  imageFolder,
}: {
  frameNumber: number;
  imageFolder: string;
}) => `${imageFolder}/${frameNumber}.avif`;

export const getProjectPreviewFrame = ({
  frameNumber,
  imageFolder,
}: {
  frameNumber: number;
  imageFolder: string;
}): ProjectPreviewFrame => {
  const fullSizeSrc = getProjectPreviewOriginalSource({
    frameNumber,
    imageFolder,
  });
  const metadata = projectPreviewMetadataByFolder.get(imageFolder);

  if (metadata == null) {
    return {
      fullSizeSrc,
      src: fullSizeSrc,
    };
  }

  const responsiveVariantWidths = PROJECT_PREVIEW_VARIANT_WIDTHS.filter(
    (width) => width < metadata.width
  );

  if (!responsiveVariantWidths.length) {
    return {
      fullSizeSrc,
      src: fullSizeSrc,
    };
  }

  return {
    fullSizeSrc,
    sizes: PROJECT_PREVIEW_IMAGE_SIZES,
    src: getProjectPreviewVariantSource({
      frameNumber,
      imageFolder,
      width: responsiveVariantWidths.at(-1) ?? metadata.width,
    }),
    srcSet: [
      ...responsiveVariantWidths.map((width) => {
        return `${getProjectPreviewVariantSource({
          frameNumber,
          imageFolder,
          width,
        })} ${width}w`;
      }),
      `${fullSizeSrc} ${metadata.width}w`,
    ].join(", "),
  };
};

export const getProjectPreviewFrames = ({
  imageFolder,
  numberImages,
}: {
  imageFolder: string;
  numberImages: number;
}) => {
  return Array.from({ length: numberImages }, (_, index) =>
    getProjectPreviewFrame({
      frameNumber: index + 1,
      imageFolder,
    })
  );
};
