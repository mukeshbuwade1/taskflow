import { memo } from 'react';

interface BackgroundPatternProps {
  patternId?: string;
}

const BackgroundPattern = ({ patternId = 'taskIcons' }: BackgroundPatternProps) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.12 }}
    aria-hidden="true"
  >
    <defs>
      <pattern id={patternId} x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(18,16)">
          <circle cx="14" cy="12" r="10" />
          <path d="M9 22 h10 M10.5 26 h7 M14 30 v5" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(110,8)">
          <circle cx="18" cy="18" r="11" />
          <circle cx="18" cy="18" r="5" />
          <path d="M18 1v6 M18 29v6 M1 18h6 M29 18h6 M5.6 5.6l4.2 4.2 M26.2 26.2l4.2 4.2 M30.4 5.6l-4.2 4.2 M9.8 26.2l-4.2 4.2" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(170,88)">
          <circle cx="16" cy="16" r="15" />
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="3.5" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(22,118)">
          <circle cx="16" cy="10" r="9" />
          <path d="M2 42 Q16 26 30 42" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(130,145)">
          <rect x="0" y="0" width="26" height="26" rx="4" />
          <path d="M6 13 l7 7 11-13" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(72,158)">
          <path d="M16 2 l3.6 8.8 9.4.8-7.2 6.2 2.4 9.2-8.2-5-8.2 5 2.4-9.2-7.2-6.2 9.4-.8Z" strokeLinejoin="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(2,170)">
          <rect x="0" y="5" width="30" height="26" rx="3" />
          <path d="M0 13 h30 M8 0 v10 M22 0 v10 M5 19 h5 M13 19 h5 M21 19 h5 M5 25 h5 M13 25 h5" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(168,16)">
          <rect x="2" y="5" width="24" height="30" rx="2" />
          <path d="M8 5 V2 a6 6 0 0 1 12 0 V5 M7 16 h14 M7 22 h14 M7 28 h8" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(68,60)">
          <path d="M2 2 h28 a3 3 0 0 1 3 3 v16 a3 3 0 0 1-3 3 h-15 l-8 8 v-8 h-5 a3 3 0 0 1-3-3 v-16 a3 3 0 0 1 3-3 Z" strokeLinejoin="round" />
          <path d="M8 12 h18 M8 18 h12" strokeLinecap="round" />
        </g>
        <g stroke="#6B7280" strokeWidth="1.4" fill="none" transform="translate(128,60)">
          <circle cx="16" cy="16" r="14" />
          <path d="M16 6 v10 l7 5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
  </svg>
);

export default memo(BackgroundPattern);
