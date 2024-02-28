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

  const [draggedConfigs, setDraggedConfigs] = useState<
    (DraggedConfig | null)[]
  >(Array(springConfigs.length).fill(null));

  const onMassChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          mass: e[0],
        },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );
  const onDampingChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          damping: e[0],
        },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onStiffnessChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          stiffness: e[0],
        },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onDurationInFramesChange = useCallback(
    (e: number | null, index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          durationInFrames: e,
        },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onDelayChange = useCallback(
    (e: number, index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          delay: e,
        },
        ...old.slice(index + 1),
      ]);
      setSpringConfigs((old) => [
        ...old.slice(0, index),
        { ...old[index], delay: e },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onOvershootClampingChange = useCallback(
    (checked: boolean, index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          overshootClamping: checked,
        },
        ...old.slice(index + 1),
      ]);
      setSpringConfigs((old) => [
        ...old.slice(0, index),
        { ...old[index], overshootClamping: checked },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onReverseChange = useCallback(
    (checked: boolean, index: number) => {
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        {
          ...springConfigs[index],
          reverse: checked,
        },
        ...old.slice(index + 1),
      ]);
      setSpringConfigs((old) => [
        ...old.slice(0, index),
        { ...old[index], reverse: checked },
        ...old.slice(index + 1),
      ]);
    },
    [springConfigs]
  );

  const onRelease = useCallback(
    (index: number) => {
      if (draggedConfigs && draggedConfigs[index]) {
        setSpringConfigs((old) => [
          ...old.slice(0, index),
          draggedConfigs[index] as DraggedConfig,
          ...old.slice(index + 1),
        ]);
      }
      setDraggedConfigs((old) => [
        ...old.slice(0, index),
        null,
        ...old.slice(index + 1),
      ]);
    },
    [draggedConfigs]
  );

  const duration = springConfigs.reduce((max, config) => {
    const calculatedDuration =
      config.delay +
      (config.durationInFrames
        ? config.durationInFrames
        : measureSpring({ fps, threshold: 0.001, config }));
    return calculatedDuration > max ? calculatedDuration : max;
  }, 0);

  const draggedDuration = draggedConfigs.some((config) => config !== null)
    ? draggedConfigs.reduce((max, draggedConfig) => {
        if (draggedConfig === null) {
          return max;
        }
        const calculatedDuration =
          draggedConfig.delay +
          (draggedConfig.durationInFrames
            ? draggedConfig.durationInFrames
            : measureSpring({ fps, threshold: 0.001, config: draggedConfig }));
        return calculatedDuration > max ? calculatedDuration : max;
      }, 0)
    : null;
  console.log("duration:", duration);
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
            draggedConfigs={draggedConfigs}
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
          draggedConfigs={draggedConfigs}
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
