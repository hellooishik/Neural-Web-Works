import { useId } from 'react';
import { studio } from '../data/content.js';

/**
 * Neural Web Works identity.
 *
 * The mark is a hexagonal web — six vertices wired into a closed ring — with a
 * bright hub at the centre firing down three spokes. Read small it is a single
 * node; read large it is a network. Pure SVG, so the same geometry serves the
 * 16px favicon and the oversized footer wordmark.
 *
 * Gradient ids are generated per instance so several marks can share a page.
 */
export function LogoMark({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const web = `nww-web-${uid}`;
  const core = `nww-core-${uid}`;

  return (
    <svg
      className={`logo__mark${className ? ` ${className}` : ''}`}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={web} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9df3e6" />
          <stop offset="0.55" stopColor="#4fc3d9" />
          <stop offset="1" stopColor="#2a7fa8" />
        </linearGradient>
        <radialGradient id={core} cx="0.34" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#9df3e6" />
          <stop offset="1" stopColor="#2aa3b8" />
        </radialGradient>
      </defs>

      <g
        fill="none"
        stroke={`url(#${web})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* the web */}
        <path d="M16 5.4 24.9 10.7 24.9 21.3 16 26.6 7.1 21.3 7.1 10.7Z" />
        {/* the synapses */}
        <path d="M16 16V5.4M16 16 7.1 21.3M16 16l8.9 5.3" opacity="0.8" />
      </g>

      <g fill={`url(#${core})`}>
        <circle cx="16" cy="16" r="3.3" />
        <circle cx="16" cy="5.4" r="2.3" />
        <circle cx="7.1" cy="21.3" r="2.3" />
        <circle cx="24.9" cy="21.3" r="2.3" />
      </g>
    </svg>
  );
}

/**
 * Full lockup: mark plus wordmark. The mark is sized in `em`, so the whole
 * lockup scales with whatever font-size the caller sets.
 */
export default function Logo({ className = '' }) {
  const [first, ...rest] = studio.name.split(' ');

  return (
    <span className={`logo${className ? ` ${className}` : ''}`}>
      <LogoMark />
      <span className="logo__word">
        {first}
        {rest.length > 0 && (
          <>
            {' '}
            <span className="logo__word-accent">{rest.join(' ')}</span>
          </>
        )}
      </span>
    </span>
  );
}
