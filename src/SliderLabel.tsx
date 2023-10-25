import React from "react";

const row: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontFamily: "GTPlanar",
  paddingBottom: 20,
  paddingTop: 9,
};

const valueLabel: React.CSSProperties = {
  fontVariantNumeric: "tabular-nums",
};

export const SliderLabel: React.FC<{
  label: string;
  value: number;
}> = ({ label, value }) => {
  return (
    <div style={row}>
      <div style={{ flex: 1 }}>{label}</div>
      <div style={valueLabel}>{value}</div>
    </div>
  );
};
