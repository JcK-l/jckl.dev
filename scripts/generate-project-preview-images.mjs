import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PUBLIC_DIR = path.resolve("public");
const PROJECT_DATA_FILE = path.resolve("src", "data", "ProjectData.tsx");
const GENERATED_DIR = path.resolve("public", "generated", "project-previews");
const PROJECT_FRAME_PATTERN = /^(\d+)\.avif$/i;
const PROJECT_PREVIEW_VARIANT_WIDTHS = [640, 960];
const AVIF_QUALITY = 58;
const AVIF_EFFORT = 6;

const loadSharp = async () => {
  try {
    const { default: sharp } = await import("sharp");
    return sharp;
  } catch (error) {
    throw new Error(
      "The project preview image generator requires the `sharp` package to be available in node_modules.",
      { cause: error }
    );
  }
};

const ensureParentDirectory = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const getConfiguredProjectPreviewFolderNames = async () => {
  const projectDataSource = await fs.readFile(PROJECT_DATA_FILE, "utf8");
  const projectPreviewFolderNames = new Set();

  for (const match of projectDataSource.matchAll(
    /imageFolder:\s*"\/([^"]+)"/g
  )) {
    const folderName = match[1];

    if (folderName) {
      projectPreviewFolderNames.add(folderName);
    }
  }

  return [...projectPreviewFolderNames];
};

const getProjectPreviewFolders = async () => {
  const projectFolders = [];
  const configuredProjectPreviewFolderNames =
    await getConfiguredProjectPreviewFolderNames();

  for (const folderName of configuredProjectPreviewFolderNames) {
    const folderPath = path.join(PUBLIC_DIR, folderName);
    const folderEntries = await fs.readdir(folderPath, { withFileTypes: true });
    const frameNames = folderEntries
      .filter((folderEntry) => {
        return (
          folderEntry.isFile() && PROJECT_FRAME_PATTERN.test(folderEntry.name)
        );
      })
      .map((folderEntry) => folderEntry.name)
      .sort((leftFrameName, rightFrameName) => {
        return (
          Number.parseInt(leftFrameName, 10) -
          Number.parseInt(rightFrameName, 10)
        );
      });

    if (frameNames.length > 0) {
      projectFolders.push({
        frameNames,
        name: folderName,
      });
    }
  }

  return projectFolders;
};

const main = async () => {
  const sharp = await loadSharp();
  const projectFolders = await getProjectPreviewFolders();
  let generatedVariantCount = 0;

  for (const folder of projectFolders) {
    for (const frameName of folder.frameNames) {
      const frameId = path.parse(frameName).name;
      const sourceImagePath = path.join(PUBLIC_DIR, folder.name, frameName);
      const sourceBuffer = await fs.readFile(sourceImagePath);
      const metadata = await sharp(sourceBuffer).metadata();

      if (!metadata.width) {
        throw new Error(`Could not read width from ${sourceImagePath}`);
      }

      for (const width of PROJECT_PREVIEW_VARIANT_WIDTHS) {
        if (width >= metadata.width) {
          continue;
        }

        const outputPath = path.join(
          GENERATED_DIR,
          folder.name,
          `${frameId}-${width}.avif`
        );

        await ensureParentDirectory(outputPath);
        await sharp(sourceBuffer)
          .resize({
            width,
            withoutEnlargement: true,
          })
          .avif({
            effort: AVIF_EFFORT,
            quality: AVIF_QUALITY,
          })
          .toFile(outputPath);

        generatedVariantCount += 1;
      }
    }
  }

  console.log(
    `Generated ${generatedVariantCount} project preview variants across ${projectFolders.length} project folders.`
  );
  console.log(
    `Output directory: ${path.relative(process.cwd(), GENERATED_DIR)}`
  );
};

await main();
