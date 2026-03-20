import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { BetweenLands } from "../BetweenLands";
import { PuzzlePieceTransfer } from "../PuzzlePieceTransfer";
import {
  $gameState,
  GameStateFlags,
  isBitSet as gameStateIsBitSet,
} from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { $pastDate } from "../../stores/stringStore";
import { saveEndingMail } from "../../stores/endingMailStore";
import {
  $endingState,
  isEndingActive,
  type SentimentLabel,
} from "../../stores/endingStore";
import { getAudioContext } from "../../utility/audioContext";
import { enterEnding } from "../../utility/endingMode";
import {
  completeFinalCacheDelivery,
  crtPieceIds,
  hasFinalCacheUnlocked,
  prepareFinalCacheEnding,
} from "../../utility/finalCacheState";
import { Email, Send } from "../../utility/icons";

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

interface FetchSentimentResponse {
  sentiment: SentimentLabel;
}

type ContactPhase = "idle" | "analyzing" | "delivering" | "placeholder";

type ViewportPoint = {
  x: number;
  y: number;
};

const apiUrl = "/api/openai";
const contactTransferSourceAnchor = { x: 0.5, y: 0.5 };

const getTransferSourcePoint = (
  sourceElement: HTMLButtonElement | null
): ViewportPoint | null => {
  if (sourceElement === null) {
    return null;
  }

  const sourceBounds = sourceElement.getBoundingClientRect();

  return {
    x: sourceBounds.left + sourceBounds.width * contactTransferSourceAnchor.x,
    y: sourceBounds.top + sourceBounds.height * contactTransferSourceAnchor.y,
  };
};

