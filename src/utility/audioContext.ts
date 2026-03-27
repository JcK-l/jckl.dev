let audioContext: AudioContext | null = null;
const audioBufferCache = new Map<string, Promise<AudioBuffer>>();

export type CachedAudioOptions = {
  gain?: number;
  loop?: boolean;
  playbackRate?: number;
};

export type CachedAudioPlayback = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  ended: Promise<void>;
  stop: () => void;
};

const getAudioContext = (): AudioContext => {
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

const getAudioBuffer = async (url: string): Promise<AudioBuffer> => {
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

export const startCachedAudio = async (
  url: string,
  options: CachedAudioOptions = {}
): Promise<CachedAudioPlayback> => {
  const context = await resumeAudioContext();
  const buffer = await getAudioBuffer(url);
  const source = context.createBufferSource();
  const gainNode = context.createGain();
  let isStopped = false;

  const disconnectNodes = () => {
    try {
      source.disconnect();
    } catch {
      return;
    } finally {
      try {
        gainNode.disconnect();
      } catch {
        return;
      }
    }
  };

  source.buffer = buffer;
  source.loop = options.loop ?? false;

  if (options.playbackRate !== undefined) {
    source.playbackRate.value = options.playbackRate;
  }

  gainNode.gain.value = options.gain ?? 1;
  source.connect(gainNode);
  gainNode.connect(context.destination);

  const ended = new Promise<void>((resolve) => {
    source.onended = () => {
      if (!isStopped) {
        isStopped = true;
        disconnectNodes();
      }

      resolve();
    };
  });

  source.start(0);

  const stop = () => {
    if (isStopped) {
      return;
    }

    isStopped = true;

    try {
      source.stop();
    } catch {
      disconnectNodes();
      return;
    }

    disconnectNodes();
  };

  return {
    context,
    source,
    gainNode,
    ended,
    stop,
  };
};

export const playCachedAudio = async (
  url: string,
  options: CachedAudioOptions = {}
): Promise<void> => {
  const playback = await startCachedAudio(url, options);

  void playback.ended;
};
