let audioContext: AudioContext | null = null;
const audioBufferCache = new Map<string, Promise<AudioBuffer>>();

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

export const resumeAudioContext = async (): Promise<AudioContext> => {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  return context;
};

export const getAudioBuffer = async (url: string): Promise<AudioBuffer> => {
  const cachedBuffer = audioBufferCache.get(url);

  if (cachedBuffer) {
    return cachedBuffer;
  }

  const bufferPromise = (async () => {
    const context = getAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    return await context.decodeAudioData(arrayBuffer);
  })();

  audioBufferCache.set(url, bufferPromise);

  return bufferPromise;
};

export const preloadAudioBuffers = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map((url) => getAudioBuffer(url)));
};

export const playCachedAudio = async (url: string): Promise<void> => {
  const context = await resumeAudioContext();
  const buffer = await getAudioBuffer(url);
  const source = context.createBufferSource();

  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
};
