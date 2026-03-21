import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ttf2woff2 from "ttf2woff2";

const FONT_SOURCE_DIR = path.resolve("scripts", "font-sources");
const PUBLIC_FONT_DIR = path.resolve("public", "fonts");

const FONT_FILES = [
  {
    input: path.resolve(
      FONT_SOURCE_DIR,
      "Poppins",
      "Poppins-Regular.ttf"
    ),
    output: path.resolve(PUBLIC_FONT_DIR, "Poppins", "Poppins-Regular.woff2"),
  },
  {
    input: path.resolve(FONT_SOURCE_DIR, "Poppins", "Poppins-Bold.ttf"),
    output: path.resolve(PUBLIC_FONT_DIR, "Poppins", "Poppins-Bold.woff2"),
  },
  {
    input: path.resolve(FONT_SOURCE_DIR, "Poppins", "Poppins-ExtraBold.ttf"),
    output: path.resolve(PUBLIC_FONT_DIR, "Poppins", "Poppins-ExtraBold.woff2"),
  },
  {
    input: path.resolve(
      FONT_SOURCE_DIR,
      "Roboto_Mono",
      "RobotoMono-VariableFont_wght.ttf"
    ),
    output: path.resolve(
      PUBLIC_FONT_DIR,
      "Roboto_Mono",
      "RobotoMono-VariableFont_wght.woff2"
    ),
  },
  {
    input: path.resolve(
      FONT_SOURCE_DIR,
      "Roboto_Mono",
      "RobotoMono-Italic-VariableFont_wght.ttf"
    ),
    output: path.resolve(
      PUBLIC_FONT_DIR,
      "Roboto_Mono",
      "RobotoMono-Italic-VariableFont_wght.woff2"
    ),
  },
  {
    input: path.resolve(
      FONT_SOURCE_DIR,
      "Source_Sans_3",
      "SourceSans3-VariableFont_wght.ttf"
    ),
    output: path.resolve(
      PUBLIC_FONT_DIR,
      "Source_Sans_3",
      "SourceSans3-VariableFont_wght.woff2"
    ),
  },
  {
    input: path.resolve(
      FONT_SOURCE_DIR,
      "Source_Sans_3",
      "SourceSans3-Italic-VariableFont_wght.ttf"
    ),
    output: path.resolve(
      PUBLIC_FONT_DIR,
      "Source_Sans_3",
      "SourceSans3-Italic-VariableFont_wght.woff2"
    ),
  },
];

const convertFont = async ({ input, output }) => {
  const fontBuffer = await fs.readFile(input);
  const convertedBuffer = ttf2woff2(fontBuffer);

  await fs.writeFile(output, convertedBuffer);

  return {
    input: path.relative(process.cwd(), input),
    output: path.relative(process.cwd(), output),
  };
};

const main = async () => {
  for (const font of FONT_FILES) {
    const convertedFont = await convertFont(font);
    console.log(`${convertedFont.input} -> ${convertedFont.output}`);
  }
};

await main();
