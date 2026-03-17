import { atom } from "nanostores";

export type PhoneResultMode = "idle" | "number" | "connection";

export const $phoneResultMode = atom<PhoneResultMode>("idle");
export const $phoneNumber = atom<number | null>(null);
export const $phoneTimer = atom<number>(0);

export const resetPhoneResult = () => {
  $phoneResultMode.set("idle");
  $phoneNumber.set(null);
  $phoneTimer.set(0);
};

export const setPhoneNumberResult = (number: number) => {
  $phoneResultMode.set("number");
  $phoneNumber.set(number);
};

export const setPhoneConnectionResult = (timer: number) => {
  $phoneResultMode.set("connection");
  $phoneTimer.set(timer);
};
