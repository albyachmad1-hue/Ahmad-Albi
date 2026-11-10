import React from 'react';

interface LcdDisplayProps {
  pitchAngle: number;
  relayState: boolean;
  backlightColor?: 'green' | 'blue';
  compact?: boolean;
}

export const LcdDisplay: React.FC<LcdDisplayProps> = ({
  pitchAngle,
  relayState,
  backlightColor = 'blue',
  compact = false
}) => {
  // Hitung persentase kemiringan jalan (Slope Grade %)
  // Rumus: Grade (%) = tan(pitch_radian) * 100
  const pitchRad = (pitchAngle * Math.PI) / 180.0;
  const gradePercent = Math.tan(pitchRad) * 100.0;

  // Format Baris 1: "P:-05.0° G:-8.7% " (Tepat 16 Karakter LCD)
  const signPitch = pitchAngle >= 0 ? '+' : '-';
  const absPitch = Math.abs(pitchAngle);
  const formattedPitch = `${signPitch}${absPitch < 10 ? '0' : ''}${absPitch.toFixed(1)}`;

  const signGrade = gradePercent >= 0 ? '+' : '-';
  const absGrade = Math.abs(gradePercent);
  const formattedGrade = `${signGrade}${absGrade.toFixed(1)}`;

  // Baris 1 persis 16 karakter
  const rawLine1 = `P:${formattedPitch}\u00B0 G:${formattedGrade}%`;
  const line1 = rawLine1.length < 16 ? rawLine1.padEnd(16, ' ') : rawLine1.slice(0, 16);

  // Baris 2 persis 16 karakter
  const line2 = (relayState ? 'RELAY ON:2500RPM' : 'RELAY OFF:NORMAL').padEnd(16, ' ');

  const isGreen = backlightColor === 'green';
  const bgClass = isGreen
    ? 'bg-emerald-950 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
    : 'bg-[#002244] border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)]';
  const textClass = isGreen
    ? 'text-emerald-300 font-mono tracking-widest'
    : 'text-cyan-200 font-mono tracking-widest';

  return (
    <div className="relative inline-block w-full max-w-md mx-auto">
      {/* Pin Connection Header Label */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 px-1">
        <span className="text-cyan-400 font-bold">LCD I2C: SDA (Pin D4) • SCL (Pin D5)</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${relayState ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          JALUR TERPISAH
        </span>
      </div>

      {/* Outer LCD Bezel */}
      <div className="bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Metallic Bezel Border */}
        <div className="border border-slate-600/80 rounded-lg p-2 bg-gradient-to-b from-slate-800 to-slate-900">
          {/* LCD Screen Display Area */}
          <div className={`rounded-md p-3 sm:p-4 border ${bgClass} transition-colors duration-300 relative overflow-hidden select-none`}>
            {/* Subtle Screen Scanline Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-10" />

            {/* Line 1 */}
            <div className={`text-base sm:text-xl font-bold font-mono tracking-wider whitespace-pre ${textClass} drop-shadow-[0_0_6px_currentColor]`}>
              {line1}
            </div>

            {/* Line 2 */}
            <div className={`text-base sm:text-xl font-bold font-mono tracking-wider whitespace-pre mt-1 ${textClass} drop-shadow-[0_0_6px_currentColor]`}>
              {line2}
            </div>

            {/* Subtle Matrix Dot overlay */}
            <div className="absolute top-1 right-2 text-[9px] font-mono text-cyan-400/40 uppercase">
              16x2 I2C MATRIX
            </div>
          </div>
        </div>

        {/* Pin Reference Footer */}
        {!compact && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>SDA (Pin D4) • SCL (Pin D5)</span>
            <span className="text-emerald-400 font-bold">JALUR MANDIRI (BEBAS GANGGUAN MPU)</span>
            <span className="text-cyan-400">Trimpot Onboard</span>
          </div>
        )}
      </div>
    </div>
  );
};
