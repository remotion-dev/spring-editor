import React from "react";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";

import { SliderLabel } from "./SliderLabel";
import { CheckboxWithLabel } from "./Checkbox";

export const Sidebar: React.FC<{
  mass: number;
  damping: number;
  stiffness: number;
  onMassChange: (e: [number]) => void;
  onDampingChange: (e: [number]) => void;
  onStiffnessChange: (e: [number]) => void;
  overshootClamping: boolean;
  onRelease: () => void;
  onOvershootClampingChange: (checked: boolean) => void;
  duration: number;
  fps: number;
}> = ({
  mass,
  onDampingChange,
  onMassChange,
  onStiffnessChange,
  overshootClamping,
  onRelease,
  damping,
  stiffness,
  duration,
  fps,
  onOvershootClampingChange,
}) => {
  return (
    <div
      style={{
        padding: 30,
        display: "flex",
        flexDirection: "column",
        width: 400,
        height: "100%",
        borderLeft: "1px solid black",
      }}
    >
      <Slider
        value={[mass]}
        min={0.3}
        step={0.1}
        max={10}
        onValueChange={onMassChange}
        onPointerUp={onRelease}
      ></Slider>
      <SliderLabel label="mass" value={mass}></SliderLabel>
      <Slider
        min={1}
        max={200}
        value={[damping]}
        onValueChange={onDampingChange}
        onPointerUp={onRelease}
      ></Slider>
      <SliderLabel label="damping" value={damping}></SliderLabel>
      <Slider
        min={1}
        max={200}
        value={[stiffness]}
        onValueChange={onStiffnessChange}
        onPointerUp={onRelease}
      ></Slider>
      <SliderLabel label="stiffness" value={stiffness}></SliderLabel>
      <CheckboxWithLabel
        checked={overshootClamping}
        id="overshootClamping"
        onCheckedChange={onOvershootClampingChange}
      ></CheckboxWithLabel>
      <div style={{ flex: 1 }}></div>
      <div>Duration: {(duration / fps).toFixed(2)}sec</div>
      <Button>Copy Remotion</Button>
      <div style={{ height: 8 }}></div>
      <Button>Copy Reanimated</Button>
    </div>
  );
};
