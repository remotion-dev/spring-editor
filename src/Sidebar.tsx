import React from "react";
import { CodeFrameTabs } from "./CodeFrame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { PADDING_LEFT } from "./draw-trajectory";
import { DraggedConfig } from "./App";
import { SpringControls } from "./SpringControls";

export const Sidebar: React.FC<{
  springConfigs: DraggedConfig[];
  draggedConfigs: (DraggedConfig | null)[];
  calculatedDurationInFrames: number;
  onMassChange: (e: [number], index: number) => void;
  onDampingChange: (e: [number]) => void;
  onStiffnessChange: (e: [number]) => void;
  onDurationInFramesChange: (e: number | null) => void;
  onDelayChange: (e: number) => void;
  onRelease: () => void;
  onOvershootClampingChange: (checked: boolean) => void;
  onReverseChange: (checked: boolean) => void;
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
}) => {
  return (
    <div
      id="sidebar"
      style={{
        padding: PADDING_LEFT,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #242424",
      }}
    >
      <Tabs defaultValue="configuration">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          {springConfigs.map((config, idx) => {
            return (
              <SpringControls
                mass={draggedConfigs[idx]?.mass ?? config.mass}
                damping={draggedConfigs[idx]?.damping ?? config.damping}
                stiffness={draggedConfigs[idx]?.stiffness ?? config.stiffness}
                overshootClamping={config.overshootClamping}
                index={idx}
                fixedDurationInFrames={
                  draggedConfigs[idx]?.durationInFrames ??
                  config.durationInFrames
                }
                reverse={config.reverse}
                delay={draggedConfigs[idx]?.delay ?? config.delay}
                calculatedDurationInFrames={calculatedDurationInFrames}
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
        </TabsContent>
        <TabsContent value="code">
          <CodeFrameTabs
            delay={springConfigs[0].delay}
            damping={springConfigs[0].damping}
            mass={springConfigs[0].mass}
            stiffness={springConfigs[0].stiffness}
            overshotClamping={springConfigs[0].overshootClamping}
            reverse={springConfigs[0].reverse}
            durationInFrames={springConfigs[0].durationInFrames}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
