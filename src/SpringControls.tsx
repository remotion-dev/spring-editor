import { Slider } from "@radix-ui/react-slider";
import { Spacing } from "./Spacing";
import { SliderLabel } from "./SliderLabel";
import { CheckboxWithLabel } from "./Checkbox";

export const SpringControls: React.FC<{
  mass: number;
  stiffness: number;
  delay: number;
  damping: number;
  overshootClamping: boolean;
  reverse: boolean;
  onMassChange: (e: [number], index: number) => void;
  onDampingChange: (e: [number]) => void;
  onStiffnessChange: (e: [number]) => void;
  onDurationInFramesChange: (e: number | null) => void;
  onDelayChange: (e: number) => void;
  onRelease: () => void;
  onOvershootClampingChange: (checked: boolean) => void;
  onReverseChange: (checked: boolean) => void;
  fixedDurationInFrames: number | null;
  calculatedDurationInFrames: number;
  index: number;
}> = ({
  mass,
  damping,
  stiffness,
  delay,
  overshootClamping,
  reverse,
  onDampingChange,
  onMassChange,
  onStiffnessChange,
  onDurationInFramesChange,
  onRelease,
  onOvershootClampingChange,
  onReverseChange,
  onDelayChange,
  calculatedDurationInFrames,
  fixedDurationInFrames,
  index,
}) => {
  return (
    <>
      <Spacing y={3} />
      <Slider
        value={[mass]}
        min={0.3}
        step={0.1}
        max={10}
        onValueChange={() => onMassChange([mass], index)} // CHANGE 0 TO IDX
        onPointerUp={onRelease}
      />
      <SliderLabel label="mass" value={mass} toggleable={null} />
      <Slider
        min={1}
        max={200}
        value={[damping]}
        onValueChange={onDampingChange}
        onPointerUp={onRelease}
      />
      <SliderLabel label="damping" value={damping} toggleable={null} />
      <Slider
        min={1}
        max={200}
        value={[stiffness]}
        onValueChange={onStiffnessChange}
        onPointerUp={onRelease}
      />
      <SliderLabel toggleable={null} label="stiffness" value={stiffness} />
      <Slider
        min={0}
        max={400}
        value={[delay]}
        onValueChange={(val) => {
          onDelayChange(val[0]);
        }}
        onPointerUp={onRelease}
      />
      <SliderLabel label="delay" toggleable={null} value={delay} />
      <>
        <Slider
          min={1}
          max={200}
          value={[fixedDurationInFrames ?? calculatedDurationInFrames]}
          style={{ opacity: fixedDurationInFrames === null ? 0.5 : 1 }}
          onValueChange={(val) => {
            onDurationInFramesChange(val[0]);
          }}
          onPointerUp={onRelease}
        />
        <SliderLabel
          label="durationInFrames"
          toggleable={(enabled) => {
            if (enabled) {
              onDurationInFramesChange(calculatedDurationInFrames);
            } else {
              onDurationInFramesChange(null);
            }
          }}
          value={fixedDurationInFrames ?? null}
        />
      </>
      <CheckboxWithLabel
        checked={overshootClamping}
        id="overshootClamping"
        onCheckedChange={onOvershootClampingChange}
      />
      <CheckboxWithLabel
        checked={reverse}
        id="reverse"
        onCheckedChange={onReverseChange}
      />
      <Spacing y={2} />
    </>
  );
};
