import { useCallback, useEffect, useState } from "react";
import { measureSpring, SpringConfig } from "remotion";

import { Sidebar } from "./Sidebar";
import { CanvasWrapper } from "./CanvasWrapper";
import { DEFAULT_DAMPING, DEFAULT_MASS, DEFAULT_STIFFNESS } from "./defaults";
import { Header } from "./Header";
import { Ball } from "./Ball";

const fps = 60;

export type ExtendedSpringConfig = SpringConfig & {
  reverse: boolean;
  durationInFrames: number | null;
  delay: number;
};

export type DraggedConfig = {
  index: number;
  config: ExtendedSpringConfig | null;
};

const DEFAULT_SPRING = {
  damping: DEFAULT_DAMPING,
  mass: DEFAULT_MASS,
  stiffness: DEFAULT_STIFFNESS,
  overshootClamping: false,
  reverse: false,
  durationInFrames: null,
  delay: 0,
};

function App() {
  const initialConfig = window.localStorage.getItem("springConfigs")
    ? JSON.parse(window.localStorage.getItem("springConfigs") as string)
    : [DEFAULT_SPRING];
  const [springConfigs, setSpringConfigs] =
    useState<ExtendedSpringConfig[]>(initialConfig);

  const updateLocalStorage = useCallback(() => {
    window.localStorage.setItem("springConfigs", JSON.stringify(springConfigs));
  }, [springConfigs]);
  const [draggedConfigs, setDraggedConfigs] = useState<DraggedConfig>({
    index: 0,
    config: null,
  });

  const addSpring = useCallback(() => {
    setSpringConfigs([...springConfigs, DEFAULT_SPRING]);
  }, [springConfigs]);

  useEffect(() => {
    updateLocalStorage();
  }, [springConfigs, updateLocalStorage]);

  const removeSpring = useCallback((index: number) => {
    setSpringConfigs((old) => [...old.splice(0, index), ...old.splice(index)]);
  }, []);

  const resetSpring = useCallback(() => {
    setSpringConfigs([DEFAULT_SPRING]);
  }, []);

  const onMassChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs(() => ({
        index,
        config: { ...springConfigs[index], mass: e[0] },
      }));
    },
    [springConfigs]
  );
  const onDampingChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs(() => ({
        index,
        config: {
          ...springConfigs[index],
          damping: e[0],
        },
      }));
    },
    [springConfigs]
  );

  const onStiffnessChange = useCallback(
    (e: number[], index: number) => {
      setDraggedConfigs(() => ({
        index,
        config: {
          ...springConfigs[index],
          stiffness: e[0],
        },
      }));
    },
    [springConfigs]
  );

  const onDurationInFramesChange = useCallback(
    (e: number | null, index: number) => {
      setDraggedConfigs(() => ({
        index,
        config: {
          ...springConfigs[index],
          durationInFrames: e,
        },
      }));

      setSpringConfigs((old) => [
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
      setDraggedConfigs(() => ({
        index,
        config: {
          ...springConfigs[index],
          delay: e,
        },
      }));
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
      setSpringConfigs((old) => [
        ...old.slice(0, index),
        { ...old[index], overshootClamping: checked },
        ...old.slice(index + 1),
      ]);
    },
    []
  );

  const onReverseChange = useCallback((checked: boolean, index: number) => {
    setSpringConfigs((old) => [
      ...old.slice(0, index),
      { ...old[index], reverse: checked },
      ...old.slice(index + 1),
    ]);
  }, []);

  const onRelease = useCallback(
    (index: number) => {
      if (draggedConfigs && draggedConfigs.config) {
        setSpringConfigs((old) => [
          ...old.slice(0, index),
          draggedConfigs.config as ExtendedSpringConfig,
          ...old.slice(index + 1),
        ]);
      }
      setDraggedConfigs({ index: 0, config: null });
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

  const draggedDuration =
    // eslint-disable-next-line no-negated-condition
    draggedConfigs.config !== null
      ? measureSpring({
          fps,
          threshold: 0.001,
          config: draggedConfigs.config,
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
            springConfigs={springConfigs}
            draggedConfigs={draggedConfigs}
            draggedDuration={
              draggedDuration && draggedDuration > 0 ? draggedDuration : null
            }
            duration={duration}
            fps={fps}
          />
          <div id="animation-preview">
            <Ball />
          </div>
        </div>
        <Sidebar
          springConfigs={springConfigs}
          draggedConfigs={draggedConfigs}
          calculatedDurationInFrames={duration}
          addSpring={addSpring}
          removeSpring={removeSpring}
          resetSpring={resetSpring}
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
