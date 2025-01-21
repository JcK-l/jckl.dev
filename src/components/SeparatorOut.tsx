import { forwardRef, useState } from "react";
import { crtImage, crtScreen } from "../data/crtImage";
import {
  GameStateFlags,
  isBitSet as gameStateIsBitSet,
  setBit,
} from "../stores/gameStateStore";
import {
  SentimentStateFlags,
  isBitSet as sentimentStateIsBitSet,
} from "../stores/sentimentStateStore";
import { getAudioContext } from "../utility/audioContext";

interface SeparatorOutProps {
  isCrt?: boolean;
}

export const SeparatorOut = forwardRef<HTMLDivElement, SeparatorOutProps>(
  (props, ref) => {
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);

    const displayCrt =
      props.isCrt &&
      gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND) &&
      !(
        (sentimentStateIsBitSet(SentimentStateFlags.FLAG_POSITIVE) ||
          sentimentStateIsBitSet(SentimentStateFlags.FLAG_NEUTRAL)) &&
        sentimentStateIsBitSet(SentimentStateFlags.FLAG_ACTIVE)
      );

    const playSound = async (file: string) => {
      const audioContext = getAudioContext();
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      let gainNode: GainNode;
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0.25;
      gainNode.connect(audioContext.destination);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNode);
      source.start(0);
      return new Promise<void>((resolve) => {
        source.onended = () => {
          resolve();
        };
      });
    };

    return (
      <div className="relative" ref={ref}>
        <svg
          className="relative z-10"
          viewBox="0 0 960 279.177"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            style={{
              fill: "var(--color-secondary)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
              opacity: 1,
            }}
            pointerEvents="none"
            d="m 0,12.653452 26.7,23.80001 c 26.6,23.90002 80,71.500048 133.3,85.900058 53.29999,14.30001 106.69999,-4.7 160,-33.700018 53.3,-29.00002 106.69999,-68.00005 160,-82.2000598 53.29999,-14.1000101 106.7,-3.5 160,16.4000098 53.29999,19.80002 106.7,48.80004 160,49.50004 53.29999,0.6 106.7,-27.00002 133.30001,-40.90003 l 26.7,-13.80001 V 230.6536 h -26.7 c -26.60001,0 -80.00001,0 -133.30001,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -133.3,0 H 0 Z"
          />
          <path
            style={{
              fill: "var(--color-transition1)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
              opacity: 1,
            }}
            pointerEvents="none"
            d="m 1e-5,119.16224 26.7,-13.00001 c 26.6,-13.000008 80,-39.000028 133.3,-59.000038 53.3,-20.00001 106.7,-34.00002 160,-11.50001 53.3,22.50002 106.7,81.500058 160,96.200068 53.3,14.60001 106.7,-15.00001 160,-45.200028 53.3,-30.20002 106.7,-60.80004 160,-59.70004 53.3,1.2 106.7,34.20002 133.3,50.70003 l 26.7,16.50001 V 251.16233 h -26.7 c -26.6,0 -80,0 -133.3,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -160,0 -53.3,0 -106.7,0 -133.3,0 h -26.7 z"
          />
          {displayCrt && (
            <svg
              cursor={`${
                (gameStateIsBitSet(GameStateFlags.FLAG_CRT) || isSoundPlaying)
                  ? "default"
                  : "pointer"
              }`}
              onClick={async () => {
                if (isSoundPlaying || sentimentStateIsBitSet(SentimentStateFlags.FLAG_ACTIVE)) return;

                setIsSoundPlaying(true);
                if (
                  gameStateIsBitSet(GameStateFlags.FLAG_STARS_ALIGN) &&
                  gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND) &&
                  gameStateIsBitSet(GameStateFlags.FLAG_CONNECTION)
                ) {
                  setBit(GameStateFlags.FLAG_CRT);
                  await playSound("/tvSounds/on.mp3");
                } else {
                  await playSound("/tvSounds/onAndOff.mp3");
                }
                setIsSoundPlaying(false);
              }}
              viewBox="0 0 960 279.177"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs id="defs1" />
              <g
                id="layer1"
                transform="matrix(0.72152775,-0.06209045,0.06209045,0.72152775,479.11345,-77.145299)"
              >
                <image
                  width="176.3889"
                  height="132.29167"
                  preserveAspectRatio="none"
                  xlinkHref={crtImage}
                  id="tv"
                  x="14.018737"
                  y="123.32362"
                />
                <image
                  width="123.47222"
                  height="97.013885"
                  preserveAspectRatio="none"
                  opacity={gameStateIsBitSet(GameStateFlags.FLAG_CRT) ? 1 : 0}
                  xlinkHref={crtScreen}
                  id="screen"
                  x="26.629618"
                  y="136.32681"
                />
              </g>
            </svg>
          )}
          <path
            style={{
              fill: "var(--color-transition2)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
              opacity: 1,
            }}
            d="m 960,88.493822 -20,9.5 c -20,9.500008 -60,28.500028 -100,37.500028 -40,9.00001 -80,8.00001 -120,-3.5 -40,-11.50001 -80,-33.50003 -120,-46.000028 -40,-12.50001 -80,-15.50001 -120,5.2 -40,20.600018 -80,65.000048 -120,80.600058 -40,15.70001 -80,2.7 -120,-12.30001 C 200,144.49386 160,127.49385 120,115.69384 80,103.79383 40,97.193822 20,93.793822 l -20,-3.3 V 272.49395 h 20 c 20,0 60,0 100,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 100,0 h 20 z"
          />
        </svg>

        <svg
          viewBox="0 0 960 279.177"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-1 z-20"
          pointerEvents="none"
        >
          <path
            style={{
              fill: "var(--color-fg-color)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
            }}
            d="m 0,162.17692 17.8,7.50001 c 17.9,7.5 53.5,22.50001 89,15.50001 35.5,-7.00001 70.9,-36.00003 106.4,-49.80004 35.5,-13.90001 71.1,-12.50001 106.8,0.8 35.7,13.30001 71.3,38.70003 106.8,54.80004 35.5,16.20001 70.9,23.20002 106.4,16.00001 35.5,-7.1 71.1,-28.50002 106.8,-47.10003 35.7,-18.70001 71.3,-34.70002 106.8,-42.20003 35.5,-7.50001 70.9,-6.5 106.4,7.70001 35.5,14.1 71.1,41.50002 89,55.10003 L 960,194.17694 V 279.177 h -17.8 c -17.9,0 -53.5,0 -89,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -106.8,0 -35.7,0 -71.3,0 -106.8,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -106.8,0 -35.7,0 -71.3,0 -106.8,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -89,0 H 0 Z"
          />
        </svg>
      </div>
    );
  }
);
