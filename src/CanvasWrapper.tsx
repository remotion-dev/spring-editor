import { PlayerInternals } from "@remotion/player";
import { useRef } from "react";
import { Canvas } from "./Canvas";
import { DraggedConfig } from "./App";

export const CanvasWrapper: React.FC<{
  draggedConfigs: (DraggedConfig | null)[];
  draggedDuration: number | null;
  duration: number;
  springConfigs: DraggedConfig[];
  fps: number;
}> = ({ springConfigs, draggedConfigs, draggedDuration, duration, fps }) => {
  const outer = useRef<HTMLDivElement>(null);
  console.log("duration: ", duration, "draggedDuration: ", draggedDuration);
  const elementSize = PlayerInternals.useElementSize(outer, {
    shouldApplyCssTransforms: false,
    triggerOnWindowResize: true,
  });

  return (
    <div
      ref={outer}
      style={{
        flex: 1,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {elementSize ? (
        <Canvas
          springConfigs={springConfigs}
          draggedConfigs={draggedConfigs}
          draggedDuration={draggedDuration}
          duration={duration}
          fps={fps}
          height={elementSize.height * window.devicePixelRatio}
          width={elementSize.width * window.devicePixelRatio}
        />
      ) : null}
    </div>
  );
};
