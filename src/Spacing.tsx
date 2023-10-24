import React from "react";

export const Spacing: React.FC<{
  x?: number;
  y?: number;
}> = ({ x = 0, y = 0 }) => {
  return (
    <div
      style={{
        display: "inline-block",
        height: 8 * y,
        width: 8 * x,
      }}
    ></div>
  );
};
