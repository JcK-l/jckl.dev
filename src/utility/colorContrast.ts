const parseHexChannel = (value: string) => {
  return parseInt(value, 16) / 255;
};

const toLinearChannel = (value: number) => {
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
};

export const normalizeHexColor = (color: string) => {
  const hex = color.trim().replace(/^#/, "");

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((channel) => channel + channel)
      .join("")}`;
  }

  if (hex.length === 6) {
    return `#${hex}`;
  }

  throw new Error(`Unsupported hex color: ${color}`);
};

export const getRelativeLuminance = (color: string) => {
  const normalizedColor = normalizeHexColor(color).slice(1);
  const [red, green, blue] = normalizedColor.match(/../g) ?? [];

  if (!red || !green || !blue) {
    throw new Error(`Invalid hex color: ${color}`);
  }

  const [linearRed, linearGreen, linearBlue] = [red, green, blue]
    .map(parseHexChannel)
    .map(toLinearChannel);

  return (
    0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue
  );
};

export const getContrastRatio = (
  foregroundColor: string,
  backgroundColor: string,
) => {
  const [lighter, darker] = [
    getRelativeLuminance(foregroundColor),
    getRelativeLuminance(backgroundColor),
  ].sort((left, right) => right - left);

  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsContrastRequirement = (
  foregroundColor: string,
  backgroundColor: string,
  minimumRatio: number,
) => {
  return getContrastRatio(foregroundColor, backgroundColor) >= minimumRatio;
};
