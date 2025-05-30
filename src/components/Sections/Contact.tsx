import { BetweenLands } from "../BetweenLands";
import {
  $gameState,
  GameStateFlags,
  isBitSet as gameStateIsBitSet,
  setBit as gameStateSetBit,
} from "../../stores/gameStateStore";
import { $formData } from "../../stores/stringStore";
import {
  $sentimentState,
  SentimentStateFlags,
  isBitSet as sentimentStateIsBitSet,
  setBit as sentimentStateSetBit,
} from "../../stores/sentimentStateStore";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { getAudioContext } from "../../utility/audioContext";
import { Email, Send } from "../../utility/icons";
import { toggleThemes } from "../../utility/toggleTheme";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Contact = () => {
  const gameState = useStore($gameState);
  const formData = useStore($formData);
  const sentimentState = useStore($sentimentState);
  const [showIcon, setShowIcon] = useState(true);
  const [openaiResponse, setOpenaiResponse] = useState("");

  interface FormData {
    name: string;
    email: string;
    message: string;
  }

  interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    message: HTMLTextAreaElement;
  }

  interface FormElement extends HTMLFormElement {
    elements: FormElements;
  }

  const validateMessage = (
    message: string,
    textarea: HTMLTextAreaElement
  ): boolean => {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    if (messageBytes.length > 36) {
      textarea.setCustomValidity("Can only send 36 bytes to the target year.");
      textarea.reportValidity();
      return false;
    } else {
      textarea.setCustomValidity("");
      return true;
    }
  };

  interface FetchCompletionResponse {
    message: string;
    sentiment: number;
  }

  const apiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8888/.netlify/functions/openai"
      : "/.netlify/functions/openai";

  const fetchOpenAI = async (message: string): Promise<void> => {
    const response: Response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    const result: FetchCompletionResponse = await response.json();
    setOpenaiResponse(result.message);
    console.log("sentiment:", result.sentiment);

    const existingFlags = JSON.parse(
      sessionStorage.getItem("flags") || "[true, false, false, false]"
    );

    if (result.sentiment < 0) {
      sentimentStateSetBit(SentimentStateFlags.FLAG_NEGATIVE);
      existingFlags[SentimentStateFlags.FLAG_NEGATIVE] = true;
    } else if (result.sentiment === 0) {
      sentimentStateSetBit(SentimentStateFlags.FLAG_NEUTRAL);
      existingFlags[SentimentStateFlags.FLAG_NEUTRAL] = true;
    } else {
      sentimentStateSetBit(SentimentStateFlags.FLAG_POSITIVE);
      existingFlags[SentimentStateFlags.FLAG_POSITIVE] = true;
    }

    sessionStorage.setItem("flags", JSON.stringify(existingFlags));
    toggleThemes();
  };

  const handleSubmit = (event: React.FormEvent<FormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data: FormData = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value,
    };

    if (gameStateIsBitSet(GameStateFlags.FLAG_CRT)) {
      if (validateMessage(data.message, form.elements.message)) {
        fetchOpenAI(data.message);
        $formData.set(data);
        console.log("Form data saved:", data);
        gameStateSetBit(GameStateFlags.FLAG_SECRET);
      }
    } else {
      form.submit();
    }
  };

  useEffect(() => {
    console.log("sentimentState:", sentimentState);
    if (
      sentimentStateIsBitSet(SentimentStateFlags.FLAG_NEGATIVE) &&
      sentimentStateIsBitSet(SentimentStateFlags.FLAG_ACTIVE)
    ) {
      let audioContext: AudioContext;
      let source: AudioBufferSourceNode;
      let gainNode: GainNode;

      const fetchAudio = async () => {
        const audioContext = getAudioContext();
        const response = await fetch("/tvSounds/tv-static-7019loop.mp3");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;

        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.09;

        gainNode.connect(audioContext.destination);
        source.connect(gainNode);

        source.start(0);
      };

      if (gameStateIsBitSet(GameStateFlags.FLAG_CRT)) {
        fetchAudio();
      }

      return () => {
        if (source) {
          source.stop();
          source.disconnect();
        }
      };
    }
  }, [sentimentState]);

  return (
    <BetweenLands
      isBackground={false}
      isCrt={gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND)}
      renderItem={(shift) =>
        sentimentStateIsBitSet(SentimentStateFlags.FLAG_ACTIVE) ? (
          <div className="h5-text page-margins relative py-24 text-center text-white">
            {openaiResponse}
          </div>
        ) : (
          <div className="page-margins pointer-events-auto relative z-20 flex flex-col items-center justify-between py-8 sm:flex-row sm:items-start">
            <div className="m-4 w-full text-white sm:w-1/2">
              <h3 className="h3-text sm:h4-text mb-6 font-heading font-bold">
                {gameStateIsBitSet(GameStateFlags.FLAG_CRT)
                  ? "?touch in get to want you Do"
                  : "Do you want to get in touch?"}
              </h3>

              <p className="font-sans leading-[16px] ">
                {gameStateIsBitSet(GameStateFlags.FLAG_CRT)
                  ? "or form this out fill can you Then"
                  : "Then you can fill out this form or"}
                <br />
                <br />
                <span className="flex items-center justify-start gap-1">
                  {gameStateIsBitSet(GameStateFlags.FLAG_CRT) ? (
                    <>
                      dev.jckl@mail <Email />
                    </>
                  ) : (
                    <>
                      <Email /> mail@jckl.dev
                    </>
                  )}
                </span>
                <br />
                {gameStateIsBitSet(GameStateFlags.FLAG_CRT)
                  ? "!you from hear to thrilled am I"
                  : "I am thrilled to hear from you!"}
              </p>
            </div>

            <form
              className="m-4 w-full sm:w-1/2"
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              <input
                type="hidden"
                name="subject"
                value="New email from %{formName} (%{submissionId})"
              />
              <div className="mb-3 flex items-end justify-center gap-3">
                <div className="relative w-5/12">
                  <label htmlFor="name" className="mb-1.5 block text-white ">
                    Your Name:
                  </label>
                  <input
                    // placeholder="Enter your full name"
                    className="w-full rounded-lg border-white bg-white p-2 font-medium text-bgColor focus:bg-primary focus:text-white focus:outline-none focus:ring focus:ring-white xl:p-4"
                    type="text"
                    name="name"
                    required
                  />
                </div>
                <div className="relative w-7/12">
                  <label htmlFor="email" className="mb-1.5 block text-white">
                    Your Email:
                  </label>
                  <input
                    // placeholder="Enter your email address"
                    className="w-full rounded-lg bg-white p-2 font-medium text-bgColor focus:bg-primary focus:text-white focus:outline-none focus:ring focus:ring-white xl:p-4"
                    type="email"
                    name="email"
                    required
                  />
                </div>
              </div>
              <label htmlFor="message" className="mb-1 block text-white">
                Your Message:
              </label>
              <textarea
                // placeholder="Type your message here"
                className="mb-3 w-full rounded-lg bg-white pb-10 pl-2 pt-2 font-medium text-bgColor focus:bg-primary focus:text-white focus:outline-none focus:ring focus:ring-white xl:pb-24 xl:pl-4 xl:pt-4"
                name="message"
                onChange={(event) => {
                  if (gameStateIsBitSet(GameStateFlags.FLAG_CRT)) {
                    const length = event.target.value.length;

                    if (length > 36) {
                      event.target.setCustomValidity(
                        "Can only send 36 bytes to the target year."
                      );
                    } else {
                      event.target.setCustomValidity("");
                    }
                    event.target.reportValidity();
                  }
                }}
                required
              ></textarea>
              <motion.button
                className="w-full rounded-lg border-white p-2 text-white ring ring-white hover:bg-secondary xl:p-4"
                animate={
                  gameStateIsBitSet(GameStateFlags.FLAG_CRT)
                    ? { rotate: [0, 1, -1, 0] }
                    : {}
                }
                type="submit"
              >
                <div className="flex items-center justify-center gap-2">
                  {gameStateIsBitSet(GameStateFlags.FLAG_SECRET) ? (
                    <>
                      Sending D-Mail...
                      <DotLottieReact
                        src={"/load.lottie"}
                        autoplay
                        loop
                        style={{ width: 24, height: 24 }}
                      ></DotLottieReact>
                    </>
                  ) : (
                    <>
                      {gameStateIsBitSet(GameStateFlags.FLAG_CRT)
                        ? "Send D-Mail"
                        : "Send Message"}
                      <Send />
                    </>
                  )}
                </div>
              </motion.button>
            </form>
          </div>
        )
      }
    />
  );
};

export default Contact;
