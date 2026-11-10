import React from 'react';
import { AchdifaTechLogo } from './AchdifaTechLogo';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Sparkles, 
  Award, 
  CheckCircle2,
  Layers,
  Lock
} from 'lucide-react';

export const AchdifaCopyrightCard: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-cyan-500/30 via-slate-800/80 to-blue-600/30 shadow-[0_25px_60px_-15px_rgba(6,182,212,0.25)] group transition-all duration-500 hover:shadow-[0_30px_70px_-10px_rgba(6,182,212,0.35)]">
      {/* Background Ambient Cyber Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3D Glassmorphic Body */}
      <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 border border-slate-700/60 overflow-hidden">
        {/* Subtle Metallic Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: 3D Logo & Brand Presentation */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl shadow-cyan-950/40">
              <AchdifaTechLogo size="lg" showText={false} withGlow={true} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span 
                  className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
                  style={{
                    textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(6,182,212,0.4)',
                    letterSpacing: '0.06em'
                  }}
                >
                  ACHDIFA
                </span>
                <span 
                  className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500"
                  style={{
                    textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0 25px rgba(59,130,246,0.6)',
                    letterSpacing: '0.12em'
                  }}
                >
                  TECH
                </span>

                <span className="text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  OFFICIAL COPYRIGHT
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Pusat Riset & Rekayasa Otomasi Sepeda Motor • Inovasi Keselamatan Mechatronics
              </p>

              {/* 3D Embossed Copyright Statement */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-cyan-300 font-bold">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tracking-wide">
                  &copy; 2026 ACHDIFA TECH. ALL RIGHTS RESERVED.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Modern 3D Badges & Certifications */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 max-w-md">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-md">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Arduino & MPU9250 Tech</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-md">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SPDT Fail-Safe Design</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Hardware Schematic</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner Divider */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Otomatis Engine Brake CVT Turunan Honda Vario 125</span>
          </div>

          <div className="text-slate-400 flex items-center gap-3">
            <span>R&D Mechatronics Lab</span>
            <span>&bull;</span>
            <span className="text-cyan-400 font-bold">Achdifa Tech Engineering</span>
          </div>
        </div>
      </div>
    </div>
  );
};
