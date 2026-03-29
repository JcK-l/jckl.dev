import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getContrastRatio } from "../utility/colorContrast";
import { themeDefinitions, Themes } from "../utility/toggleTheme";

type ContrastPair = {
  foreground: string;
  background: string;
  label: string;
  minimumRatio: number;
};

const themeStyles = readFileSync(new URL("./themes.css", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const extractCssBlock = (selector: string) => {
  const blockMatch = themeStyles.match(
    new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`, "m"),
  );

  if (!blockMatch?.[1]) {
    throw new Error(`Could not find the CSS block for selector: ${selector}`);
  }

  return blockMatch[1];
};

const extractColorTokens = (cssBlock: string) => {
  const tokenPattern = /--([\w-]+):\s*(#[0-9A-Fa-f]{3,6});/g;
  const tokens = new Map<string, string>();

  for (const match of cssBlock.matchAll(tokenPattern)) {
    const [, tokenName, tokenValue] = match;

    if (!tokenName || !tokenValue) {
      continue;
    }

    tokens.set(tokenName, tokenValue);
  }

  return tokens;
};

const rootThemeTokens = extractColorTokens(extractCssBlock(":root"));

const runtimeThemeTokens = new Map(
  Object.values(Themes).map((theme) => {
    if (theme === Themes.ORIGINAL) {
      return [theme, rootThemeTokens] as const;
    }

    return [
      theme,
      extractColorTokens(
        extractCssBlock(
          `:root[data-theme="${themeDefinitions[theme].dataValue}"]`,
        ),
      ),
    ] as const;
  }),
);

const getThemeColor = (tokenName: string) => {
  const value = rootThemeTokens.get(tokenName);

  if (!value) {
    throw new Error(`Theme color token not found in :root: ${tokenName}`);
  }

  return value;
};

const getRuntimeThemeColor = (theme: Themes, tokenName: string) => {
  const themeTokens = runtimeThemeTokens.get(theme);

  if (!themeTokens) {
    throw new Error(`Runtime theme token map not found: ${theme}`);
  }

  const value = themeTokens.get(tokenName);

  if (!value) {
    throw new Error(`Runtime theme color token not found: ${theme} ${tokenName}`);
  }

  return value;
};

const contrastPairs: ContrastPair[] = [
  {
    label: "appliance eyebrow on shell top",
    foreground: "color-appliance-label",
    background: "color-appliance-shell-surface",
    minimumRatio: 4.5,
  },
  {
    label: "appliance subtitle on shell top",
    foreground: "color-appliance-label-soft",
    background: "color-appliance-shell-surface",
    minimumRatio: 4.5,
  },
  {
    label: "appliance heading on inset panel",
    foreground: "color-appliance-label-soft",
    background: "color-appliance-control-surface",
    minimumRatio: 4.5,
  },
  {
    label: "appliance label on control panel",
    foreground: "color-appliance-label",
    background: "color-appliance-control-surface",
    minimumRatio: 4.5,
  },
  {
    label: "appliance body copy on control panel",
    foreground: "color-appliance-copy",
    background: "color-appliance-control-surface",
    minimumRatio: 4.5,
  },
  {
    label: "appliance primary action on control panel",
    foreground: "color-primary",
    background: "color-appliance-control-surface",
    minimumRatio: 4.5,
  },
  {
    label: "terminal primary text on screen",
    foreground: "color-appliance-screen-text",
    background: "color-appliance-screen-bg",
    minimumRatio: 4.5,
  },
  {
    label: "terminal muted text on screen",
    foreground: "color-appliance-screen-muted",
    background: "color-appliance-screen-bg",
    minimumRatio: 4.5,
  },
  {
    label: "terminal success text on screen",
    foreground: "color-appliance-screen-success",
    background: "color-appliance-screen-bg",
    minimumRatio: 4.5,
  },
  {
    label: "terminal failure text on screen",
    foreground: "color-appliance-screen-failure",
    background: "color-appliance-screen-bg",
    minimumRatio: 4.5,
  },
  {
    label: "hint badge text on terminal screen background",
    foreground: "color-appliance-screen-accent-bg",
    background: "color-appliance-screen-bg",
    minimumRatio: 4.5,
  },
];

describe("theme contrast", () => {
  it.each(contrastPairs)(
    "keeps $label at or above a $minimumRatio:1 ratio in the default theme",
    ({ foreground, background, minimumRatio }) => {
      const ratio = getContrastRatio(
        getThemeColor(foreground),
        getThemeColor(background),
      );

      expect(ratio).toBeGreaterThanOrEqual(minimumRatio);
    },
  );

  it.each(
    Object.values(Themes).flatMap((theme) => {
      return contrastPairs.map((pair) => ({
        ...pair,
        theme,
      }));
    }),
  )(
    "keeps $label at or above a $minimumRatio:1 ratio in the $theme palette",
    ({ foreground, background, minimumRatio, theme }) => {
      const ratio = getContrastRatio(
        getRuntimeThemeColor(theme, foreground),
        getRuntimeThemeColor(theme, background),
      );

      expect(ratio).toBeGreaterThanOrEqual(minimumRatio);
    },
  );
});
