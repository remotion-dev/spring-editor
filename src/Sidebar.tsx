import React from "react";
import { CodeFrameTabs } from "./CodeFrame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { PADDING_LEFT } from "./draw-trajectory";
import { DraggedConfig, ExtendedSpringConfig } from "./App";
import { SpringControls } from "./SpringControls";
import { Button } from "./components/ui/button";
import { Spacing } from "./Spacing";

export const Sidebar: React.FC<{
  springConfigs: ExtendedSpringConfig[];
  draggedConfigs: DraggedConfig;
  calculatedDurationInFrames: number;
  addSpring: () => void;
  removeSpring: (index: number) => void;
  onMassChange: (e: number[], index: number) => void;
  onDampingChange: (e: number[], index: number) => void;
  onStiffnessChange: (e: number[], index: number) => void;
  onDurationInFramesChange: (e: number | null, index: number) => void;
  onDelayChange: (e: number, index: number) => void;
  onRelease: (index: number) => void;
  onOvershootClampingChange: (checked: boolean, index: number) => void;
  onReverseChange: (checked: boolean, index: number) => void;
}> = ({
  springConfigs,
  draggedConfigs,
  onDampingChange,
  onMassChange,
  onStiffnessChange,
  onDurationInFramesChange,
  onRelease,
  calculatedDurationInFrames,
  onOvershootClampingChange,
  onReverseChange,
  onDelayChange,
  addSpring,
  removeSpring,
}) => {
  return (
    <div
      id="sidebar"
      style={{
        padding: PADDING_LEFT,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #242424",
        overflow: "scroll",
      }}
    >
      <Tabs defaultValue="configuration">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          <>
            {springConfigs.map((config, idx) => {
              return (
                <SpringControls
                  key={idx}
                  mass={draggedConfigs.config?.mass ?? config.mass}
                  damping={draggedConfigs.config?.damping ?? config.damping}
                  stiffness={
                    draggedConfigs.config?.stiffness ?? config.stiffness
                  }
                  overshootClamping={config.overshootClamping}
                  index={idx}
                  fixedDurationInFrames={
                    draggedConfigs.config?.durationInFrames ??
                    config.durationInFrames
                  }
                  reverse={config.reverse}
                  delay={draggedConfigs.config?.delay ?? config.delay}
                  calculatedDurationInFrames={calculatedDurationInFrames}
                  removeSpring={removeSpring}
                  onMassChange={onMassChange}
                  onDampingChange={onDampingChange}
                  onDelayChange={onDelayChange}
                  onDurationInFramesChange={onDurationInFramesChange}
                  onStiffnessChange={onStiffnessChange}
                  onRelease={onRelease}
                  onOvershootClampingChange={onOvershootClampingChange}
                  onReverseChange={onReverseChange}
                />
              );
            })}
            <Spacing y={5} />
            <Button style={{ width: "100%" }} onClick={addSpring}>
              Add spring
            </Button>
          </>
        </TabsContent>
        <TabsContent value="code">
          <CodeFrameTabs springConfigs={springConfigs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
