import { LinkedIn, Heart, GitHub } from "../utility/icons";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../stores/sentimentStateStore";
import { useStore } from "@nanostores/react";

export const Footer = () => {
  const sentimentState = useStore($sentimentState);
  const removeHeart = isBitSet(SentimentStateFlags.FLAG_NEGATIVE) && isBitSet(SentimentStateFlags.FLAG_ACTIVE);

  return (
    <footer
      className="bg-fg-Color relative mt-1 h-36 select-none items-center text-base font-medium shadow-inner sm:h-28"
      // style={{boxShadow: 'inset 0 2px 4px 0 rgba(35, 25, 66, 0.1)}'}}
    >
      <div className="m-auto flex h-full flex-col justify-center sm:flex-row-reverse">
        <div className="mt-4 flex justify-center gap-1 sm:mt-0 sm:items-center">
          <a
            href={"https://github.com/JcK-l"}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitHub />
          </a>

          {/* <!-- <LinkedIn /> --> */}
        </div>

        <div className="mx-auto my-4 sm:mx-4 sm:my-auto">
          <svg
            className="sm:hidden"
            width="160"
            height="2"
            viewBox="-1 0 162 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              y1="1"
              x2="160"
              y2="1"
              stroke="var(--color-text-color)"
              strokeOpacity="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            className="hidden sm:block"
            width="2"
            viewBox="0 -1 2 26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="24"
              stroke="var(--color-text-color)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex justify-center gap-1 sm:items-center">
          Coded
          {removeHeart ? (" ") : (
            <>
              {" "}with
              <Heart />
            </>
          )}
          by Joshua Lowe
        </div>
      </div>
    </footer>
  );
};
