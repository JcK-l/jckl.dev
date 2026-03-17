import { atom } from "nanostores";

export type PhoneResultMode = "idle" | "number" | "connection";

export const $phoneResultMode = atom<PhoneResultMode>("idle");
export const $phoneNumber = atom<number | null>(null);
export const $phoneTimer = atom<string>("");
export const $phoneCurrentTimestamp = atom<number | null>(null);
export const $phonePastTimestamp = atom<number | null>(null);

export const resetPhoneResult = () => {
  $phoneResultMode.set("idle");
  $phoneNumber.set(null);
  $phoneTimer.set("");
  $phoneCurrentTimestamp.set(null);
  $phonePastTimestamp.set(null);
};

export const setPhoneNumberResult = (number: number) => {
  $phoneResultMode.set("number");
  $phoneNumber.set(number);
};

export const setPhonewaveResult = (
  timer: string,
  currentTimestamp: number,
  pastTimestamp: number
) => {
  $phoneResultMode.set("connection");
  $phoneTimer.set(timer);
  $phoneCurrentTimestamp.set(currentTimestamp);
  $phonePastTimestamp.set(pastTimestamp);
};
