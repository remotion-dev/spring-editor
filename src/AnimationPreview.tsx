import React from "react";

export const AnimationPreview: React.FC<{
  id: string;
  animation: string;
}> = ({ id, animation }) => {
  return (
    <div style={{ textAlign: "center", paddingBottom: 20 }}>
      <div
        style={{
          height: 100,
          width: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          id={id}
          style={{
            height: 70,
            width: 70,
            backgroundColor: "#0b84f3",
          }}
        ></div>
      </div>
      <div
        style={{
          textTransform: "uppercase",
          fontSize: 13,
        }}
      >
        {animation}
      </div>
    </div>
  );
};
