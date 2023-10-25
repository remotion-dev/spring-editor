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
      <div style={{ fontSize: 20 }}>Spring editor</div>
      <div style={{ flex: 1 }}></div>
      <a href="https://remotion.dev" target="_blank">
        <Img style={{ height: 60 }} src="/remotion.png"></Img>
      </a>
    </div>
  );
};
