import React, { useState } from 'react';
import { 
  Wrench, 
  Gauge, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  Sparkles,
  Layers,
  Activity,
  Flame,
  Radio
} from 'lucide-react';

export const CalibrationGuide: React.FC = () => {
  const [testVoltage, setTestVoltage] = useState(0.80);

  // Approximate RPM based on TPS voltage curve for Honda Vario 125:
  // 0.42V = ~1600 RPM (Idle)
  // 0.65V = ~2100 RPM (Clutch starting to drag)
  // 0.80V = ~2500 RPM (Clutch fully locked / Engine brake sweet spot)
  // 0.95V = ~3000 RPM (High engine brake)
  const estimatedRpm = Math.round(1600 + ((testVoltage - 0.42) / (0.95 - 0.42)) * 1400);

  return (
    <div className="space-y-6">
      {/* Workshop Guide Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            <Wrench className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Panduan Praktis Kalibrasi & Standar Keselamatan Bengkel
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Prosedur penyetelan trimpot multitester, orientasi fisik MPU9250, peredaman getaran mesin, dan pengaman kelistrikan otomotif.
            </p>
          </div>
        </div>

        {/* Section 1: Multimeter Trimpot Calibration */}
        <div className="mt-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-cyan-500/10 text-cyan-400 rounded">
              <Gauge className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">
              1. Prosedur Kalibrasi Trimpot 10k/5k Menggunakan Multitester Digital
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Untuk mendapatkan efek CVT Engine Brake yang sempurna pada Honda Vario 125 tanpa membuat motor melompat liar atau boros bensin, tegangan output potensiometer harus disetel secara presisi pada kisaran <strong>0,65 Volt s/d 0,95 Volt</strong> (target ideal: <strong>0,80 Volt</strong>).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">LANGKAH 1</span>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Pasang Catu Daya 5V</h4>
              <p className="text-xs text-slate-400">
                Sambungkan Kaki 1 Trimpot ke Ground (Kabel Hijau/Hitam) dan Kaki 3 Trimpot ke VCC 5V ECM (Kabel Kuning/Biru).
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">LANGKAH 2</span>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Hubungkan Probe Multimeter</h4>
              <p className="text-xs text-slate-400">
                Set multitester ke mode <strong>DC Volts (20V)</strong>. Colok probe hitam ke Ground dan probe merah ke <strong>Kaki 2 (Wiper Tengah)</strong> Trimpot.
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">LANGKAH 3</span>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Putar Obeng Presisi ke 0.80V</h4>
              <p className="text-xs text-slate-400">
                Putar perlahan baut trimpot multiturn sampai angka di layar multimeter terbaca stabil di <strong>0.80 Volt</strong>, lalu kunci posisi dengan lem silikon/kutek.
              </p>
            </div>
          </div>

          {/* Interactive Multimeter Simulator */}
          <div className="mt-5 bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Simulasi Putar Obeng Trimpot (Voltase Wiper Kaki 2):
              </label>
              <input
                type="range"
                min="0.50"
                max="1.20"
                step="0.01"
                value={testVoltage}
                onChange={(e) => setTestVoltage(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.50V (Kurang)</span>
                <span className="text-emerald-400 font-bold">0.80V Target Ideal</span>
                <span>1.20V (Terlalu Tinggi)</span>
              </div>
            </div>

            {/* Multimeter Digital Readout Box */}
            <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-xl border border-amber-500/30">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">MULTIMETER DC VOLT:</span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  {testVoltage.toFixed(2)} V
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">ESTIMASI RESPON CVT:</span>
                <span className={`text-xs font-bold font-mono ${
                  testVoltage < 0.65 
                    ? 'text-slate-400' 
                    : testVoltage <= 0.95 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
                }`}>
                  ~{estimatedRpm} RPM • {testVoltage < 0.65 ? 'Kopling Selip' : testVoltage <= 0.95 ? 'Engine Brake Menggigit Sempurna' : 'Gas Terlalu Besar!'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Orientasi Fisik Sensor MPU9250 & Peredam Getaran */}
        <div className="mt-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">
              2. Orientasi Fisik MPU9250 & Penanganan Getaran CVT (Anti-Vibration Mount)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Arah Orientasi Sumbu X Sensor
              </h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                Sensor MPU9250 memiliki panah sumbu koordinat tercetak di papan PCB:
              </p>
              <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                <li>• <strong>Sumbu X</strong>: Wajib menghadap lurus ke arah DEPAN sepeda motor.</li>
                <li>• <strong>Sumbu Y</strong>: Menghadap ke kanan/kiri (Roll body motor).</li>
                <li>• <strong>Sumbu Z</strong>: Menghadap tegak lurus ke atas bumi (Yaw).</li>
              </ul>
              <p className="text-[11px] text-amber-300 mt-2">
                Dengan orientasi ini, saat motor menuruni turunan bukit, Sumbu X Pitch akan membaca nilai <strong>NEGATIF (&lt;= -5.0°)</strong> secara konsisten.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Peredaman Getaran Mesin (Vibration Dampening)
              </h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                Mesin matic 1 silinder menghasilkan frekuensi resonansi getaran 50Hz s/d 120Hz pada sasis:
              </p>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li>• Jangan baut langsung PCB sensor ke besi rangka sasis tanpa bantalan.</li>
                <li>• Gunakan <strong>Double Tape Busa Eva Tebal (3M Foam)</strong> atau dudukan karet silikon (silicone dampers).</li>
                <li>• Complementary Filter (98% Gyro + 2% Accel) di program sudah menyaring getaran, namun isolasi mekanis akan membuat sensor jauh lebih awet dan presisi!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Proteksi Kelistrikan Motor (Spike Koil & Busi) */}
        <div className="mt-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-rose-500/10 text-rose-400 rounded">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">
              3. Proteksi Kelistrikan Otomotif Sepeda Motor (Wajib Dipasang)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-400 mb-1">Sekering (Fuse) 1 Ampere</h4>
              <p className="text-slate-400 leading-relaxed">
                Pasang inline fuse holder 1A pada kabel positif +12V dari saklar kontak (ACC) sebelum masuk ke modul step-down LM2596. Mencegah risiko korsleting arus pendek aki motor.
              </p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-400 mb-1">Filter Kapasitor Elco</h4>
              <p className="text-slate-400 leading-relaxed">
                Pasang kapasitor Elco <strong>100µF / 25V</strong> diparalel dengan kapasitor keramik <strong>100nF</strong> pada output 5V DC step-down untuk menyerap lonjakan tegangan (noise spikes) dari spul pengisian dan koil busi.
              </p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 mb-1">Satu Ground Bersama (Common GND)</h4>
              <p className="text-slate-400 leading-relaxed">
                Pastikan pin GND Arduino Uno R3, GND Modul Relay, GND MPU9250, dan Kaki 1 Trimpot terhubung menjadi satu kesatuan ground (Common Ground) yang bersih dengan massa sensor ECM.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Prosedur Pengujian Aman Pertama Kali */}
        <div className="mt-5 bg-gradient-to-r from-amber-950/30 to-slate-950 p-5 rounded-xl border border-amber-500/30">
          <h3 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Prosedur Uji Coba Pertama Kali (Standar 2 / Standar Gantung)
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
            <li>
              <strong>Uji Meja (Bench Test):</strong> Sebelum dipasang ke motor, uji rangkaian di meja kerja dengan power supply 5V. Miringkan modul MPU9250 dengan tangan ke bawah &gt; 5 derajat, pastikan Relay 1 klik aktif, Relay 2 menyala, dan LCD menampilkan <code>CVT:ON RPM 2500</code>.
            </li>
            <li>
              <strong>Uji Standar Dua (Roda Belakang Terangkat):</strong> Pasang di motor. Nyalakan mesin pada posisi standar 2 di jalan datar. Pastikan lampu indikator injeksi (MIL) speedometer tidak berkedip.
            </li>
            <li>
              <strong>Simulasi Turunan Manual:</strong> Dongkrak roda belakang sedikit atau miringkan sensor sampai LCD menunjukkan kemiringan &lt;= -5°. Rpm mesin akan otomatis naik secara halus dari idle (~1600 RPM) ke ~2500 RPM dan roda belakang berputar pelan dengan kopling terkunci.
            </li>
            <li>
              <strong>Uji Jalan Turunan Nyata:</strong> Lakukan uji coba pertama di turunan ringan dengan kecepatan rendah. Saat motor mulai menuruni turunan dan tuas gas ditutup penuh, sistem akan otomatis menahan laju motor seperti gigi 1 mobil manual!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
