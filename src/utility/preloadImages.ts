export type PreloadImageDescriptor = {
  sizes?: string;
  src: string;
  srcSet?: string;
};

export type PreloadImageSource = string | PreloadImageDescriptor;

const imageReadyCache = new Map<string, Promise<void>>();

const resolveImageDescriptor = (
  source: PreloadImageSource
): PreloadImageDescriptor => {
  return typeof source === "string" ? { src: source } : source;
};

const getImageReadyCacheKey = (source: PreloadImageSource) => {
  const descriptor = resolveImageDescriptor(source);

  return [descriptor.src, descriptor.srcSet ?? "", descriptor.sizes ?? ""].join(
    "|"
  );
};

const preloadImage = (source: PreloadImageSource) => {
  const descriptor = resolveImageDescriptor(source);
  const cacheKey = getImageReadyCacheKey(source);
  const cachedPromise = imageReadyCache.get(cacheKey);

  if (cachedPromise) {
    return cachedPromise;
  }

  const imageReadyPromise = new Promise<void>((resolve) => {
    const image = new Image();
    let isSettled = false;

    const resolveOnce = () => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      resolve();
    };

    const decodeImage = () => {
      if (typeof image.decode !== "function") {
        resolveOnce();
        return;
      }

      image
        .decode()
        .catch(() => undefined)
        .finally(resolveOnce);
    };

    image.onload = () => {
      decodeImage();
    };
    image.onerror = () => {
      resolveOnce();
    };
    image.sizes = descriptor.sizes ?? "";
    image.srcset = descriptor.srcSet ?? "";
    image.src = descriptor.src;

    if (image.complete && image.naturalWidth > 0) {
      decodeImage();
    }
  });

  imageReadyCache.set(cacheKey, imageReadyPromise);

  return imageReadyPromise;
};

export const preloadImages = (sources: PreloadImageSource[]) =>
  Promise.all(sources.map((src) => preloadImage(src)));
