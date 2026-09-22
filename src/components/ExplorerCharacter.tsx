import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { CharacterMood } from '../types';

interface ExplorerCharacterProps {
  mood?: CharacterMood;
  speechText?: string;
  subText?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
}

export const ExplorerCharacter: React.FC<ExplorerCharacterProps> = ({
  mood = 'idle',
  speechText,
  subText,
  size = 'md',
  className = '',
  onClick,
}) => {
  const [customImageSrc, setCustomImageSrc] = useState<string | null>('/character.svg');

  useEffect(() => {
    // Check if user has uploaded an image file to public/
    const candidates = ['/character.svg', '/Chrecter.png', '/chrecter.png', '/character.png', '/hero.png'];
    let mounted = true;

    for (const src of candidates) {
      const img = new Image();
      img.onload = () => {
        if (mounted) {
          setCustomImageSrc(src);
        }
      };
      img.src = src;
    }

    return () => {
      mounted = false;
    };
  }, []);

  const sizeMap = {
    sm: 'w-24 h-28',
    md: 'w-32 h-38 sm:w-40 sm:h-48',
    lg: 'w-44 h-52 sm:w-56 sm:h-64',
    hero: 'w-56 h-68 sm:w-72 sm:h-84',
  };

  const bounceVariants: Variants = {
    idle: {
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -8, 0, -4, 0],
      rotate: [-1, 1.5, -1, 0],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -14, 0, -8, 0],
      scale: [1, 1.05, 1],
      rotate: [-2, 2, -1, 0],
      transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [-2, 2, -2],
      transition: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
    },
    encouraging: {
      y: [0, -6, 0],
      scale: [1, 1.04, 1],
      transition: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' },
    },
    'super-excited': {
      y: [0, -16, 0, -8, 0],
      scale: [1, 1.08, 1],
      rotate: [-3, 3, -2, 2, 0],
      transition: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' },
    },
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Pop Comic Dialogue Balloon */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 24 }}
          className="mb-3 max-w-xs sm:max-w-md px-4 py-3 bg-white border-3 border-black text-slate-900 rounded-2xl shadow-[5px_5px_0px_#111827] relative text-center z-10"
        >
          {/* Starburst Badge Tag */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E5192D] text-white border-2 border-black rounded-full font-pop text-[10px] uppercase tracking-wider mb-1 shadow-[2px_2px_0px_#000]">
            <span>⚡ KANNADABLOX HERO</span>
          </div>
          <p className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
            {speechText}
          </p>
          {subText && (
            <p className="text-xs text-[#E5192D] font-bold mt-0.5">{subText}</p>
          )}

          {/* Comic Dialogue Arrow / Tail */}
          <div
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-white border-b-3 border-r-3 border-black rotate-45"
          />
        </motion.div>
      )}

      {/* Vector Manga Companion Runner Character */}
      <motion.div
        variants={bounceVariants}
        animate={mood}
        onClick={onClick}
        className={`${sizeMap[size]} cursor-pointer select-none filter drop-shadow-[5px_5px_0px_rgba(17,24,39,0.8)] relative flex items-center justify-center`}
        title="KannadaBLOX Hero Runner"
      >
        {customImageSrc ? (
          <img
            src={customImageSrc}
            alt="KannadaBLOX Hero Runner"
            className="w-full h-full object-contain pointer-events-none"
            onError={() => setCustomImageSrc(null)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg viewBox="0 0 240 280" className="w-full h-full overflow-visible">
          <defs>
            {/* Manga Stipple Halftone Dot Pattern for Hoodie */}
            <pattern id="mangaHalftoneHoodie" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.2" fill="#18181B" opacity="0.6" />
            </pattern>
            {/* Manga Stipple Dot Pattern for Cap */}
            <pattern id="mangaHalftoneCap" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1" fill="#18181B" opacity="0.5" />
            </pattern>
            {/* Subtle Screen Paper Texture */}
            <filter id="mangaShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#09090B" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* 1. GIANT CRIMSON RED KANNADA GLYPH BACKDROP (The Letter 'ಕ')   */}
          {/* ============================================================== */}
          <g id="kannada-red-glyph">
            {/* Top curved horizontal head arch */}
            <path
              d="M48 68 C48 40 85 28 140 28 C192 28 206 50 206 72 C206 90 190 102 165 106 C178 112 204 125 204 154 C204 186 165 205 118 205 C70 205 32 184 32 152 C32 128 50 114 74 108 C54 100 48 85 48 68 Z"
              fill="#E5192D"
              opacity="0.95"
            />
            {/* Letter cut-outs to match the exact Kannada Ka (ಕ) graphic shape */}
            {/* Top inner counter space */}
            <path
              d="M92 48 C120 48 162 48 162 68 C162 82 135 84 100 84 C76 84 72 74 72 64 C72 52 82 48 92 48 Z"
              fill="#FFFFFF"
            />
            {/* Left crossbar wing */}
            <rect x="34" y="94" width="54" height="20" rx="3" fill="#E5192D" />
            {/* Bottom inner loop counter space */}
            <path
              d="M80 134 C105 130 160 130 160 156 C160 178 115 182 82 176 C65 172 58 158 58 148 C58 138 68 135 80 134 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* ============================================================== */}
          {/* 2. MANGA SPEED LINES & MOTION DYNAMICS                          */}
          {/* ============================================================== */}
          {/* Back speed arcs behind backpack */}
          <path d="M26 142 C20 148 18 156 22 164" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M32 172 C26 177 24 184 28 190" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Skid lines under back shoe */}
          <line x1="32" y1="250" x2="82" y2="250" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="254" x2="204" y2="254" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" />

          {/* Motion arcs around shoes */}
          <path d="M24 235 C20 242 22 250 26 254" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M208 240 C214 246 215 252 210 258" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M148 248 C144 254 146 258 150 260" stroke="#09090B" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Smartphone Radiating Broadcast Lines */}
          <line x1="172" y1="102" x2="178" y2="94" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="196" y1="94" x2="202" y2="84" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
          <line x1="208" y1="112" x2="216" y2="108" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="204" y1="126" x2="214" y2="128" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />

          {/* ============================================================== */}
          {/* 3. BOY CHARACTER BODY & OUTFIT                                 */}
          {/* ============================================================== */}
          <g id="manga-boy-runner">
            {/* --- BACK LEG & SNEAKER (Kicking backward in air) --- */}
            <g id="back-leg">
              {/* Back Thigh */}
              <path
                d="M92 188 L68 208 L80 220 L102 195 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* White Sock with ribbing line */}
              <path
                d="M66 206 L52 222 L64 228 L78 214 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <line x1="56" y1="216" x2="68" y2="222" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

              {/* Chunky Back Sneaker (Heel tilted up in stride) */}
              {/* Sneaker Body */}
              <path
                d="M54 222 L38 232 C34 238 36 244 42 246 L68 244 C76 244 80 238 74 230 L64 224 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Thick Sculpted Sole */}
              <path
                d="M36 238 C32 244 34 250 44 250 L72 248 C80 248 82 242 78 236"
                stroke="#09090B"
                strokeWidth="4"
                fill="none"
              />
              {/* Three Streetwear Black Stripes */}
              <line x1="44" y1="234" x2="48" y2="244" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="233" x2="54" y2="243" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              <line x1="56" y1="232" x2="60" y2="242" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              
              {/* Bouncing Tied Shoelace Loops */}
              <path d="M56 226 C60 220 66 222 64 228 C62 232 58 236 60 242" stroke="#09090B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M58 227 C62 234 66 238 68 244" stroke="#09090B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* --- BLACK BACKPACK ON BACK --- */}
            <g id="backpack">
              {/* Main Backpack Shell */}
              <path
                d="M84 122 C64 128 56 142 58 164 C60 178 72 188 88 184 L96 150 Z"
                fill="#09090B"
                stroke="#09090B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Backpack Top Loop */}
              <path d="M72 124 C68 116 78 114 82 120" stroke="#09090B" strokeWidth="3" fill="none" />
              {/* White zipper seam reflection */}
              <path d="M64 136 C60 148 62 165 70 175" stroke="#3F3F46" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            </g>

            {/* --- FRONT LEG & CHUNKY SNEAKER (Stepping forward) --- */}
            <g id="front-leg">
              {/* Front Knee & Leg */}
              <path
                d="M136 190 L166 216 L154 232 L124 204 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Knee hatch mark */}
              <line x1="148" y1="206" x2="154" y2="212" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

              {/* White Crew Sock */}
              <path
                d="M162 216 L174 232 L162 242 L150 226 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <line x1="168" y1="222" x2="174" y2="228" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

              {/* Chunky Front Sneaker */}
              <path
                d="M152 238 L170 230 C182 226 195 230 204 238 C212 245 208 254 196 256 L160 256 C148 256 144 248 152 238 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Thick Wavy Foam Sole */}
              <path
                d="M146 248 C158 258 190 258 206 254 C212 252 214 246 208 240"
                stroke="#09090B"
                strokeWidth="3.5"
                fill="none"
              />
              {/* Three Streetwear Black Stripes on Front Shoe */}
              <line x1="172" y1="234" x2="168" y2="248" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              <line x1="178" y1="235" x2="174" y2="249" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              <line x1="184" y1="236" x2="180" y2="250" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
              
              {/* Looped Laces */}
              <path d="M164 232 C168 226 174 228 172 234" stroke="#09090B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M172 234 C176 240 180 244 184 246" stroke="#09090B" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* --- BLACK STREET SHORTS --- */}
            <g id="shorts">
              <path
                d="M84 172 L144 170 L156 198 L126 204 L114 190 L98 206 L82 195 Z"
                fill="#09090B"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* White Lightning Bolt Decal on Left Short Thigh */}
              <polygon
                points="102,185 106,192 103,192 105,198 99,191 102,191"
                fill="#FFFFFF"
              />
            </g>

            {/* --- OVERSIZED COZY HOODIE WITH HALFTONE TEXTURE --- */}
            <g id="hoodie-torso">
              {/* Hoodie Base Shape */}
              <path
                d="M86 122 C92 110 110 108 132 108 C144 108 152 114 150 128 L142 176 L86 176 Z"
                fill="#F4F4F5"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Halftone Screentone Fill on Hoodie */}
              <path
                d="M88 122 C94 112 110 110 132 110 C143 110 149 116 148 128 L140 174 L88 174 Z"
                fill="url(#mangaHalftoneHoodie)"
              />

              {/* Draped Hood Collar behind neck */}
              <path
                d="M96 112 C90 116 88 124 94 130 C100 134 112 134 118 126 Z"
                fill="#E4E4E7"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Thick Backpack Shoulder Strap over chest */}
              <path
                d="M102 114 C98 126 94 146 96 166 L108 168 C106 148 108 128 114 116 Z"
                fill="#09090B"
                stroke="#09090B"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Hoodie Front Pocket Line & Folds */}
              <path d="M102 152 C115 150 128 150 138 156" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M120 162 C128 160 136 162 140 166" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* --- RIGHT ARM HOLDING LARGE PENCIL --- */}
            <g id="right-arm-pencil">
              {/* Upper arm & Sleeve */}
              <path
                d="M94 126 C86 134 76 148 84 158 C90 165 106 162 116 156 L124 144 C116 138 106 130 94 126 Z"
                fill="#F4F4F5"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Sleeve Halftone */}
              <path
                d="M92 130 C86 136 80 148 86 156 C90 160 102 158 112 154 L118 144 Z"
                fill="url(#mangaHalftoneHoodie)"
              />

              {/* Ribbed Sleeve Cuff */}
              <path
                d="M112 154 L122 144 L126 148 L116 158 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="3"
              />

              {/* Hand gripping pencil */}
              <path
                d="M116 154 C118 160 126 164 132 158 C136 154 134 148 128 146 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="3"
              />
              <path d="M124 150 C128 154 130 156 128 160" stroke="#09090B" strokeWidth="2.5" fill="none" />

              {/* THE PENCIL (Pointed downward forward) */}
              <g transform="rotate(35 125 155)">
                {/* Pencil Body Shaft */}
                <rect x="110" y="148" width="10" height="34" rx="1.5" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
                <line x1="115" y1="148" x2="115" y2="182" stroke="#09090B" strokeWidth="1.5" />
                {/* Wood Sharpened Tip Cone */}
                <polygon points="110,182 120,182 115,196" fill="#FFFDF7" stroke="#09090B" strokeWidth="2.5" />
                {/* Black Graphite Lead Point */}
                <polygon points="113,190 117,190 115,196" fill="#09090B" />
              </g>
            </g>

            {/* --- LEFT ARM HOLDING SMARTPHONE --- */}
            <g id="left-arm-phone">
              {/* Sleeve extending forward/up */}
              <path
                d="M136 122 C146 126 158 136 166 145 C168 149 164 154 158 152 C150 148 142 140 134 134 Z"
                fill="#F4F4F5"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M138 125 C146 128 156 136 164 144 C164 146 160 150 156 148 C150 145 142 138 136 132 Z"
                fill="url(#mangaHalftoneHoodie)"
              />

              {/* Ribbed Wrist Cuff */}
              <path
                d="M162 142 L168 148 L164 152 L158 146 Z"
                fill="#FFFFFF"
                stroke="#09090B"
                strokeWidth="2.5"
              />

              {/* Cartoon Hand Gripping Phone */}
              <path
                d="M166 144 C172 140 178 144 176 150 C174 154 168 156 164 150 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="3"
              />

              {/* Modern Black Smartphone */}
              <g transform="rotate(-18 174 136)">
                {/* Phone Body */}
                <rect
                  x="166"
                  y="120"
                  width="18"
                  height="34"
                  rx="4"
                  fill="#09090B"
                  stroke="#09090B"
                  strokeWidth="3"
                />
                {/* Phone Screen Reflection / Glass */}
                <rect
                  x="169"
                  y="124"
                  width="12"
                  height="26"
                  rx="2"
                  fill="#FFFFFF"
                  opacity="0.9"
                />
                {/* Mini Kannada glyph or soundwave on screen */}
                <path d="M172 134 Q175 130 178 134 T180 140" stroke="#E5192D" strokeWidth="2" fill="none" />
              </g>
            </g>

            {/* --- HEAD & BASEBALL CAP --- */}
            <g id="head-and-cap">
              {/* Chubby Manga Profile Cheek & Chin */}
              <path
                d="M124 96 C124 96 116 114 128 124 C138 132 152 128 158 116 C162 108 164 98 158 92 C154 88 140 88 128 92 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Cute Stylized Ear */}
              <path
                d="M120 102 C114 104 114 116 122 118 C126 120 128 114 126 108 Z"
                fill="#FFFDF7"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Inner Ear Helix Line */}
              <path d="M120 106 C118 110 120 114 124 112" stroke="#09090B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Manga Eyebrow */}
              <path d="M148 92 C152 90 156 92 158 94" stroke="#09090B" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Distinctive Manga Eye */}
              {mood === 'celebrating' || mood === 'super-excited' ? (
                // Super joyful curved arc eye
                <path d="M146 100 Q152 94 158 100" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
              ) : (
                // Stylized oval manga pupil looking forward at smartphone
                <g>
                  <ellipse cx="152" cy="100" rx="4.5" ry="6.5" fill="#09090B" />
                  {/* Glossy White Highlight Sparkle */}
                  <ellipse cx="150" cy="98" rx="2" ry="2.5" fill="#FFFFFF" />
                </g>
              )}

              {/* Cute Round Manga Nose */}
              <path d="M158 102 C162 104 163 108 158 110" stroke="#09090B" strokeWidth="3.5" fill="none" strokeLinecap="round" />

              {/* Focused / Determined Smile */}
              {mood === 'happy' || mood === 'celebrating' || mood === 'super-excited' ? (
                <path
                  d="M146 116 C148 122 156 122 158 116 Z"
                  fill="#E5192D"
                  stroke="#09090B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              ) : (
                <path d="M146 116 C150 118 154 118 156 115" stroke="#09090B" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}

              {/* Dark Hair tufts peeking under cap */}
              <path d="M116 100 C112 108 114 116 118 120" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M112 106 C108 112 110 118 114 122" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* --- STREETWEAR BASEBALL CAP --- */}
              {/* Cap Crown Dome with Halftone Screentone */}
              <path
                d="M116 94 C114 74 130 64 154 64 C166 64 176 72 174 86 C164 88 140 92 116 94 Z"
                fill="#F4F4F5"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M118 92 C116 76 130 66 154 66 C164 66 174 74 172 86 C162 87 140 90 118 92 Z"
                fill="url(#mangaHalftoneCap)"
              />

              {/* Black Cap Visor / Brim extending forward */}
              <path
                d="M148 84 C164 78 184 84 186 92 C175 96 156 94 146 90 Z"
                fill="#09090B"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Lightning Bolt Badge on Cap Crown */}
              <polygon
                points="132,74 137,80 133,80 135,86 128,79 131,79"
                fill="#09090B"
              />
            </g>
          </g>

          {/* Action Sparks / Starbursts when Celebrating */}
          {(mood === 'celebrating' || mood === 'super-excited') && (
            <g id="celebration-sparks">
              <polygon points="30,40 33,48 42,50 33,52 30,60 27,52 18,50 27,48" fill="#FFC700" stroke="#09090B" strokeWidth="2" />
              <polygon points="210,50 212,56 218,58 212,60 210,66 208,60 202,58 208,56" fill="#E5192D" stroke="#09090B" strokeWidth="2" />
              <polygon points="190,170 193,176 200,178 193,180 190,186 187,180 180,178 187,176" fill="#FFDE59" stroke="#09090B" strokeWidth="2" />
            </g>
          )}
        </svg>
        )}
      </motion.div>
    </div>
  );
};
