"use client";

import type { GeoSceneSpec } from "@/lib/types";

/** Renders a GeoSceneSpec as SVG: watered regions saturated green,
 *  dry regions sandy — the "garden" metaphor. */
export default function GeoScene({
  scene,
  size = 260,
  showLabels = true,
}: {
  scene: GeoSceneSpec;
  size?: number;
  showLabels?: boolean;
}) {
  const W = 200;
  const H = 160;
  const watered = "#4ade80";
  const dry = "#d6c9a8";
  const stroke = "#78716c";

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} width={size} height={(size * (H + 20)) / W} role="img">
      {/* base (dry) shape */}
      {scene.kind === "triangle" && <polygon points="100,10 180,150 20,150" fill={dry} stroke={stroke} strokeWidth="2" />}
      {scene.kind === "square" && <rect x="40" y="20" width="120" height="120" rx="6" fill={dry} stroke={stroke} strokeWidth="2" />}
      {scene.kind === "rect" && <rect x="30" y="20" width="140" height="100" rx="6" fill={dry} stroke={stroke} strokeWidth="2" />}
      {scene.kind === "circle-sector" && <circle cx="100" cy="90" r="70" fill={dry} stroke={stroke} strokeWidth="2" />}
      {scene.kind === "composite" && (
        <path d="M40 20 h120 v120 h-120 z M160 140 L40 20 Z" fill={dry} fillRule="evenodd" stroke={stroke} strokeWidth="2" />
      )}

      {/* watered overlay */}
      {scene.kind === "triangle" && (
        <TopSimilarTriangle ratio={scene.wateredRatio} fill={watered} />
      )}
      {scene.kind === "square" && scene.parts && <GridCells parts={scene.parts} />}
      {scene.kind === "square" && !scene.parts && (
        <rect x="40" y="20" width="120" height={120 * scene.wateredRatio} fill={watered} />
      )}
      {scene.kind === "rect" && (
        <rect x="30" y="20" width="140" height={100 * scene.wateredRatio} fill={watered} />
      )}
      {scene.kind === "circle-sector" && (
        <Sector cx={100} cy={90} r={70} deg={scene.angleDeg ?? scene.wateredRatio * 360} fill={watered} />
      )}
      {scene.kind === "composite" && (
        <path d="M40 20 h120 v120 h-120 z M160 140 L40 20 Z" fill={watered} fillRule="evenodd" opacity="0.9" />
      )}

      {/* top outline for triangle after watered layer */}
      {scene.kind === "triangle" && <polygon points="100,10 180,150 20,150" fill="none" stroke={stroke} strokeWidth="2" />}

      {showLabels &&
        scene.labels?.map((l, i) => (
          <text key={i} x={l.at[0] * W} y={l.at[1] * H} textAnchor="middle" fontSize="12" fill="var(--muted, #666)">
            {l.text}
          </text>
        ))}
    </svg>
  );
}

/** Watered top region of the triangle = similar triangle whose linear
 *  scale is sqrt(wateredRatio) (area scales with square). */
function TopSimilarTriangle({ ratio, fill }: { ratio: number; fill: string }) {
  const s = Math.sqrt(Math.min(1, Math.max(0, ratio)));
  // apex at top (100,10); base at y=150 half-width 80 → scaled half-width 80*s
  const apexY = 10;
  const baseY = 150;
  const halfW = 80;
  // similar triangle anchored at apex: base y = apexY + (baseY-apexY)*s
  const by = apexY + (baseY - apexY) * s;
  const bw = halfW * s;
  return <polygon points={`100,${apexY} ${100 - bw},${by} ${100 + bw},${by}`} fill={fill} />;
}

function GridCells({ parts }: { parts: { kind: string; watered: boolean }[] }) {
  const n = parts.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const x0 = 40, y0 = 20, size = 120;
  const cw = size / cols, ch = size / rows;
  return (
    <g>
      {parts.map((p, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        return p.watered ? (
          <rect key={i} x={x0 + c * cw + 1} y={y0 + r * ch + 1} width={cw - 2} height={ch - 2} fill="#4ade80" />
        ) : null;
      })}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={x0 + i * cw} y1={y0} x2={x0 + i * cw} y2={y0 + size} stroke="#a8a29e" strokeWidth="0.7" />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line key={`h${i}`} x1={x0} y1={y0 + i * ch} x2={x0 + size} y2={y0 + i * ch} stroke="#a8a29e" strokeWidth="0.7" />
      ))}
    </g>
  );
}

function Sector({ cx, cy, r, deg, fill }: { cx: number; cy: number; r: number; deg: number; fill: string }) {
  const rad = (deg * Math.PI) / 180;
  const x = cx + r * Math.sin(rad);
  const y = cy - r * Math.cos(rad);
  const large = deg > 180 ? 1 : 0;
  return (
    <path d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`} fill={fill} />
  );
}
