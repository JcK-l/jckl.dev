export const heroPortraitSizes =
  "(max-width: 639px) 83vw, (max-width: 767px) 75vw, (max-width: 1023px) 67vw, (max-width: 1535px) 50vw, (max-width: 1899px) 42vw, 33vw";

export const heroPortraitVariants = [
  { src: "/MeTransparent-360.avif", width: 360 },
  { src: "/MeTransparent-600.avif", width: 600 },
  { src: "/MeTransparent-720.avif", width: 720 },
  { src: "/MeTransparent-md.avif", width: 1000 },
  { src: "/MeTransparent-1200.avif", width: 1200 },
  { src: "/MeTransparent-1600.avif", width: 1600 },
  { src: "/MeTransparent-xl.avif", width: 2000 },
] as const;

export const heroPortraitSrc = "/MeTransparent-720.avif";
export const heroPortraitSrcSet = heroPortraitVariants
  .map(({ src, width }) => `${src} ${width}w`)
  .join(", ");
