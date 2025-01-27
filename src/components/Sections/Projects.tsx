import { projects } from "../../data/ProjectData";
import { PhoneProvider } from "../../context/PhoneContext";
import { Phone } from "../Phone";
import { ProjectText } from "../ProjectText";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";
import { $offScriptCount } from "../../stores/offScriptCountStore";
import { useStore } from "@nanostores/react";
import { Connection } from "../Connection";
import { useEffect, useState } from "react";

const Projects = () => {
  const sentimentState = useStore($sentimentState);
  const offScriptCount = useStore($offScriptCount);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    const savedFlags = sessionStorage.getItem("flags");
    const flags = JSON.parse(savedFlags || "[]");
    const allFlagsTrue: boolean = flags.every((flag: boolean) => flag === true);
    setIsFinal(allFlagsTrue);
  }, [sentimentState]);

  return isBitSet(SentimentStateFlags.FLAG_NEGATIVE) &&
    isBitSet(SentimentStateFlags.FLAG_ACTIVE) ? (
    <div></div>
  ) : (
    <div className="page-margins relative bg-fgColor py-4">
      <div className="z-10 w-full text-titleColor">
        <h1 className="h2-text mb-8 inline-block w-auto xl:mb-24">
          My Projects{isBitSet(SentimentStateFlags.FLAG_POSITIVE) ? "!" : ""}
        </h1>
      </div>
      <PhoneProvider>
        <div className="relative flex flex-col-reverse justify-between gap-4 md:flex-row ">
          <div className="relative flex w-full flex-col justify-center gap-2">
            {projects.map((project, index) => (
              <ProjectText
                title={project.title}
                description={project.description}
                showOnNumbers={[index]}
                imageFolder={project.imageFolder}
                numberImages={project.numberImages}
                githubLink={project.githubLink}
                youtubeLink={project.youtubeLink}
                demoLink={project.demoLink}
                key={index}
              />
            ))}
            <ProjectText
              title={"No Project"}
              description="There is no project with this number!"
              showOnNumbers={[0]}
              numbersExclude={[
                ...Array.from({ length: projects.length + 1 }, (_, i) => i - 1),
                571046,
                1048596,
                1143688,
                418,
              ]}
            />

            <ProjectText
              title={""}
              description=""
              showOnNumbers={[571046, 1048596, 1143688]}
              renderItem={() => (
                <a
                  href={"https://steins-gate.fandom.com/wiki/Divergence_Meter"}
                  className="mx-auto w-7/12 rounded-lg"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img
                    src="/divergenceMeter.avif"
                    alt="Divergence Meter"
                    className="rounded-lg"
                  />
                </a>
              )}
            />

            {isFinal ? (
              <ProjectText
                title={""}
                description=""
                showOnNumbers={[418]}
                renderItem={() => (
                  <>
                    <h5 className="h4-text relative block font-bold text-titleColor">
                      I'm a teapot
                    </h5>
                    <p>
                      418. You cracked the code, reached the end of this
                      experiment, and I couldn't be more grateful. This site was
                      never just about me—it was about creating an experience, a
                      place to connect, spark curiosity, and maybe even inspire
                      a little madness, much like a certain lab I admire.
                    </p>
                    <p>
                      Thank you for taking the time to explore. For indulging
                      the mad science, the experiments, and maybe even a little
                      chaos. If there’s one thing I’ve learned, it’s that the
                      smallest actions can ripple through time in ways we don’t
                      expect.
                    </p>
                    <p>
                      So, whether you're here for inspiration, curiosity, or
                      just stumbled in by accident—know this: you’ve left your
                      mark on this site, and in my heart. Welcome to the lab.
                      {/* You’re one of us now.El Psy Kongroo. */}
                    </p>
                    <p>This is the choice of Steins Gate.</p>
                    <p style={{ textAlign: "right" }}>- Joshua</p>
                    <br />
                    <img
                      src="/kurisu.avif"
                      alt="kurisu"
                      className="mx-auto w-6/12"
                    />
                  </>
                )}
              />
            ) : (
              <>
                {offScriptCount === 1 && (
                  <ProjectText
                    title={"This is off script"}
                    description="Congratulations, intrepid traveler. You’ve wandered into the unknown. But alas, this realm is not yet for your eyes. Return when you’ve followed the proper sequence of events. El Psy Kongroo."
                    showOnNumbers={[418]}
                  />
                )}
                {offScriptCount === 2 && (
                  <ProjectText
                    title={"Again? Really?"}
                    description="Ah, I see. You fancy yourself a rogue. A rulebreaker. Perhaps even a genius! But know this: even Hououin Kyouma follows the sacred script when the timeline depends on it. Turn back, or risk attracting the Organization's agents."
                    showOnNumbers={[418]}
                  />
                )}
                {offScriptCount === 3 && (
                  <ProjectText
                    title={"Three times? A mad scientist in the making."}
                    description="It seems you crave the forbidden knowledge hidden here. But beware, tampering with this space could destabilize the very fabric of this site. Are you prepared to face the consequences? … No? Thought so. Back you go."
                    showOnNumbers={[418]}
                  />
                )}
                {offScriptCount === 4 && (
                  <ProjectText
                    title={"Alright, you’ve done it now."}
                    description="Not many dare to push this far. Do you think you’ve unlocked some grand secret? Well, let me tell you... you haven’t. Yet. But I’ll give you one last chance. The truth lies where your journey began."
                    showOnNumbers={[418]}
                  />
                )}
                {offScriptCount === 5 && (
                  <ProjectText
                    title={"You’ve defied all logic."}
                    description="You’re either a temporal anomaly or just *really* stubborn. Either way, I’m impressed. But the true path lies in traversing all timelines: the good, the neutral, and the bad. Each response you send in the D-Mail holds the power to shape your journey. Can you unlock them all?"
                    showOnNumbers={[418]}
                  />
                )}
                {offScriptCount >= 6 && (
                  <ProjectText
                    title={""}
                    description=""
                    showOnNumbers={[418]}
                    renderItem={() => (
                      <img
                        src="/areYouSerious.avif"
                        alt="..."
                        className="mx-auto my-auto w-6/12"
                      />
                    )}
                  />
                )}
              </>
            )}

            {!isBitSet(SentimentStateFlags.FLAG_ACTIVE) && <Connection />}
          </div>
          <Phone />
        </div>
      </PhoneProvider>
    </div>
  );
};

export default Projects;
