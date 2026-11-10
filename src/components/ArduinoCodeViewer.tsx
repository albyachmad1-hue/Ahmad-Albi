import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Settings, 
  HelpCircle, 
  Terminal, 
  CheckCircle2,
  FileCode,
  BookOpen
} from 'lucide-react';
import { ARDUINO_SKETCH_INO } from '../data/arduinoCode';

export const ArduinoCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [alpha, setAlpha] = useState(0.98);
  const [thresholdOn, setThresholdOn] = useState(-5.0);
  const [thresholdOff, setThresholdOff] = useState(-3.5);
  const [debounceMs, setDebounceMs] = useState(300);

  // Generate dynamic code if custom parameters are adjusted
  const dynamicCode = ARDUINO_SKETCH_INO
    .replace('const float ALPHA = 0.98;', `const float ALPHA = ${alpha.toFixed(2)}; // ${(alpha * 100).toFixed(0)}% Gyro, ${((1 - alpha) * 100).toFixed(0)}% Accel`)
    .replace('const float THRESHOLD_PITCH_ON   = -5.0;', `const float THRESHOLD_PITCH_ON   = ${thresholdOn.toFixed(1)}; // Aktif jika sudut <= ${thresholdOn.toFixed(1)} derajat`)
    .replace('const float THRESHOLD_PITCH_OFF  = -3.5;', `const float THRESHOLD_PITCH_OFF  = ${thresholdOff.toFixed(1)}; // Mati jika sudut naik di atas ${thresholdOff.toFixed(1)} derajat`)
    .replace('const unsigned long DEBOUNCE_TIME_MS = 300;', `const unsigned long DEBOUNCE_TIME_MS = ${debounceMs}; // Stabil selama ${debounceMs}ms`);

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([dynamicCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'CVT_Brake_Arduino_Uno.ino';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Customizer Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
                <Settings className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Generator & Parameter Penyetelan Program Arduino Uno R3
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Sesuaikan bobot Complementary Filter, sudut aktivasi turunan, histeresis, dan waktu debounce getaran untuk Arduino Uno.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Tersalin ke Clipboard!' : 'Salin Kode (.ino)'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              Unduh CVT_Brake_Arduino_Uno.ino
            </button>
          </div>
        </div>

        {/* Live Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Alpha Weight */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Bobot Filter (ALPHA)</span>
              <span className="text-cyan-400 font-mono font-bold">{alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.90"
              max="0.99"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {(alpha * 100).toFixed(0)}% Gyroscope + {((1 - alpha) * 100).toFixed(0)}% Accelerometer
            </p>
          </div>

          {/* Trigger Angle */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Ambang ON (Turunan)</span>
              <span className="text-rose-400 font-mono font-bold">{thresholdOn.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="-12.0"
              max="-3.0"
              step="0.5"
              value={thresholdOn}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setThresholdOn(val);
                if (val >= thresholdOff) {
                  setThresholdOff(val + 1.5);
                }
              }}
              className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Relay 1 & 2 aktif jika kemiringan &lt;= {thresholdOn.toFixed(1)}°
            </p>
          </div>

          {/* Hysteresis Release */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Ambang OFF (Histeresis)</span>
              <span className="text-amber-400 font-mono font-bold">{thresholdOff.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="-8.0"
              max="-1.0"
              step="0.5"
              value={thresholdOff}
              onChange={(e) => setThresholdOff(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Relay mati kembali bila sudut naik &gt; {thresholdOff.toFixed(1)}°
            </p>
          </div>

          {/* Debounce Time */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Waktu Debounce</span>
              <span className="text-emerald-400 font-mono font-bold">{debounceMs} ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={debounceMs}
              onChange={(e) => setDebounceMs(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Durasi minimum kemiringan sebelum relay terpicu
            </p>
          </div>
        </div>
      </div>

      {/* Code Editor Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 ml-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              CVT_Brake_MPU9250.ino
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            C++ / Arduino IDE Compatible
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 bg-[#0d1117] overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre">
            {dynamicCode}
          </pre>
        </div>
      </div>

      {/* Step-by-Step Arduino IDE Flashing Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Panduan Langkah Flash ke Arduino Uno R3 via Arduino IDE:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="font-bold text-slate-200 mb-1">Install Library</h4>
            <p className="text-slate-400 leading-relaxed">
              Buka Arduino IDE &gt; Tools &gt; Manage Libraries... Cari dan install <strong>MPU9250_WE</strong> oleh Wolfgang Ewald. Driver LCD I2C mandiri untuk Pin D4 &amp; D5 sudah terintegrasi langsung di sketch, dan <code>Wire.h</code> sudah bawaan.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="font-bold text-slate-200 mb-1">Pilih Board Arduino Uno</h4>
            <p className="text-slate-400 leading-relaxed">
              Pilih menu <strong>Tools &gt; Board &gt; Arduino AVR Boards &gt; Arduino Uno</strong>. Pada Arduino Uno tidak perlu memilih Processor karena otomatis menggunakan bootloader Optiboot standar.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="font-bold text-slate-200 mb-1">Kabel USB Tipe-B & Port</h4>
            <p className="text-slate-400 leading-relaxed">
              Colokkan kabel USB Tipe-B (kabel printer/Uno standar) ke port USB Arduino Uno dan laptop. Pilih nomor Port COM pada menu <strong>Tools &gt; Port</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">
              4
            </div>
            <h4 className="font-bold text-slate-200 mb-1">Upload & Kalibrasi</h4>
            <p className="text-slate-400 leading-relaxed">
              Klik tombol <strong>Upload (Ctrl+U)</strong>. Biarkan motor dalam kondisi berhenti di jalan datar selama 2 detik saat pertama kali sistem boot untuk kalibrasi otomatis autoOffsets().
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
