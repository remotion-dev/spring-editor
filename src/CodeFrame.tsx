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

const CodeFrame: React.FC<Props> = ({
  damping,
  mass,
  stiffness,
  overshotClamping,
  reverse,
}) => {
  const [h, setH] = useState<string | null>(null);

  const code = useMemo(() => {
    const isDefaultDamping = DEFAULT_DAMPING === damping;
    const isDefaultMass = DEFAULT_MASS === mass;
    const isDefaultStiffness = DEFAULT_STIFFNESS === stiffness;

    const isAllDefault =
      isDefaultDamping && isDefaultMass && isDefaultStiffness;

    const lines = [
      "const spr = spring({",
      "  frame,",
      "  fps,",
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
      console.log({ html });
      setH(html);
    });
  }, [code]);

  if (!h) {
    return null;
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: "#24292E",
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 20,
          borderRadius: 8,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: h }}></div>
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
        <CodeFrame {...props}></CodeFrame>
      </TabsContent>
      <TabsContent value="password">coming soon</TabsContent>
    </Tabs>
  );
}
