import React, { useState } from 'react';
import { 
  Table, 
  Search, 
  Filter, 
  Check, 
  ShieldAlert, 
  SlidersHorizontal, 
  ArrowRight, 
  Cable,
  HelpCircle,
  Copy
} from 'lucide-react';
import { WIRING_MATRIX, TPS_INFO_SECTIONS } from '../data/wiringData';

export const WiringTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredWiring = WIRING_MATRIX.filter((item) => {
    const matchesSearch = 
      item.fromComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.toComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fromPin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.toPin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wireColor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubsystem = selectedSubsystem === 'ALL' || item.subsystem === selectedSubsystem;

    return matchesSearch && matchesSubsystem;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Honda Vario 125 TPS Socket Pinout & Safe Bypass Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            <Cable className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Identifikasi Jalur Kabel TPS Honda Vario 125 & Metode Pemasangan
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Standar bukaan gas: Idle 0.40V - 0.45V | RPM 2500 Target: 0.65V - 0.95V (Wiper Trimpot ke Relay 1)
            </p>
          </div>
        </div>

        {/* 3 Wires Identification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {TPS_INFO_SECTIONS.hondaVario125.wires.map((wire) => (
            <div key={wire.pin} className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  PIN #{wire.pin} SOKET TPS
                </span>
                <span className="w-3 h-3 rounded-full" style={{
                  backgroundColor: wire.pin === 1 ? '#0284c7' : wire.pin === 2 ? '#ea580c' : '#15803d'
                }} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {wire.color}
              </h4>
              <p className="text-xs text-amber-400 font-semibold mb-1">
                {wire.role}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {wire.voltage}
              </p>
            </div>
          ))}
        </div>

        {/* Metode Pemasangan Relay SPDT Paling Aman (Fail-Safe) */}
        <div className="mt-5 bg-gradient-to-r from-cyan-950/40 to-slate-950 p-4 rounded-xl border border-cyan-500/30">
          <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Metode C: Fail-Safe SPDT Relay (Sangat Direkomendasikan untuk Keamanan Berkendara)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Daripada hanya memotong atau memparalel trimpot secara langsung yang beresiko korsleting atau error MIL ECU motor:
            gunakan saklar <strong>SPDT (Single Pole Double Throw)</strong> pada Modul Relay 1.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs font-mono">
            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-700">
              <span className="text-slate-400 block text-[10px]">TERMINAL NC (NORMALLY CLOSED)</span>
              <span className="text-emerald-400 font-bold">Kabel Kuning/Merah dari TPS Asli</span>
              <p className="text-[10px] text-slate-500 mt-1">
                Saat relay mati (jalan datar/alat padam), sinyal TPS asli mengalir 100% normal tanpa modifikasi.
              </p>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-700">
              <span className="text-slate-400 block text-[10px]">TERMINAL COM (COMMON)</span>
              <span className="text-amber-400 font-bold">Kabel Kuning/Merah Menuju ECM/ECU</span>
              <p className="text-[10px] text-slate-500 mt-1">
                Jalur input tegangan utama yang dibaca oleh otak ECM Honda Vario 125.
              </p>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-700">
              <span className="text-slate-400 block text-[10px]">TERMINAL NO (NORMALLY OPEN)</span>
              <span className="text-cyan-400 font-bold">Kaki 2 (Wiper) Trimpot (0.80V)</span>
              <p className="text-[10px] text-slate-500 mt-1">
                Hanya terhubung saat motor menuruni turunan &lt;= -5° (Relay D6 aktif), mengunci RPM pada 2500.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Pin-to-Pin Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                <Table className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">
                Tabel Interkoneksi Pin Lengkap (Pin-by-Pin Matrix)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Total {WIRING_MATRIX.length} titik sambungan kawat terstruktur untuk perakitan bebas kesalahan.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pin, kabel, atau komponen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56 sm:w-64"
              />
            </div>

            <select
              value={selectedSubsystem}
              onChange={(e) => setSelectedSubsystem(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Sub-sistem</option>
              <option value="MPU9250">Sensor MPU9250 (I2C)</option>
              <option value="LCD1602">LCD 16x2 I2C Backpack (SDA/SCL)</option>
              <option value="RELAY">Dual Relay & Buzzer</option>
              <option value="TPS_POT">TPS & Potensiometer</option>
              <option value="POWER">Power Supply 12V-5V</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Sub-sistem</th>
                <th className="py-3 px-3">Komponen Asal</th>
                <th className="py-3 px-3">Pin Asal</th>
                <th className="py-3 px-3 text-center">Arah</th>
                <th className="py-3 px-3">Komponen Tujuan</th>
                <th className="py-3 px-3">Pin Tujuan</th>
                <th className="py-3 px-3">Warna Kabel</th>
                <th className="py-3 px-3">Deskripsi Fungsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredWiring.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">{index + 1}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.subsystem === 'MPU9250' ? 'bg-indigo-500/20 text-indigo-300' :
                      item.subsystem === 'LCD1602' ? 'bg-emerald-500/20 text-emerald-300' :
                      item.subsystem === 'RELAY' ? 'bg-amber-500/20 text-amber-300' :
                      item.subsystem === 'TPS_POT' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.subsystem}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{item.fromComponent}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{item.fromPin}</td>
                  <td className="py-2.5 px-3 text-center text-slate-500">
                    <ArrowRight className="w-3.5 h-3.5 inline" />
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{item.toComponent}</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">{item.toPin}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-slate-600" 
                        style={{ backgroundColor: item.wireColorHex }} 
                      />
                      <span className="text-slate-300">{item.wireColor}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-xs">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
