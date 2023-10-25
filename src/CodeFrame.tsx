import React, { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shikiji";
import { DEFAULT_DAMPING, DEFAULT_MASS, DEFAULT_STIFFNESS } from "./defaults";

type Props = {
  damping: number;
  mass: number;
  stiffness: number;
  overshotClamping: boolean;
  reverse: boolean;
};

const CodeFrame: React.FC<
  Props & {
    platform: "remotion" | "reanimated";
  }
> = ({ damping, mass, stiffness, overshotClamping, reverse, platform }) => {
  const [h, setH] = useState<string | null>(null);

  const code = useMemo(() => {
    const isDefaultDamping = DEFAULT_DAMPING === damping;
    const isDefaultMass = DEFAULT_MASS === mass;
    const isDefaultStiffness = DEFAULT_STIFFNESS === stiffness;

    const isAllDefault =
      isDefaultDamping && isDefaultMass && isDefaultStiffness;

    const lines = [
      "const spr = spring({",
      platform === "remotion" ? "  frame," : null,
      platform === "remotion" ? "  fps," : null,
      platform === "reanimated" ? "  toValue: 1," : null,
      isAllDefault ? null : "  config: {",
      isDefaultDamping ? null : `    damping: ${damping}`,
      isDefaultMass ? null : `    mass: ${mass}`,
      isDefaultStiffness ? null : `    stiffness: ${stiffness}`,
      isAllDefault ? null : "  },",
      overshotClamping ? "  overshootClamping: true," : null,
      reverse ? "  reverse: true," : null,
      "});",
    ]
      .filter(Boolean)
      .join("\n");
    return lines;
  }, [damping, mass, stiffness, overshotClamping, reverse]);

  useEffect(() => {
    codeToHtml(code, {
      lang: "javascript",
      theme: "github-dark",
    }).then((html) => {
      setH(html);
    });
  }, [code]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#24292E",
          paddingTop: 14,
          paddingLeft: 20,
          height: 300,
          borderRadius: 8,
        }}
      >
        {h ? <div dangerouslySetInnerHTML={{ __html: h }}></div> : null}
      </div>
    </div>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CodeFrameTabs(props: Props) {
  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Remotion</TabsTrigger>
        <TabsTrigger value="password">Reanimated</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <CodeFrame platform="remotion" {...props}></CodeFrame>
      </TabsContent>
      <TabsContent value="password">
        <CodeFrame platform="reanimated" {...props}></CodeFrame>
      </TabsContent>
    </Tabs>
  );
}
