import React, { useEffect, useMemo } from "react";
import { draw, stopDrawing } from "./draw";
import { DraggedConfig } from "./App";

const canvasRef = React.createRef<HTMLCanvasElement>();

export const Canvas: React.FC<{
  width: number;
  height: number;
  draggedConfig: DraggedConfig | null;
  draggedDuration: number | null;
  duration: number;
  config: DraggedConfig;
  fps: number;
}> = ({
  height,
  width,
  draggedConfig,
  draggedDuration,
  config,
  duration,
  fps,
}) => {
  const canvasStyle: React.CSSProperties = useMemo(() => {
    return {
      width: "100%",
      height: "100%",
      backgroundColor: "var(--background)",
    };
  }, [height, width]);

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("no canvas");
    }

    stopDrawing();
    draw({
      ref: canvasRef.current,
      duration: draggedDuration ?? duration,
      config,
      draggedConfig,
      fps,
      draggedDuration,
      height,
      width,
    });
  }, [draggedDuration, duration, config, draggedConfig, fps, width, height]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      style={canvasStyle}
    ></canvas>
  );
};
