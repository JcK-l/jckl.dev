import { TypingText } from "./TypingText";
import { useEffect, useState } from "react";
import { usePhoneContext } from "../hooks/useDataContext";
import { formatDate } from "../utility/formatDate";

export const Connection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { number, setNumber, timer, setTimer } = usePhoneContext();

  const currentDate = new Date();
  const pastDate = new Date(currentDate.getTime() - timer * 60 * 60 * 1000);

  const isSuccess = pastDate.getFullYear() === 2024;

  useEffect(() => {
    // Reset the connection when any of the values change, except when isSuccess is true
    setCurrentStep(0);
  }, [timer]);

  if (number !== -1) {
    return null;
  }

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
          text={`TARGET YEAR: 2024`}
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
          text={`DATE ${timer} HOURS AGO: ${formatDate(pastDate, true)}`}
          onComplete={() => setCurrentStep(5)}
          onCompleteDelay={1500}
        />
      )}
      {currentStep >= 5 &&
        (isSuccess ? (
          <TypingText
            text="SUCCESS: The past date is in the year 2024."
            onComplete={() => setCurrentStep(6)}
          />
        ) : (
          <TypingText
            text={`FAILURE: The past date is in the year ${pastDate.getFullYear()}.`}
            onComplete={() => setCurrentStep(6)}
          />
        ))}
    </div>
  );
};
