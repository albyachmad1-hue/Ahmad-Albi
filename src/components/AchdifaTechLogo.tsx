import React from 'react';

interface AchdifaTechLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withGlow?: boolean;
}

export const AchdifaTechLogo: React.FC<AchdifaTechLogoProps> = ({
  size = 'md',
  showText = true,
  withGlow = true
}) => {
  const dimension = 
    size === 'sm' ? 36 :
    size === 'md' ? 48 :
    size === 'lg' ? 64 : 80;

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* 3D Modern Geometric Logo Emblem */}
      <div 
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          withGlow ? 'filter drop-shadow-[0_0_15px_rgba(6,182,212,0.45)]' : ''
        }`}
        style={{ width: dimension, height: dimension }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Metallic Titanium 3D Gradient */}
            <linearGradient id="achdifaMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="35%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Cyber Cyan Neon 3D Facet */}
            <linearGradient id="achdifaCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="45%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>

            {/* Deep Cobalt Blue 3D Shadow Facet */}
            <linearGradient id="achdifaCobalt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Gold Mechatronics Accent */}
            <linearGradient id="achdifaGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* 3D Bevel Emboss Filter */}
            <filter id="bevel3D" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Hexagonal 3D Outer Shield / Ring */}
          <polygon 
            points="50,4 90,26 90,74 50,96 10,74 10,26" 
            fill="#090d16" 
            stroke="url(#achdifaCyan)" 
            strokeWidth="2.5" 
          />

          {/* Inner 3D Tech Lines */}
          <polygon 
            points="50,11 83,29 83,71 50,89 17,71 17,29" 
            fill="#0f172a" 
            opacity="0.8" 
          />

          {/* STYLIZED 3D "A" EMBLEM WITH MECHATRONIC WINGS & CVT PULLEY GEOMETRY */}
          {/* Left Facet of 'A' (Cobalt Shadow) */}
          <polygon 
            points="50,16 28,68 39,68 46,50 50,50" 
            fill="url(#achdifaCobalt)" 
            filter="url(#bevel3D)" 
          />

          {/* Right Facet of 'A' (Vivid Cyan Reflection) */}
          <polygon 
            points="50,16 72,68 61,68 54,50 50,50" 
            fill="url(#achdifaCyan)" 
            filter="url(#bevel3D)" 
          />

          {/* Center Crossbar (Golden Circuit Bridge / Automotive Speed Arrow) */}
          <polygon 
            points="36,54 64,54 60,62 40,62" 
            fill="url(#achdifaGold)" 
          />

          {/* Central Apex Core (White Hot Diamond Highlight) */}
          <polygon 
            points="50,16 54,27 50,32 46,27" 
            fill="#ffffff" 
          />

          {/* Dynamic 3D Circuit Speed Fins (Bottom Left & Right) */}
          <path 
            d="M 18,36 L 6,36 L 16,56 L 24,56 Z" 
            fill="url(#achdifaCyan)" 
            opacity="0.9" 
          />
          <path 
            d="M 82,36 L 94,36 L 84,56 L 76,56 Z" 
            fill="url(#achdifaCyan)" 
            opacity="0.9" 
          />

          {/* Electronic Circuit Nodes (Glowing Cyan Dots) */}
          <circle cx="50" cy="78" r="3" fill="#22d3ee" />
          <line x1="50" y1="62" x2="50" y2="78" stroke="#06b6d4" strokeWidth="2" strokeDasharray="2 1" />
          <circle cx="36" cy="84" r="2" fill="#38bdf8" />
          <circle cx="64" cy="84" r="2" fill="#38bdf8" />
          <line x1="50" y1="78" x2="36" y2="84" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="50" y1="78" x2="64" y2="84" stroke="#0284c7" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Typography with 3D Text Effect */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span 
              className="text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 12px rgba(6,182,212,0.3)',
                letterSpacing: '0.08em'
              }}
            >
              ACHDIFA
            </span>
            <span 
              className="text-lg sm:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(59,130,246,0.5)',
                letterSpacing: '0.12em'
              }}
            >
              TECH
            </span>
          </div>
          <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            AUTOMOTIVE &bull; IOT &bull; EMBEDDED
          </span>
        </div>
      )}
    </div>
  );
};
