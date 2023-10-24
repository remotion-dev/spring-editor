import React from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Spacing } from "./Spacing";
const row: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  fontFamily: "GTPlanar",
  paddingBottom: 30,
  paddingTop: 9,
  alignItems: "center",
};

export const CheckboxWithLabel: React.FC<{
  id: string;
  onCheckedChange: (checked: boolean) => void;
  checked: boolean;
}> = ({ id, checked, onCheckedChange }) => {
  return (
    <div style={row}>
      <Checkbox
        id={id}
        onCheckedChange={onCheckedChange}
        checked={checked}
      ></Checkbox>
      <Spacing x={1}></Spacing>
      <Label htmlFor={id}>
        {id} <br></br>
      </Label>
    </div>
  );
};
