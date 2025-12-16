"use client";

import { useMemo } from "react";

const BG_COLORS = [
  { color: "#E1FF00", dark: false },
  { color: "#00DB66", dark: false },
  { color: "#00DFD3", dark: false },
  { color: "#6321FF", dark: true },
  { color: "#F20E9B", dark: true },
  { color: "#FF4D00", dark: true },
];
const BOX_SIZE = 100;
const CENTER = BOX_SIZE / 2;
const MIN_RADIUS = 0; // Don't get too close to center
const MAX_RADIUS = 70; // Stay within bounds (50 would touch edges)

// this is a total random function
// function generateRandomSvg() {
//   const randomCoords = () => Math.floor(Math.random() * BOX_SIZE);
//   const vertexCount = Math.floor(Math.random() * 6) + 3;
//   const bg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

//   let pathString = `M ${randomCoords()} ${randomCoords()} `;
//   for (let i = 0; i < vertexCount; i++) {
//     pathString += `L ${randomCoords()} ${randomCoords()} `;
//   }
//   pathString += "Z";

//   return {
//     bg,
//     pathString,
//     fill: bg.dark ? "#FFFFFF" : "#262626",
//   };
// }

function generateConstrainedVertex(
  vertexIndex: number,
  totalVertices: number,
  center: number, // center of the box (e.g., 50 for a 100×100 box)
  minRadius: number, // minimum distance from center
  maxRadius: number // maximum distance from center
): { x: number; y: number } {
  // Calculate the angle slice for this vertex
  const sliceAngle = (2 * Math.PI) / totalVertices;
  const startAngle = sliceAngle * vertexIndex;
  const endAngle = sliceAngle * (vertexIndex + 1);

  // Random angle within the slice
  const angle = startAngle + Math.random() * (endAngle - startAngle);

  // Random radius (use sqrt for uniform area distribution)
  // Without sqrt, points cluster toward center
  const radius = minRadius + Math.sqrt(Math.random()) * (maxRadius - minRadius);

  // Convert polar to cartesian
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);

  return { x: Math.round(x), y: Math.round(y) };
}

function generateRandomSvg() {
  const vertexCount = Math.floor(Math.random() * 32) + 4;
  const bg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

  // Generate first vertex
  const firstVertex = generateConstrainedVertex(
    0,
    vertexCount,
    CENTER,
    MIN_RADIUS,
    MAX_RADIUS
  );
  let pathString = `M ${firstVertex.x} ${firstVertex.y} `;

  // Generate remaining vertices, each in its own pie slice
  for (let i = 1; i < vertexCount; i++) {
    const vertex = generateConstrainedVertex(
      i,
      vertexCount,
      CENTER,
      MIN_RADIUS,
      MAX_RADIUS
    );
    pathString += `L ${vertex.x} ${vertex.y} `;
  }
  pathString += "Z";

  return {
    bg,
    pathString,
    fill: bg.dark ? "#FFFFFF" : "#262626",
  };
}

// SVG component that renders pre-generated data
function RandomizedSvg({
  data,
}: {
  data: ReturnType<typeof generateRandomSvg>;
}) {
  return (
    <div
      style={{
        background: data.bg.color,
        width: 120,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        fill="none"
      >
        <path d={data.pathString} fill={data.fill} />
      </svg>
    </div>
  );
}

export default function RandomizedSvgPage() {
  // Generate 8 unique SVGs, memoized to prevent re-generation on every render
  const svgDataList = useMemo(() => {
    return Array.from({ length: 8 }, () => generateRandomSvg());
  }, []);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: 32 }}>
      {svgDataList.map((data, index) => (
        <RandomizedSvg key={index} data={data} />
      ))}
    </div>
  );
}
