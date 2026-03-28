import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockImageInstance = {
  complete: boolean;
  decode?: ReturnType<typeof vi.fn>;
  naturalWidth: number;
  onerror: null | (() => void);
  onload: null | (() => void);
  src: string;
  triggerError: () => void;
  triggerLoad: () => void;
};

const OriginalImage = globalThis.Image;

const setMockImage = ({
  completeOnSrc = false,
  decodeRejects = false,
  hasDecode = true,
  naturalWidth = 100,
} = {}) => {
  const instances: MockImageInstance[] = [];

  class MockImage {
    complete = false;
    decode = hasDecode
      ? vi.fn(() =>
          decodeRejects ? Promise.reject(new Error("decode failed")) : Promise.resolve()
        )
      : undefined;
    naturalWidth = 0;
    onerror: null | (() => void) = null;
    onload: null | (() => void) = null;
    private _src = "";

    constructor() {
      instances.push(this as unknown as MockImageInstance);
    }

    get src() {
      return this._src;
    }

    set src(value: string) {
      this._src = value;

      if (completeOnSrc) {
        this.complete = true;
        this.naturalWidth = naturalWidth;
      }
    }

    triggerError = () => {
      this.onerror?.();
    };

    triggerLoad = () => {
      this.onload?.();
    };
  }

  Object.defineProperty(globalThis, "Image", {
    configurable: true,
    writable: true,
    value: MockImage,
  });

  return instances;
};

describe("pieceImages", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "Image", {
      configurable: true,
      writable: true,
      value: OriginalImage,
    });
  });

  it("caches duplicate sources and resolves after the image decodes", async () => {
    const instances = setMockImage();
    const { preloadPieceImages } = await import("./pieceImages");

    const preloadPromise = preloadPieceImages(["/piece-a.avif", "/piece-a.avif"]);

    expect(instances.length).toBe(1);

    instances[0]?.triggerLoad();
    await preloadPromise;

    expect(instances[0]?.decode).toHaveBeenCalledTimes(1);
  });

  it("resolves when an image errors", async () => {
    const instances = setMockImage({ hasDecode: false });
    const { preloadPieceImages } = await import("./pieceImages");

    const preloadPromise = preloadPieceImages(["/piece-b.avif"]);

    instances[0]?.triggerError();

    await expect(preloadPromise).resolves.toEqual([undefined]);
  });

  it("resolves already-complete images immediately even if decode rejects", async () => {
    const instances = setMockImage({ completeOnSrc: true, decodeRejects: true });
    const { preloadPieceImages } = await import("./pieceImages");

    await expect(preloadPieceImages(["/piece-c.avif"])).resolves.toEqual([
      undefined,
    ]);
    expect(instances[0]?.decode).toHaveBeenCalledTimes(1);
  });
});