const Contact = () => {
  const gameState = useStore($gameState);
  const dispensedGroups = useStore($dispensedGroups);
  const endingState = useStore($endingState);
  const pastDate = useStore($pastDate);
  const [phase, setPhase] = useState<ContactPhase>("idle");
  const [submitError, setSubmitError] = useState("");
  const [transferKey, setTransferKey] = useState(0);
  const [pendingTransfer, setPendingTransfer] = useState(false);
  const [transferSourcePoint, setTransferSourcePoint] =
    useState<ViewportPoint | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormElement | null>(null);
  const wasEndingActiveRef = useRef(endingState.isActive);
  const isEndingModeActive = endingState.isActive;
  const isNegativeEndingActive = isEndingActive("negative", endingState);
  const isAnalyzing = phase === "analyzing";
  const isDeliveringDmail = phase === "delivering";
  const isEndingSequenceVisible = isAnalyzing || isDeliveringDmail;
  const shouldHideContact = isEndingModeActive && !isDeliveringDmail;

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
    }

    textarea.setCustomValidity("");
    return true;
  };

  const fetchSentiment = async (message: string): Promise<SentimentLabel> => {
    const response: Response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const responseText = await response.text();
    let result: FetchSentimentResponse | { error?: string } = {};

    if (responseText) {
      try {
        result = JSON.parse(responseText) as
          | FetchSentimentResponse
          | { error?: string };
      } catch {
        result = {};
      }
    }

    if (!response.ok) {
      const errorMessage =
        result && "error" in result && typeof result.error === "string"
          ? result.error
          : "Failed to analyze sentiment";

      throw new Error(errorMessage);
    }

    if (
      result &&
      "sentiment" in result &&
      (result.sentiment === "negative" ||
        result.sentiment === "neutral" ||
        result.sentiment === "positive")
    ) {
      return result.sentiment;
    }

    throw new Error("Received an invalid sentiment response");
  };

  const handleSubmit = async (event: React.FormEvent<FormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data: FormData = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value,
    };

    if (!gameStateIsBitSet(GameStateFlags.FLAG_CRT)) {
      form.submit();
      return;
    }

    if (!validateMessage(data.message, form.elements.message)) {
      return;
    }

    setSubmitError("");
    setPhase("analyzing");
    setTransferSourcePoint(null);

    try {
      const sentiment = await fetchSentiment(data.message);
      const shouldTriggerTransfer =
        !hasFinalCacheUnlocked(gameState) && !dispensedGroups.crt;

      submitButtonRef.current?.blur();
      saveEndingMail(sentiment, {
        ...data,
        date: pastDate,
      });
      prepareFinalCacheEnding();
      setPendingTransfer(shouldTriggerTransfer);
      setPhase("delivering");
      enterEnding(sentiment);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send D-Mail"
      );
      setPhase("idle");
    }
  };

  useEffect(() => {
    if (
      !isNegativeEndingActive ||
      !gameStateIsBitSet(GameStateFlags.FLAG_CRT)
    ) {
      return;
    }

    let source: AudioBufferSourceNode | undefined;
    let gainNode: GainNode | undefined;

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

    void fetchAudio();

    return () => {
      source?.stop();
      source?.disconnect();
      gainNode?.disconnect();
    };
  }, [gameState, isNegativeEndingActive]);

  useEffect(() => {
    if (phase !== "delivering" || !isEndingModeActive) {
      return;
    }

    if (pendingTransfer) {
      setTransferSourcePoint(getTransferSourcePoint(submitButtonRef.current));
      setTransferKey((currentKey) => currentKey + 1);
      setPendingTransfer(false);
    }

    setPhase("placeholder");
  }, [isEndingModeActive, pendingTransfer, phase]);

  useEffect(() => {
    const wasEndingActive = wasEndingActiveRef.current;

    if (wasEndingActive && !isEndingModeActive) {
      setPhase("idle");
      setSubmitError("");
      setPendingTransfer(false);
      setTransferSourcePoint(null);
      formRef.current?.reset();
    }

    wasEndingActiveRef.current = isEndingModeActive;
  }, [isEndingModeActive]);

  return (
    <BetweenLands
      isBackground={false}
      isCrt={gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND)}
      separatorInMiddleLayer={
        <PuzzlePieceTransfer
          direction="up"
          onComplete={completeFinalCacheDelivery}
          pieceIds={crtPieceIds}
          sourceAnchor={contactTransferSourceAnchor}
          sourcePoint={transferSourcePoint ?? undefined}
          sourceRef={submitButtonRef}
          triggerKey={transferKey}
        />
      }
      renderItem={() =>
        shouldHideContact ? (
          <div className="page-margins relative z-20 py-16 sm:py-24">
            <div className="border-white/15 bg-bgColor/28 text-white/70 mx-auto min-h-[12rem] max-w-2xl rounded-[2rem] border px-6 py-10 text-center backdrop-blur-[2px] sm:px-10 sm:py-14">
              <p className="text-white/50 font-mono text-[0.72rem] uppercase tracking-[0.18em]">
                Another Timeline Is Open
              </p>
              <p className="mt-5 text-sm leading-7 sm:text-base">
                The line is quiet down here now. Follow the change above if you
                want to see where that D-Mail landed.
              </p>
            </div>
          </div>
        ) : (
          <div className="page-margins relative z-20 py-8">
            <div
              className={`flex flex-col items-center justify-between sm:flex-row sm:items-start ${
                isEndingSequenceVisible ? "pointer-events-none" : ""
              }`}
            >
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
                ref={formRef}
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
                  className="mb-3 w-full rounded-lg bg-white pb-10 pl-2 pt-2 font-medium text-bgColor focus:bg-primary focus:text-white focus:outline-none focus:ring focus:ring-white xl:pb-24 xl:pl-4 xl:pt-4"
                  name="message"
                  onChange={(event) => {
                    if (gameStateIsBitSet(GameStateFlags.FLAG_CRT)) {
                      const encoder = new TextEncoder();
                      const byteLength = encoder.encode(
                        event.target.value
                      ).length;

                      if (byteLength > 36) {
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
                  disabled={isEndingSequenceVisible}
                  ref={submitButtonRef}
                  type="submit"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isEndingSequenceVisible ? (
                      <>
                        {isAnalyzing
                          ? "Analyzing D-Mail..."
                          : "Delivering D-Mail..."}
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
                {submitError ? (
                  <p className="mt-3 text-center text-sm text-red">
                    {submitError}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        )
      }
    />
  );
};

export default Contact;
