/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InclineSimulator } from './components/InclineSimulator';
import { CircuitSchematic } from './components/CircuitSchematic';
import { WiringTable } from './components/WiringTable';
import { ArduinoCodeViewer } from './components/ArduinoCodeViewer';
import { CalibrationGuide } from './components/CalibrationGuide';
import { AchdifaCopyrightCard } from './components/AchdifaCopyrightCard';
import { 
  CheckCircle2, 
  Cpu, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Table, 
  Code2, 
  Wrench,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'schematic' | 'wiring' | 'code' | 'calibration'>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Core System Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">SENSOR SUDUT</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
              <Compass className="w-3.5 h-3.5" />
              MPU9250 (X Pitch)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">FILTER ALGORITMA</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Activity className="w-3.5 h-3.5" />
              98% Gyro + 2% Accel
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">AMBANG TURUNAN</span>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              &lt;= -5.0° (Hyst: -3.5°)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">PIN RELAY 1 (D6)</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
              <Sliders className="w-3.5 h-3.5" />
              TPS Bypass 0.80V
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">PIN RELAY 2 (D7)</span>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              Piezo Buzzer Beep
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono block">DISPLAY LCD 16X2</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
              <Cpu className="w-3.5 h-3.5" />
              Pin D4 (SDA) & Pin D5 (SCL)
            </span>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'simulator' && <InclineSimulator />}
        {activeTab === 'schematic' && <CircuitSchematic />}
        {activeTab === 'wiring' && <WiringTable />}
        {activeTab === 'code' && <ArduinoCodeViewer />}
        {activeTab === 'calibration' && <CalibrationGuide />}

        {/* 3D Modern Achdifa Tech Copyright Card */}
        <section className="pt-6">
          <AchdifaCopyrightCard />
        </section>
      </main>

      {/* Footer Technical Note */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Sistem Otomasi Otomotif Honda Vario 125 CVT Brake • Mode Fail-Safe SPDT Relay
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            &copy; 2026 ACHDIFA TECH &bull; All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
