import { useId } from "react";

/**
 * Self-contained SVG illustrations. No external images are used, so the
 * landing page and dashboard always load instantly and offline.
 */

export function HeroWindow({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;
  return (
    <svg
      viewBox="0 0 480 580"
      overflow="visible"
      className={className}
      role="img"
      aria-label="Illustration of an aeroplane window at sunset with the wing and clouds outside"
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d79b8" />
          <stop offset="0.38" stopColor="#d38fb2" />
          <stop offset="0.7" stopColor="#f6a9b8" />
          <stop offset="1" stopColor="#ffd6bd" />
        </linearGradient>
        <radialGradient id={id("sun")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffd2b8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd2b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("wing")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9bfd0" />
        </linearGradient>
        <linearGradient id={id("frame")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efd9e1" />
        </linearGradient>
        <linearGradient id={id("shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff9f7" />
          <stop offset="1" stopColor="#f3dfe6" />
        </linearGradient>
        <clipPath id={id("glass")}>
          <rect x="62" y="62" width="356" height="456" rx="170" />
        </clipPath>
        <filter id={id("blur")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("shadow")} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#412335" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Outer bezel */}
      <rect
        x="30"
        y="30"
        width="420"
        height="520"
        rx="195"
        fill={`url(#${id("frame")})`}
        filter={`url(#${id("shadow")})`}
      />
      <rect x="46" y="46" width="388" height="488" rx="183" fill="#f6e6ec" />

      {/* Glass scene */}
      <g clipPath={`url(#${id("glass")})`}>
        <rect x="62" y="62" width="356" height="456" fill={`url(#${id("sky")})`} />
        <circle cx="300" cy="390" r="150" fill={`url(#${id("sun")})`} />

        {/* far clouds */}
        <g fill="#fff" opacity="0.55" filter={`url(#${id("blur")})`}>
          <ellipse cx="120" cy="330" rx="90" ry="20" />
          <ellipse cx="360" cy="290" rx="80" ry="16" />
          <ellipse cx="240" cy="260" rx="60" ry="12" />
        </g>

        {/* wing */}
        <path
          d="M430 292 C 350 318 250 370 120 452 L 98 478 C 215 470 330 452 430 430 Z"
          fill={`url(#${id("wing")})`}
        />
        <path d="M430 292 C 350 318 250 370 120 452" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
        <path d="M400 330 L 150 462" stroke="#a79bb0" strokeOpacity="0.35" strokeWidth="1.5" />
        {/* winglet */}
        <path d="M118 454 L 92 392 L 112 386 L 146 446 Z" fill="#efe8f2" />

        {/* near clouds */}
        <g fill="#fff">
          <ellipse cx="150" cy="520" rx="150" ry="52" opacity="0.92" />
          <ellipse cx="330" cy="534" rx="170" ry="56" opacity="0.95" />
          <ellipse cx="240" cy="490" rx="110" ry="34" opacity="0.85" />
          <ellipse cx="400" cy="486" rx="70" ry="24" opacity="0.8" />
        </g>
      </g>

      {/* Window shade */}
      <g clipPath={`url(#${id("glass")})`}>
        <rect x="62" y="62" width="356" height="92" fill={`url(#${id("shade")})`} />
        <g stroke="#e6cdd7" strokeWidth="1.5">
          <line x1="62" y1="86" x2="418" y2="86" />
          <line x1="62" y1="108" x2="418" y2="108" />
          <line x1="62" y1="130" x2="418" y2="130" />
        </g>
        <rect x="62" y="148" width="356" height="8" fill="#e8c9d4" />
        <rect x="216" y="140" width="48" height="22" rx="11" fill="#fff9f7" stroke="#e6cdd7" />
      </g>

      {/* Glass highlight */}
      <path d="M96 200 C 96 160 130 110 190 92" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function BoardingPassIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bp-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9b5e3" />
          <stop offset="0.55" stopColor="#f4a9bf" />
          <stop offset="1" stopColor="#ffd6bd" />
        </linearGradient>
      </defs>
      <rect width="240" height="150" fill="url(#bp-sky)" />
      <ellipse cx="60" cy="140" rx="90" ry="26" fill="#fff" opacity="0.85" />
      <ellipse cx="200" cy="146" rx="90" ry="28" fill="#fff" opacity="0.9" />
      <g transform="translate(88 28) rotate(-8)">
        <rect width="110" height="64" rx="10" fill="#fff" />
        <rect x="0" y="0" width="110" height="18" rx="10" fill="#e986a5" />
        <rect x="0" y="9" width="110" height="9" fill="#e986a5" />
        <rect x="10" y="28" width="46" height="5" rx="2.5" fill="#412335" opacity="0.8" />
        <rect x="10" y="38" width="30" height="4" rx="2" fill="#81767e" opacity="0.6" />
        <rect x="10" y="48" width="38" height="4" rx="2" fill="#81767e" opacity="0.4" />
        <path d="M76 36 l18 -6 l-6 18 l-4 -8 z" fill="#e986a5" />
      </g>
    </svg>
  );
}

export function FlashCardsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="240" height="150" fill="#fcecf1" />
      <g transform="translate(58 30) rotate(-10)">
        <rect width="96" height="68" rx="10" fill="#fff" stroke="#f0dde4" />
      </g>
      <g transform="translate(78 26) rotate(-2)">
        <rect width="96" height="68" rx="10" fill="#fff" stroke="#f0dde4" />
      </g>
      <g transform="translate(100 34) rotate(8)">
        <rect width="100" height="72" rx="10" fill="#fff" stroke="#f0dde4" />
        <path d="M30 40 l32 -10 l-10 28 l-6 -12 z" fill="#e986a5" />
        <rect x="14" y="14" width="34" height="5" rx="2.5" fill="#412335" opacity="0.75" />
      </g>
      <g fill="#a7d3bd" opacity="0.8">
        <path d="M20 140 C 20 100 40 90 54 80 C 52 100 46 124 30 144 Z" />
        <path d="M34 142 C 40 110 62 100 78 98 C 70 120 56 136 38 146 Z" />
      </g>
    </svg>
  );
}

export function ConversationIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4eef8" />
          <stop offset="1" stopColor="#f8dce5" />
        </linearGradient>
      </defs>
      <rect width="240" height="150" fill="url(#cv-bg)" />
      <rect x="30" y="26" width="120" height="44" rx="16" fill="#fff" />
      <rect x="44" y="40" width="70" height="5" rx="2.5" fill="#412335" opacity="0.7" />
      <rect x="44" y="52" width="48" height="5" rx="2.5" fill="#81767e" opacity="0.5" />
      <path d="M52 70 l-8 14 l20 -14 z" fill="#fff" />
      <rect x="92" y="82" width="120" height="44" rx="16" fill="#e986a5" />
      <rect x="106" y="96" width="76" height="5" rx="2.5" fill="#fff" opacity="0.9" />
      <rect x="106" y="108" width="50" height="5" rx="2.5" fill="#fff" opacity="0.7" />
      <path d="M196 126 l8 12 l-22 -12 z" fill="#e986a5" />
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 56" className={className} aria-hidden="true">
      <path
        d="M24 52a20 20 0 0 1 2-39.9A28 28 0 0 1 80 18a17 17 0 0 1 16 34Z"
        fill="currentColor"
      />
    </svg>
  );
}
