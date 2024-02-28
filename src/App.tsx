import { useCallback, useState } from "react";
import { measureSpring, SpringConfig } from "remotion";
import { AnimationPreview } from "./AnimationPreview";

import { Sidebar } from "./Sidebar";
import { CanvasWrapper } from "./CanvasWrapper";
import { DEFAULT_DAMPING, DEFAULT_MASS, DEFAULT_STIFFNESS } from "./defaults";
import { Header } from "./Header";

const fps = 60;

export type DraggedConfig = SpringConfig & {
  reverse: boolean;
  durationInFrames: number | null;
  delay: number;
};

function App() {
  const [springConfigs, setSpringConfigs] = useState<DraggedConfig[]>([
    {
      damping: DEFAULT_DAMPING,
      mass: DEFAULT_MASS,
      stiffness: DEFAULT_STIFFNESS,
      overshootClamping: false,
      reverse: false,
      durationInFrames: null,
      delay: 0,
    },
    {
      damping: DEFAULT_DAMPING,
      mass: DEFAULT_MASS,
      stiffness: DEFAULT_STIFFNESS,
      overshootClamping: false,
      reverse: false,
      durationInFrames: null,
      delay: 0,
    },
  ]);

  const [draggedConfig, setDraggedConfig] = useState<DraggedConfig | null>(
    null
  );

  const onMassChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        mass: e[0],
      });
    },
    [springConfigs]
  );
  const onDampingChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        damping: e[0],
      });
    },
    [springConfigs]
  );

  const onStiffnessChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        stiffness: e[0],
      });
    },
    [springConfigs]
  );

  const onDurationInFramesChange = useCallback(
    (e: number | null, index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        durationInFrames: e,
      });
    },
    [springConfigs]
  );

  const onDelayChange = useCallback(
    (e: number, index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        delay: e,
      });
      setSpringConfigs([
        ...springConfigs.slice(0, index),
        { ...springConfigs[index], delay: e },
        ...springConfigs.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onOvershootClampingChange = useCallback(
    (checked: boolean, index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        overshootClamping: checked,
      });
      setSpringConfigs([
        ...springConfigs.slice(0, index),
        { ...springConfigs[index], overshootClamping: checked },
        ...springConfigs.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onReverseChange = useCallback(
    (checked: boolean, index: number) => {
      setDraggedConfig({
        ...springConfigs[index],
        reverse: checked,
      });
      setSpringConfigs([
        ...springConfigs.slice(0, index),
        { ...springConfigs[index], reverse: checked },
        ...springConfigs.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onRelease = useCallback(
    (index: number) => {
      if (draggedConfig) {
        setSpringConfigs([
          ...springConfigs.slice(0, index),
          draggedConfig as DraggedConfig,
          ...springConfigs.slice(index + 1),
        ]);
      }
      setDraggedConfig(null);
    },
    [draggedConfig, springConfigs]
  );

  const duration = springConfigs.reduce((max, config) => {
    const calculatedDuration =
      config.delay +
      (config.durationInFrames
        ? config.durationInFrames
        : measureSpring({ fps, threshold: 0.001, config }));
    return calculatedDuration > max ? calculatedDuration : max;
  }, 0);

  const draggedDuration = draggedConfig
    ? draggedConfig.durationInFrames
      ? draggedConfig.durationInFrames + draggedConfig.delay
      : measureSpring({
          fps,
          threshold: 0.001,
          config: draggedConfig,
        }) + draggedConfig.delay
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
            springConfigs={springConfigs}
            draggedConfig={draggedConfig}
            draggedDuration={
              draggedDuration && draggedDuration > 0 ? draggedDuration : null
            }
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
          springConfigs={springConfigs}
          draggedConfig={draggedConfig}
          calculatedDurationInFrames={duration}
          onMassChange={onMassChange}
          onDampingChange={onDampingChange}
          onStiffnessChange={onStiffnessChange}
          onRelease={onRelease}
          onOvershootClampingChange={onOvershootClampingChange}
          onReverseChange={onReverseChange}
          onDurationInFramesChange={onDurationInFramesChange}
          onDelayChange={onDelayChange}
        />
      </div>
    </div>
  );
}

export default App;
