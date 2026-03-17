import { TypingText } from "./TypingText";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { formatDate } from "../utility/formatDate";
import {
  isInPhoneTargetWindow,
  PHONE_TARGET_LABEL,
} from "../utility/phoneTargetDate";
import {
  $phoneCurrentTimestamp,
  $phonePastTimestamp,
  $phoneResultMode,
  $phoneTimer,
} from "../stores/phoneStore";

export const Connection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const mode = useStore($phoneResultMode);
  const timer = useStore($phoneTimer);
  const currentTimestamp = useStore($phoneCurrentTimestamp);
  const pastTimestamp = useStore($phonePastTimestamp);

  useEffect(() => {
    setCurrentStep(0);
  }, [currentTimestamp, pastTimestamp, timer]);

  if (
    mode !== "connection" ||
    currentTimestamp === null ||
    pastTimestamp === null
  ) {
    return null;
  }

  const currentDate = new Date(currentTimestamp);
  const pastDate = new Date(pastTimestamp);
  const isSuccess = isInPhoneTargetWindow(pastDate);

  return (
    <div className="relative mx-auto w-10/12 sm:w-7/12 h-[10rem]">
      {currentStep === 0 && (
        <TypingText
          text={`ESTABLISHING CONNECTION...`}
          onComplete={() => setCurrentStep(1)}
          onCompleteDelay={1500}
        />
      )}
      {currentStep >= 1 && (
        <TypingText
          text={`CONNECTION ESTABLISHED`}
          onComplete={() => setCurrentStep(2)}
          onCompleteDelay={1500}
        />
      )}
      {currentStep >= 2 && (
        <TypingText
          text={`TARGET WINDOW: ${PHONE_TARGET_LABEL}`}
          onComplete={() => setCurrentStep(3)}
        />
      )}
      {currentStep >= 3 && (
        <TypingText
          text={`CURRENT DATE: ${formatDate(currentDate, true)}`}
          onComplete={() => setCurrentStep(4)}
        />
      )}
      {currentStep >= 4 && (
        <TypingText
          text={`TIMER SET: ${timer}`}
          onComplete={() => setCurrentStep(5)}
          onCompleteDelay={1500}
        />
      )}
      {currentStep >= 5 &&
        (
          <TypingText
            text={`PAST DATE: ${formatDate(pastDate, true)}`}
            onComplete={() => setCurrentStep(6)}
            onCompleteDelay={1500}
          />
        )}
      {currentStep >= 6 &&
        (isSuccess ? (
          <TypingText
            text={`SUCCESS: The past date is inside ${PHONE_TARGET_LABEL}.`}
            onComplete={() => setCurrentStep(7)}
          />
        ) : (
          <TypingText
            text={`FAILURE: The past date is outside ${PHONE_TARGET_LABEL}.`}
            onComplete={() => setCurrentStep(7)}
          />
        ))}
    </div>
  );
};
