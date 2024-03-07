import React, { useCallback, useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shikiji";
import { DEFAULT_DAMPING, DEFAULT_MASS, DEFAULT_STIFFNESS } from "./defaults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./components/ui/button";
import { Spacing } from "./Spacing";
import { copyText } from "./copy-text";
import toast, { Toaster } from "react-hot-toast";
import { ExtendedSpringConfig } from "./App";

const CodeFrame: React.FC<{
  springConfigs: ExtendedSpringConfig[];
  platform: "remotion" | "reanimated";
}> = ({ springConfigs, platform }) => {
  const [h, setH] = useState<string | null>(null);

  const code = useMemo(() => {
    const allLines: string[] = [];

    springConfigs.forEach((config, index) => {
      const isDefaultDamping = DEFAULT_DAMPING === config.damping;
      const isDefaultMass = DEFAULT_MASS === config.mass;
      const isDefaultStiffness = DEFAULT_STIFFNESS === config.stiffness;

      const isAllDefault =
        isDefaultDamping && isDefaultMass && isDefaultStiffness;

      const lines = [
        `const spr${index + 1} = spring({`,
        platform === "remotion" ? "  frame," : null,
        platform === "remotion" ? "  fps," : null,
        platform === "reanimated" ? "  toValue: 1," : null,
        isAllDefault ? null : "  config: {",
        isDefaultDamping ? null : `    damping: ${config.damping}`,
        isDefaultMass ? null : `    mass: ${config.mass}`,
        isDefaultStiffness ? null : `    stiffness: ${config.stiffness}`,
        isAllDefault ? null : "  },",
        config.durationInFrames === null || platform === "reanimated"
          ? null
          : `  durationInFrames: ${config.durationInFrames},`,
        config.delay === 0 || platform === "reanimated"
          ? 0
          : `  delay: ${config.delay},`,
        config.overshootClamping ? "  overshootClamping: true," : null,
        config.reverse ? "  reverse: true," : null,
        "});",
      ]
        .filter(Boolean)
        .join("\n");

      allLines.push(lines);
    });

    return allLines.join("\n\n");
  }, [springConfigs, platform]);

  useEffect(() => {
    codeToHtml(code, {
      lang: "javascript",
      theme: "github-dark",
    }).then((html) => {
      setH(html);
    });
  }, [code]);

  const onClick = useCallback(async () => {
    try {
      await copyText(code);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [code]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#24292E",
          paddingTop: 14,
          paddingLeft: 20,
          borderRadius: 8,
        }}
      >
        {h ? (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: h }}
          />
        ) : null}
      </div>
      <Spacing block y={1} />
      <Button style={{ width: "100%" }} onClick={onClick}>
        Copy
      </Button>
      <Toaster />
    </div>
  );
};

export function CodeFrameTabs(props: {
  springConfigs: ExtendedSpringConfig[];
}) {
  return (
    <Tabs defaultValue="remotion">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="remotion">Remotion</TabsTrigger>
        <TabsTrigger value="reanimated">Reanimated</TabsTrigger>
      </TabsList>
      <TabsContent value="remotion">
        <CodeFrame platform="remotion" springConfigs={props.springConfigs} />
      </TabsContent>
      <TabsContent value="reanimated">
        <CodeFrame platform="reanimated" springConfigs={props.springConfigs} />
      </TabsContent>
    </Tabs>
  );
}
