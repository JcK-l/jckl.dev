import { useRef, useEffect, useState } from "react";
import { PuzzleGame } from "../PuzzleGame";
import { PuzzleProvider } from "../../context/PuzzleContext";
import { AboutText } from "../AboutText";
import { Email } from "../Email";
import {
  GameStateFlags,
  isBitSet as gameStateIsBitSet,
} from "../../stores/gameStateStore";
import { $formData, $pastDate } from "../../stores/stringStore";
import { useStore } from "@nanostores/react";
import {
  $sentimentState,
  isBitSet as sentimentStateIsBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);
  const isMail = gameStateIsBitSet(GameStateFlags.FLAG_SECRET);
  const formData = useStore($formData);
  const sentimentState = useStore($sentimentState);
  const date = useStore($pastDate);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsWide(true);
    } else {
      setIsWide(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* <FlyingMan ref={ref} /> */}
      <div className="page-margins relative py-4" ref={ref}>
        {sentimentStateIsBitSet(SentimentStateFlags.FLAG_NEGATIVE) ? (
          <div></div>
        ) : (
          <div className="z-10 w-full">
            <h1 className="h2-text mb-8 inline-block text-titleColor xl:mb-24">
              About Me
              {sentimentStateIsBitSet(SentimentStateFlags.FLAG_POSITIVE)
                ? "!"
                : ""}
            </h1>
          </div>
        )}

        <PuzzleProvider>
          <div className="relative flex flex-col-reverse justify-between gap-10 lg:flex-row lg:gap-20">
            <div className="relative flex w-full flex-col gap-2">
              <AboutText
                renderItem={() => <></>}
                showRange={{ min: 0, max: 3 }}
                removeOnNext={true}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <h5 className="h5-text text-titleColor">
                      As you might have guessed, I like puzzles...
                    </h5>
                    <br />
                    <p>
                      Whether it's chess puzzles or solving a Rubik’s Cube, I’ve
                      always been hooked on challenges. I used to compete in
                      chess tournaments, learning from every game—win or lose.
                      Much like the puzzle you’re working on right now, I enjoy
                      the process of putting the pieces together and watching
                      everything fall into place.
                    </p>
                  </>
                )}
                showRange={{ min: 4, max: 7 }}
                removeOnNext={!isWide}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <p>
                      So, why not keep going? There’s more to discover as you
                      finish the puzzle!
                    </p>
                  </>
                )}
                showRange={{ min: 4, max: 7 }}
                removeOnNext={true}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <br />
                    <h5 className="h5-text text-titleColor">
                      Music is my escape...
                    </h5>
                    <br />
                    <p>
                      I listen to just about every genre—jazz fusion, indie,
                      classical, city pop, hip-hop, and electro. It’s all about
                      finding something fresh to get lost in. I also play the
                      piano; it’s my way of relaxing and clearing my mind when
                      there’s too much going on. Just a few notes, and things
                      start to make sense again.
                    </p>
                  </>
                )}
                showRange={{ min: 8, max: 11 }}
                removeOnNext={!isWide}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <p> Keep going—you're almost there!</p>
                  </>
                )}
                showRange={{ min: 8, max: 11 }}
                removeOnNext={true}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <br />
                    <h5 className="h5-text text-titleColor">
                      Computers have always been my thing...
                    </h5>
                    <br />
                    <p>
                      From building PCs to grinding competitive games, I’ve
                      always loved testing my skills and pushing limits.
                      Programming is just another extension of that—it lets me
                      create, experiment, and bring ideas to life. There’s
                      something endlessly exciting about turning thoughts into
                      reality through code.
                    </p>
                  </>
                )}
                showRange={{ min: 12, max: 16 }}
                removeOnNext={!isWide}
                isAboutText={!isMail}
              />
              <AboutText
                renderItem={() => (
                  <>
                    <p>You’re so close now—just a few more pieces to go! </p>
                  </>
                )}
                showRange={{ min: 12, max: 16 }}
                removeOnNext={true}
                isAboutText={!isMail}
              />
              <Email
                name={formData.name}
                email={formData.email}
                message={formData.message}
                date={date}
                isMail={isMail}
              />
            </div>
            <PuzzleGame />
          </div>
        </PuzzleProvider>
      </div>
    </>
  );
};

export default About;
