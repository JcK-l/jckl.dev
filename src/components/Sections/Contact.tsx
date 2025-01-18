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
import { Email, Send } from "../../utility/icons";
import OpenAI from "openai";

const Contact = () => {
  const binaryState = useStore($binaryState);
  const formData = useStore($formData);
  const [showIcon, setShowIcon] = useState(true);
  const client = new OpenAI();

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

  const fetchCompletion = async () => {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
    });

    console.log(completion.choices[0].message);
  };

  useEffect(() => {
    fetchCompletion();
  }, []);

  const handleSubmit = (event: React.FormEvent<FormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data: FormData = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value,
    };

    if (isBitSet(BitPosition.FLAG_CRT)) {
      if (validateMessage(data.message, form.elements.message)) {
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
      gainNode.gain.value = 0.1;

      gainNode.connect(audioContext.destination); // Ensure gainNode is connected to destination
      source.connect(gainNode);

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
                <Email />
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
              onChange={(event) => {
                if (isBitSet(BitPosition.FLAG_CRT)) {
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
                isBitSet(BitPosition.FLAG_CRT) ? { rotate: [0, 1, -1, 0] } : {}
              }
              type="submit"
            >
              <div className="flex items-center justify-center gap-1">
                Send Message
                <Send />
              </div>
            </motion.button>
          </form>
        </div>
      )}
    />
  );
};

export default Contact;
