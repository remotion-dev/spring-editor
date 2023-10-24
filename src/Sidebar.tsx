import React from "react";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";

import { SliderLabel } from "./SliderLabel";
import { CheckboxWithLabel } from "./Checkbox";
import { Spacing } from "./Spacing";
import { CodeFrame } from "./CodeFrame";

const row: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontFamily: "GTPlanar",

  alignItems: "center",
};

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
  reverse: boolean;
  onReverseChange: (checked: boolean) => void;
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
  onReverseChange,
  reverse,
}) => {
  return (
    <div
      style={{
        padding: 30,
        display: "flex",
        flexDirection: "column",
        width: 400,
        height: "100%",
        borderLeft: "1px solid #242424",
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
      <CheckboxWithLabel
        checked={reverse}
        id="reverse"
        onCheckedChange={onReverseChange}
      ></CheckboxWithLabel>
      <div style={{ flex: 1 }}></div>
      <div style={row}>
        <svg height="1em" viewBox="0 0 512 512">
          <path
            fill="white"
            d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
          />
        </svg>
        <Spacing x={1}></Spacing>
        {(duration / fps).toFixed(2)}sec
      </div>
      <Spacing y={2}></Spacing>
      <CodeFrame
        damping={damping}
        mass={mass}
        stiffness={stiffness}
        overshotClamping={overshootClamping}
        reverse={reverse}
      ></CodeFrame>
      <Spacing y={2}></Spacing>
      <Button>Copy Remotion</Button>
      <div style={{ height: 8 }}></div>
      <Button>Copy Reanimated</Button>
    </div>
  );
};
