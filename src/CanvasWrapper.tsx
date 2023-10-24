import { PlayerInternals } from "@remotion/player";
import { forwardRef, useRef } from "react";
import { Canvas } from "./Canvas";
import { SpringConfig } from "remotion";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

const CanvasWrapperForward: React.ForwardRefRenderFunction<
  HTMLCanvasElement,
  {
    draggedConfig: SpringConfig | null;
    draggedDuration: number | null;
    duration: number;
    config: SpringConfig;
    fps: number;
  }
> = ({ config, draggedConfig, draggedDuration, duration, fps }, ref) => {
  const outer = useRef<HTMLDivElement>(null);

  const elementSize = PlayerInternals.useElementSize(outer, {
    shouldApplyCssTransforms: false,
    triggerOnWindowResize: true,
  });

  return (
    <div style={{ flex: 1 }} ref={outer}>
      {elementSize ? (
        <Canvas
          config={config}
          draggedConfig={draggedConfig}
          draggedDuration={draggedDuration}
          duration={duration}
          fps={fps}
          height={elementSize.height}
          width={elementSize.width}
        ></Canvas>
      ) : null}
    </div>
  );
};

export const CanvasWrapper = forwardRef(CanvasWrapperForward);
