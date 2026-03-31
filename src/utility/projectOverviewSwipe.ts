import { getHorizontalSwipeDirection } from "./horizontalSwipe";

const MOBILE_OVERVIEW_SWIPE_DISTANCE_RATIO = 0.1;
const MAX_MOBILE_OVERVIEW_SWIPE_THRESHOLD_PX = 72;
const MOBILE_OVERVIEW_SWIPE_VELOCITY_THRESHOLD = 380;

export const getProjectOverviewSwipeDirection = ({
  offsetX,
  offsetY,
  surfaceWidth,
  velocityX,
}: {
  offsetX: number;
  offsetY: number;
  surfaceWidth: number;
  velocityX: number;
}) => {
  return getHorizontalSwipeDirection({
    offsetX,
    offsetY,
    surfaceWidth,
    velocityX,
    distanceRatio: MOBILE_OVERVIEW_SWIPE_DISTANCE_RATIO,
    maxDistanceThreshold: MAX_MOBILE_OVERVIEW_SWIPE_THRESHOLD_PX,
    velocityThreshold: MOBILE_OVERVIEW_SWIPE_VELOCITY_THRESHOLD,
  });
};
