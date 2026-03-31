import {
  forwardRef,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { useStore } from "@nanostores/react";
import { crtImage, crtScreen } from "../data/crtImage";
import {
  $gameState,
  GameStateFlags,
  hasBit,
  setBit,
} from "../stores/gameStateStore";
import { $endingState } from "../stores/endingStore";
import {
  preloadAudioBuffers,
  resumeAudioContext,
  startCachedAudio,
} from "../utility/audioContext";

interface SeparatorOutProps {
  isCrt?: boolean;
  crtScreenOpacity?: number;
  underLayer?: ReactNode;
  middleLayer?: ReactNode;
}

const crtReadySoundFiles = ["/tvSounds/on.mp3", "/tvSounds/onAndOff.mp3"];
const CRT_SOUND_GAIN = 0.25;
const crtHitAreaStyle = {
  left: "51.75%",
  top: "0.1%",
  width: "14.2%",
  height: "38.2%",
} as const;

export const SeparatorOut = forwardRef<HTMLDivElement, SeparatorOutProps>(
  (props, ref) => {
    const gameState = useStore($gameState);
    const endingState = useStore($endingState);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);

    const hasHandoff = hasBit(gameState, GameStateFlags.FLAG_LEND_A_HAND);
    const isCrtPowered = hasBit(gameState, GameStateFlags.FLAG_CRT);
    const displayCrt = props.isCrt && hasHandoff;
    const crtScreenOpacity = props.crtScreenOpacity ?? 0;
    const isCrtReady =
      hasBit(gameState, GameStateFlags.FLAG_STARS_ALIGN) &&
      hasHandoff &&
      hasBit(gameState, GameStateFlags.FLAG_CONNECTION);
    const crtButtonLabel = isCrtReady
      ? "Power on CRT cache relay"
      : "Check CRT cache relay";

    const activateCrt = async () => {
      if (isSoundPlaying || endingState.isActive) {
        return;
      }

      setIsSoundPlaying(true);
      await resumeAudioContext();

      try {
        const soundFile = isCrtReady
          ? "/tvSounds/on.mp3"
          : "/tvSounds/onAndOff.mp3";

        if (isCrtReady) {
          setBit(GameStateFlags.FLAG_CRT);
        }

        const playback = await startCachedAudio(soundFile, {
          gain: CRT_SOUND_GAIN,
        });

        await playback.ended;
      } finally {
        setIsSoundPlaying(false);
      }
    };

    const handleCrtKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      void activateCrt();
    };

    useEffect(() => {
      void preloadAudioBuffers(crtReadySoundFiles);
    }, []);

    return (
      <div
        className={`relative ${
          displayCrt || props.middleLayer || props.underLayer
            ? "overflow-visible"
            : "overflow-hidden"
        }`}
        ref={ref}
      >
        {props.underLayer ? (
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="pointer-events-none absolute inset-0">
              {props.underLayer}
            </div>
          </div>
        ) : null}
        <svg
          className="pointer-events-none relative z-10 block h-auto w-full translate-y-px"
          viewBox="0 0 960 279.177"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
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
        </svg>
        {(displayCrt || props.middleLayer) && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {displayCrt && (
              <>
                {!isCrtPowered ? (
                  <button
                    type="button"
                    aria-disabled={isSoundPlaying || endingState.isActive}
                    aria-label={crtButtonLabel}
                    data-state={isCrtReady ? "ready" : "pending"}
                    className="crt-trigger-button pointer-events-auto absolute"
                    disabled={isSoundPlaying || endingState.isActive}
                    onClick={() => {
                      void activateCrt();
                    }}
                    onKeyDown={handleCrtKeyDown}
                    style={crtHitAreaStyle}
                  />
                ) : null}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 block h-full w-full overflow-visible"
                  viewBox="0 0 960 279.177"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ overflow: "visible" }}
                >
                  <defs id="defs1">
                    <filter
                      id="crt-trigger-glow-base"
                      x="-28%"
                      y="-28%"
                      width="156%"
                      height="156%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="4"
                        floodColor="#f1faee"
                        floodOpacity="0.18"
                      />
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="7"
                        floodColor="#f09d51"
                        floodOpacity="0.12"
                      />
                    </filter>
                    <filter
                      id="crt-trigger-glow-ready"
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="5"
                        floodColor="#f1faee"
                        floodOpacity="0.28"
                      />
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="8.5"
                        floodColor="#f09d51"
                        floodOpacity="0.18"
                      />
                    </filter>
                  </defs>
                  <g
                    className="crt-visual"
                    filter={
                      isCrtReady
                        ? "url(#crt-trigger-glow-ready)"
                        : "url(#crt-trigger-glow-base)"
                    }
                    id="layer1"
                    transform="matrix(0.72152775,-0.06209045,0.06209045,0.72152775,479.11345,-77.145299)"
                  >
                    <image
                      className="crt-trigger-image"
                      draggable="false"
                      width="176.3889"
                      height="132.29167"
                      preserveAspectRatio="none"
                      xlinkHref={crtImage}
                      id="tv"
                      x="14.018737"
                      y="123.32362"
                    />
                    <image
                      className="crt-trigger-screen"
                      draggable="false"
                      width="123.47222"
                      height="97.013885"
                      preserveAspectRatio="none"
                      opacity={crtScreenOpacity}
                      xlinkHref={crtScreen}
                      id="screen"
                      x="26.629618"
                      y="136.32681"
                    />
                  </g>
                </svg>
              </>
            )}
            {props.middleLayer ? (
              <div className="pointer-events-none absolute inset-0">
                {props.middleLayer}
              </div>
            ) : null}
          </div>
        )}
        <svg
          className="pointer-events-none absolute inset-0 z-30 block h-full w-full translate-y-px"
          viewBox="0 0 960 279.177"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            style={{
              fill: "var(--color-transition2)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
              opacity: 1,
            }}
            d="m 960,88.493822 -20,9.5 c -20,9.500008 -60,28.500028 -100,37.500028 -40,9.00001 -80,8.00001 -120,-3.5 -40,-11.50001 -80,-33.50003 -120,-46.000028 -40,-12.50001 -80,-15.50001 -120,5.2 -40,20.600018 -80,65.000048 -120,80.600058 -40,15.70001 -80,2.7 -120,-12.30001 C 200,144.49386 160,127.49385 120,115.69384 80,103.79383 40,97.193822 20,93.793822 l -20,-3.3 V 272.49395 h 20 c 20,0 60,0 100,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 120,0 40,0 80,0 100,0 h 20 z"
          />
          <path
            style={{
              fill: "var(--color-fg-color)",
              strokeLinecap: "round",
              strokeLinejoin: "miter",
            }}
            pointerEvents="none"
            d="m 0,162.17692 17.8,7.50001 c 17.9,7.5 53.5,22.50001 89,15.50001 35.5,-7.00001 70.9,-36.00003 106.4,-49.80004 35.5,-13.90001 71.1,-12.50001 106.8,0.8 35.7,13.30001 71.3,38.70003 106.8,54.80004 35.5,16.20001 70.9,23.20002 106.4,16.00001 35.5,-7.1 71.1,-28.50002 106.8,-47.10003 35.7,-18.70001 71.3,-34.70002 106.8,-42.20003 35.5,-7.50001 70.9,-6.5 106.4,7.70001 35.5,14.1 71.1,41.50002 89,55.10003 L 960,194.17694 V 279.177 h -17.8 c -17.9,0 -53.5,0 -89,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -106.8,0 -35.7,0 -71.3,0 -106.8,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -106.8,0 -35.7,0 -71.3,0 -106.8,0 -35.5,0 -70.9,0 -106.4,0 -35.5,0 -71.1,0 -89,0 H 0 Z"
          />
        </svg>
      </div>
    );
  }
);
