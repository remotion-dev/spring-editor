import React from "react";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "@radix-ui/react-label";

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
      mass = {mass} <br></br>
      <Slider
        min={1}
        max={200}
        value={[damping]}
        onValueChange={onDampingChange}
        onPointerUp={onRelease}
      ></Slider>
      damping = {damping} <br></br>
      <Slider
        min={1}
        max={200}
        value={[stiffness]}
        onValueChange={onStiffnessChange}
        onPointerUp={onRelease}
      ></Slider>{" "}
      stiffness = {stiffness} <br></br>
      <Checkbox
        id="overshootClamping"
        onCheckedChange={onOvershootClampingChange}
        checked={overshootClamping}
      ></Checkbox>
      <Label htmlFor="overshootClamping">
        overshootClamping <br></br>
      </Label>
      <div style={{ flex: 1 }}></div>
      <div>Duration: {(duration / fps).toFixed(2)}sec</div>
      <Button>Copy Remotion</Button>
      <div style={{ height: 8 }}></div>
      <Button>Copy Reanimated</Button>
    </div>
  );
};
