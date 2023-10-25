import { PlayerInternals } from "@remotion/player";
import { forwardRef, useRef } from "react";
import { Canvas } from "./Canvas";
import { DraggedConfig } from "./App";

const CanvasWrapperForward: React.ForwardRefRenderFunction<
  HTMLCanvasElement,
  {
    draggedConfig: DraggedConfig | null;
    draggedDuration: number | null;
    duration: number;
    config: DraggedConfig;
    fps: number;
  }
> = ({ config, draggedConfig, draggedDuration, duration, fps }, ref) => {
  const outer = useRef<HTMLDivElement>(null);

  const elementSize = PlayerInternals.useElementSize(outer, {
    shouldApplyCssTransforms: false,
    triggerOnWindowResize: true,
  });

  return (
    <div
      style={{ flex: 1, overflow: "hidden", width: "100%", height: "100%" }}
      ref={outer}
    >
      {elementSize ? (
        <Canvas
          config={config}
          draggedConfig={draggedConfig}
          draggedDuration={draggedDuration}
          duration={duration}
          fps={fps}
          height={elementSize.height}
          width={elementSize.width}
        />
      ) : null}
    </div>
  );
};

export const CanvasWrapper = forwardRef(CanvasWrapperForward);
