export const getHorizontalSwipeDirection = ({
  offsetX,
  offsetY,
  surfaceWidth,
  velocityX,
  distanceRatio,
  maxDistanceThreshold,
  velocityThreshold,
}: {
  offsetX: number;
  offsetY: number;
  surfaceWidth: number;
  velocityX: number;
  distanceRatio: number;
  maxDistanceThreshold: number;
  velocityThreshold: number;
}) => {
  if (surfaceWidth <= 0 || Math.abs(offsetX) <= Math.abs(offsetY)) {
    return 0;
  }

  const dragDistanceThreshold = Math.min(
    surfaceWidth * distanceRatio,
    maxDistanceThreshold
  );

  if (offsetX <= -dragDistanceThreshold || velocityX <= -velocityThreshold) {
    return 1;
  }

  if (offsetX >= dragDistanceThreshold || velocityX >= velocityThreshold) {
    return -1;
  }

  return 0;
};
