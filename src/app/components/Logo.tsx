// Mirrors public/logo.svg, which is the standalone asset the social card is
// generated from (see scripts/generate-icons.mjs). The one difference: the
// capture brackets use currentColor here so the header can tint them per theme.
export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Screenshot Maker"
  >
    <defs>
      <linearGradient
        id="logo-window"
        x1="13"
        y1="15"
        x2="51"
        y2="49"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4338ca" />
      </linearGradient>
      <clipPath id="logo-window-clip">
        <rect x="13" y="15" width="38" height="34" rx="5" />
      </clipPath>
    </defs>
    <g
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 20V10a7 7 0 0 1 7-7h10" />
      <path d="M44 3h10a7 7 0 0 1 7 7v10" />
      <path d="M61 44v10a7 7 0 0 1-7 7H44" />
      <path d="M20 61H10a7 7 0 0 1-7-7V44" />
    </g>
    <rect x="13" y="15" width="38" height="34" rx="5" fill="url(#logo-window)" />
    <g clipPath="url(#logo-window-clip)">
      <path d="M13 24h38" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
      <circle cx="19.5" cy="19.5" r="1.9" fill="#fff" fillOpacity=".9" />
      <circle cx="26" cy="19.5" r="1.9" fill="#fff" fillOpacity=".5" />
      <circle cx="21.5" cy="31" r="3.4" fill="#fff" fillOpacity=".95" />
      <path d="M13 49 25 36l8.5 9L39.5 39 51 49z" fill="#fff" fillOpacity=".95" />
    </g>
  </svg>
);
