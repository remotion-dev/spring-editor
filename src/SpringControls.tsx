import { Slider } from "./components/ui/slider";
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
  onMassChange: (e: number[], index: number) => void;
  onDampingChange: (e: number[], index: number) => void;
  onStiffnessChange: (e: number[], index: number) => void;
  onDurationInFramesChange: (e: number | null, index: number) => void;
  onDelayChange: (e: number, index: number) => void;
  onRelease: (index: number) => void;
  onOvershootClampingChange: (checked: boolean, index: number) => void;
  onReverseChange: (checked: boolean, index: number) => void;
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
        onValueChange={(e) => onMassChange(e, index)}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel label="mass" value={mass} toggleable={null} />
      <Slider
        min={1}
        max={200}
        value={[damping]}
        onValueChange={(e) => onDampingChange(e, index)}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel label="damping" value={damping} toggleable={null} />
      <Slider
        min={1}
        max={200}
        value={[stiffness]}
        onValueChange={(e) => onStiffnessChange(e, index)}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel toggleable={null} label="stiffness" value={stiffness} />
      <Slider
        min={0}
        max={400}
        value={[delay]}
        onValueChange={(val) => {
          onDelayChange(val[0], index);
        }}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel label="delay" toggleable={null} value={delay} />
      <>
        <Slider
          min={1}
          max={200}
          value={[fixedDurationInFrames ?? calculatedDurationInFrames]}
          style={{ opacity: fixedDurationInFrames === null ? 0.5 : 1 }}
          onValueChange={(val) => {
            onDurationInFramesChange(val[0], index);
          }}
          onPointerUp={() => onRelease(index)}
        />
        <SliderLabel
          label="durationInFrames"
          toggleable={(enabled) => {
            if (enabled) {
              onDurationInFramesChange(calculatedDurationInFrames, index);
            } else {
              onDurationInFramesChange(null, index);
            }
          }}
          value={fixedDurationInFrames ?? null}
        />
      </>
      <CheckboxWithLabel
        checked={overshootClamping}
        id="overshootClamping"
        onCheckedChange={(e) => onOvershootClampingChange(e, index)}
      />
      <CheckboxWithLabel
        checked={reverse}
        id="reverse"
        onCheckedChange={(e) => onReverseChange(e, index)}
      />
      <Spacing y={2} />
    </>
  );
};
