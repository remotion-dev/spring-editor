import React, { useCallback, useEffect, useRef, useState } from "react";
import { measureSpring, spring, SpringConfig } from "remotion";
import {
  drawTrajectory,
  LINE_WIDTH,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
} from "./draw-trajectory";
import { getTrajectory } from "./get-trajectory";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

const canvasStyle: React.CSSProperties = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: "white",
};

const fps = 60;
function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [initialRender] = useState(() => Date.now());
  const latestRerender = useRef<number>(initialRender);
  const [config, setConfig] = useState<SpringConfig>({
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  });
  const [draggedConfig, setDraggedConfig] = useState<SpringConfig | null>(null);

  const onMassChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setDraggedConfig({ ...config, mass: Number(e.target.value) });
    },
    [config]
  );

  const onDampingChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setDraggedConfig({ ...config, damping: Number(e.target.value) });
      },
      [config]
    );

  const onStiffnessChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setDraggedConfig({ ...config, stiffness: Number(e.target.value) });
      },
      [config]
    );

  const onOvershootClampingChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setDraggedConfig({
          ...config,
          overshootClamping: e.target.checked,
        });
        setConfig({
          ...config,
          overshootClamping: e.target.checked,
        });
      },
      [config]
    );

  const onRelease = useCallback(() => {
    if (draggedConfig) {
      setConfig(draggedConfig as SpringConfig);
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
  useEffect(() => {
    const context = ref.current?.getContext("2d");
    if (!context) {
      return;
    }
    latestRerender.current = Date.now();
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const trajectory = getTrajectory(draggedDuration ?? duration, fps, config);
    const draggedTrajectory = draggedConfig
      ? getTrajectory(draggedDuration ?? duration, fps, draggedConfig)
      : [];
    const max = draggedConfig
      ? Math.max(...draggedTrajectory)
      : Math.max(...trajectory);
    drawTrajectory({
      springTrajectory: trajectory,
      canvasHeight: CANVAS_HEIGHT,
      canvasWidth: CANVAS_WIDTH,
      context,
      max,
      primary: draggedConfig ? false : true,
      animate: !draggedConfig,
      fps,
      renderTime: latestRerender.current,
      lastRenderRef: latestRerender,
    });
    if (draggedConfig) {
      drawTrajectory({
        springTrajectory: draggedTrajectory,
        canvasHeight: CANVAS_HEIGHT,
        canvasWidth: CANVAS_WIDTH,
        context,
        max,
        primary: true,
        animate: false,
        fps,
        renderTime: latestRerender.current,
        lastRenderRef: latestRerender,
      });
    }

    // Draw 1 line
    const oneHeight =
      (CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * (1 - 1 / max) +
      PADDING_TOP;
    context.beginPath();
    context.lineWidth = LINE_WIDTH;
    context.lineCap = "round";
    context.strokeStyle = "rgba(0, 0, 0, 0.1)";
    context.moveTo(PADDING_LEFT, oneHeight);
    context.lineTo(CANVAS_WIDTH - PADDING_RIGHT, oneHeight);
    context.stroke();
    context.closePath();
  }, [config, draggedConfig, draggedDuration, duration]);

  return (
    <div
      style={{
        margin: 10,
      }}
    >
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={ref}
        style={canvasStyle}
      ></canvas>
      <div>
        <div>{draggedDuration ?? duration}</div>
        <input
          type="range"
          min={0.3}
          step={0.1}
          max={10}
          value={draggedConfig?.mass ?? config.mass}
          onChange={onMassChange}
          onPointerUp={onRelease}
        ></input>{" "}
        mass = {draggedConfig?.mass ?? config.mass} <br></br>
        <input
          type="range"
          min={1}
          max={200}
          value={draggedConfig?.damping ?? config.damping}
          onChange={onDampingChange}
          onPointerUp={onRelease}
        ></input>{" "}
        damping = {draggedConfig?.damping ?? config.damping} <br></br>
        <input
          type="range"
          min={1}
          max={200}
          value={draggedConfig?.stiffness ?? config.stiffness}
          onChange={onStiffnessChange}
          onPointerUp={onRelease}
        ></input>{" "}
        stiffness = {draggedConfig?.stiffness ?? config.stiffness} <br></br>
        <input
          type="checkbox"
          onChange={onOvershootClampingChange}
          checked={config.overshootClamping}
        ></input>
        overshootClamping = {String(config.overshootClamping)} <br></br>
      </div>
    </div>
  );
}

export default App;
