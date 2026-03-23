import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BetweenLands } from "../BetweenLands";
import { PuzzlePieceTransfer } from "../puzzle/PuzzlePieceTransfer";
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
import {
  preloadAudioBuffers,
  startCachedAudio,
  type CachedAudioPlayback,
} from "../../utility/audioContext";
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

type ContactPhase = "idle" | "analyzing" | "delivering";

type ViewportPoint = {
  x: number;
  y: number;
};

const ContactSpinner = () => (
  <span
    aria-hidden="true"
    className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white"
  />
);

const apiUrl = "/api/openai";
const contactTransferSourceAnchor = { x: 0.5, y: 0.5 };
const contactStaticAudioUrl = "/tvSounds/tv-static-7019loop.mp3";
const originalEndingStaticGain = 0.05;
const negativeEndingStaticGain = 0.09;
const contactStaticGainRampSeconds = 0.18;
const contactStaticBubblePaddingRatio = 0.35;

const getContactBubbleStrength = (sectionElement: HTMLElement) => {
  const sectionBounds = sectionElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const sectionCenter = sectionBounds.top + sectionBounds.height / 2;
  const bubblePadding = viewportHeight * contactStaticBubblePaddingRatio;
  const maxDistance =
    viewportHeight / 2 + sectionBounds.height / 2 + bubblePadding;
  const normalizedDistance = Math.min(
    Math.abs(sectionCenter - viewportCenter) / maxDistance,
    1
  );
  const proximity = 1 - normalizedDistance;

  return proximity * proximity;
};

const getContactSectionBubbleStrength = () => {
  const contactSection = document.getElementById("contact");

  if (contactSection === null) {
    return 0;
  }

  return getContactBubbleStrength(contactSection);
};

const getContactStaticTargetGain = (isNegativeEndingActive: boolean) => {
  const bubbleStrength = getContactSectionBubbleStrength();
  const baseGain = isNegativeEndingActive
    ? negativeEndingStaticGain
    : originalEndingStaticGain;

  return baseGain * bubbleStrength;
};

const getContactStaticVisualOpacity = () => {
  return getContactSectionBubbleStrength();
};

