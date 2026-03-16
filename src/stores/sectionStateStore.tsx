import { atom } from "nanostores";

export const $hasSeenAbout = atom(false);
export const $isAboutInView = atom(false);

export const markAboutSeen = () => {
  if (!$hasSeenAbout.get()) {
    $hasSeenAbout.set(true);
  }
};

export const setAboutInView = (isInView: boolean) => {
  $isAboutInView.set(isInView);
};
