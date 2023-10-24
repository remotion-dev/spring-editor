import { PlayerInternals } from "@remotion/player";
import { forwardRef, useMemo, useRef } from "react";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

const CanvasForward: React.ForwardRefRenderFunction<HTMLCanvasElement> = (
  props,
  ref
) => {
  const outer = useRef<HTMLDivElement>(null);

  const elementSize = PlayerInternals.useElementSize(outer, {
    shouldApplyCssTransforms: false,
    triggerOnWindowResize: true,
  });

  const canvasStyle: React.CSSProperties = useMemo(() => {
    if (!elementSize) {
      return {};
    }

    return {
      width: elementSize.width,
      height: elementSize.height,
      backgroundColor: "var(--background)",
    };
  }, []);

  return (
    <div style={{ flex: 1 }} ref={outer}>
      {elementSize ? (
        <canvas
          width={elementSize.width}
          height={elementSize.height}
          ref={ref}
          style={canvasStyle}
        ></canvas>
      ) : null}
    </div>
  );
};

export const Canvas = forwardRef(CanvasForward);
