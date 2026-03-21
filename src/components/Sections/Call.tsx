import { useEffect, type ReactNode } from "react";
import { useStore } from "@nanostores/react";
import { Phone } from "../phone/Phone";
import { ProjectText } from "../ProjectText";
import { projects } from "../../data/ProjectData";
import { $offScriptCount } from "../../stores/offScriptCountStore";
import { $phoneNumber, $phoneResultMode } from "../../stores/phoneStore";
import { $gameState, GameStateFlags } from "../../stores/gameStateStore";
import {
  $endingState,
  hasUnlockedAllEndings,
  isEndingActive,
} from "../../stores/endingStore";
import { getStoredOffScriptCount } from "../../utility/phoneProgress";

const specialDivergenceNumbers = new Set([571046, 1048596, 1143688]);

const ResultBlock = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => (
  <div className="bg-white/40 rounded-[2rem] p-5 md:p-8">
    {!title ? null : (
      <h5 className="h4-text mb-4 text-center font-bold text-titleColor">
        {title}
      </h5>
    )}
    <div className="p-text mx-auto w-full text-center md:w-2/3">{children}</div>
  </div>
);

const Call = () => {
  const endingState = useStore($endingState);
  const mode = useStore($phoneResultMode);
  const phoneNumber = useStore($phoneNumber);
  const offScriptCount = useStore($offScriptCount);
  const gameState = useStore($gameState);

  useEffect(() => {
    $offScriptCount.set(getStoredOffScriptCount());
  }, [endingState]);

  const isFinal = hasUnlockedAllEndings(endingState);

  if (isEndingActive("negative", endingState)) {
    return <div></div>;
  }
  const project =
    phoneNumber === null
      ? undefined
      : projects.find((entry) => entry.id === phoneNumber);
  const hasConnectionUnlocked =
    (gameState & (1 << GameStateFlags.FLAG_CONNECTION)) !== 0;
  const shouldShowPhone = isFinal && hasConnectionUnlocked;

  if (!shouldShowPhone && mode !== "number") {
    return null;
  }

  const renderNumberResult = () => {
    if (project) {
      return (
        <div className="bg-white/40 rounded-[2rem] p-5 md:p-8">
          <ProjectText
            title={project.title}
            description={project.description}
            imageFolder={project.imageFolder}
            numberImages={project.numberImages}
            githubLink={project.githubLink}
            youtubeLink={project.youtubeLink}
            demoLink={project.demoLink}
          />
        </div>
      );
    }

    if (phoneNumber !== null && specialDivergenceNumbers.has(phoneNumber)) {
      return (
        <a
          href="https://steins-gate.fandom.com/wiki/Divergence_Meter"
          className="bg-white/40 mx-auto block w-full rounded-[2rem] p-5 md:w-7/12 md:p-8"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src="/divergenceMeter.avif"
            alt="Divergence Meter"
            className="rounded-lg"
            decoding="async"
            loading="lazy"
          />
        </a>
      );
    }

    if (phoneNumber === 418) {
      if (isFinal) {
        return (
          <ResultBlock title="I'm a teapot">
            <>
              <p>
                418. You cracked the code, reached the end of this experiment,
                and I couldn't be more grateful. This site was never just about
                me. It was about creating an experience, sparking curiosity, and
                maybe even inspiring a little madness, much like a certain lab I
                admire.
              </p>
              <p className="mt-4">
                Thank you for taking the time to explore. For indulging the mad
                science, the experiments, and maybe even a little chaos. If
                there’s one thing I’ve learned, it’s that the smallest actions
                can ripple through time in ways we don’t expect.
              </p>
              <p className="mt-4">
                So, whether you're here for inspiration, curiosity, or just
                stumbled in by accident, know this: you’ve left your mark on
                this site, and in my heart. Welcome to the lab.
              </p>
              <p className="mt-4">This is the choice of Steins Gate.</p>
              <p className="mt-4 text-right">- Joshua</p>
              <img
                src="/kurisu.avif"
                alt="kurisu"
                className="mx-auto mt-6 w-6/12"
                decoding="async"
                loading="lazy"
              />
            </>
          </ResultBlock>
        );
      }

      if (offScriptCount === 1) {
        return (
          <ResultBlock title="This is off script">
            <p>
              Congratulations, intrepid traveler. You’ve wandered into the
              unknown. But alas, this realm is not yet for your eyes. Return
              when you’ve followed the proper sequence of events. El Psy
              Kongroo.
            </p>
          </ResultBlock>
        );
      }

      if (offScriptCount === 2) {
        return (
          <ResultBlock title="Again? Really?">
            <p>
              Ah, I see. You fancy yourself a rogue. A rulebreaker. Perhaps even
              a genius. But know this: even Hououin Kyouma follows the sacred
              script when the timeline depends on it. Turn back, or risk
              attracting the Organization's agents.
            </p>
          </ResultBlock>
        );
      }

      if (offScriptCount === 3) {
        return (
          <ResultBlock title="Three times? A mad scientist in the making.">
            <p>
              It seems you crave the forbidden knowledge hidden here. But
              beware, tampering with this space could destabilize the very
              fabric of this site. Are you prepared to face the consequences?
              No? Thought so. Back you go.
            </p>
          </ResultBlock>
        );
      }

      if (offScriptCount === 4) {
        return (
          <ResultBlock title="Alright, you’ve done it now.">
            <p>
              Not many dare to push this far. Do you think you’ve unlocked some
              grand secret? Well, let me tell you, you haven’t. Yet. But I’ll
              give you one last chance. The truth lies where your journey began.
            </p>
          </ResultBlock>
        );
      }

      if (offScriptCount === 5) {
        return (
          <ResultBlock title="You’ve defied all logic.">
            <p>
              You’re either a temporal anomaly or just really stubborn. Either
              way, I’m impressed. But the true path lies in traversing all
              timelines: the good, the neutral, and the bad. Each response you
              send in the D-Mail holds the power to shape your journey. Can you
              unlock them all?
            </p>
          </ResultBlock>
        );
      }

      if (offScriptCount >= 6) {
        return (
          <div className="bg-white/40 rounded-[2rem] p-5 md:p-8">
            <img
              src="/areYouSerious.avif"
              alt="..."
              className="mx-auto my-auto w-6/12"
              decoding="async"
              loading="lazy"
            />
          </div>
        );
      }
    }

    return (
      <ResultBlock title="No Project">
        <p>There is no project with this number!</p>
      </ResultBlock>
    );
  };

  const renderContent = () => {
    if (mode === "number") {
      return renderNumberResult();
    }

    if (shouldShowPhone) {
      return (
        <div className="p-text bg-white/30 rounded-[2rem] px-5 py-6 text-center text-titleColor md:px-8 lg:text-left">
          Dial a number on the phone to reveal a result.
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-margins relative bg-fgColor py-4">
      <div
        className={
          shouldShowPhone
            ? "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-stretch lg:gap-10"
            : "mx-auto max-w-[58rem]"
        }
      >
        <div
          className={
            shouldShowPhone ? "order-2 min-w-0 lg:order-1 lg:flex" : ""
          }
        >
          <div className={shouldShowPhone ? "w-full lg:h-full" : "w-full"}>
            {renderContent()}
          </div>
        </div>
        {!shouldShowPhone ? null : (
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <Phone />
          </div>
        )}
      </div>
    </div>
  );
};

export default Call;
