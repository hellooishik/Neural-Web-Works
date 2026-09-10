/**
 * The hero backdrop: a power plant in silhouette, rim-lit in aqua, standing in
 * still water. Pure SVG so it stays sharp at any size and costs nothing to
 * animate. The WaterCanvas layer sits on top of this and does the drops.
 */

const GROUND = 470;

function CoolingTower({ x, base, height, id }) {
  const top = GROUND - height;
  const halfBase = base / 2;
  const halfTop = base * 0.36;
  const waistPull = base * 0.3;

  const body = [
    `M ${x - halfBase} ${GROUND}`,
    `C ${x - halfBase + waistPull * 0.35} ${GROUND - height * 0.55},`,
    `${x - halfTop - waistPull * 0.18} ${GROUND - height * 0.72},`,
    `${x - halfTop} ${top}`,
    `L ${x + halfTop} ${top}`,
    `C ${x + halfTop + waistPull * 0.18} ${GROUND - height * 0.72},`,
    `${x + halfBase - waistPull * 0.35} ${GROUND - height * 0.55},`,
    `${x + halfBase} ${GROUND}`,
    'Z'
  ].join(' ');

  return (
    <g>
      <path d={body} fill={`url(#${id}-body)`} />
      <path d={body} fill="none" stroke="url(#rim)" strokeWidth="1.4" />
      {/* Ribbing gives the concrete some read at large sizes. */}
      {[0.18, 0.36, 0.54, 0.72].map((t) => (
        <line
          key={t}
          x1={x - halfBase + (halfBase - halfTop) * t * 1.1}
          x2={x + halfBase - (halfBase - halfTop) * t * 1.1}
          y1={GROUND - height * t}
          y2={GROUND - height * t}
          stroke="rgba(126,213,226,0.09)"
          strokeWidth="1"
        />
      ))}
      <ellipse cx={x} cy={top} rx={halfTop} ry={halfTop * 0.2} fill="#04141c" />
      <ellipse
        cx={x}
        cy={top}
        rx={halfTop}
        ry={halfTop * 0.2}
        fill="none"
        stroke="rgba(111,227,212,0.5)"
        strokeWidth="1.4"
      />
      <g className="plant__steam" style={{ transformOrigin: `${x}px ${top}px` }}>
        <ellipse className="plant__puff plant__puff--a" cx={x} cy={top - 30} rx={halfTop * 0.95} ry={26} />
        <ellipse className="plant__puff plant__puff--b" cx={x + 8} cy={top - 74} rx={halfTop * 1.2} ry={34} />
        <ellipse className="plant__puff plant__puff--c" cx={x - 10} cy={top - 126} rx={halfTop * 1.5} ry={44} />
      </g>
    </g>
  );
}

function Pylon({ x, height }) {
  const top = GROUND - height;
  const w = height * 0.28;
  return (
    <g stroke="rgba(126,213,226,0.34)" strokeWidth="1.3" fill="none">
      <path d={`M ${x - w / 2} ${GROUND} L ${x - w * 0.16} ${top} L ${x + w * 0.16} ${top} L ${x + w / 2} ${GROUND}`} />
      <path d={`M ${x - w * 0.42} ${GROUND - height * 0.3} L ${x + w * 0.42} ${GROUND - height * 0.3}`} />
      <path d={`M ${x - w * 0.3} ${GROUND - height * 0.62} L ${x + w * 0.3} ${GROUND - height * 0.62}`} />
      <path d={`M ${x - w / 2} ${GROUND} L ${x + w * 0.3} ${GROUND - height * 0.62}`} strokeOpacity="0.4" />
      <path d={`M ${x + w / 2} ${GROUND} L ${x - w * 0.3} ${GROUND - height * 0.62}`} strokeOpacity="0.4" />
      <path d={`M ${x - w * 0.62} ${top + 14} L ${x + w * 0.62} ${top + 14}`} />
    </g>
  );
}

