import { useCallback, useRef, useState } from "react";
import { measureSpring, SpringConfig } from "remotion";
import { AnimationPreview } from "./AnimationPreview";

import { Sidebar } from "./Sidebar";
import { CanvasWrapper } from "./CanvasWrapper";
import { DEFAULT_DAMPING, DEFAULT_MASS, DEFAULT_STIFFNESS } from "./defaults";
import { Header } from "./Header";

const fps = 60;

export type DraggedConfig = SpringConfig & {
  reverse: boolean;
};

function App() {
  const [config, setConfig] = useState<
    SpringConfig & {
      reverse: boolean;
    }
  >({
    damping: DEFAULT_DAMPING,
    mass: DEFAULT_MASS,
    stiffness: DEFAULT_STIFFNESS,
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
    config,
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
        flexDirection: "column",
      }}
    >
      <Header />
      <div
        id="app"
        style={{
          boxShadow: "0 3px 10px var(--shadow-color)",
          display: "flex",
          borderRadius: 8,
          overflow: "hidden",
          width: "100%",
          flex: 1,
        }}
      >
        <div id="canvas">
          <CanvasWrapper
            config={config}
            draggedConfig={draggedConfig}
            draggedDuration={draggedDuration}
            duration={duration}
            fps={fps}
          />
          <div id="animation-preview">
            <AnimationPreview animation="Scale" id="scale" />
            <AnimationPreview animation="Translate" id="translate" />
            <AnimationPreview animation="Rotate" id="rotate" />
          </div>
        </div>
        <Sidebar
          mass={draggedConfig?.mass ?? config.mass}
          damping={draggedConfig?.damping ?? config.damping}
          stiffness={draggedConfig?.stiffness ?? config.stiffness}
          overshootClamping={config.overshootClamping}
          duration={draggedDuration ?? duration}
          fps={fps}
          reverse={config.reverse}
          onMassChange={onMassChange}
          onDampingChange={onDampingChange}
          onStiffnessChange={onStiffnessChange}
          onRelease={onRelease}
          onOvershootClampingChange={onOvershootClampingChange}
          onReverseChange={onReverseChange}
        />
      </div>
    </div>
  );
}

export default App;
