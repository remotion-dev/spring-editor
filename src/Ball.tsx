const DIAMETER = 32;

const ballStyle: React.CSSProperties = {
  width: DIAMETER,
  height: DIAMETER,
  borderRadius: DIAMETER / 2,
  backgroundColor: "white",
};
const ballContainer: React.CSSProperties = {
  display: "flex",
  padding: "40px 10px",
  paddingTop: 40,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 10,
  justifyContent: "flex-end",
};

export const Ball: React.FC = () => {
  return (
    <div style={ballContainer} id="ball">
      <div style={ballStyle} />
    </div>
  );
};
