import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Zap, 
  Gauge, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { LcdDisplay } from './LcdDisplay';
import { BrakingPhysicsCard } from './BrakingPhysicsCard';

export const InclineSimulator: React.FC = () => {
  // Simulator State
  const [targetAngle, setTargetAngle] = useState<number>(-7.5); // Initial downhill -7.5 deg
  const [currentAngle, setCurrentAngle] = useState<number>(-7.5);
  const [engineVibration, setEngineVibration] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [lcdColor, setLcdColor] = useState<'blue' | 'green'>('blue');
  const [trimpotVoltage, setTrimpotVoltage] = useState<number>(0.80); // 0.65 - 0.95V
  
  // Simulation Sensor Signals
  const [accelRawPitch, setAccelRawPitch] = useState<number>(-7.5);
  const [gyroPitch, setGyroPitch] = useState<number>(-7.5);
  const [filteredPitch, setFilteredPitch] = useState<number>(-7.5);
  
  // Relay States
  const [relay1Tps, setRelay1Tps] = useState<boolean>(false);
  const [relay2Buzzer, setRelay2Buzzer] = useState<boolean>(false);
  const [debounceProgress, setDebounceProgress] = useState<number>(0);

  // Web Audio Context reference for Buzzer Sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const beepIntervalRef = useRef<number | null>(null);

  // Hysteresis & Debounce tracking
  const debounceStartRef = useRef<number | null>(null);
  const DEBOUNCE_TIME = 300; // ms
  const THRESHOLD_ON = -5.0; // deg
  const THRESHOLD_OFF = -3.5; // deg

  // Web Audio initialization
  const toggleAudio = () => {
    if (!audioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
        setAudioEnabled(true);
      } catch (err) {
        console.error('AudioContext not supported', err);
      }
    } else {
      setAudioEnabled(false);
      stopBuzzerSound();
    }
  };

  const playBuzzerBeep = () => {
    if (!audioEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, ctx.currentTime); // 2.4 kHz piezo buzzer tone
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  };

  const stopBuzzerSound = () => {
    if (beepIntervalRef.current) {
      window.clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
  };

  // Beep interval effect when relay 2 is active
  useEffect(() => {
    if (relay2Buzzer && audioEnabled) {
      playBuzzerBeep();
      beepIntervalRef.current = window.setInterval(() => {
        playBuzzerBeep();
      }, 400);
    } else {
      stopBuzzerSound();
    }
    return () => stopBuzzerSound();
  }, [relay2Buzzer, audioEnabled]);

  // Main simulation tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Smooth interpolation towards target angle
      setCurrentAngle((prev) => {
        const diff = targetAngle - prev;
        return Math.abs(diff) < 0.1 ? targetAngle : prev + diff * 0.25;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [targetAngle]);

  // Sensor reading and Complementary Filter simulation
  useEffect(() => {
    // Generate simulated vibration noise for accelerometer (engine harmonics)
    const vibrationNoise = engineVibration ? (Math.random() - 0.5) * 4.2 : 0;
    const accelVal = currentAngle + vibrationNoise;
    setAccelRawPitch(accelVal);

    // Gyroscope is smooth but might drift slowly
    const smoothGyro = currentAngle + (Math.random() - 0.5) * 0.3;
    setGyroPitch(smoothGyro);

    // Complementary Filter: 98% Gyro + 2% Accel
    // Filtered = 0.98 * Gyro + 0.02 * Accel
    const filtered = 0.98 * smoothGyro + 0.02 * accelVal;
    setFilteredPitch(filtered);

    // Debounce and Hysteresis Logic
    const now = Date.now();
    if (filtered <= THRESHOLD_ON) {
      if (!relay1Tps) {
        if (!debounceStartRef.current) {
          debounceStartRef.current = now;
          setDebounceProgress(10);
        } else {
          const elapsed = now - debounceStartRef.current;
          const progress = Math.min(100, Math.round((elapsed / DEBOUNCE_TIME) * 100));
          setDebounceProgress(progress);

          if (elapsed >= DEBOUNCE_TIME) {
            setRelay1Tps(true);
            setRelay2Buzzer(true);
            debounceStartRef.current = null;
            setDebounceProgress(100);
          }
        }
      }
    } else if (filtered > THRESHOLD_OFF) {
      // Hysteresis release
      debounceStartRef.current = null;
      setDebounceProgress(0);
      if (relay1Tps) {
        setRelay1Tps(false);
        setRelay2Buzzer(false);
      }
    } else {
      // Inside hysteresis band (-5.0 to -3.5)
      debounceStartRef.current = null;
    }
  }, [currentAngle, engineVibration, relay1Tps]);

  // Derived values
  const simulatedTpsVoltage = relay1Tps ? trimpotVoltage : 0.42; // 0.42V idle vs trimpot bypass
  const simulatedRpm = relay1Tps ? 2500 : 1600; // Idle 1600 RPM vs 2500 RPM bite speed

  return (
    <div className="space-y-6">
      {/* Dual Bus Architectural Upgrade Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Pembaruan Arsitektur: Pemisahan Terminal I2C (Bebas Gangguan Data & Noise Busi)
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                DUAL INDEPENDENT BUS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Terminal <strong>Pin A4 & A5</strong> kini 100% didedikasikan khusus Sensor MPU9250 (Hardware Fast TWI 400kHz), sedangkan 
              LCD 16x2 dipindahkan ke <strong>Pin D4 (SDA) & Pin D5 (SCL)</strong>. Pemisahan ini menjamin siklus pembacaan gyro 100Hz 
              tidak pernah ter-delay oleh penulisan teks display serta kebal terhadap freeze akibat induksi koil pengapian motor!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block">Sensor MPU9250:</span>
            <span className="text-cyan-400 font-bold">Pin A4 & Pin A5</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block">Display LCD 16x2:</span>
            <span className="text-amber-400 font-bold">Pin D4 & Pin D5</span>
          </div>
        </div>
      </div>

      {/* Simulation Controls & Dashboard Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                <Activity className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Simulasi Real-Time Kemiringan & Filter Komplementer
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Uji respon Arduino Uno R3, Complementary Filter 98/2, LCD 16x2, Relay D6 (Bypass TPS Vario), dan Buzzer D7 pada berbagai derajat turunan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setEngineVibration(!engineVibration)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                engineVibration
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Simulasi getaran mesin motor Honda Vario pada sensor accelerometer"
            >
              <Flame className="w-3.5 h-3.5" />
              Getaran Mesin: {engineVibration ? 'AKTIF (±4° Noise)' : 'MATI'}
            </button>

            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                audioEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Dengarkan bunyi buzzer alarm saat turunan"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              Suara Buzzer D7: {audioEnabled ? 'ON' : 'MUTE'}
            </button>

            <button
              onClick={() => setLcdColor(lcdColor === 'blue' ? 'green' : 'blue')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Lampu LCD: {lcdColor === 'blue' ? 'Biru' : 'Hijau'}
            </button>
          </div>
        </div>

        {/* Incline Slider & Preset Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="pitch-slider" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Sudut Kemiringan Sumbu X (Pitch)</span>
                <span className="text-xs font-normal text-slate-400">
                  (Positif = Nanjak, Negatif = Turunan)
                </span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className={`text-2xl font-black font-mono ${
                  currentAngle <= THRESHOLD_ON
                    ? 'text-rose-400'
                    : currentAngle >= 5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {currentAngle >= 0 ? `+${currentAngle.toFixed(1)}` : currentAngle.toFixed(1)}°
                </span>
              </div>
            </div>

            <div className="relative pt-2">
              <input
                id="pitch-slider"
                type="range"
                min="-25"
                max="25"
                step="0.5"
                value={targetAngle}
                onChange={(e) => setTargetAngle(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 border border-slate-700"
              />
              {/* Ticks and Zones */}
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                <span className="text-rose-400">-25° (Curam)</span>
                <span className="text-rose-300 font-bold underline decoration-rose-500">-5° Trigger</span>
                <span className="text-emerald-400">0° Datar</span>
                <span className="text-amber-400">+5° Nanjak</span>
                <span className="text-amber-300">+25° Curam</span>
              </div>
            </div>

            {/* Quick Angle Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Preset Cepat:</span>
              <button
                onClick={() => setTargetAngle(0)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  targetAngle === 0
                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                0.0° (Jalan Datar)
              </button>
              <button
                onClick={() => setTargetAngle(-3.0)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  targetAngle === -3.0
                    ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                -3.0° (Turunan Landai)
              </button>
              <button
                onClick={() => setTargetAngle(-5.0)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  targetAngle === -5.0
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                -5.0° (Ambang Trigger)
              </button>
              <button
                onClick={() => setTargetAngle(-12.0)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  targetAngle === -12.0
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                -12.0° (Turunan Pegunungan)
              </button>
              <button
                onClick={() => setTargetAngle(8.0)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  targetAngle === 8.0
                    ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                +8.0° (Tanjakan)
              </button>
            </div>
          </div>

          {/* Authentic LCD 16x2 Component */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <LcdDisplay
              pitchAngle={filteredPitch}
              relayState={relay1Tps}
              backlightColor={lcdColor}
            />
          </div>
        </div>
      </div>

      {/* Visual Motorcycle & Hardware Actuation Status */}
      {/* Visual Motorcycle & Hardware Actuation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Motorcycle Incline Graphic (SVG Animation) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Visualisasi Posisi Sepeda Motor & CVT Clutch Engagement
              </h3>
              <p className="text-[11px] text-cyan-300 font-medium mt-0.5">
                {currentAngle > 0 
                  ? 'KONDISI MENANJAK: Roda Depan LEBIH TINGGI dari Roda Belakang yang LEBIH RENDAH' 
                  : currentAngle < 0 
                  ? 'KONDISI MENURUN: Roda Depan LEBIH RENDAH dari Roda Belakang yang LEBIH TINGGI' 
                  : 'KONDISI DATAR: Roda Depan & Roda Belakang Sejajar Rata (0.0°)'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                currentAngle <= -5.0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : currentAngle >= 5.0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentAngle <= -5.0 ? 'TURUNAN CURAM (RELAY ON)' : currentAngle >= 5.0 ? 'TANJAKAN (NORMAL)' : 'DATAR (NORMAL)'}
              </span>
            </div>
          </div>

          {/* SVG Road & Scooter Incline Simulation */}
          <div className="relative w-full h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Background Sky & Incline Grid */}
            <svg className="w-full h-full" viewBox="0 0 620 250">
              <defs>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#080c14" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="hondaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>
                <linearGradient id="cvtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="620" height="250" fill="url(#skyGrad)" />

              {/* Horizontal Reference Line */}
              <line x1="30" y1="125" x2="590" y2="125" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
              <text x="590" y="129" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                0.0° BIDANG HORIZONTAL
              </text>

              {/* ROTATED ROAD & MOTORCYCLE */}
              {/* 
                Instruksi Pengguna:
                "SAAT MENANJAK POSISI RODA DEPAN LEBIH TINGGI DARI RODA BELAKANG YANG LEBIH RENDAH DARI PERMUKAAN JALAN DAN SEBALINYA."
                Motor menghadap ke kanan (Roda Depan di kanan x>0, Roda Belakang & CVT di kiri x<0).
                Di koordinat SVG, sumbu Y positif mengarah ke bawah.
                Dengan rotasi rotate(-currentAngle):
                - Saat Menanjak (currentAngle > 0, misal +8°):
                  Rotasi menjadi -8° (berlawanan jarum jam / counter-clockwise).
                  Sisi kanan (RODA DEPAN) terangkat NAIK (LEBIH TINGGI).
                  Sisi kiri (RODA BELAKANG & CVT) turun ke BAWAH (LEBIH RENDAH).
                - Saat Menurun (currentAngle < 0, misal -5° atau -10°):
                  Rotasi menjadi +5° (searah jarum jam / clockwise).
                  Sisi kanan (RODA DEPAN) menukik TURUN (LEBIH RENDAH).
                  Sisi kiri (RODA BELAKANG & CVT) terangkat NAIK (LEBIH TINGGI).
              */}
              <g transform={`translate(310, 125) rotate(${-currentAngle})`}>
                {/* Road surface */}
                <rect x="-320" y="48" width="640" height="85" fill="url(#roadGrad)" />
                <line x1="-320" y1="48" x2="320" y2="48" stroke="#94a3b8" strokeWidth="3.5" />
                {/* Asphalt Center Dashed Line */}
                <line x1="-320" y1="72" x2="320" y2="72" stroke="#eab308" strokeWidth="2.5" strokeDasharray="22 16" />

                {/* Road Incline Degree Indicator along the road */}
                <text x="-290" y="105" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  KEMIRINGAN JALAN: {currentAngle >= 0 ? `+${currentAngle.toFixed(1)}°` : `${currentAngle.toFixed(1)}°`}
                </text>

                {/* DETAILED HONDA VARIO 125 MOTORCYCLE */}
                <g transform="translate(-100, -32)">
                  {/* REAR WHEEL & TIRE (with CVT) */}
                  <g transform="translate(15, 45)">
                    {/* Outer Tire */}
                    <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#334155" strokeWidth="9" />
                    {/* Rim */}
                    <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
                    {/* Spokes */}
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="0" y1="-18" x2="0" y2="18" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="7" fill="#cbd5e1" />
                  </g>

                  {/* FRONT WHEEL & TIRE */}
                  <g transform="translate(185, 45)">
                    {/* Outer Tire */}
                    <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#334155" strokeWidth="9" />
                    {/* Rim */}
                    <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
                    {/* Brake Disc Rotor */}
                    <circle cx="0" cy="0" r="14" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                    {/* Front Disc Brake Caliper */}
                    <rect x="8" y="-12" width="10" height="15" rx="2" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
                    {/* Spokes */}
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="0" y1="-18" x2="0" y2="18" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="7" fill="#cbd5e1" />
                  </g>

                  {/* FRONT TELESCOPIC SUSPENSION FORK */}
                  <line x1="185" y1="45" x2="155" y2="-12" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                  <line x1="183" y1="45" x2="157" y2="10" stroke="#cbd5e1" strokeWidth="4" />
                  {/* Front Fender / Spakbor Depan */}
                  <path d="M 155 35 Q 185 10 215 35" fill="none" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />

                  {/* REAR MONO-SHOCK ABSORBER WITH RED SPRING */}
                  <g transform="translate(42, 20) rotate(-25)">
                    <rect x="-4" y="-2" width="8" height="38" rx="3" fill="#0f172a" />
                    {/* Red Coil Spring */}
                    <path d="M -5 5 Q 0 2 5 5 Q 0 8 -5 11 Q 0 14 5 17 Q 0 20 -5 23 Q 0 26 5 29" fill="none" stroke="#ef4444" strokeWidth="3" />
                  </g>

                  {/* HONDA VARIO 125 CHASSIS & FAIRING BODY */}
                  {/* Lower Belly Pan / Dek Bawah */}
                  <path d="M 35 45 L 80 48 L 140 46 L 155 25 L 140 25 L 75 35 Z" fill="#1e293b" />

                  {/* Main Underbone Body Frame (Metallic Blue) */}
                  <path 
                    d="M 28 35 L 55 15 L 85 24 L 125 18 L 155 -15 L 175 -8 L 165 15 L 145 28 L 85 30 L 40 40 Z" 
                    fill="url(#hondaBlue)" 
                    stroke="#38bdf8" 
                    strokeWidth="2" 
                  />

                  {/* Front Cowling & Dual LED Headlight Area */}
                  <path 
                    d="M 155 -15 L 180 -10 L 205 -5 L 195 18 L 175 16 L 155 5 Z" 
                    fill="#0284c7" 
                    stroke="#38bdf8" 
                    strokeWidth="1.5" 
                  />
                  {/* Dual LED Headlamp Glow */}
                  <polygon points="190,-4 206,-4 198,12 186,8" fill="#38bdf8" opacity="0.85" />
                  <polygon points="195,-2 204,-2 198,8 191,6" fill="#ffffff" />

                  {/* Handlebar (Setang Motor) & Master Cylinder */}
                  <g id="handlebar-group">
                    {/* Handlebar stem */}
                    <line x1="155" y1="-15" x2="148" y2="-38" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    {/* Handlebar cover / batok kepala */}
                    <ellipse cx="148" cy="-38" rx="14" ry="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                    {/* Speedometer display */}
                    <ellipse cx="147" cy="-39" rx="7" ry="4" fill="#0f172a" />
                    {/* Handlebar Grips & Throttle */}
                    <line x1="138" y1="-38" x2="160" y2="-38" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Brake Lever */}
                    <line x1="156" y1="-37" x2="166" y2="-35" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                    {/* Rear View Mirror */}
                    <line x1="144" y1="-43" x2="136" y2="-55" stroke="#94a3b8" strokeWidth="2" />
                    <ellipse cx="134" cy="-56" rx="8" ry="5" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />
                  </g>

                  {/* Comfortable Stepped Dual Seat (Jok Motor) */}
                  <path 
                    d="M 45 15 Q 75 10 95 16 Q 115 17 128 17 L 125 25 Q 90 24 50 25 Z" 
                    fill="#0f172a" 
                    stroke="#334155" 
                    strokeWidth="1.5" 
                  />
                  {/* Seat red stitching accent */}
                  <path d="M 50 17 Q 75 13 95 18 Q 115 19 125 19" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" />

                  {/* Sporty Muffler Exhaust (Knalpot Vario) */}
                  <g transform="translate(20, 36)">
                    <rect x="-8" y="0" width="48" height="15" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <rect x="0" y="2" width="34" height="6" rx="2" fill="#64748b" />
                    {/* Muffler Tip */}
                    <ellipse cx="40" cy="7.5" rx="3" ry="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  </g>

                  {/* MPU9250 SENSOR MODULE MOUNTED ON FRAME */}
                  <g transform="translate(100, 18)">
                    <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                    <text x="0" y="14" fill="#93c5fd" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      MPU9250
                    </text>
                  </g>

                  {/* CVT TRANSMISSION CASE & CUTAWAY WITH CLUTCH BELL */}
                  <g id="cvt-box-group" transform="translate(15, 25)">
                    {/* Outer Aluminum CVT Crankcase */}
                    <path 
                      d="M -5 10 L 45 5 Q 60 12 55 25 Q 45 35 15 35 L -10 30 Q -22 22 -5 10 Z" 
                      fill="url(#cvtGrad)" 
                      stroke={relay1Tps ? '#10b981' : '#64748b'} 
                      strokeWidth={relay1Tps ? '2.5' : '1.5'} 
                      className="transition-colors duration-300"
                    />

                    {/* CVT Cutaway Window showing Centrifugal Clutch & Belt */}
                    <ellipse cx="0" cy="22" rx="14" ry="11" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                    <ellipse cx="40" cy="18" rx="11" ry="8" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                    {/* Rubber V-Belt */}
                    <path d="M 0 11 Q 20 8 40 10 L 40 26 Q 20 28 0 33 Z" fill="none" stroke="#000000" strokeWidth="4.5" />

                    {/* CENTRIFUGAL CLUTCH SHOES (KAMPAS GANDA CVT) */}
                    {relay1Tps ? (
                      // EXPANDED & ENGAGED (LOCK TO DRUM)
                      <g filter="url(#glowGreen)">
                        <circle cx="0" cy="22" r="11" fill="none" stroke="#10b981" strokeWidth="3" />
                        <circle cx="0" cy="22" r="6" fill="#059669" />
                        {/* 3 Clutch shoes expanding */}
                        <line x1="-9" y1="17" x2="-4" y2="20" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                        <line x1="8" y1="18" x2="3" y2="21" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="28" x2="0" y2="24" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    ) : (
                      // RETRACTED & DISENGAGED (FREE WHEEL)
                      <g>
                        <circle cx="0" cy="22" r="11" fill="none" stroke="#475569" strokeWidth="1.5" />
                        <circle cx="0" cy="22" r="5" fill="#334155" />
                        {/* 3 Clutch shoes retracted */}
                        <line x1="-6" y1="19" x2="-3" y2="21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        <line x1="6" y1="19" x2="3" y2="21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        <line x1="0" y1="26" x2="0" y2="23" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Label On CVT Case */}
                    <text 
                      x="22" 
                      y="18" 
                      fill={relay1Tps ? '#6ee7b7' : '#94a3b8'} 
                      fontSize="7.5" 
                      fontWeight="bold" 
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {relay1Tps ? 'CVT LOCKED' : 'CVT IDLE'}
                    </text>
                  </g>
                </g>
              </g>

              {/* OVERLAY POINTERS & ELEVATION COMPARISON */}
              {/* Dynamic Coordinate Calculations for Visual Labels */}
              {/* Setang & Roda Depan Position Indicator */}
              <g transform="translate(430, 32)">
                <rect x="-10" y="-12" width="180" height="28" rx="6" fill="#0f172a" stroke={currentAngle > 0 ? '#38bdf8' : '#34d399'} strokeWidth="1.5" />
                <text x="80" y="0" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  RODA DEPAN & SETANG
                </text>
                <text x="80" y="11" fill={currentAngle > 0 ? '#38bdf8' : '#34d399'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                  {currentAngle > 0 ? 'Posisi: LEBIH TINGGI (Naik)' : currentAngle < 0 ? 'Posisi: LEBIH RENDAH (Turun)' : 'Posisi: RATA SEJAJAR'}
                </text>
              </g>

              {/* Roda Belakang & Box CVT Position Indicator */}
              <g transform="translate(30, 32)">
                <rect x="-10" y="-12" width="180" height="28" rx="6" fill="#0f172a" stroke={currentAngle > 0 ? '#f59e0b' : '#f87171'} strokeWidth="1.5" />
                <text x="80" y="0" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  RODA BELAKANG & BOX CVT
                </text>
                <text x="80" y="11" fill={currentAngle > 0 ? '#f59e0b' : '#f87171'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                  {currentAngle > 0 ? 'Posisi: LEBIH RENDAH (Bawah)' : currentAngle < 0 ? 'Posisi: LEBIH TINGGI (Atas)' : 'Posisi: RATA SEJAJAR'}
                </text>
              </g>

              {/* Angle Readout & Gravity Vector */}
              <g transform="translate(30, 225)">
                <text fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  PITCH SENSOR: <tspan fill={currentAngle <= -5 ? '#f87171' : currentAngle >= 5 ? '#f59e0b' : '#34d399'} fontWeight="bold">{currentAngle >= 0 ? `+${currentAngle.toFixed(1)}°` : `${currentAngle.toFixed(1)}°`}</tspan>
                </text>
              </g>

              <g transform="translate(460, 225)">
                <text fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="start">
                  GAYA GRAVITASI: 1.0G (TEGAK BUMI)
                </text>
              </g>
            </svg>

            {/* CVT Clutch State Floating Badge */}
            <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border shadow-lg ${
              relay1Tps
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900/90 text-slate-300 border-slate-700'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${relay1Tps ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>
                KOPLING CVT: {relay1Tps ? 'ENGAGED / MENGUNCI (ENGINE BRAKE ON ~2500 RPM)' : 'DISENGAGED (FREE WHEEL IDLE)'}
              </span>
            </div>
          </div>

          {/* Debounce Timer Indicator */}
          {debounceProgress > 0 && debounceProgress < 100 && (
            <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div className="flex items-center justify-between text-xs text-amber-300 mb-1 font-mono">
                <span>Filter Debounce Getaran (Anti-False-Trigger):</span>
                <span>{debounceProgress}% ({Math.round((debounceProgress / 100) * DEBOUNCE_TIME)} ms)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-75" 
                  style={{ width: `${debounceProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Hardware Status Gauges: Relay 1, Relay 2, TPS Voltage, Engine RPM */}
        <div className="lg:col-span-5 space-y-4">
          {/* Relay 1 Status (D6 TPS Bypass) */}
          <div className={`p-4 rounded-xl border transition-all ${
            relay1Tps 
              ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-900/20' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full ${relay1Tps ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-600'}`} />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Relay 1 (Pin D6) - TPS Bypass
                    {relay1Tps ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                        AKTIF / ON
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        STANDBY / OFF
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Terminal D6 Arduino Uno R3 -&gt; IN1 Modul Dual Relay
                  </p>
                </div>
              </div>
              <Zap className={`w-5 h-5 ${relay1Tps ? 'text-emerald-400 animate-bounce' : 'text-slate-600'}`} />
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Tegangan TPS Out</span>
                <span className={`text-base font-bold ${relay1Tps ? 'text-amber-300' : 'text-slate-300'}`}>
                  {simulatedTpsVoltage.toFixed(2)} Volt
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {relay1Tps ? '(Bypass Trimpot)' : '(Idle Standar)'}
                </span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Putaran Mesin</span>
                <span className={`text-base font-bold ${relay1Tps ? 'text-emerald-300' : 'text-slate-300'}`}>
                  ~{simulatedRpm} RPM
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {relay1Tps ? 'Kopling Gigit' : 'Langsam'}
                </span>
              </div>
            </div>
          </div>

          {/* Relay 2 Status (D7 Buzzer Alarm) */}
          <div className={`p-4 rounded-xl border transition-all ${
            relay2Buzzer 
              ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-900/20' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full ${relay2Buzzer ? 'bg-rose-400 animate-ping' : 'bg-slate-600'}`} />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Relay 2 (Pin D7) - Buzzer Peringatan
                    {relay2Buzzer ? (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                        BEEP AKTIF
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        SENYAP
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Terminal D7 Arduino Uno R3 -&gt; IN2 Modul Dual Relay -&gt; Piezo Buzzer 5V
                  </p>
                </div>
              </div>
              <ShieldAlert className={`w-5 h-5 ${relay2Buzzer ? 'text-rose-400 animate-spin' : 'text-slate-600'}`} />
            </div>

            <div className="mt-2 text-xs text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/80">
              {relay2Buzzer ? (
                <span className="text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  Peringatan Audio: Mengingatkan pengendara bahwa sistem penahan turunan sedang aktif.
                </span>
              ) : (
                <span>Buzzer tidak berbunyi selama kemiringan berada di atas ambang batas -5.0°.</span>
              )}
            </div>
          </div>

          {/* Trimpot 10k/5k Tuning Dial */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">
                Penyetelan Trimpot 10k/5k (Tegangan RPM 2500):
              </span>
              <span className="font-mono text-cyan-400 font-bold text-sm">
                {trimpotVoltage.toFixed(2)} V
              </span>
            </div>
            <input
              type="range"
              min="0.65"
              max="0.95"
              step="0.01"
              value={trimpotVoltage}
              onChange={(e) => setTrimpotVoltage(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0.65V (Min RPM)</span>
              <span className="text-amber-400">0.80V (Rekomendasi Vario)</span>
              <span>0.95V (Max RPM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Downhill Braking Physics & Incline Percentage Calculator */}
      <BrakingPhysicsCard 
        currentPitch={filteredPitch} 
        relayActive={relay1Tps} 
      />

      {/* Complementary Filter Deep Dive & Live Comparison Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
            <Activity className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-white">
            Perbandingan Filter Komplementer (98% Giroskop + 2% Akselerometer)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Accel Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
              <span>1. Akselerometer Murni</span>
              <span className="font-bold">{accelRawPitch.toFixed(1)}°</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 mt-2">
              <p className="text-rose-400 font-medium">Kelemahan: Rentan Noise Getaran</p>
              <p>
                Saat mesin motor menyala atau melewati aspal kasar, gravitasi 1g terkontaminasi getaran mekanis, membuat angka melompat-lompat liar hingga ±4°.
              </p>
            </div>
            <div className="mt-3 bg-slate-900 p-2 rounded text-center font-mono text-xs text-amber-300">
              Noise Getaran: {engineVibration ? '±4.2° Jitter' : 'Tenang (Mesin Mati)'}
            </div>
          </div>

          {/* Gyro Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
              <span>2. Giroskop Murni</span>
              <span className="font-bold">{gyroPitch.toFixed(1)}°</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 mt-2">
              <p className="text-rose-400 font-medium">Kelemahan: Gyroscopic Drift</p>
              <p>
                Sangat halus terhadap getaran mesin, namun integrasi matematis kecepatan sudut (deg/s * dt) akan bergeser (drift) beberapa derajat setelah beberapa menit berkendara.
              </p>
            </div>
            <div className="mt-3 bg-slate-900 p-2 rounded text-center font-mono text-xs text-cyan-300">
              Respon Cepat: Halus tanpa goyangan
            </div>
          </div>

          {/* Complementary Filter Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
              <span className="font-bold">3. Complementary (98/2)</span>
              <span className="text-base font-bold text-white">{filteredPitch.toFixed(1)}°</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 mt-2">
              <p className="text-emerald-400 font-medium">Kelebihan: Solusi Terbaik Otomotif</p>
              <p>
                Rumus: <code className="text-emerald-300 font-mono">0.98 * Gyro + 0.02 * Accel</code>.
                Mengunci kestabilan sudut dari getaran mesin motor Vario sekaligus mencegah drift jangka panjang.
              </p>
            </div>
            <div className="mt-3 bg-emerald-950/60 p-2 rounded text-center font-mono text-xs text-emerald-300 font-bold border border-emerald-500/20">
              Stabil & Presisi: Siap Mengunci CVT di -5°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
