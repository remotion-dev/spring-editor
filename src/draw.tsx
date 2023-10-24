import { SpringConfig } from "remotion";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./Canvas";
import { getTrajectory } from "./get-trajectory";
import {
  LINE_WIDTH,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
  drawTrajectory,
} from "./draw-trajectory";

let latestRerender = Date.now();

export const draw = ({
  ref,
  duration,
  fps,
  config,
  draggedConfig,
  draggedDuration,
}: {
  ref: HTMLCanvasElement;
  duration: number;
  fps: number;
  config: SpringConfig;
  draggedConfig: SpringConfig | null;
  draggedDuration: number | null;
}) => {
  const context = ref.getContext("2d");

  if (!context) {
    return;
  }

  latestRerender = Date.now();
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const trajectory = getTrajectory(duration, fps, config);
  const draggedTrajectory = draggedConfig
    ? getTrajectory(draggedDuration ?? duration, fps, draggedConfig)
    : [];

  const max = draggedConfig
    ? Math.max(...draggedTrajectory)
    : Math.max(...trajectory);

  context.strokeStyle = "rgba(255, 255, 255, 0.05)";
  context.lineWidth = LINE_WIDTH;
  context.lineCap = "round";

  // Draw 0 line
  const zeroHeight = CANVAS_HEIGHT - PADDING_BOTTOM;
  context.beginPath();
  context.moveTo(PADDING_LEFT, zeroHeight);
  context.lineTo(CANVAS_WIDTH - PADDING_RIGHT, zeroHeight);
  context.stroke();
  context.closePath();

  // Draw 1 line
  const oneHeight =
    (CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * (1 - 1 / max) +
    PADDING_TOP;
  context.beginPath();
  context.moveTo(PADDING_LEFT, oneHeight);
  context.lineTo(CANVAS_WIDTH - PADDING_RIGHT, oneHeight);
  context.stroke();
  context.closePath();

  drawTrajectory({
    springTrajectory: trajectory,
    canvasHeight: CANVAS_HEIGHT,
    canvasWidth: CANVAS_WIDTH,
    context,
    max,
    primary: draggedConfig ? false : true,
    animate: !draggedConfig,
    fps,
  });
  if (draggedConfig) {
    drawTrajectory({
      springTrajectory: draggedTrajectory,
      canvasHeight: CANVAS_HEIGHT,
      canvasWidth: CANVAS_WIDTH,
      context,
      max,
      primary: true,
      animate: false,
      fps,
    });
  }
};
