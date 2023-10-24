import React, { useCallback, useEffect, useRef, useState } from "react";
import { measureSpring, SpringConfig } from "remotion";
import { AnimationPreview } from "./AnimationPreview";
import {
  drawTrajectory,
  LINE_WIDTH,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
} from "./draw-trajectory";
import { getTrajectory } from "./get-trajectory";
import { useDarkMode } from "./use-dark-mode";
import { Slider } from "./components/ui/slider";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { Sidebar } from "./Sidebar";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

const canvasStyle: React.CSSProperties = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: "var(--background)",
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

  const darkMode = useDarkMode();

  const [draggedConfig, setDraggedConfig] = useState<SpringConfig | null>(null);

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

    context.strokeStyle = darkMode ? "rgba(255, 255, 255, 0.05)" : "#eee";
    context.lineWidth = LINE_WIDTH;
    context.lineCap = "round";

    // Draw 0 line
    const zeroHeight = CANVAS_HEIGHT - PADDING_BOTTOM;
    context.beginPath();
    context.moveTo(PADDING_LEFT, zeroHeight);
    context.lineTo(CANVAS_WIDTH - PADDING_RIGHT, zeroHeight);
    context.stroke();
    context.closePath();

    // Draw 1 line
    const oneHeight =
      (CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * (1 - 1 / max) +
      PADDING_TOP;
    context.beginPath();
    context.moveTo(PADDING_LEFT, oneHeight);
    context.lineTo(CANVAS_WIDTH - PADDING_RIGHT, oneHeight);
    context.stroke();
    context.closePath();

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
      darkMode,
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
        darkMode,
      });
    }
  }, [config, darkMode, draggedConfig, draggedDuration, duration]);

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
        <div style={{ flex: 1 }}>
          <canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            ref={ref}
            style={canvasStyle}
          ></canvas>
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
        ></Sidebar>
      </div>
    </div>
  );
}

export default App;
