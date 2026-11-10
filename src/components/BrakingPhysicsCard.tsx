import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Gauge, 
  ArrowRight,
  Info
} from 'lucide-react';

interface BrakingPhysicsCardProps {
  currentPitch: number; // Pitch angle in degrees (negative for downhill)
  relayActive: boolean; // Is CVT engine brake active
}

export const BrakingPhysicsCard: React.FC<BrakingPhysicsCardProps> = ({
  currentPitch,
  relayActive
}) => {
  // Parameters as per user specifications
  const [speedKmh, setSpeedKmh] = useState<number>(40); // 40 km/h default
  const [distanceM, setDistanceM] = useState<number>(200); // 200 m default
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.35); // 0.35 dry asphalt

  // Conversions
  const speedMs = speedKmh * (1000 / 3600); // 11.11 m/s for 40 km/h
  const g = 9.81; // m/s^2

  // Slope grade percentage from pitch angle: G (%) = tan(theta) * 100
  // For calculation in downhill, we use the absolute slope if pitch is negative
  const isDownhill = currentPitch < 0;
  const absPitch = Math.abs(currentPitch);
  const pitchRad = (absPitch * Math.PI) / 180;
  const gradePercent = Math.tan(pitchRad) * 100; // e.g. -5.0° -> 8.75%
  const gradeDecimal = gradePercent / 100; // e.g. 0.0875

  // 1. Perlambatan dasar (jalan datar): a = v^2 / (2 * S)
  const aBase = (speedMs * speedMs) / (2 * distanceM); // 0.31 m/s^2 for 40 km/h and 200m

  // 2. Gaya dorong gravitasi di jalan menurun: g * G
  const gravityPush = isDownhill ? g * gradeDecimal : 0;

  // 3. Total perlambatan yang harus dikerjakan rem: a_rem = [v^2 / (2S)] + (g * G)
  const aBrakeTotal = aBase + gravityPush;

  // 4. Efek CVT Engine Brake (mengurangi beban rem cakram sebesar ~0.38 m/s^2)
  const cvtBrakingAssist = relayActive ? 0.38 : 0;
  const netPadBrakeLoad = Math.max(0, aBrakeTotal - cvtBrakingAssist);

  // 5. Rasio beban kerja rem dibandingkan jalan datar
  const loadMultiplier = aBase > 0 ? (aBrakeTotal / aBase) : 1;

  // 6. Rumus Jarak Berhenti Ideal: S = v^2 / [ 254 * ( f - G ) ]
  const effectiveFriction = frictionCoeff - (isDownhill ? gradeDecimal : -gradeDecimal);
  const idealStoppingDistance = effectiveFriction > 0.03 
    ? (speedKmh * speedKmh) / (254 * effectiveFriction)
    : 999;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <Calculator className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Kalkulator Fisika Pengereman Turunan & Beban Rem
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono border border-rose-500/30">
                Rumus Dinamis
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analisis matematis perlambatan (<code className="text-cyan-300">a = v² / 2S</code>), gaya dorong gravitasi (<code className="text-cyan-300">g × G</code>), dan jarak berhenti ideal (<code className="text-cyan-300">S = v² / [254(f-G)]</code>).
            </p>
          </div>
        </div>

        {/* Live Incline Readout */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <TrendingDown className={`w-4 h-4 ${isDownhill ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">Kemiringan Aktif:</span>
            <span className={`font-bold ${isDownhill ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentPitch >= 0 ? `+${currentPitch.toFixed(1)}°` : `${currentPitch.toFixed(1)}°`} 
              {' '}({isDownhill ? '-' : '+'}{gradePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sliders for Custom Testing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
        {/* Speed Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">Kecepatan (v):</span>
            <span className="font-mono font-bold text-cyan-400">{speedKmh} km/jam ({speedMs.toFixed(2)} m/s)</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={speedKmh}
            onChange={(e) => setSpeedKmh(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>20 km/j</span>
            <span className="text-cyan-400 font-bold">40 km/j (Kasus Kamu)</span>
            <span>80 km/j</span>
          </div>
        </div>

        {/* Distance Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">Jarak Target Berhenti (S):</span>
            <span className="font-mono font-bold text-emerald-400">{distanceM} meter</span>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            step="25"
            value={distanceM}
            onChange={(e) => setDistanceM(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>50 m</span>
            <span className="text-emerald-400 font-bold">200 m (Kasus Kamu)</span>
            <span>400 m</span>
          </div>
        </div>

        {/* Friction Coefficient Selector */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">Kondisi Aspal (f):</span>
            <span className="font-mono font-bold text-amber-400">
              {frictionCoeff === 0.35 ? '0.35 (Kering)' : frictionCoeff === 0.20 ? '0.20 (Basah)' : '0.12 (Licin)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <button
              onClick={() => setFrictionCoeff(0.35)}
              className={`py-1 text-[11px] rounded font-mono font-semibold transition-all ${
                frictionCoeff === 0.35
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Kering (0.35)
            </button>
            <button
              onClick={() => setFrictionCoeff(0.20)}
              className={`py-1 text-[11px] rounded font-mono font-semibold transition-all ${
                frictionCoeff === 0.20
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Basah (0.20)
            </button>
            <button
              onClick={() => setFrictionCoeff(0.12)}
              className={`py-1 text-[11px] rounded font-mono font-semibold transition-all ${
                frictionCoeff === 0.12
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Licin (0.12)
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculated Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Metric 1: Perlambatan Dasar (Datar) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            1. Perlambatan Dasar (Jalan Datar)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-cyan-300">
              {aBase.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">m/s²</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 bg-slate-900 p-1.5 rounded">
            a = {speedMs.toFixed(1)}² / (2 × {distanceM})
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Perlambatan yang diperlukan untuk berhenti di permukaan datar tanpa gravitasi tambahan.
          </p>
        </div>

        {/* Metric 2: Gaya Dorong Gravitasi */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            2. Gaya Dorong Gravitasi (g × G)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${gravityPush > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              +{gravityPush.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">m/s²</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 bg-slate-900 p-1.5 rounded">
            9.81 × {gradeDecimal.toFixed(3)} ({gradePercent.toFixed(1)}%)
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Gaya dorong menuruni lereng yang membebani rem dan mempercepat putaran roda belakang.
          </p>
        </div>

        {/* Metric 3: Total Perlambatan yang Dibutuhkan Rem */}
        <div className={`p-4 rounded-xl border transition-all ${
          loadMultiplier >= 2.5
            ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
            : loadMultiplier >= 1.8
            ? 'bg-amber-950/40 border-amber-500/50'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-mono text-slate-300">
              3. Total Rem yang Dibutuhkan (a_rem)
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              loadMultiplier >= 2.5
                ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {loadMultiplier.toFixed(2)}x LEBIH BERAT
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${
              loadMultiplier >= 2.5 ? 'text-rose-400' : 'text-amber-300'
            }`}>
              {aBrakeTotal.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">m/s²</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-900/80 p-1.5 rounded">
            a_rem = {aBase.toFixed(2)} + {gravityPush.toFixed(2)} m/s²
          </div>
          <p className="text-[10px] text-slate-300 mt-2">
            {loadMultiplier >= 2.5
              ? 'BAHAYA OVERHEAT: Beban rem 2-4x lipat lebih tinggi dari jalan datar!'
              : 'Beban pengereman meningkat sebanding kemiringan lereng.'}
          </p>
        </div>

        {/* Metric 4: Jarak Pengereman Ideal */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            4. Jarak Berhenti Ideal (S_ideal)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${
              idealStoppingDistance > 35 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {idealStoppingDistance > 200 ? '>200' : idealStoppingDistance.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">meter</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 bg-slate-900 p-1.5 rounded">
            S = {speedKmh}² / [254 × ({frictionCoeff} - {isDownhill ? gradeDecimal.toFixed(2) : '0'})]
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Jarak minimum untuk berhenti total tanpa roda mengunci (skidding).
          </p>
        </div>
      </div>

      {/* CVT Brake Protection Impact Card */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            relayActive 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Peran CVT Engine Brake (~2500 RPM) pada Keselamatan Rem
              {relayActive && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  AKTIF MEREDUKSI BEBAN REM
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Saat relay D6 aktif mem-bypass TPS ke 2500 RPM, kampas kopling ganda CVT tetap mengunci mangkok kopling. Kompresi mesin memberikan perlambatan alami sebesar <strong>~0.38 m/s²</strong>, secara langsung menyerap gaya dorong gravitasi lereng sehingga rem tromol/cakram tidak kepanasan (anti-brake fade)!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">Beban Bersih Rem Fisik:</span>
            <span className={`text-lg font-bold ${relayActive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netPadBrakeLoad.toFixed(2)} m/s²
            </span>
          </div>
        </div>
      </div>

      {/* Detailed User Table Comparison (Turunan 3%, 5%, 8%, 10%) */}
      <div className="mt-5 pt-5 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Tabel Hitungan Kasus Spesifik (Jarak 200m, Kecepatan 40 km/jam)
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Perlambatan Dasar (Datar): <strong>0.31 m/s²</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="py-2.5 px-3">Kemiringan Turunan</th>
                <th className="py-2.5 px-3">Sudut Setara</th>
                <th className="py-2.5 px-3">Gaya Dorong Gravitasi (g × G)</th>
                <th className="py-2.5 px-3">Total Rem Dibutuhkan</th>
                <th className="py-2.5 px-3">Beban Kerja Rem</th>
                <th className="py-2.5 px-3">Status CVT Brake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className={`hover:bg-slate-800/40 ${Math.abs(gradePercent - 3) < 1 ? 'bg-cyan-950/30 font-bold' : ''}`}>
                <td className="py-2 px-3 text-cyan-300 font-bold">Turunan 3% (0.03)</td>
                <td className="py-2 px-3 text-slate-400">-1.7°</td>
                <td className="py-2 px-3 text-amber-300">0.29 m/s²</td>
                <td className="py-2 px-3 text-white font-bold">0.60 m/s²</td>
                <td className="py-2 px-3 text-slate-300">1.94x (Hampir 2x)</td>
                <td className="py-2 px-3 text-slate-400">Standby (Di atas -5°)</td>
              </tr>
              <tr className={`hover:bg-slate-800/40 ${Math.abs(gradePercent - 5) < 1 ? 'bg-cyan-950/30 font-bold' : ''}`}>
                <td className="py-2 px-3 text-cyan-300 font-bold">Turunan 5% (0.05)</td>
                <td className="py-2 px-3 text-slate-400">-2.9°</td>
                <td className="py-2 px-3 text-amber-300">0.49 m/s²</td>
                <td className="py-2 px-3 text-white font-bold">0.80 m/s²</td>
                <td className="py-2 px-3 text-amber-400">2.58x lipat</td>
                <td className="py-2 px-3 text-slate-400">Standby (Di atas -5°)</td>
              </tr>
              <tr className={`hover:bg-slate-800/40 ${(Math.abs(gradePercent - 8) < 1 || Math.abs(currentPitch + 5) < 0.5) ? 'bg-rose-950/40 font-bold border-l-2 border-rose-500' : ''}`}>
                <td className="py-2 px-3 text-rose-300 font-bold">Turunan 8% s/d 8.7% (Ambang -5.0°)</td>
                <td className="py-2 px-3 text-rose-300">-4.6° s/d -5.0°</td>
                <td className="py-2 px-3 text-amber-300">0.78 s/d 0.85 m/s²</td>
                <td className="py-2 px-3 text-rose-300 font-bold">1.09 s/d 1.16 m/s²</td>
                <td className="py-2 px-3 text-rose-400 font-bold">3.5x - 3.7x lipat</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">RELAY ON (CVT ENGINE BRAKE!)</td>
              </tr>
              <tr className={`hover:bg-slate-800/40 ${Math.abs(gradePercent - 10) < 1 ? 'bg-cyan-950/30 font-bold' : ''}`}>
                <td className="py-2 px-3 text-rose-400 font-bold">Turunan 10% (0.10)</td>
                <td className="py-2 px-3 text-rose-400">-5.7°</td>
                <td className="py-2 px-3 text-amber-300">0.98 m/s²</td>
                <td className="py-2 px-3 text-rose-400 font-bold">1.29 m/s²</td>
                <td className="py-2 px-3 text-rose-500 font-bold">4.16x lipat (&gt; 4x)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">RELAY ON (CVT + BUZZER BEEP)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="text-amber-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Makin curam turunan, rem harus kerja 2-4x lebih keras.
          </span>
          <span>
            Jarak berhenti ideal turunan 5% (f=0.35): <strong className="text-emerald-300">21 meter</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
