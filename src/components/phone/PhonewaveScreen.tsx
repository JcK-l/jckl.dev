import { ApplianceTerminal } from "../ApplianceTerminal";
import { TypingText } from "../TypingText";

export type PhonewaveTone = "neutral" | "success" | "failure" | "muted";
export type PhonewaveLine = {
  label: string;
  tone?: PhonewaveTone;
  value: string;
};

const toneClassNames: Record<PhonewaveTone, string> = {
  neutral: "text-[var(--color-appliance-screen-text)]",
  success: "text-[var(--color-green)]",
  failure: "text-[var(--color-baloon1)]",
  muted: "text-[var(--color-appliance-screen-muted)]",
};

const formatPhonewaveLine = ({ label, value }: PhonewaveLine) =>
  `[${label}] ${value}`;

const PHONEWAVE_TYPING_DELAY_MS = 16;
const PHONEWAVE_TYPING_DELAY_JITTER_MS = 3;
const PHONEWAVE_BOOT_SETTLE_MS = 520;
const PHONEWAVE_LINE_SETTLE_MS = 180;

const phonewaveLineClassName =
  "text-[0.72rem] uppercase tracking-[0.18em] sm:text-[0.82rem]";

const renderStaticLine = (line: PhonewaveLine, index: number) => (
  <p
    key={`${line.label}-${index}`}
    className={`${phonewaveLineClassName} ${
      toneClassNames[line.tone ?? "neutral"]
    }`}
  >
    {formatPhonewaveLine(line)}
  </p>
);

export const PhonewaveScreen = ({
  animate,
  className = "",
  currentStep,
  lines,
  onStepComplete,
}: {
  animate: boolean;
  className?: string;
  currentStep: number;
  lines: PhonewaveLine[];
  onStepComplete: (step: number) => void;
}) => {
  const shouldAnimate = animate && currentStep < lines.length;

  return (
    <ApplianceTerminal
      bodyClassName="flex flex-col space-y-2.5"
      className={`min-h-[16rem] ${className}`}
      headerLabel="event log"
    >
      {shouldAnimate
        ? lines.map((line, index) => {
            if (index < currentStep) {
              return renderStaticLine(line, index);
            }

            if (index > currentStep) {
              return null;
            }

            return (
              <TypingText
                key={`${line.label}-${index}`}
                className={`${phonewaveLineClassName} ${
                  toneClassNames[line.tone ?? "neutral"]
                }`}
                text={formatPhonewaveLine(line)}
                typingDelay={PHONEWAVE_TYPING_DELAY_MS}
                typingDelayJitter={PHONEWAVE_TYPING_DELAY_JITTER_MS}
                onComplete={() => {
                  if (index === lines.length - 1) {
                    onStepComplete(lines.length);
                    return;
                  }

                  onStepComplete(index + 1);
                }}
                onCompleteDelay={
                  line.label === "boot"
                    ? PHONEWAVE_BOOT_SETTLE_MS
                    : PHONEWAVE_LINE_SETTLE_MS
                }
              />
            );
          })
        : lines.map(renderStaticLine)}
    </ApplianceTerminal>
  );
};
