export const getPhoneTargetStart = () => new Date(2023, 4, 1, 0, 0, 0, 0);

export const getPhoneTargetEnd = () =>
  new Date(2023, 4, 31, 23, 59, 59, 999);

export const isInPhoneTargetWindow = (date: Date) =>
  date.getTime() >= getPhoneTargetStart().getTime() &&
  date.getTime() <= getPhoneTargetEnd().getTime();

export const PHONE_TARGET_LABEL = "MAY 2023";
