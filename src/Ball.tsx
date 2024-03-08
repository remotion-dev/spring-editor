const DIAMETER = 32;

const ballStyle: React.CSSProperties = {
  width: DIAMETER,
  height: DIAMETER,
  borderRadius: DIAMETER / 2,
  backgroundColor: "white",
};

export const Ball: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        padding: "40px 10px",
        justifyContent: "flex-end",
      }}
      id="ball"
    >
      <div style={ballStyle} />
    </div>
  );
};
