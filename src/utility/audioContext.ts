let audioContext: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
    console.log("Audio context state:", audioContext.state); // Log audio context state
  }
  return audioContext;
};