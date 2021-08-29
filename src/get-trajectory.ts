import { spring, SpringConfig } from "remotion";

export const getTrajectory = (
  durationInFrames: number,
  fps: number,
  config: SpringConfig
) => {
  return new Array(durationInFrames).fill(true).map((_, i) => {
    return spring({
      fps,
      frame: i,
      config,
    });
  });
};
