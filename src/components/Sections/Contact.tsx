import { BetweenLands } from "../BetweenLands";
import {
  $binaryState,
  BitPosition,
  isBitSet,
  setBit,
} from "../../stores/binaryStateStore";
import { $formData } from "../../stores/stringStore";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { getAudioContext } from "../../utility/audioContext";

const Contact = () => {
  const binaryState = useStore($binaryState);
  const formData = useStore($formData);
  const [warning, setWarning] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState(true);

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

  const validateMessage = (message: string, textarea: HTMLTextAreaElement) => {
    console.log("Message:", message);
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    if (messageBytes.length > 36) {
      textarea.setCustomValidity(
        "You can only send a message to the target year using 36 bytes."
      );
      setWarning(true);
    } else {
      textarea.setCustomValidity("");
      setWarning(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<FormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data: FormData = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value,
    };

    if (isBitSet(BitPosition.FLAG_CRT)) {
      validateMessage(data.message, form.elements.message);
      if (!warning) {
        $formData.set(data);
        console.log("Form data saved:", data);
        setBit(BitPosition.FLAG_SECRET);
      }
    } else {
      form.submit();
    }
  };

  useEffect(() => {
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
      gainNode.gain.value = 0.10; 

      gainNode.connect(audioContext.destination); // Ensure gainNode is connected to destination
      source.connect(gainNode);

      console.log("Gain value:", gainNode.gain.value); // Log gain value
      console.log("Audio context state:", audioContext.state); // Log audio context state

      source.start(0);
    };

    if (isBitSet(BitPosition.FLAG_CRT)) {
      fetchAudio();
    }

    return () => {
      if (source) {
        source.stop();
        source.disconnect();
      }
    };
  }, [isBitSet(BitPosition.FLAG_CRT)]);

  return (
    <BetweenLands
      isBackground={false}
      isCrt={isBitSet(BitPosition.FLAG_LEND_A_HAND)}
      renderItem={(shift) => (
        <div className="page-margins pointer-events-auto relative z-20 flex flex-col items-center justify-between py-8 sm:flex-row sm:items-start">
          <div className="m-4 w-full text-white sm:w-1/2">
            <h3 className="h3-text sm:h4-text mb-6 font-heading font-bold">
              Do you want to get in touch?
            </h3>

            <p className="font-sans leading-[16px] ">
              Then you can fill out this form or <br />
              <br />
              <span className="flex items-center justify-start gap-1">
                {/* https://www.svgrepo.com/svg/513836/mail */}
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title />
                  <g id="Complete">
                    <g id="mail">
                      <g>
                        <polyline
                          fill="none"
                          points="4 8.2 12 14.1 20 8.2"
                          stroke="var(--color-white)"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                        <rect
                          fill="none"
                          height="14"
                          rx="2"
                          ry="2"
                          stroke="var(--color-white)"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          width="18"
                          x="3"
                          y="6.5"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
                mail@jckl.dev
              </span>
              <br />
              I'm thrilled to hear from you!
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
              onChange={(e) =>
                isBitSet(BitPosition.FLAG_CRT) &&
                validateMessage(e.currentTarget.value, e.currentTarget) &&
                e.currentTarget.reportValidity()
              }
              required
            ></textarea>
            <motion.button
              className="w-full rounded-lg border-white p-2 text-white ring ring-white hover:bg-secondary xl:p-4"
              animate={
                isBitSet(BitPosition.FLAG_CRT) ? { rotate: [0, 1, -1, 0] } : {}
              }
              type="submit"
            >
              <div className="flex items-center justify-center gap-1">
                Send Message
                {showIcon && (
                  // https://www.svgrepo.com/svg/533306/send
                  <motion.svg
                    className="h-6 w-6 text-white"
                    animate={
                      isBitSet(BitPosition.FLAG_SECRET)
                        ? {
                            rotate: [0, 40],
                            x: [0, 0, 1000],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      ease: "linear",
                    }}
                    onAnimationComplete={() => setShowIcon(false)}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="var(--color-white)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          </form>
        </div>
      )}
    />
  );
};

export default Contact;
