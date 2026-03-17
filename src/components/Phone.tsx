import { useState } from "react";
import { resetPhoneResult, setPhoneNumberResult } from "../stores/phoneStore";
import { PhonePad } from "./PhonePad";

const formatPhoneDisplay = (input: string) => {
  if (input === "") {
    return "";
  }

  if (!/^\d+$/.test(input)) {
    return input;
  }

  return input.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const Phone = () => {
  const [input, setInput] = useState("");

  const handleDigit = (digit: string) => {
    setInput((currentInput) => currentInput + digit);
  };

  const handleCancel = () => {
    setInput((currentInput) => currentInput.slice(0, -1));
  };

  const handleCall = () => {
    if (input === "") {
      resetPhoneResult();
      return;
    }

    const digitsOnly = input.replace(/\D/g, "");
    const inputNumber = digitsOnly === "" ? null : Number(digitsOnly);

    if (inputNumber === null) {
      resetPhoneResult();
      return;
    }

    setInput("");
    setPhoneNumberResult(inputNumber);
  };

  return (
    <PhonePad
      display={formatPhoneDisplay(input)}
      onBottomLeft={() => handleDigit("*")}
      onBottomRight={() => handleDigit("#")}
      onCall={handleCall}
      onCancel={handleCancel}
      onDigit={handleDigit}
      showCallButton={true}
      showCancelButton={input !== ""}
    />
  );
};
