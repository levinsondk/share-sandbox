import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

const BG_COLORS = [
  { color: "#E1FF00", dark: false },
  { color: "#00DB66", dark: false },
  { color: "#00DFD3", dark: false },
  { color: "#6321FF", dark: true },
  { color: "#F20E9B", dark: true },
  { color: "#FF4D00", dark: true },
];

const BOX_SIZE = 100;

// Image generation
export default function Icon() {
  const randomBG = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
  const randomCoords = () => Math.floor(Math.random() * BOX_SIZE);
  const vertexCount = Math.floor(Math.random() * 6) + 3; // 3 to 8
  function getPath() {
    let pathString = `M ${randomCoords()} ${randomCoords()} `;
    for (let i = 0; i < vertexCount; i++) {
      pathString += `L ${randomCoords()} ${randomCoords()}`;
    }
    pathString += " Z";
    return pathString;
  }
  const pathString = getPath();
  const isDark = randomBG.dark;
  const pathFill = isDark ? "#FFFFFF" : "262626";

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: randomBG.color,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={pathString} fill={pathFill} />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
