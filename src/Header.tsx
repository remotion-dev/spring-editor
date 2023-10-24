import React from "react";
import { Img } from "remotion";

export const Header: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontFamily: "GTPlanar",
        fontWeight: "bold",
        width: "100%",
        height: 60,
        borderBottom: "1px solid #242424",
        alignItems: "center",
        paddingLeft: 20,
      }}
    >
      <div style={{ fontSize: 20 }}>
        Spring editor for Remotion and Reanimated
      </div>
      <div style={{ flex: 1 }}></div>
      <a href="https://remotion.dev" target="_blank">
        <Img
          style={{ height: 60 }}
          src="https://github.com/remotion-dev/brand/raw/main/withtitle-dark/element-0.png"
        ></Img>
      </a>
    </div>
  );
};