const rampPlaybackGain = (
  playback: CachedAudioPlayback,
  targetGain: number
) => {
  const now = playback.context.currentTime;
  const currentGain = playback.gainNode.gain.value;

  playback.gainNode.gain.cancelScheduledValues(now);
  playback.gainNode.gain.setValueAtTime(currentGain, now);
  playback.gainNode.gain.linearRampToValueAtTime(
    targetGain,
    now + contactStaticGainRampSeconds
  );
};

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
  const [crtScreenOpacity, setCrtScreenOpacity] = useState(0);
  const [reservedContentHeight, setReservedContentHeight] = useState(0);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<FormElement | null>(null);
  const wasEndingActiveRef = useRef(endingState.isActive);
  const staticPlaybackRef = useRef<CachedAudioPlayback | null>(null);
  const isEndingModeActive = endingState.isActive;
  const isNegativeEndingActive = isEndingActive("negative", endingState);
  const isNeutralEndingActive = isEndingActive("neutral", endingState);
  const isPositiveEndingActive = isEndingActive("positive", endingState);
  const isAnalyzing = phase === "analyzing";
  const isDeliveringDmail = phase === "delivering";
  const isEndingSequenceVisible = isAnalyzing || isDeliveringDmail;
  const shouldHideContact = isEndingModeActive;
  const isCrtPowered = gameStateIsBitSet(GameStateFlags.FLAG_CRT);
  const shouldDisplayContactCrt =
    gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND) &&
    !isPositiveEndingActive &&
    !isNeutralEndingActive;
  const shouldPlayContactStatic =
    isCrtPowered && !isPositiveEndingActive && !isNeutralEndingActive;

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
      setTransferSourcePoint(
        shouldTriggerTransfer
          ? getTransferSourcePoint(submitButtonRef.current)
          : null
      );
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
    if (!isCrtPowered) {
      return;
    }

    void preloadAudioBuffers([contactStaticAudioUrl]);
  }, [isCrtPowered]);

  useEffect(() => {
    if (!shouldPlayContactStatic) {
      staticPlaybackRef.current?.stop();
      staticPlaybackRef.current = null;
      setCrtScreenOpacity(0);
      return;
    }

    let playback: CachedAudioPlayback | null = null;
    let isCancelled = false;

    const startStaticPlayback = async () => {
      try {
        playback = await startCachedAudio(contactStaticAudioUrl, {
          gain: 0,
          loop: true,
        });
      } catch {
        return;
      }

      if (isCancelled) {
        playback.stop();
        return;
      }

      staticPlaybackRef.current = playback;
      rampPlaybackGain(
        playback,
        getContactStaticTargetGain(isNegativeEndingActive)
      );
      setCrtScreenOpacity(getContactStaticVisualOpacity());
    };

    void startStaticPlayback();

    return () => {
      isCancelled = true;

      if (playback !== null) {
        playback.stop();
      }

      if (staticPlaybackRef.current === playback) {
        staticPlaybackRef.current = null;
      }
    };
  }, [shouldPlayContactStatic]);

  useEffect(() => {
    if (!shouldPlayContactStatic) {
      return;
    }

    const playback = staticPlaybackRef.current;
    const nextOpacity = getContactStaticVisualOpacity();

    if (playback !== null) {
      rampPlaybackGain(playback, getContactStaticTargetGain(isNegativeEndingActive));
    }

    setCrtScreenOpacity((currentOpacity) => {
      return Math.abs(currentOpacity - nextOpacity) < 0.01
        ? currentOpacity
        : nextOpacity;
    });
  }, [isNegativeEndingActive, shouldPlayContactStatic]);

  useEffect(() => {
    if (!shouldPlayContactStatic) {
      return;
    }

    const updateContactStaticBubble = () => {
      const playback = staticPlaybackRef.current;
      const nextOpacity = getContactStaticVisualOpacity();

      if (playback !== null) {
        rampPlaybackGain(
          playback,
          getContactStaticTargetGain(isNegativeEndingActive)
        );
      }

      setCrtScreenOpacity((currentOpacity) => {
        return Math.abs(currentOpacity - nextOpacity) < 0.01
          ? currentOpacity
          : nextOpacity;
      });
    };

    updateContactStaticBubble();
    window.addEventListener("scroll", updateContactStaticBubble, {
      passive: true,
    });
    window.addEventListener("resize", updateContactStaticBubble);

    return () => {
      window.removeEventListener("scroll", updateContactStaticBubble);
      window.removeEventListener("resize", updateContactStaticBubble);
    };
  }, [isNegativeEndingActive, shouldPlayContactStatic]);

  useEffect(() => {
    if (shouldHideContact) {
      return;
    }

    const element = contentRef.current;

    if (!element) {
      return;
    }

    const updateReservedContentHeight = (nextHeight: number) => {
      const roundedHeight = Math.round(nextHeight);

      setReservedContentHeight((currentHeight) => {
        return currentHeight === roundedHeight ? currentHeight : roundedHeight;
      });
    };

    updateReservedContentHeight(element.getBoundingClientRect().height);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateReservedContentHeight(entry.contentRect.height);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [shouldHideContact]);

  useEffect(() => {
    if (phase !== "delivering" || !isEndingModeActive) {
      return;
    }

    if (pendingTransfer) {
      setTransferKey((currentKey) => currentKey + 1);
      setPendingTransfer(false);
    }

    setPhase("idle");
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
      isCrt={shouldDisplayContactCrt}
      separatorOutCrtScreenOpacity={crtScreenOpacity}
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
          <div
            className="page-margins relative z-20 py-16 sm:py-24"
            style={
              reservedContentHeight > 0
                ? { minHeight: `${reservedContentHeight}px` }
                : undefined
            }
          >
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
          <div className="page-margins relative z-20 py-8" ref={contentRef}>
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
                      id="name"
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
                      id="email"
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
                  id="message"
                  name="message"
                  placeholder={
                    isCrtPowered ? "How did you like the website?" : undefined
                  }
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
                        <ContactSpinner />
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
