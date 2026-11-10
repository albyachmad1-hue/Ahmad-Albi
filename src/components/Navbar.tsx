import React from 'react';
import { 
  Activity, 
  Layers, 
  Table, 
  Code2, 
  Wrench, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Gauge
} from 'lucide-react';
import { AchdifaTechLogo } from './AchdifaTechLogo';

interface NavbarProps {
  activeTab: 'simulator' | 'schematic' | 'wiring' | 'code' | 'calibration';
  setActiveTab: (tab: 'simulator' | 'schematic' | 'wiring' | 'code' | 'calibration') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Achdifa Tech 3D Modern Logo & Project Title */}
          <div className="flex items-center gap-3">
            <AchdifaTechLogo size="md" showText={true} withGlow={true} />
            <div className="hidden sm:block h-8 w-px bg-slate-800 mx-1" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  CVT Engine Brake Assistant
                </span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                  MPU9250 + UNO R3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sistem Pengereman Otomatis CVT Turunan (Complementary Filter 98/2)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Simulasi Interaktif
            </button>

            <button
              onClick={() => setActiveTab('schematic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'schematic'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              Skema Rangkaian
            </button>

            <button
              onClick={() => setActiveTab('wiring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'wiring'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              Tabel Wiring & TPS
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Program Arduino (.ino)
            </button>

            <button
              onClick={() => setActiveTab('calibration')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'calibration'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Panduan Kalibrasi
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
