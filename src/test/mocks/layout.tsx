import type { ReactNode } from "react";

type RenderItem = ((shift: number) => ReactNode) | (() => ReactNode);

export const MockBetweenLands = ({
  crtCallback,
  renderItem,
  separatorInMiddleLayer,
  separatorOutUnderLayer,
  separatorOutMiddleLayer,
}: {
  crtCallback?: () => void;
  renderItem?: RenderItem;
  separatorInMiddleLayer?: ReactNode;
  separatorOutUnderLayer?: ReactNode;
  separatorOutMiddleLayer?: ReactNode;
}) => {
  let renderedItem: ReactNode = null;

  if (typeof renderItem === "function") {
    renderedItem =
      renderItem.length > 0
        ? (renderItem as (shift: number) => ReactNode)(0)
        : (renderItem as () => ReactNode)();
  }

  return (
    <div>
      {!crtCallback ? null : (
        <button type="button" onClick={crtCallback}>
          trigger-crt
        </button>
      )}
      <div data-testid="between-lands">{renderedItem}</div>
      <div data-testid="separator-in">{separatorInMiddleLayer}</div>
      <div data-testid="separator-out-under">{separatorOutUnderLayer}</div>
      <div data-testid="separator-out">{separatorOutMiddleLayer}</div>
    </div>
  );
};

export const MockPuzzlePieceTransfer = ({
  triggerKey,
  onComplete,
}: {
  triggerKey: number;
  onComplete: () => void;
}) => (
  <div data-testid="piece-transfer">
    <span>{`trigger:${triggerKey}`}</span>
    <button type="button" onClick={onComplete}>
      complete-transfer
    </button>
  </div>
);
