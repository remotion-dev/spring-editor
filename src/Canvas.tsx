import React, { useEffect, useMemo } from "react";
import { draw, stopDrawing } from "./draw";
import { DraggedConfig } from "./App";
import { Spacing } from "./Spacing";
import { PADDING_BOTTOM, PADDING_RIGHT } from "./draw-trajectory";

const canvasRef = React.createRef<HTMLCanvasElement>();

const row: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontFamily: "GTPlanar",
  fontSize: 15,
  alignItems: "center",
  position: "absolute",
  right: PADDING_RIGHT,
  bottom: PADDING_BOTTOM - 12,
};

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
  }, []);

  const durationLabel = `${(duration / fps).toFixed(2)}sec`;

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
      labelText: durationLabel,
    });
  }, [
    draggedDuration,
    duration,
    config,
    draggedConfig,
    fps,
    width,
    height,
    durationLabel,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={canvasStyle}
      />
      <div style={row}>
        <svg height="1em" viewBox="0 0 512 512">
          <path
            fill="white"
            d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
          />
        </svg>
        <Spacing x={1} />
        {durationLabel}
      </div>
    </>
  );
};