export default function PowerPlant() {
  return (
    <svg
      className="plant"
      viewBox="0 0 1200 620"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Illustration of a power plant with cooling towers standing in still water"
    >
      <defs>
        <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(159,244,232,0.85)" />
          <stop offset="0.55" stopColor="rgba(90,190,214,0.28)" />
          <stop offset="1" stopColor="rgba(90,190,214,0.05)" />
        </linearGradient>
        <linearGradient id="towerA-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1f2a" />
          <stop offset="0.45" stopColor="#061620" />
          <stop offset="1" stopColor="#0d2733" />
        </linearGradient>
        <linearGradient id="towerB-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#081b25" />
          <stop offset="0.5" stopColor="#05131c" />
          <stop offset="1" stopColor="#0b222d" />
        </linearGradient>
        <linearGradient id="block" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c2431" />
          <stop offset="1" stopColor="#04121a" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(20,72,94,0.72)" />
          <stop offset="1" stopColor="rgba(3,14,21,0)" />
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(111,227,212,0.22)" />
          <stop offset="1" stopColor="rgba(111,227,212,0)" />
        </linearGradient>
        <linearGradient id="fade-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflection-mask">
          <rect x="0" y={GROUND} width="1200" height="150" fill="url(#fade-down)" />
        </mask>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* horizon glow */}
      <ellipse cx="600" cy={GROUND} rx="620" ry="130" fill="url(#sun)" />

      <g id="plant-scene">
        {/* far low buildings */}
        <g fill="url(#block)" stroke="rgba(126,213,226,0.16)" strokeWidth="1">
          <rect x="80" y={GROUND - 62} width="150" height="62" rx="2" />
          <rect x="240" y={GROUND - 40} width="70" height="40" rx="2" />
          <rect x="905" y={GROUND - 54} width="120" height="54" rx="2" />
        </g>

        <CoolingTower x={332} base={196} height={262} id="towerA" />
        <CoolingTower x={520} base={146} height={198} id="towerB" />

        {/* turbine hall */}
        <g>
          <rect x="620" y={GROUND - 96} width="272" height="96" fill="url(#block)" />
          <rect
            x="620"
            y={GROUND - 96}
            width="272"
            height="96"
            fill="none"
            stroke="rgba(126,213,226,0.22)"
            strokeWidth="1.2"
          />
          {Array.from({ length: 11 }).map((_, col) =>
            Array.from({ length: 3 }).map((__, rowIdx) => (
              <rect
                key={`${col}-${rowIdx}`}
                x={634 + col * 23}
                y={GROUND - 82 + rowIdx * 26}
                width="12"
                height="12"
                rx="1"
                fill="rgba(150,240,226,0.5)"
                opacity={(col * 3 + rowIdx) % 4 === 0 ? 0.85 : 0.22}
              />
            ))
          )}
        </g>

        {/* chimney */}
        <g>
          <path
            d={`M 700 ${GROUND} L 706 ${GROUND - 336} L 730 ${GROUND - 336} L 736 ${GROUND} Z`}
            fill="url(#block)"
            stroke="url(#rim)"
            strokeWidth="1.3"
          />
          {[0.42, 0.58, 0.74].map((t) => (
            <rect
              key={t}
              x={702 + t * 4}
              y={GROUND - 336 * t}
              width={32 - t * 8}
              height="9"
              fill="rgba(111,227,212,0.16)"
            />
          ))}
          <circle cx="718" cy={GROUND - 344} r="3.4" className="plant__beacon" fill="#ff9d7a" />
          <g className="plant__steam plant__steam--slow">
            <ellipse className="plant__puff plant__puff--a" cx="722" cy={GROUND - 372} rx="20" ry="14" />
            <ellipse className="plant__puff plant__puff--c" cx="734" cy={GROUND - 418} rx="34" ry="22" />
          </g>
        </g>

        <Pylon x={1000} height={168} />
        <Pylon x={1132} height={140} />
        {/* catenary cables */}
        <g stroke="rgba(126,213,226,0.26)" strokeWidth="1" fill="none">
          <path d={`M 892 ${GROUND - 132} Q 946 ${GROUND - 96} 977 ${GROUND - 144}`} />
          <path d={`M 1023 ${GROUND - 144} Q 1078 ${GROUND - 108} 1112 ${GROUND - 118}`} />
          <path d={`M 892 ${GROUND - 116} Q 946 ${GROUND - 78} 977 ${GROUND - 128}`} strokeOpacity="0.5" />
        </g>
      </g>

      {/* water body */}
      <rect x="0" y={GROUND} width="1200" height="150" fill="url(#water)" />
      <use href="#plant-scene" transform={`translate(0 ${GROUND * 2}) scale(1 -1)`} mask="url(#reflection-mask)" opacity="0.5" filter="url(#soft)" />
      <line x1="0" y1={GROUND} x2="1200" y2={GROUND} stroke="rgba(126,213,226,0.4)" strokeWidth="1" />
    </svg>
  );
}
