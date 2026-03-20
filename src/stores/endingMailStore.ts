import { atom } from "nanostores";
import type { SentimentLabel } from "./endingStore";

export type EndingMail = {
  date: string;
  email: string;
  message: string;
  name: string;
};

type EndingMailBySentiment = Record<SentimentLabel, EndingMail | null>;

const defaultEndingMailBySentiment: EndingMailBySentiment = {
  negative: null,
  neutral: null,
  positive: null,
};

export const $endingMailBySentiment = atom<EndingMailBySentiment>(
  defaultEndingMailBySentiment
);

export const saveEndingMail = (
  sentiment: SentimentLabel,
  endingMail: EndingMail
) => {
  $endingMailBySentiment.set({
    ...$endingMailBySentiment.get(),
    [sentiment]: endingMail,
  });
};
