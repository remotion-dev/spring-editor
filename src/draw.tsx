import { getTrajectory } from "./get-trajectory";
import {
  LINE_WIDTH,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
  drawTrajectory,
} from "./draw-trajectory";
import { DraggedConfig, ExtendedSpringConfig } from "./App";
import { measureText } from "@remotion/layout-utils";

export let stopDrawing = () => {};

export const draw = ({
  ref,
  duration,
  fps,
  springConfigs,
  draggedConfigs,
  draggedDuration,
  height,
  width,
  labelText,
}: {
  ref: HTMLCanvasElement;
  duration: number;
  fps: number;
  springConfigs: ExtendedSpringConfig[];
  draggedConfigs: DraggedConfig;
  draggedDuration: number | null;
  width: number;
  height: number;
  labelText: string;
}) => {
  const context = ref.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, width, height);
  const trajectory = getTrajectory(duration, fps, springConfigs);

  const hasSomeDragged = draggedConfigs.config !== null;

  const currentIdx = draggedConfigs.index;
  const draggedConfigsToDraw = [
    ...springConfigs.slice(0, currentIdx),
    draggedConfigs.config,
    ...springConfigs.slice(currentIdx + 1),
  ];

  const draggedTrajectory = hasSomeDragged
    ? getTrajectory(
        draggedDuration ?? duration,
        fps,
        draggedConfigsToDraw as ExtendedSpringConfig[]
      )
    : [];
  const max = hasSomeDragged
    ? Math.max(...draggedTrajectory)
    : Math.max(...trajectory);

  context.strokeStyle = "rgba(255, 255, 255, 0.05)";
  context.lineWidth = LINE_WIDTH * window.devicePixelRatio;
  context.lineCap = "round";

  // Draw 0 line
  const zeroHeight = height - PADDING_BOTTOM;
  context.beginPath();
  context.moveTo(PADDING_LEFT, zeroHeight);
  context.lineTo(
    width -
      PADDING_RIGHT -
      measureText({
        fontFamily: "GTPlanar",
        fontSize: 15,
        text: labelText,
        fontWeight: "medium",
        letterSpacing: undefined,
      }).width -
      23 -
      16,
    zeroHeight
  );
  context.stroke();
  context.closePath();

  for (let i = 1; i <= max + 1; i++) {
    const lHeight =
      (height - PADDING_TOP - PADDING_BOTTOM) * (1 - i / max) + PADDING_TOP;
    context.beginPath();
    context.moveTo(
      PADDING_LEFT +
        measureText({
          fontFamily: "GTPlanar",
          fontSize: 15,
          text: i.toString(),
          fontWeight: "medium",
          letterSpacing: undefined,
        }).width +
        8,
      lHeight
    );
    context.lineTo(width - PADDING_RIGHT, lHeight);
    context.stroke();
    context.fillStyle = "white";
    context.closePath();
    context.font = "15px GTPlanar";
    context.fillText(i.toString(), PADDING_LEFT, lHeight + 6);
  }

  const toStop: (() => void)[] = [];
  const stopPrimary = drawTrajectory({
    springTrajectory: trajectory,
    canvasHeight: height,
    canvasWidth: width,
    context,
    max,
    primary: !hasSomeDragged, // Used to be !draggedConfig
    animate: !hasSomeDragged,
    fps,
  });

  toStop.push(stopPrimary);

  if (hasSomeDragged) {
    toStop.push(
      drawTrajectory({
        springTrajectory: draggedTrajectory,
        canvasHeight: height,
        canvasWidth: width,
        context,
        max,
        primary: true,
        animate: false,
        fps,
      })
    );
  }

  stopDrawing = () => {
    toStop.forEach((stop) => stop());
  };
};
