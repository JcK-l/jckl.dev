import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SOURCE_IMAGE = path.resolve("public", "MeTransparent-xl.avif");
const HERO_VARIANTS = [
  { width: 360, output: path.resolve("public", "MeTransparent-360.avif") },
  { width: 600, output: path.resolve("public", "MeTransparent-600.avif") },
  { width: 720, output: path.resolve("public", "MeTransparent-720.avif") },
  { width: 1000, output: path.resolve("public", "MeTransparent-md.avif") },
  { width: 1200, output: path.resolve("public", "MeTransparent-1200.avif") },
  { width: 1600, output: path.resolve("public", "MeTransparent-1600.avif") },
  { width: 2000, output: path.resolve("public", "MeTransparent-xl.avif") },
];
const AVIF_QUALITY = 58;
const AVIF_EFFORT = 6;

const loadSharp = async () => {
  try {
    const { default: sharp } = await import("sharp");
    return sharp;
  } catch (error) {
    throw new Error(
      "The hero image generator requires the `sharp` package to be available in node_modules.",
      { cause: error }
    );
  }
};

const ensureParentDirectory = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const main = async () => {
  const sharp = await loadSharp();
  const sourceBuffer = await fs.readFile(SOURCE_IMAGE);
  const metadata = await sharp(sourceBuffer).metadata();

  if (!metadata.width) {
    throw new Error(`Could not read width from ${SOURCE_IMAGE}`);
  }

  for (const variant of HERO_VARIANTS) {
    if (variant.width > metadata.width) {
      throw new Error(
        `Variant ${variant.width}w exceeds source width ${metadata.width}w.`
      );
    }
  }

  await Promise.all(
    HERO_VARIANTS.map(async (variant) => {
      await ensureParentDirectory(variant.output);

      await sharp(sourceBuffer)
        .resize({
          width: variant.width,
          withoutEnlargement: true,
        })
        .avif({
          quality: AVIF_QUALITY,
          effort: AVIF_EFFORT,
        })
        .toFile(variant.output);
    })
  );

  const relativeSource = path.relative(process.cwd(), SOURCE_IMAGE);
  const srcSet = HERO_VARIANTS.map(
    ({ width, output }) => `/${path.relative("public", output).replaceAll("\\", "/")} ${width}w`
  ).join(", ");

  console.log(`Generated ${HERO_VARIANTS.length} hero variants from ${relativeSource}`);
  console.log(`srcset: ${srcSet}`);
};

await main();
