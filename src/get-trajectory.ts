import { spring } from "remotion";
import { ExtendedSpringConfig } from "./App";

export const getTrajectory = (
  durationInFrames: number,
  fps: number,
  springConfigs: (ExtendedSpringConfig | null)[]
) => {
  return new Array(durationInFrames).fill(true).map((_, i) => {
    let totalValue = 0;
    springConfigs.forEach((config) => {
      if (!config) {
        return;
      }
      totalValue += spring({
        fps,
        frame: i,
        config,
        reverse: config.reverse,
        durationInFrames: config.durationInFrames ?? undefined,
        delay: config.delay ?? undefined,
      });
    });
    return totalValue;
  });
};
