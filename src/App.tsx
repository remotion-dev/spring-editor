import { useCallback, useRef, useState } from "react";
import { measureSpring, SpringConfig } from "remotion";
import { AnimationPreview } from "./AnimationPreview";

import { Sidebar } from "./Sidebar";
import { CanvasWrapper } from "./CanvasWrapper";

const fps = 60;

export type DraggedConfig = SpringConfig & {
  reverse: boolean;
};

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<
    SpringConfig & {
      reverse: boolean;
    }
  >({
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    reverse: false,
  });

  const [draggedConfig, setDraggedConfig] = useState<DraggedConfig | null>(
    null
  );

  const onMassChange = useCallback(
    (e: [number]) => {
      setDraggedConfig({ ...config, mass: e[0] });
    },
    [config]
  );

  const onDampingChange = useCallback(
    (e: number[]) => {
      setDraggedConfig({ ...config, damping: e[0] });
    },
    [config]
  );

  const onStiffnessChange = useCallback(
    (e: number[]) => {
      setDraggedConfig({ ...config, stiffness: e[0] });
    },
    [config]
  );

  const onOvershootClampingChange = useCallback(
    (checked: boolean) => {
      setDraggedConfig({
        ...config,
        overshootClamping: checked,
      });
      setConfig({
        ...config,
        overshootClamping: checked,
      });
    },
    [config]
  );

  const onReverseChange = useCallback(
    (checked: boolean) => {
      setDraggedConfig({
        ...config,
        reverse: checked,
      });
      setConfig({
        ...config,
        reverse: checked,
      });
    },
    [config]
  );

  const onRelease = useCallback(() => {
    if (draggedConfig) {
      setConfig(draggedConfig as DraggedConfig);
    }
    setDraggedConfig(null);
  }, [draggedConfig]);

  const duration = measureSpring({
    fps,
    threshold: 0.001,
    config: config,
  });
  const draggedDuration = draggedConfig
    ? measureSpring({
        fps,
        threshold: 0.001,
        config: draggedConfig,
      })
    : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        position: "absolute",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          boxShadow: "0 3px 10px var(--shadow-color)",
          display: "flex",
          flexDirection: "row",
          borderRadius: 8,
          overflow: "hidden",
          flex: 1,
          height: "100%",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CanvasWrapper
            config={config}
            draggedConfig={draggedConfig}
            draggedDuration={draggedDuration}
            duration={duration}
            fps={fps}
            ref={ref}
          ></CanvasWrapper>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <AnimationPreview animation="Scale" id="scale"></AnimationPreview>
            <AnimationPreview
              animation="Translate"
              id="translate"
            ></AnimationPreview>
            <AnimationPreview animation="Rotate" id="rotate"></AnimationPreview>
          </div>
        </div>
        <Sidebar
          mass={draggedConfig?.mass ?? config.mass}
          damping={draggedConfig?.damping ?? config.damping}
          stiffness={draggedConfig?.stiffness ?? config.stiffness}
          onMassChange={onMassChange}
          onDampingChange={onDampingChange}
          onStiffnessChange={onStiffnessChange}
          onRelease={onRelease}
          overshootClamping={config.overshootClamping}
          duration={draggedDuration ?? duration}
          fps={fps}
          onOvershootClampingChange={onOvershootClampingChange}
          reverse={config.reverse}
          onReverseChange={onReverseChange}
        ></Sidebar>
      </div>
    </div>
  );
}

export default App;
