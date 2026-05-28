import { memo } from 'react';

const LoginIllustration = () => (
  <svg
    viewBox="0 0 480 540"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-lg"
  >
    <ellipse cx="295" cy="365" rx="195" ry="205" fill="url(#blobGrad)" />
    <rect x="148" y="52" width="198" height="368" rx="22" fill="#3B82F6" />
    <rect x="163" y="72" width="168" height="328" rx="12" fill="#F8FAFC" />
    <rect x="224" y="62" width="46" height="8" rx="4" fill="#2563EB" />
    <circle cx="247" cy="218" r="52" fill="#22C55E" />
    <path d="M222 218 L240 237 L275 200" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="178" y="293" width="138" height="76" rx="12" fill="#2563EB" />
    <rect x="188" y="310" width="86" height="10" rx="5" fill="white" opacity="0.65" />
    <rect x="188" y="327" width="54" height="8" rx="4" fill="white" opacity="0.45" />
    <circle cx="298" cy="317" r="9" fill="white" opacity="0.3" />
    <circle cx="283" cy="317" r="9" fill="white" opacity="0.22" />
    <circle cx="247" cy="412" r="12" fill="#2563EB" />
    <ellipse cx="388" cy="468" rx="54" ry="17" fill="rgba(109,40,217,0.22)" />
    <path d="M367 402 L360 462 L374 462 L376 402Z" fill="#1E293B" />
    <path d="M388 402 L394 462 L408 462 L400 402Z" fill="#1E293B" />
    <ellipse cx="364" cy="464" rx="15" ry="6" fill="#0F172A" />
    <ellipse cx="398" cy="464" rx="15" ry="6" fill="#0F172A" />
    <path d="M360 278 Q367 368 366 402 L400 402 Q397 368 403 278Z" fill="#7C3AED" />
    <path d="M399 298 Q426 318 423 354" stroke="#FECACA" strokeWidth="14" strokeLinecap="round" fill="none" />
    <rect x="417" y="346" width="24" height="40" rx="5" fill="#334155" />
    <rect x="420" y="350" width="18" height="30" rx="3" fill="#64748B" />
    <path d="M363 295 Q338 320 343 355" stroke="#FECACA" strokeWidth="14" strokeLinecap="round" fill="none" />
    <rect x="373" y="255" width="16" height="24" rx="8" fill="#FECACA" />
    <ellipse cx="381" cy="238" rx="30" ry="32" fill="#FECACA" />
    <path d="M352 232 Q356 188 381 190 Q414 193 412 232 Q402 204 378 208 Q360 214 352 232Z" fill="#1E293B" />
    <circle cx="411" cy="202" r="13" fill="#1E293B" />
    <path d="M374 248 Q381 255 388 248" stroke="#E57373" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <defs>
      <radialGradient id="blobGrad" cx="42%" cy="42%" r="58%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
        <stop offset="55%" stopColor="#EC4899" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.18" />
      </radialGradient>
    </defs>
  </svg>
);

export default memo(LoginIllustration);
