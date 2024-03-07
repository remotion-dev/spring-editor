import { Slider } from "./components/ui/slider";
import { Spacing } from "./Spacing";
import { SliderLabel } from "./SliderLabel";
import { CheckboxWithLabel } from "./Checkbox";
import { Button } from "./components/ui/button";

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
  removeSpring: (index: number) => void;
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
  removeSpring,
}) => {
  const crossIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          borderBottom: "1px solid grey",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontFamily: "GTPlanar",
          }}
        >
          Spring {index + 1}
        </p>
        {index > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Remove spring"
            onClick={() => removeSpring(index)}
          >
            {crossIcon}
          </Button>
        ) : null}
      </div>

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
      <Spacing y={0.5} />
      <Slider
        min={1}
        max={200}
        value={[damping]}
        onValueChange={(e) => onDampingChange(e, index)}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel label="damping" value={damping} toggleable={null} />
      <Spacing y={0.5} />
      <Slider
        min={1}
        max={200}
        value={[stiffness]}
        onValueChange={(e) => onStiffnessChange(e, index)}
        onPointerUp={() => onRelease(index)}
      />
      <SliderLabel toggleable={null} label="stiffness" value={stiffness} />
      <Spacing y={0.5} />
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
      <Spacing y={0.5} />
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
