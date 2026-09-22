import React, { useState, useEffect } from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-10 w-auto max-w-[140px]',
    md: 'h-16 w-auto max-w-[200px]',
    lg: 'h-24 sm:h-28 w-auto max-w-[280px]',
    hero: 'h-36 sm:h-44 md:h-52 w-auto max-w-[380px]',
  };

  if (!hasError) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/logo.svg"
          alt="ಕನ್ನಡ & BLOX Logo"
          className={`${sizeClasses[size]} object-contain filter drop-shadow-[4px_4px_0px_rgba(17,24,39,0.9)]`}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 360"
        className={`${sizeClasses[size]} overflow-visible filter drop-shadow-[5px_5px_0px_rgba(17,24,39,0.9)]`}
        aria-label="ಕನ್ನಡ & BLOX Logo"
      >
        <defs>
          {/* Halftone Screentone Texture for Vintage Comic Style */}
          <pattern id="logoHalftoneDots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.1" fill="#18181B" opacity="0.35" />
          </pattern>

          {/* Red 3D Extrusion Gradient */}
          <linearGradient id="red3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5192D" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Deep Shadow Gradient for 3D Bevels */}
          <linearGradient id="deepRedShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C01020" />
            <stop offset="100%" stopColor="#880A15" />
          </linearGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. THICK COMIC STICKER DIE-CUT OUTER BORDER                */}
        {/* ========================================================= */}
        <path
          d="
            M 120 75
            C 110 70 80 80 60 95
            C 40 110 40 145 50 160
            C 45 170 38 180 38 200
            C 38 235 48 260 70 275
            C 88 288 120 285 150 285
            L 170 275
            L 225 272
            C 255 275 305 265 330 255
            C 365 245 400 230 405 210
            C 415 195 435 175 430 140
            C 425 115 395 100 375 105
            C 360 85 335 70 290 70
            C 270 70 250 78 235 85
            C 220 75 180 70 145 72
            Z
          "
          fill="#09090B"
          stroke="#09090B"
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* ========================================================= */}
        {/* 2. GAMEPAD CONTROLLER (Upper Right, Tilted)               */}
        {/* ========================================================= */}
        <g transform="translate(295, 80) rotate(18)">
          {/* Action speed lines radiating from controller */}
          <line x1="65" y1="-18" x2="75" y2="-32" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          <line x1="88" y1="-8" x2="104" y2="-18" stroke="#09090B" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="98" y1="12" x2="114" y2="12" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" />

          {/* Controller 3D Red Drop Shadow */}
          <rect x="-8" y="6" width="112" height="72" rx="28" fill="#B91C1C" stroke="#09090B" strokeWidth="5" />

          {/* Controller Main Body (Cream with Halftone) */}
          <rect x="-10" y="-2" width="112" height="72" rx="28" fill="#FFFDF8" stroke="#09090B" strokeWidth="5.5" />
          <rect x="-10" y="-2" width="112" height="72" rx="28" fill="url(#logoHalftoneDots)" opacity="0.6" />

          {/* Left/Right Grip Grippers (Black Accent) */}
          <path d="M-8 30 C-4 54 8 68 20 66 L12 40 Z" fill="#09090B" />
          <path d="M100 30 C96 54 84 68 72 66 L80 40 Z" fill="#09090B" />

          {/* Center Touchpad & Lightbar */}
          <rect x="34" y="8" width="24" height="18" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="2.5" />

          {/* D-Pad (Left Cross) */}
          <g transform="translate(14, 18)">
            <rect x="0" y="6" width="20" height="8" rx="2" fill="#18181B" stroke="#09090B" strokeWidth="2" />
            <rect x="6" y="0" width="8" height="20" rx="2" fill="#18181B" stroke="#09090B" strokeWidth="2" />
            {/* Center dot */}
            <circle cx="10" cy="10" r="2.5" fill="#E5192D" />
          </g>

          {/* Action Buttons (Right 4 Buttons) */}
          <g transform="translate(70, 18)">
            <circle cx="10" cy="2" r="4.5" fill="#E5192D" stroke="#09090B" strokeWidth="2" />
            <circle cx="2" cy="10" r="4.5" fill="#E5192D" stroke="#09090B" strokeWidth="2" />
            <circle cx="18" cy="10" r="4.5" fill="#E5192D" stroke="#09090B" strokeWidth="2" />
            <circle cx="10" cy="18" r="4.5" fill="#E5192D" stroke="#09090B" strokeWidth="2" />
          </g>

          {/* Dual Analog Thumbsticks (Lower Center) */}
          <circle cx="30" cy="46" r="10" fill="#18181B" stroke="#09090B" strokeWidth="3" />
          <circle cx="30" cy="46" r="6" fill="#3F3F46" />
          <circle cx="62" cy="46" r="10" fill="#18181B" stroke="#09090B" strokeWidth="3" />
          <circle cx="62" cy="46" r="6" fill="#3F3F46" />
        </g>

        {/* ========================================================= */}
        {/* 3. 3D RED EXTRUSION FOR "ಕನ್ನಡ" (Top Word)               */}
        {/* ========================================================= */}
        <g id="kannada-3d-red">
          {/* Extruded red shadow for Ka (ಕ) */}
          <path
            d="
              M 65 145 L 65 168 L 132 168 L 132 145 Z
              M 55 105 L 55 125 L 125 125 L 125 105 Z
              M 115 130 L 128 172 L 142 168 L 130 126 Z
            "
            fill="url(#deepRedShadow)"
          />
          {/* Extruded red shadow for Nna (ನ್ನ) */}
          <path
            d="
              M 145 135 L 145 165 L 210 165 L 210 135 Z
              M 185 160 L 185 190 L 222 190 L 222 160 Z
            "
            fill="url(#deepRedShadow)"
          />
          {/* Extruded red shadow for Da (ಡ) */}
          <path
            d="
              M 220 125 L 220 162 L 295 162 L 295 125 Z
              M 265 145 L 272 178 L 295 174 L 288 142 Z
            "
            fill="url(#deepRedShadow)"
          />
        </g>

        {/* ========================================================= */}
        {/* 4. "ಕನ್ನಡ" FACE LETTERS (Cream with Halftone)             */}
        {/* ========================================================= */}
        <g id="kannada-face-text">
          {/* Main Kannada Text with authentic thick 3D styling */}
          <text
            x="52"
            y="148"
            className="font-kannada font-black select-none"
            fontSize="78"
            letterSpacing="2"
            fill="url(#deepRedShadow)"
            stroke="#09090B"
            strokeWidth="14"
            strokeLinejoin="round"
          >
            ಕನ್ನಡ
          </text>
          {/* Red 3D Mid-layer */}
          <text
            x="52"
            y="144"
            className="font-kannada font-black select-none"
            fontSize="78"
            letterSpacing="2"
            fill="url(#red3DGrad)"
            stroke="#09090B"
            strokeWidth="10"
            strokeLinejoin="round"
          >
            ಕನ್ನಡ
          </text>
          {/* Cream Top Face */}
          <text
            x="50"
            y="138"
            className="font-kannada font-black select-none"
            fontSize="78"
            letterSpacing="2"
            fill="#FFF8EE"
            stroke="#09090B"
            strokeWidth="6"
            strokeLinejoin="round"
          >
            ಕನ್ನಡ
          </text>
          {/* Halftone texture overlay on top text */}
          <text
            x="50"
            y="138"
            className="font-kannada font-black select-none pointer-events-none"
            fontSize="78"
            letterSpacing="2"
            fill="url(#logoHalftoneDots)"
            opacity="0.6"
          >
            ಕನ್ನಡ
          </text>
        </g>

        {/* ========================================================= */}
        {/* 5. STYLIZED AMPERSAND "&"                                 */}
        {/* ========================================================= */}
        <g transform="translate(195, 155)">
          {/* 3D Red Shadow */}
          <text
            x="0"
            y="14"
            className="font-pop font-black select-none"
            fontSize="28"
            fill="#B91C1C"
            stroke="#09090B"
            strokeWidth="6"
          >
            &amp;
          </text>
          {/* Cream Face */}
          <text
            x="-1"
            y="10"
            className="font-pop font-black select-none"
            fontSize="28"
            fill="#FFF8EE"
            stroke="#09090B"
            strokeWidth="3.5"
          >
            &amp;
          </text>
        </g>

        {/* ========================================================= */}
        {/* 6. "BLOX" 3D RED EXTRUSION BASE                          */}
        {/* ========================================================= */}
        <g id="blox-3d-red">
          {/* 'B' Red Extrusion */}
          <path
            d="
              M 58 175 L 58 268 L 140 268 L 140 252 L 152 248 L 152 215 L 140 205 L 148 195 L 148 175 Z
            "
            fill="url(#deepRedShadow)"
            stroke="#09090B"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* 'L' Red Extrusion */}
          <path
            d="
              M 152 185 L 152 268 L 218 268 L 218 245 L 188 245 L 188 185 Z
            "
            fill="url(#deepRedShadow)"
            stroke="#09090B"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* 'O' Red Extrusion */}
          <path
            d="
              M 224 188 C 224 188 214 220 216 248 C 218 274 246 276 270 276 C 295 276 318 268 316 242 C 314 218 300 188 300 188 Z
            "
            fill="url(#deepRedShadow)"
            stroke="#09090B"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* 'X' Red Extrusion */}
          <path
            d="
              M 306 195 L 340 235 L 308 274 L 345 274 L 368 246 L 392 274 L 424 274 L 388 232 L 418 195 L 385 195 L 366 220 L 344 195 Z
            "
            fill="url(#deepRedShadow)"
            stroke="#09090B"
            strokeWidth="8"
            strokeLinejoin="round"
          />
        </g>

        {/* ========================================================= */}
        {/* 7. "BLOX" TOP CHUNKY CREAM FACES                          */}
        {/* ========================================================= */}
        <g id="blox-faces" transform="translate(0, -10)">
          {/* --- LETTER 'B' --- */}
          <g>
            <path
              d="
                M 56 178
                L 126 178
                C 142 178 146 192 136 204
                C 148 214 145 238 126 240
                L 56 240
                Z
              "
              fill="#FFF8EE"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* 'B' top counter */}
            <path d="M 82 192 L 108 192 C 114 192 114 202 108 202 L 82 202 Z" fill="#E5192D" stroke="#09090B" strokeWidth="4" />
            {/* 'B' bottom counter */}
            <path d="M 82 214 L 112 214 C 118 214 118 226 112 226 L 82 226 Z" fill="#E5192D" stroke="#09090B" strokeWidth="4" />
          </g>

          {/* --- LETTER 'L' --- */}
          <g>
            <path
              d="
                M 152 178
                L 182 178
                L 182 222
                L 214 222
                L 214 242
                L 152 242
                Z
              "
              fill="#FFF8EE"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
          </g>

          {/* --- LETTER 'O' WITH PLAY TRIANGLE --- */}
          <g>
            {/* Outer Rounded Block 'O' */}
            <path
              d="
                M 230 180
                C 214 180 210 200 210 218
                C 210 236 216 248 238 248
                L 278 248
                C 298 248 304 234 304 216
                C 304 198 296 180 274 180
                Z
              "
              fill="#FFF8EE"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* PLAY BUTTON TRIANGLE IN CENTER (Iconic feature of the logo!) */}
            <polygon
              points="244,198 274,215 244,232"
              fill="#E5192D"
              stroke="#09090B"
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </g>

          {/* --- LETTER 'X' --- */}
          <g>
            <path
              d="
                M 306 180
                L 334 180
                L 358 210
                L 384 180
                L 412 180
                L 378 218
                L 414 252
                L 386 252
                L 358 222
                L 330 252
                L 304 252
                L 340 218
                Z
              "
              fill="#FFF8EE"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
          </g>

          {/* Halftone texture overlay across BLOX faces */}
          <path
            d="
              M 56 178 L 140 178 L 140 240 L 56 240 Z
              M 152 178 L 214 178 L 214 242 L 152 242 Z
              M 210 180 L 304 180 L 304 248 L 210 248 Z
              M 304 180 L 414 180 L 414 252 L 304 252 Z
            "
            fill="url(#logoHalftoneDots)"
            opacity="0.5"
            className="pointer-events-none"
          />
        </g>
      </svg>
    </div>
  );
};
