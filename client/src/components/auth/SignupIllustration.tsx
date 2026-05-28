import { memo } from 'react';

const SignupIllustration = () => (
  <svg viewBox="0 0 480 540" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
    <ellipse cx="265" cy="310" rx="215" ry="225" fill="url(#signupBlob)" />
    <g transform="rotate(-9 250 260)">
      <rect x="148" y="100" width="162" height="258" rx="16" fill="#1E3A8A" opacity="0.6" />
      <rect x="162" y="120" width="134" height="11" rx="5" fill="white" opacity="0.26" />
      <rect x="162" y="139" width="102" height="9" rx="4" fill="white" opacity="0.2" />
      <rect x="162" y="155" width="118" height="9" rx="4" fill="white" opacity="0.2" />
      <rect x="162" y="171" width="86" height="9" rx="4" fill="white" opacity="0.16" />
    </g>
    <g transform="rotate(-3 255 260)">
      <rect x="160" y="88" width="162" height="268" rx="16" fill="#1D4ED8" />
      <rect x="174" y="108" width="134" height="13" rx="5" fill="white" opacity="0.36" />
      <rect x="174" y="130" width="108" height="10" rx="4" fill="white" opacity="0.28" />
      <rect x="174" y="148" width="126" height="10" rx="4" fill="white" opacity="0.28" />
      <rect x="174" y="166" width="92" height="10" rx="4" fill="white" opacity="0.22" />
      <rect x="174" y="194" width="130" height="10" rx="4" fill="white" opacity="0.22" />
      <rect x="174" y="248" width="19" height="19" rx="4" fill="white" opacity="0.36" />
      <path d="M178 257.5 l4.5 5 9-10.5" stroke="white" strokeWidth="2.2" opacity="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
    <rect x="195" y="138" width="140" height="202" rx="14" fill="#06B6D4" />
    <rect x="208" y="157" width="114" height="13" rx="5" fill="white" opacity="0.52" />
    <rect x="208" y="178" width="90" height="10" rx="4" fill="white" opacity="0.42" />
    <rect x="208" y="195" width="106" height="10" rx="4" fill="white" opacity="0.42" />
    <rect x="208" y="212" width="74" height="10" rx="4" fill="white" opacity="0.36" />
    <rect x="208" y="239" width="114" height="10" rx="4" fill="white" opacity="0.3" />
    <rect x="208" y="268" width="22" height="22" rx="5" fill="#22C55E" />
    <path d="M212 279 l5 5.5 10-12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <ellipse cx="152" cy="476" rx="60" ry="18" fill="rgba(29,78,216,0.18)" />
    <path d="M128 410 L120 468 L138 468 L140 410Z" fill="#1E40AF" />
    <path d="M152 410 L158 468 L176 468 L168 410Z" fill="#1E40AF" />
    <ellipse cx="127" cy="471" rx="18" ry="7" fill="#172554" />
    <ellipse cx="165" cy="471" rx="18" ry="7" fill="#172554" />
    <path d="M118 278 Q127 372 128 410 L172 410 Q171 372 176 278Z" fill="#3B82F6" />
    <path d="M127 288 Q150 278 160 288 Q150 315 127 288Z" fill="#DBEAFE" opacity="0.85" />
    <path d="M172 292 Q212 278 238 270" stroke="#BFDBFE" strokeWidth="17" strokeLinecap="round" fill="none" />
    <path d="M120 290 Q97 316 93 352" stroke="#BFDBFE" strokeWidth="17" strokeLinecap="round" fill="none" />
    <rect x="138" y="258" width="16" height="22" rx="8" fill="#BFDBFE" />
    <ellipse cx="146" cy="240" rx="31" ry="33" fill="#BFDBFE" />
    <path d="M115 235 Q117 192 146 190 Q180 191 179 235 Q167 208 148 212 Q126 218 115 235Z" fill="#1E3A8A" />
    <path d="M126 257 Q146 271 167 257 Q161 278 146 281 Q131 278 126 257Z" fill="#1E3A8A" />
    <defs>
      <radialGradient id="signupBlob" cx="45%" cy="42%" r="56%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
        <stop offset="52%" stopColor="#7DD3FC" stopOpacity="0.52" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.12" />
      </radialGradient>
    </defs>
  </svg>
);

export default memo(SignupIllustration);
