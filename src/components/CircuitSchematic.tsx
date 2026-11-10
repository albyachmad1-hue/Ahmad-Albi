import React, { useState } from 'react';
import { 
  Layers, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Cpu, 
  Compass, 
  Sliders, 
  BatteryCharging,
  Maximize2,
  Sparkles,
  Eye,
  CheckCircle2,
  Table
} from 'lucide-react';
import { COMPONENTS_DATA } from '../data/wiringData';
import { ComponentDetail } from '../types';

export const CircuitSchematic: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(COMPONENTS_DATA[0]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TPS' | 'I2C' | 'LCD' | 'POWER'>('ALL');
  const [highlightedWire, setHighlightedWire] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [workbenchTheme, setWorkbenchTheme] = useState<'fritzing_light' | 'fritzing_dark'>('fritzing_dark');

  const isLight = workbenchTheme === 'fritzing_light';

  return (
    <div className="space-y-6">
      {/* Header and Filter Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Skema Rangkaian Fritzing Realistis (Komponen Asli Otomotif)
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Visualisasi tata letak komponen fisik mirip Fritzing: Arduino Uno R3, Modul MPU9250, LCD 16x2, Modul Dual Relay Songle 5V, Trimpot 3296W, Soket TPS Vario 125, dan Step-Down LM2596.
            </p>
          </div>

          {/* Subsystem Trace Filters & Theme / Zoom */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { setActiveFilter('ALL'); setHighlightedWire(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua Kabel
              </button>
              <button
                onClick={() => { setActiveFilter('TPS'); setHighlightedWire(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'TPS'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Jalur TPS & D6
              </button>
              <button
                onClick={() => { setActiveFilter('I2C'); setHighlightedWire(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'I2C'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MPU9250 I2C
              </button>
              <button
                onClick={() => { setActiveFilter('LCD'); setHighlightedWire(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'LCD'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LCD I2C (SDA/SCL)
              </button>
              <button
                onClick={() => { setActiveFilter('POWER'); setHighlightedWire(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'POWER'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daya 12V-5V
              </button>
            </div>

            {/* View Zoom & Theme Controls */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.45))}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.8))}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs font-mono"
                title="Reset Zoom"
              >
                100%
              </button>
              <div className="w-px h-4 bg-slate-800 mx-1" />
              <button
                onClick={() => setWorkbenchTheme(isLight ? 'fritzing_dark' : 'fritzing_light')}
                className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 font-mono"
                title="Ganti Tema Meja Kerja Fritzing"
              >
                {isLight ? 'Tema: Gelap' : 'Tema: Fritzing Klasik'}
              </button>
            </div>
          </div>
        </div>

        {/* Wire Info Notification Pill if a wire is hovered/selected */}
        {highlightedWire && (
          <div className="mt-3 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-mono text-cyan-200 shadow-lg animate-fadeIn">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <strong>{highlightedWire}</strong>
            </span>
            <button 
              onClick={() => setHighlightedWire(null)}
              className="text-slate-400 hover:text-white text-[10px] underline ml-3"
            >
              Hapus Sorotan
            </button>
          </div>
        )}

        {/* Interactive Fritzing Realistic SVG Canvas */}
        <div className={`relative mt-4 rounded-xl border border-slate-800 p-2 sm:p-4 overflow-x-auto transition-colors duration-300 ${
          isLight ? 'bg-[#ecefe6]' : 'bg-[#0b101b]'
        }`}>
          <div 
            className="min-w-[1080px] relative transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 1140 760" className="w-full h-auto select-none font-sans">
              <defs>
                {/* Soft Drop Shadow for Realistic 3D Components */}
                <filter id="fritzingShadow" x="-10%" y="-10%" width="125%" height="125%">
                  <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
                </filter>
                <filter id="wireShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
                </filter>
                <filter id="neonWireGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Solder eyelet template */}
                <pattern id="breadboardGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="11" cy="11" r="1.5" fill={isLight ? '#cbd5e1' : '#1e293b'} />
                </pattern>
              </defs>

              {/* Workbench Grid Texture */}
              <rect width="1140" height="760" fill="url(#breadboardGrid)" />

              {/* ------------------------------------------------------------------ */}
              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 1: ARDUINO UNO R3 (REALISTIC BLUE PCB WITH DIP-28 & USB-B) */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(415, 230)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[0])}
              >
                {/* PCB Board Base - Arduino Uno R3 Contour */}
                <path 
                  d="M 0 10 Q 0 0 10 0 L 260 0 Q 270 0 270 10 L 270 70 L 290 85 L 290 280 L 280 295 L 280 305 Q 280 315 270 315 L 10 315 Q 0 315 0 305 Z" 
                  fill="#006699" 
                  stroke="#004d73" 
                  strokeWidth="2.5" 
                />
                
                {/* Silver Plated Mounting Holes (Uno Standards) */}
                <circle cx="15" cy="55" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                <circle cx="160" cy="15" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                <circle cx="265" cy="75" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                <circle cx="265" cy="295" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

                {/* Metallic USB Type-B Port (Large Square Jack) */}
                <rect x="18" y="-14" width="55" height="42" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="25" y="-12" width="41" height="30" rx="2" fill="#64748b" />
                <rect x="35" y="-6" width="21" height="18" rx="2" fill="#e2e8f0" />
                <text x="45" y="24" fill="#0f172a" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">USB-B</text>

                {/* DC Power Barrel Jack (2.1mm Center Positive, 7-12V) */}
                <rect x="12" y="245" width="50" height="75" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="22" y="305" width="30" height="15" rx="1" fill="#1e293b" />
                <circle cx="37" cy="275" r="8" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="37" cy="275" r="3" fill="#ca8a04" />
                <text x="37" y="238" fill="#fde047" fontSize="7" fontFamily="monospace" textAnchor="middle">7-12V DC</text>

                {/* ATmega16U2 USB-to-Serial Chip near USB Jack */}
                <rect x="85" y="45" width="32" height="32" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="101" y="63" fill="#94a3b8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">16U2</text>

                {/* Iconic ATmega328P DIP-28 Socket IC (DIP Package) */}
                <rect x="90" y="115" width="135" height="48" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <path d="M 90 133 A 6 6 0 0 0 90 145 Z" fill="#334155" /> {/* DIP notch */}
                <text x="157" y="137" fill="#cbd5e1" fontSize="10.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ATMEGA328P-PU</text>
                <text x="157" y="151" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">28-PIN DIP SOCKET</text>
                {/* 28 Silver Through-Hole Pins on DIP Socket */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <g key={i}>
                    <line x1={98 + i * 9} y1="110" x2={98 + i * 9} y2="115" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1={98 + i * 9} y1="163" x2={98 + i * 9} y2="168" stroke="#cbd5e1" strokeWidth="2" />
                  </g>
                ))}

                {/* 16.000 MHz Crystal Oscillator */}
                <rect x="140" y="65" width="46" height="22" rx="9" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
                <text x="163" y="79" fill="#0f172a" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">16.000</text>

                {/* Reset Tactile Pushbutton (Top-left near USB) */}
                <rect x="80" y="12" width="26" height="24" rx="2" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="93" cy="24" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                <text x="93" y="42" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">RESET</text>

                {/* SMD LEDs: ON (Green), L (Yellow), TX, RX */}
                <g transform="translate(145, 95)">
                  <rect x="0" y="0" width="8" height="10" rx="1" fill="#15803d" />
                  <text x="-4" y="8" fill="#a7f3d0" fontSize="6" fontFamily="monospace" textAnchor="end">ON</text>
                  <rect x="22" y="0" width="8" height="10" rx="1" fill="#d97706" />
                  <text x="34" y="8" fill="#fde68a" fontSize="6" fontFamily="monospace">L</text>
                  <rect x="44" y="0" width="8" height="10" rx="1" fill="#3b82f6" />
                  <text x="56" y="8" fill="#93c5fd" fontSize="6" fontFamily="monospace">TX</text>
                  <rect x="66" y="0" width="8" height="10" rx="1" fill="#3b82f6" />
                  <text x="78" y="8" fill="#93c5fd" fontSize="6" fontFamily="monospace">RX</text>
                </g>

                {/* Silk Print Official Branding */}
                <text x="160" y="195" fill="#ffffff" fontSize="15" fontFamily="sans-serif" textAnchor="middle" fontWeight="black" letterSpacing="1">
                  Arduino™
                </text>
                <text x="160" y="215" fill="#facc15" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  UNO R3
                </text>
                <text x="160" y="230" fill="#a5f3fc" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  ATmega328P • 5V 16MHz
                </text>

                {/* LEFT PIN HEADER - POWER & ANALOG (15 Pins) */}
                <g transform="translate(14, 52)">
                  <rect x="-4" y="-2" width="22" height="236" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                  {[
                    { name: 'IOREF', color: '#cbd5e1' },
                    { name: 'RESET', color: '#cbd5e1' },
                    { name: '3.3V', color: '#cbd5e1' },
                    { name: 'A0', color: '#cbd5e1' },
                    { name: 'A1', color: '#cbd5e1' },
                    { name: 'A2', color: '#cbd5e1' },
                    { name: 'A3', color: '#cbd5e1' },
                    { name: 'A4', note: '(MPU SDA)', color: '#38bdf8', highlight: true },
                    { name: 'A5', note: '(MPU SCL)', color: '#facc15', highlight: true },
                    { name: 'SDA', color: '#38bdf8' },
                    { name: 'SCL', color: '#facc15' },
                    { name: '5V', note: '(PWR)', color: '#f87171', highlight: true },
                    { name: 'VIN', color: '#cbd5e1' },
                    { name: 'GND', note: '(GND)', color: '#94a3b8', highlight: true },
                    { name: 'GND', color: '#94a3b8' },
                  ].map((pin, idx) => (
                    <g key={idx} transform={`translate(0, ${idx * 15.5})`}>
                      <rect x="0" y="0" width="14" height="12" rx="1.5" fill="#334155" stroke="#64748b" strokeWidth="1" />
                      <circle cx="7" cy="6" r="3" fill="#e2e8f0" />
                      <text x="24" y="9" fill={pin.color} fontSize="8" fontFamily="monospace" fontWeight={pin.highlight ? 'bold' : 'normal'}>
                        {pin.name} {pin.note}
                      </text>
                    </g>
                  ))}
                </g>

                {/* RIGHT PIN HEADER - DIGITAL I/O (15 Pins) */}
                <g transform="translate(252, 52)">
                  <rect x="-4" y="-2" width="22" height="236" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                  {[
                    { name: 'D12', note: '(FREE)', color: '#64748b' },
                    { name: 'D11', note: '(FREE)', color: '#64748b' },
                    { name: 'D10', color: '#cbd5e1' },
                    { name: 'D9', color: '#cbd5e1' },
                    { name: 'D8', color: '#cbd5e1' },
                    { name: 'D7', note: '(BUZZER)', color: '#f43f5e', highlight: true },
                    { name: 'D6', note: '(TPS BYPASS)', color: '#84cc16', highlight: true },
                    { name: 'D5', note: '(LCD SCL)', color: '#facc15', highlight: true },
                    { name: 'D4', note: '(LCD SDA)', color: '#38bdf8', highlight: true },
                    { name: 'D3', note: '(FREE)', color: '#64748b' },
                    { name: 'D2', note: '(FREE)', color: '#64748b' },
                    { name: 'GND', color: '#94a3b8' },
                    { name: 'AREF', color: '#cbd5e1' },
                    { name: 'RX<-0', color: '#cbd5e1' },
                    { name: 'TX->1', color: '#cbd5e1' },
                  ].map((pin, idx) => (
                    <g key={idx} transform={`translate(0, ${idx * 15.5})`}>
                      <rect x="0" y="0" width="14" height="12" rx="1.5" fill="#334155" stroke="#64748b" strokeWidth="1" />
                      <circle cx="7" cy="6" r="3" fill="#e2e8f0" />
                      <text x="-10" y="9" fill={pin.color} fontSize="8" fontFamily="monospace" textAnchor="end" fontWeight={pin.highlight ? 'bold' : 'normal'}>
                        {pin.note} {pin.name}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 2: MPU-9250 SENSOR MODULE (GY-9250 BLUE PCB)             */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(60, 60)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[1])}
              >
                {/* Royal Blue PCB */}
                <rect x="0" y="0" width="230" height="150" rx="8" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />
                <circle cx="20" cy="20" r="4.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />

                <text x="125" y="24" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  MPU-9250 (GY-9250)
                </text>
                <text x="125" y="37" fill="#93c5fd" fontSize="8.5" fontFamily="monospace">
                  9-Axis IMU (Sumbu X Pitch Turunan)
                </text>

                {/* MPU9250 IC Chip */}
                <rect x="80" y="50" width="60" height="55" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <circle cx="88" cy="58" r="2" fill="#facc15" />
                <text x="110" y="78" fill="#93c5fd" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MPU-9250</text>
                <text x="110" y="92" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">INVERSENSE</text>

                {/* Coordinate Directions */}
                <g transform="translate(175, 60)" stroke="#facc15" strokeWidth="1.5">
                  <line x1="0" y1="15" x2="25" y2="15" />
                  <polygon points="25,12 30,15 25,18" fill="#facc15" />
                  <text x="15" y="10" fill="#fde047" fontSize="7.5" fontFamily="monospace">X (MAJU)</text>

                  <line x1="12" y1="2" x2="12" y2="28" />
                  <polygon points="9,2 12,-3 15,2" fill="#facc15" />
                  <text x="18" y="28" fill="#fde047" fontSize="7.5" fontFamily="monospace">Y</text>
                </g>

                {/* 10-pin Header at Bottom with Gold Through-Holes */}
                <g transform="translate(15, 115)">
                  {[
                    { name: 'VCC', color: '#f87171' },
                    { name: 'GND', color: '#94a3b8' },
                    { name: 'SCL', color: '#facc15' },
                    { name: 'SDA', color: '#38bdf8' },
                    { name: 'EDA', color: '#64748b' },
                    { name: 'ECL', color: '#64748b' },
                    { name: 'AD0', color: '#64748b' },
                    { name: 'INT', color: '#64748b' },
                    { name: 'NCS', color: '#64748b' },
                    { name: 'FSYNC', color: '#64748b' },
                  ].map((pin, i) => (
                    <g key={i} transform={`translate(${i * 20}, 0)`}>
                      <rect x="0" y="0" width="16" height="22" rx="2" fill="#0f172a" stroke="#334155" />
                      <circle cx="8" cy="11" r="3.5" fill="#facc15" stroke="#b45309" strokeWidth="1" />
                      <text x="8" y="30" fill={pin.color} fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {pin.name}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 3: LCD 16X2 DENGAN MODUL I2C BACKPACK (PCF8574)          */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(760, 40)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[2])}
              >
                {/* Emerald Green FR4 Main PCB */}
                <rect x="0" y="0" width="340" height="205" rx="8" fill="#064e3b" stroke="#047857" strokeWidth="2.5" />
                {/* 4 Corner Mounting Screws */}
                <circle cx="15" cy="15" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="325" cy="15" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="15" cy="190" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="325" cy="190" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />

                {/* Stamped Black Metal Bezel Frame */}
                <rect x="25" y="42" width="290" height="92" rx="5" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                {/* Metal Bezel Clamping Tabs */}
                <rect x="35" y="38" width="8" height="6" fill="#64748b" />
                <rect x="165" y="38" width="8" height="6" fill="#64748b" />
                <rect x="295" y="38" width="8" height="6" fill="#64748b" />
                <rect x="35" y="132" width="8" height="6" fill="#64748b" />
                <rect x="165" y="132" width="8" height="6" fill="#64748b" />
                <rect x="295" y="132" width="8" height="6" fill="#64748b" />

                {/* LCD Display Glass Area (Green Backlight HD44780) */}
                <rect x="38" y="52" width="264" height="72" rx="3" fill="#022c22" stroke="#10b981" strokeWidth="1" />
                {/* LCD Lines (16 Characters Each) */}
                <text x="50" y="79" fill="#6ee7b7" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                  P:-05.0° G:-8.7%
                </text>
                <text x="50" y="108" fill="#6ee7b7" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                  RELAY ON:2500RPM
                </text>

                {/* PIGGYBACK I2C BACKPACK MODULE (BLACK PCB SOLDERED AT TOP/REAR) */}
                <g transform="translate(18, 142)">
                  <rect x="0" y="0" width="304" height="52" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* PCF8574 SOP-16 SMD Chip */}
                  <rect x="75" y="12" width="46" height="28" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <text x="98" y="29" fill="#cbd5e1" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PCF8574T</text>
                  
                  {/* Contrast Trimpot (Blue Square with Brass Screw) */}
                  <rect x="135" y="12" width="28" height="28" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                  <circle cx="149" cy="26" r="7" fill="#ca8a04" stroke="#eab308" strokeWidth="0.8" />
                  <line x1="144" y1="26" x2="154" y2="26" stroke="#0f172a" strokeWidth="1.5" />
                  <text x="149" y="47" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle">KONTRAS</text>

                  {/* Address Jumpers A0, A1, A2 (Default 0x27) */}
                  <g transform="translate(178, 14)">
                    <rect x="0" y="0" width="48" height="18" rx="2" fill="#1e293b" stroke="#475569" />
                    <text x="24" y="12" fill="#94a3b8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">ADDR 0x27</text>
                  </g>

                  {/* 4-PIN I2C TERMINAL HEADER (GND, VCC, SDA, SCL) */}
                  <g transform="translate(10, 8)">
                    {[
                      { name: 'GND', color: '#94a3b8', pinColor: '#1e293b' },
                      { name: 'VCC', color: '#f87171', pinColor: '#ef4444' },
                      { name: 'SDA', color: '#38bdf8', pinColor: '#0284c7' },
                      { name: 'SCL', color: '#facc15', pinColor: '#ca8a04' },
                    ].map((pin, i) => (
                      <g key={i} transform={`translate(${i * 14}, 0)`}>
                        <rect x="0" y="0" width="11" height="20" rx="1.5" fill="#334155" stroke="#475569" />
                        <circle cx="5.5" cy="10" r="3" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
                        <text x="5.5" y="32" fill={pin.color} fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                          {pin.name}
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* Backlight Jumper */}
                  <rect x="242" y="14" width="16" height="20" rx="2" fill="#dc2626" stroke="#991b1b" />
                  <text x="250" y="27" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">LED</text>
                  <text x="250" y="44" fill="#94a3b8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">JUMPER</text>
                </g>

                {/* Subtitle & Code Stamp */}
                <text x="170" y="28" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  TERMINAL MANDIRI: SDA ke D4 • SCL ke D5 (BEBAS GANGGUAN MPU)
                </text>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 4: 2-CHANNEL 5V RELAY MODULE (SONGLE BLUE CUBES)         */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(410, 565)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[3])}
              >
                {/* Royal Blue Board */}
                <rect x="0" y="0" width="300" height="180" rx="8" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="2.5" />
                <text x="150" y="20" fill="#ffffff" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                  MODUL DUAL RELAY 5V (SONGLE OPTO-ISOLATED)
                </text>

                {/* RELAY CUBE 1 (TPS BYPASS) */}
                <g transform="translate(20, 32)">
                  <rect x="0" y="0" width="120" height="75" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="60" y="18" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">SONGLE ®</text>
                  <text x="60" y="32" fill="#fef08a" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRD-05VDC-SL-C</text>
                  <text x="60" y="46" fill="#e0f2fe" fontSize="7" fontFamily="monospace" textAnchor="middle">10A 250VAC 10A 30VDC</text>
                  <text x="60" y="60" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RELAY 1 (TPS BYPASS)</text>
                </g>

                {/* RELAY CUBE 2 (BUZZER ALARM) */}
                <g transform="translate(160, 32)">
                  <rect x="0" y="0" width="120" height="75" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="60" y="18" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">SONGLE ®</text>
                  <text x="60" y="32" fill="#fef08a" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRD-05VDC-SL-C</text>
                  <text x="60" y="46" fill="#e0f2fe" fontSize="7" fontFamily="monospace" textAnchor="middle">10A 250VAC 10A 30VDC</text>
                  <text x="60" y="60" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RELAY 2 (BUZZER)</text>
                </g>

                {/* Two 4-pin Optocoupler EL817 chips */}
                <rect x="65" y="112" width="30" height="16" rx="2" fill="#0f172a" stroke="#475569" />
                <text x="80" y="123" fill="#cbd5e1" fontSize="7" fontFamily="monospace" textAnchor="middle">EL817</text>
                <rect x="205" y="112" width="30" height="16" rx="2" fill="#0f172a" stroke="#475569" />
                <text x="220" y="123" fill="#cbd5e1" fontSize="7" fontFamily="monospace" textAnchor="middle">EL817</text>

                {/* GREEN SCREW TERMINALS (SPDT RELAY OUTPUTS) AT BOTTOM */}
                <g transform="translate(15, 134)">
                  {/* Terminal 1: Relay 1 (NC, COM, NO) */}
                  <rect x="0" y="0" width="130" height="38" rx="4" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
                  {/* 3 Brass Screws with Slotted Heads */}
                  {[
                    { label: 'NC1 (TPS Asli)', color: '#f59e0b', x: 22 },
                    { label: 'COM1 (Ke ECM)', color: '#ea580c', x: 65 },
                    { label: 'NO1 (0.8V Trimpot)', color: '#38bdf8', x: 108 },
                  ].map((term, i) => (
                    <g key={i}>
                      <circle cx={term.x} cy="15" r="9" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
                      <line x1={term.x - 6} y1="15" x2={term.x + 6} y2="15" stroke="#713f12" strokeWidth="2.5" />
                      <text x={term.x} y="32" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {term.label}
                      </text>
                    </g>
                  ))}
                </g>

                {/* Terminal 2: Relay 2 (NC, COM, NO) for Buzzer */}
                <g transform="translate(155, 134)">
                  <rect x="0" y="0" width="130" height="38" rx="4" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
                  {[
                    { label: 'NC2 (Kosong)', color: '#94a3b8', x: 22 },
                    { label: 'COM2 (+5V)', color: '#f87171', x: 65 },
                    { label: 'NO2 (Buzzer +)', color: '#f43f5e', x: 108 },
                  ].map((term, i) => (
                    <g key={i}>
                      <circle cx={term.x} cy="15" r="9" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
                      <line x1={term.x - 6} y1="15" x2={term.x + 6} y2="15" stroke="#713f12" strokeWidth="2.5" />
                      <text x={term.x} y="32" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {term.label}
                      </text>
                    </g>
                  ))}
                </g>

                {/* 4-Pin Male Header (GND, IN1, IN2, VCC) on top right */}
                <g transform="translate(245, 110)">
                  <rect x="0" y="0" width="45" height="16" rx="2" fill="#0f172a" />
                  <circle cx="8" cy="8" r="2.5" fill="#facc15" />
                  <circle cx="18" cy="8" r="2.5" fill="#84cc16" />
                  <circle cx="28" cy="8" r="2.5" fill="#f43f5e" />
                  <circle cx="38" cy="8" r="2.5" fill="#ef4444" />
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 5: POTENSIOMETER TRIMPOT 10K/5K (BOURNS 3296W BLUE)      */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(50, 480)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[4])}
              >
                {/* Classic Blue Bourns 3296 Trimpot Body */}
                <rect x="0" y="0" width="130" height="95" rx="5" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
                {/* Molded plastic details */}
                <rect x="5" y="5" width="120" height="85" rx="3" fill="#2563eb" />

                {/* Brass Adjustment Screw on Top Edge */}
                <circle cx="105" cy="25" r="14" fill="#ca8a04" stroke="#a16207" strokeWidth="1.5" />
                <line x1="95" y1="25" x2="115" y2="25" stroke="#713f12" strokeWidth="3" />

                {/* Silkscreen text */}
                <text x="15" y="32" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">BOURNS ®</text>
                <text x="15" y="47" fill="#fde047" fontSize="9" fontFamily="monospace" fontWeight="bold">3296W 103</text>
                <text x="15" y="60" fill="#e0e7ff" fontSize="7.5" fontFamily="monospace">10KΩ (0.80V)</text>

                {/* 3 Silver Pins Emerging at the bottom */}
                <g transform="translate(25, 95)">
                  {/* Pin 1: GND */}
                  <rect x="0" y="0" width="5" height="25" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                  <text x="2" y="36" fill="#86efac" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">1:GND</text>

                  {/* Pin 2: Wiper (Output 0.8V) */}
                  <rect x="40" y="0" width="5" height="25" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                  <text x="42" y="36" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">2:WIPER</text>

                  {/* Pin 3: 5V VCC */}
                  <rect x="80" y="0" width="5" height="25" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                  <text x="82" y="36" fill="#f87171" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">3:5V</text>
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 6: SOKET TPS HONDA VARIO 125 ASLI (WATERPROOF PLUG)      */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(40, 260)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[4])}
              >
                {/* Black Automotive Waterproof Connector Housing */}
                <path 
                  d="M 0 10 L 160 10 L 175 35 L 175 125 L 0 125 Z" 
                  fill="#0f172a" 
                  stroke="#334155" 
                  strokeWidth="2.5" 
                />
                {/* Locking Lever Clip */}
                <rect x="40" y="0" width="80" height="15" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
                <rect x="65" y="-5" width="30" height="8" rx="2" fill="#ef4444" />

                <text x="85" y="32" fill="#ffffff" fontSize="9.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                  SOKET TPS VARIO 125
                </text>
                <text x="85" y="44" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  3-PIN WATERPROOF PLUG
                </text>

                {/* 3 Waterproof Rubber Wire Ports */}
                <g transform="translate(20, 55)">
                  {/* Pin 1: Kuning/Biru */}
                  <circle cx="20" cy="15" r="9" fill="#0284c7" stroke="#facc15" strokeWidth="3" />
                  <circle cx="20" cy="15" r="3.5" fill="#facc15" />
                  <text x="36" y="19" fill="#e2e8f0" fontSize="8" fontFamily="monospace">1. Kuning/Biru (5V VCC ECM)</text>

                  {/* Pin 2: Kuning/Merah */}
                  <circle cx="20" cy="38" r="9" fill="#ea580c" stroke="#facc15" strokeWidth="3" />
                  <circle cx="20" cy="38" r="3.5" fill="#facc15" />
                  <text x="36" y="42" fill="#e2e8f0" fontSize="8" fontFamily="monospace">2. Kuning/Merah (Signal Out)</text>

                  {/* Pin 3: Hijau/Hitam */}
                  <circle cx="20" cy="61" r="9" fill="#15803d" stroke="#000000" strokeWidth="3" />
                  <circle cx="20" cy="61" r="3.5" fill="#000000" />
                  <text x="36" y="65" fill="#e2e8f0" fontSize="8" fontFamily="monospace">3. Hijau/Hitam (Ground ECM)</text>
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 7: PIEZO BUZZER 5V (CYLINDRICAL REALISTIC)               */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(850, 580)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
              >
                {/* Black Plastic Cylindrical Housing */}
                <circle cx="45" cy="45" r="40" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                <circle cx="45" cy="45" r="36" fill="#1e293b" />
                <circle cx="45" cy="45" r="14" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                <circle cx="45" cy="45" r="5" fill="#000000" />

                {/* Positive + Marking */}
                <text x="25" y="30" fill="#ef4444" fontSize="14" fontFamily="sans-serif" fontWeight="bold">+</text>
                <text x="45" y="102" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  PIEZO BUZZER 5V
                </text>
                <text x="45" y="114" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  BEEP ALARM TURUNAN
                </text>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* COMPONENT 8: DC-DC STEP DOWN LM2596 (12V KE 5V REGULATOR)          */}
              {/* ------------------------------------------------------------------ */}
              <g 
                transform="translate(800, 310)" 
                filter="url(#fritzingShadow)"
                className="cursor-pointer group"
                onClick={() => setSelectedComponent(COMPONENTS_DATA[5])}
              >
                {/* Blue PCB */}
                <rect x="0" y="0" width="280" height="175" rx="8" fill="#1e3a8a" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="15" cy="15" r="4.5" fill="#e2e8f0" stroke="#64748b" />
                <circle cx="265" cy="15" r="4.5" fill="#e2e8f0" stroke="#64748b" />
                <circle cx="15" cy="160" r="4.5" fill="#e2e8f0" stroke="#64748b" />
                <circle cx="265" cy="160" r="4.5" fill="#e2e8f0" stroke="#64748b" />

                <text x="140" y="22" fill="#ffffff" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                  DC-DC STEP-DOWN LM2596 (12V-&gt;5V)
                </text>

                {/* Big Black Toroidal Inductor with Copper Coil */}
                <circle cx="70" cy="85" r="32" fill="#0f172a" stroke="#ca8a04" strokeWidth="6" strokeDasharray="6 3" />
                <circle cx="70" cy="85" r="16" fill="#1e293b" />
                <text x="70" y="89" fill="#fef08a" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">47uH</text>

                {/* LM2596 IC Chip with Metal Heatsink Tab */}
                <rect x="130" y="45" width="45" height="40" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <rect x="135" y="42" width="35" height="8" rx="1" fill="#cbd5e1" />
                <text x="152" y="68" fill="#ffffff" fontSize="7.5" fontFamily="monospace" textAnchor="middle">LM2596</text>

                {/* Multiturn Trimpot Blue */}
                <rect x="195" y="45" width="50" height="35" rx="3" fill="#2563eb" stroke="#1d4ed8" />
                <circle cx="230" cy="55" r="6" fill="#ca8a04" />

                {/* Two Aluminum Electrolytic Filter Capacitors */}
                <circle cx="35" cy="130" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="235" cy="120" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
                <text x="35" y="133" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">220uF</text>
                <text x="235" y="123" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">220uF</text>

                {/* Solder Pads / Terminals: IN+, IN-, OUT+, OUT- */}
                <g transform="translate(10, 80)">
                  <rect x="0" y="-30" width="18" height="15" rx="2" fill="#dc2626" />
                  <text x="9" y="-20" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">IN+</text>
                  <rect x="0" y="20" width="18" height="15" rx="2" fill="#0f172a" stroke="#64748b" />
                  <text x="9" y="30" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">IN-</text>
                </g>

                <g transform="translate(252, 80)">
                  <rect x="0" y="-30" width="18" height="15" rx="2" fill="#16a34a" />
                  <text x="9" y="-20" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OUT+</text>
                  <rect x="0" y="20" width="18" height="15" rx="2" fill="#0f172a" stroke="#64748b" />
                  <text x="9" y="30" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OUT-</text>
                </g>
              </g>

              {/* ------------------------------------------------------------------ */}
              {/* REALISTIC FRITZING CURVED WIRES (BEZIER CUBIC PATHS)               */}
              {/* ------------------------------------------------------------------ */}

              {/* 1. I2C SDA (BLUE WIRE): Uno A4 -> MPU9250 SDA */}
              {(activeFilter === 'ALL' || activeFilter === 'I2C') && (
                <g 
                  filter={highlightedWire === 'I2C SDA (A4)' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                  className="cursor-pointer"
                  onClick={() => setHighlightedWire('I2C SDA (A4 ke SDA MPU9250)')}
                >
                  <path 
                    d="M 434 390 C 320 390, 220 280, 135 180" 
                    fill="none" 
                    stroke={highlightedWire?.includes('SDA') ? '#38bdf8' : '#2563eb'} 
                    strokeWidth={highlightedWire?.includes('SDA') ? '5.5' : '3.8'} 
                    strokeLinecap="round" 
                  />
                  <circle cx="434" cy="390" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  <circle cx="135" cy="180" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                </g>
              )}

              {/* 2. I2C SCL (YELLOW WIRE): Uno A5 -> MPU9250 SCL */}
              {(activeFilter === 'ALL' || activeFilter === 'I2C') && (
                <g 
                  filter={highlightedWire === 'I2C SCL (A5)' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                  className="cursor-pointer"
                  onClick={() => setHighlightedWire('I2C SCL (A5 ke SCL MPU9250)')}
                >
                  <path 
                    d="M 434 405 C 310 405, 200 295, 115 180" 
                    fill="none" 
                    stroke={highlightedWire?.includes('SCL') ? '#fde047' : '#eab308'} 
                    strokeWidth={highlightedWire?.includes('SCL') ? '5.5' : '3.8'} 
                    strokeLinecap="round" 
                  />
                  <circle cx="434" cy="405" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                  <circle cx="115" cy="180" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                </g>
              )}

              {/* 3. RELAY 1 CONTROL (LIME GREEN WIRE): Uno D6 -> Relay 1 IN1 */}
              {(activeFilter === 'ALL' || activeFilter === 'TPS') && (
                <g 
                  filter={highlightedWire === 'Relay 1 D6' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                  className="cursor-pointer"
                  onClick={() => setHighlightedWire('Relay 1 D6 (Uno D6 ke IN1 Modul Relay TPS Bypass 2500 RPM)')}
                >
                  <path 
                    d="M 686 375 C 640 430, 680 500, 663 675" 
                    fill="none" 
                    stroke={highlightedWire?.includes('Relay 1') ? '#4ade80' : '#84cc16'} 
                    strokeWidth={highlightedWire?.includes('Relay 1') ? '5.5' : '4'} 
                    strokeLinecap="round" 
                  />
                  <circle cx="686" cy="375" r="4.5" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
                </g>
              )}

              {/* 4. RELAY 2 CONTROL (ROSE/MAGENTA WIRE): Uno D7 -> Relay 2 IN2 */}
              {(activeFilter === 'ALL' || activeFilter === 'TPS') && (
                <g 
                  filter={highlightedWire === 'Relay 2 D7' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                  className="cursor-pointer"
                  onClick={() => setHighlightedWire('Relay 2 D7 (Uno D7 ke IN2 Modul Relay Buzzer Beep)')}
                >
                  <path 
                    d="M 686 360 C 660 410, 710 520, 673 675" 
                    fill="none" 
                    stroke={highlightedWire?.includes('Relay 2') ? '#f43f5e' : '#e11d48'} 
                    strokeWidth={highlightedWire?.includes('Relay 2') ? '5.5' : '4'} 
                    strokeLinecap="round" 
                  />
                  <circle cx="686" cy="360" r="4.5" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.5" />
                </g>
              )}

              {/* 5. LCD 16X2 I2C BACKPACK (TERMINAL TERPISAH: PIN D4 & PIN D5) */}
              {(activeFilter === 'ALL' || activeFilter === 'LCD') && (
                <g>
                  {/* LCD I2C SDA (BLUE): LCD Header Pin 3 -> Uno Pin D4 */}
                  <g 
                    filter={highlightedWire === 'LCD I2C SDA' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                    className="cursor-pointer"
                    onClick={() => setHighlightedWire('LCD I2C SDA (Uno Pin D4 ke SDA Modul LCD 16x2 - Jalur Bebas Gangguan MPU)')}
                  >
                    <path 
                      d="M 821 195 C 750 250, 720 340, 686 420" 
                      fill="none" 
                      stroke={highlightedWire?.includes('LCD I2C SDA') ? '#38bdf8' : '#0284c7'} 
                      strokeWidth={highlightedWire?.includes('LCD I2C SDA') ? '5.5' : '4'} 
                      strokeLinecap="round" 
                    />
                    <circle cx="821" cy="195" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="686" cy="420" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  </g>

                  {/* LCD I2C SCL (YELLOW): LCD Header Pin 4 -> Uno Pin D5 */}
                  <g 
                    filter={highlightedWire === 'LCD I2C SCL' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                    className="cursor-pointer"
                    onClick={() => setHighlightedWire('LCD I2C SCL (Uno Pin D5 ke SCL Modul LCD 16x2 - Jalur Bebas Gangguan MPU)')}
                  >
                    <path 
                      d="M 835 195 C 770 260, 740 330, 686 405" 
                      fill="none" 
                      stroke={highlightedWire?.includes('LCD I2C SCL') ? '#fde047' : '#ca8a04'} 
                      strokeWidth={highlightedWire?.includes('LCD I2C SCL') ? '5.5' : '4'} 
                      strokeLinecap="round" 
                    />
                    <circle cx="835" cy="195" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                    <circle cx="686" cy="405" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                  </g>

                  {/* LCD I2C VCC (RED 5V): LCD Header Pin 2 -> Uno 5V */}
                  <g 
                    filter={highlightedWire === 'LCD I2C VCC' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                    className="cursor-pointer"
                    onClick={() => setHighlightedWire('LCD I2C VCC (Uno 5V ke VCC Modul LCD 16x2)')}
                  >
                    <path 
                      d="M 807 195 C 710 300, 580 410, 434 450" 
                      fill="none" 
                      stroke={highlightedWire?.includes('LCD I2C VCC') ? '#f87171' : '#dc2626'} 
                      strokeWidth={highlightedWire?.includes('LCD I2C VCC') ? '5.5' : '3.5'} 
                      strokeLinecap="round" 
                    />
                    <circle cx="807" cy="195" r="4" fill="#f87171" stroke="#b91c1c" strokeWidth="1.5" />
                  </g>

                  {/* LCD I2C GND (BLACK): LCD Header Pin 1 -> Uno GND */}
                  <g 
                    filter={highlightedWire === 'LCD I2C GND' ? 'url(#neonWireGlow)' : 'url(#wireShadow)'}
                    className="cursor-pointer"
                    onClick={() => setHighlightedWire('LCD I2C GND (Uno GND ke GND Modul LCD 16x2)')}
                  >
                    <path 
                      d="M 793 195 C 700 320, 590 430, 434 480" 
                      fill="none" 
                      stroke={highlightedWire?.includes('LCD I2C GND') ? '#94a3b8' : '#1e293b'} 
                      strokeWidth={highlightedWire?.includes('LCD I2C GND') ? '5.5' : '3.5'} 
                      strokeLinecap="round" 
                    />
                    <circle cx="793" cy="195" r="4" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                  </g>

                  {/* On-Schematic Explanatory Tag */}
                  <text x="680" y="240" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    Jalur Mandiri Terpisah: LCD ke D4/D5 • MPU ke A4/A5
                  </text>
                </g>
              )}

              {/* 6. TPS VARIO 125 TO SPDT RELAY & TRIMPOT WIRES */}
              {(activeFilter === 'ALL' || activeFilter === 'TPS') && (
                <g>
                  {/* Trimpot Wiper (Kaki 2) to Relay 1 NO1 */}
                  <path 
                    d="M 117 600 C 180 680, 350 710, 518 700" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="4" 
                    strokeDasharray="6 3" 
                    filter="url(#wireShadow)" 
                  />
                  <text x="310" y="685" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    Wiper Trimpot 0.80V -&gt; Relay 1 NO
                  </text>

                  {/* Sinyal Asli TPS Kuning/Merah ke Relay 1 NC1 (Fail-Safe) */}
                  <path 
                    d="M 215 315 C 320 380, 400 680, 432 700" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="4" 
                    filter="url(#wireShadow)" 
                  />
                  <text x="240" y="470" fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    Kuning/Merah Asli -&gt; NC Relay 1
                  </text>

                  {/* Relay 1 COM1 ke Kabel Kuning/Merah arah ECM */}
                  <path 
                    d="M 475 700 C 475 750, 300 740, 215 340" 
                    fill="none" 
                    stroke="#ea580c" 
                    strokeWidth="4" 
                    filter="url(#wireShadow)" 
                  />
                  <text x="310" y="740" fill="#ea580c" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    COM Relay 1 -&gt; Sinyal ECM
                  </text>

                  {/* Relay 2 NO2 to Piezo Buzzer (+) */}
                  <path 
                    d="M 663 700 C 730 730, 800 690, 850 625" 
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="4" 
                    filter="url(#wireShadow)" 
                  />
                </g>
              )}

              {/* 7. POWER RAILS 5V & GND */}
              {(activeFilter === 'ALL' || activeFilter === 'POWER') && (
                <g>
                  {/* Step-Down OUT+ (5V) to Arduino 5V Pin */}
                  <path 
                    d="M 1060 360 C 1040 330, 700 240, 434 452" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="4.5" 
                    filter="url(#wireShadow)" 
                  />
                  {/* Step-Down OUT- (GND) to Arduino GND Pin */}
                  <path 
                    d="M 1060 410 C 1040 430, 700 490, 434 483" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="4.5" 
                    filter="url(#wireShadow)" 
                  />
                </g>
              )}

              {/* ACHDIFA TECH 3D SCHEMATIC CERTIFICATION STAMP */}
              <g transform="translate(40, 680)">
                <rect x="0" y="0" width="220" height="52" rx="8" fill="#090d16" stroke="#0891b2" strokeWidth="1.5" opacity="0.9" />
                <polygon points="18,12 28,38 23,38 21,32 15,32 13,38 8,38" fill="#38bdf8" />
                <polygon points="18,17 16,28 20,28" fill="#090d16" />
                <text x="35" y="24" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="black" letterSpacing="1">
                  ACHDIFA TECH
                </text>
                <text x="35" y="38" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
                  R&D MECHATRONICS LAB &bull; REV 2.4
                </text>
                <text x="35" y="47" fill="#64748b" fontSize="6.5" fontFamily="monospace">
                  &copy; 2026 PROPRIETARY SCHEMATIC
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Legend / Wiring Color Key */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-bold">KODE WARNA KABEL FRITZING:</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> SDA (A4)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> SCL (A5)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500" /> Relay 1 (D6 TPS)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Relay 2 (D7 Buzzer)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> LCD I2C Backpack (SDA/SCL)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Kuning/Merah TPS
            </span>
          </div>

          <span className="text-[11px] text-slate-500">
            *Klik komponen atau kabel untuk melihat detail teknis
          </span>
        </div>

        {/* Selected Component Inspector Card */}
        {selectedComponent && (
          <div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
                  <Info className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedComponent.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Part: {selectedComponent.partNumber} | Tegangan Kerja: {selectedComponent.voltage}
                  </p>
                </div>
              </div>

              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                {selectedComponent.pinCount} Pin I/O
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {selectedComponent.functionDesc}
            </p>

            <div className="mt-3">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Catatan Kritis Pemasangan & Keamanan di Sepeda Motor:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                {selectedComponent.criticalNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
