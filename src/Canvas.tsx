import React, { useEffect, useMemo } from "react";
import { draw } from "./draw";
import { SpringConfig } from "remotion";

const canvasRef = React.createRef<HTMLCanvasElement>();

export const Canvas: React.FC<{
  width: number;
  height: number;
  draggedConfig: SpringConfig | null;
  draggedDuration: number | null;
  duration: number;
  config: SpringConfig;
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
      width,
      height,
      backgroundColor: "var(--background)",
    };
  }, [height, width]);

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("no canvas");
    }

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
