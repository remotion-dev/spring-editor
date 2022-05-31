import React from "react";
import { interpolate, interpolateColors } from "remotion";

const gradient = ["#42e9f5", "#4290f5"] as const;

export const LINE_WIDTH = 5;
export const PADDING_LEFT = 80;
export const PADDING_RIGHT = 20;
export const PADDING_TOP = 20;
export const PADDING_BOTTOM = 20;

export const drawTrajectory = async ({
  context,
  canvasHeight,
  canvasWidth,
  springTrajectory,
  primary,
  max,
  animate,
  fps,
  renderTime,
  lastRenderRef,
  darkMode,
}: {
  primary: boolean;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  springTrajectory: number[];
  max: number;
  animate: boolean;
  fps: number;
  renderTime: number;
  lastRenderRef: React.MutableRefObject<number>;
  darkMode: boolean;
}) => {
  const intervalBetweenDraw = 1000 / fps;
  const segmentWidth =
    (canvasWidth - PADDING_LEFT - PADDING_RIGHT) /
    (springTrajectory.length - 1);

  let lastX = PADDING_LEFT;
  let lastY = canvasHeight - PADDING_BOTTOM;
  let lastDraw = Date.now();
  for (let i = 0; i < springTrajectory.length; i++) {
    if (lastRenderRef.current !== renderTime) {
      break;
    }
    const timeSinceLastDraw = Date.now() - lastDraw;
    if (animate) {
      await new Promise((resolve) =>
        setTimeout(resolve, intervalBetweenDraw - timeSinceLastDraw)
      );
    }
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineWidth = LINE_WIDTH;
    context.lineCap = "round";
    const color = interpolateColors(
      i,
      [0, springTrajectory.length - 1],
      gradient
    );
    const x = segmentWidth * i + PADDING_LEFT;
    const y =
      (canvasHeight - PADDING_TOP - PADDING_BOTTOM) *
        (1 - springTrajectory[i] / max) +
      PADDING_TOP;
    lastX = x;
    lastY = y;

    context.strokeStyle = primary ? color : darkMode ? "#333" : "#eee";
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    lastDraw = Date.now();

    (
      document.getElementById("scale") as HTMLElement
    ).style.transform = `scale(${springTrajectory[i]})`;
    (
      document.getElementById("translate") as HTMLElement
    ).style.transform = `translateY(${interpolate(
      springTrajectory[i],
      [0, 1],
      [100, 0]
    )}px)`;
    (
      document.getElementById("rotate") as HTMLElement
    ).style.transform = `rotate(${interpolate(
      springTrajectory[i],
      [0, 1],
      [Math.PI * 2, 0]
    )}rad)`;
  }
};
