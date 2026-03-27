const pieceImageReadyCache = new Map<string, Promise<void>>();

const preloadPieceImage = (src: string) => {
  const cachedPromise = pieceImageReadyCache.get(src);

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
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      decodeImage();
    }
  });

  pieceImageReadyCache.set(src, imageReadyPromise);

  return imageReadyPromise;
};

export const preloadPieceImages = (sources: string[]) =>
  Promise.all(sources.map((src) => preloadPieceImage(src)));
