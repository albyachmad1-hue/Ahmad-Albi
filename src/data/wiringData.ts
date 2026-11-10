import { WiringItem, ComponentDetail } from '../types';

export const COMPONENTS_DATA: ComponentDetail[] = [
  {
    id: 'uno',
    name: 'Arduino Uno R3 (ATmega328P)',
    partNumber: 'Arduino Uno Rev3 USB Type-B 5V 16MHz',
    functionDesc: 'Mikrokontroler utama pemroses Complementary Filter, kontrol logika relay, dan antarmuka LCD 16x2.',
    voltage: '5V Regulated (via 5V pin) atau 7-12V (via DC Barrel Jack 2.1mm / VIN pin)',
    pinCount: 28,
    criticalNotes: [
      'Gunakan catu daya 5V yang terstabilisasi dari modul Step-Down LM2596 ke pin 5V & GND (atau 7-12V via DC Barrel Jack).',
      'Jangan beri tegangan 12V aki motor langsung ke pin 5V (akan membakar chip ATmega328P).',
      'Pin A4 (SDA) dan A5 (SCL) 100% didedikasikan khusus Sensor MPU9250 (Hardware I2C 400kHz bebas gangguan).',
      'Pin D4 (SDA LCD) dan D5 (SCL LCD) didedikasikan khusus Display LCD 16x2 I2C (Terisolasi dari bus sensor MPU).',
      'Pemisahan terminal ini mencegah latensi penulisan teks LCD mengganggu loop sampling 100Hz gyro dan mencegah I2C hang akibat noise busi motor!',
      'Pin D6 mengontrol Relay 1 (TPS Bypass ke 2500 RPM), Pin D7 mengontrol Relay 2 (Buzzer).'
    ]
  },
  {
    id: 'mpu9250',
    name: 'Sensor IMU 9-Axis MPU9250',
    partNumber: 'MPU-9250 / MPU-6500 (GY-9250)',
    functionDesc: 'Mendeteksi sudut kemiringan Pitch depan-belakang kendaraan menggunakan perpaduan 3-Axis Gyroscope dan 3-Axis Accelerometer pada bus I2C Hardware khusus (Pin A4 & A5).',
    voltage: '3.3V s/d 5V (Modul GY-9250 memiliki onboard 3.3V LDO regulator)',
    pinCount: 10,
    criticalNotes: [
      'Orientasi Sumbu X harus menghadap ke arah depan motor.',
      'Pasang modul secara kaku pada sasis/rangka menggunakan busa peredam getaran (anti-vibration mount) untuk memotong harmonik getaran mesin cvt.',
      'Koneksi I2C Hardware: VCC -> 5V/3.3V, GND -> GND, SCL -> Pin A5 Uno, SDA -> Pin A4 Uno.'
    ]
  },
  {
    id: 'lcd1602',
    name: 'Display LiquidCrystal 16x2 I2C (Terminal Khusus D4 & D5)',
    partNumber: 'LCD 1602A + Modul I2C Serial Backpack PCF8574',
    functionDesc: 'Menampilkan data sudut Pitch real-time & konversi persentase kemiringan jalan (%) pada baris 1, serta status Relay / RPM 2500 pada baris 2 melalui terminal pin mandiri terpisah (Pin D4 SDA & Pin D5 SCL).',
    voltage: '5V DC',
    pinCount: 4,
    criticalNotes: [
      'Hanya membutuhkan 4 kabel: GND, VCC (5V), SDA (ke Pin D4 Uno), dan SCL (ke Pin D5 Uno).',
      'Terhubung ke jalur mandiri terpisah dari sensor MPU9250: delay penulisan karakter LCD tidak akan pernah memperlambat pembacaan sensor gerak!',
      'Kontras tampilan disetel langsung melalui trimpot putar biru kecil yang sudah terintegrasi di papan I2C backpack.',
      'Jumper pengubah alamat I2C (A0, A1, A2) dibiarkan default terbuka (alamat default: 0x27).'
    ]
  },
  {
    id: 'dual_relay',
    name: 'Modul Dual Relay 5V dengan Optocoupler Isolator',
    partNumber: '2-Channel 5V Relay Module (Songle SRD-05VDC-SL-C)',
    functionDesc: 'Saklar elektromekanis isolasi tinggi. Relay 1 mengalihkan jalur TPS ke Trimpot 2500 RPM, Relay 2 mengaktifkan buzzer.',
    voltage: '5V VCC Coil',
    pinCount: 6,
    criticalNotes: [
      'Relay 1 menggunakan konfigurasi SPDT (Single Pole Double Throw) FAIL-SAFE:',
      '- COM (Common) -> Terhubung ke kabel Sinyal ECU/ECM (Kuning/Merah arah ECU).',
      '- NC (Normally Closed) -> Terhubung ke kabel Sinyal dari sensor TPS fisik asli.',
      '- NO (Normally Open) -> Terhubung ke Kaki 2 (Wiper) Potensiometer Trimpot 2500 RPM.',
      'Keunggulan SPDT Fail-Safe: Bila modul mati, sekering putus, atau relay OFF, sinyal TPS asli mengalir normal 100% tanpa gangguan!',
      'Relay 2 (Buzzer): COM ke +5V, NO ke anoda buzzer positif, katoda buzzer ke GND.'
    ]
  },
  {
    id: 'tps_pot',
    name: 'Potensiometer / Trimpot Presisi Multiturn',
    partNumber: 'Trimpot Linear 10 kΩ atau 5 kΩ (Tipe 3296W atau B10K)',
    functionDesc: 'Membagi tegangan 5V VCC TPS menjadi tegangan presisi 0.65V - 0.95V untuk mensimulasikan bukaan gas RPM 2500.',
    voltage: 'Input 5V dari kabel Kuning/Biru TPS',
    pinCount: 3,
    criticalNotes: [
      'Kaki 1: Ground (Kabel Hijau/Hitam dari soket TPS atau GND sistem).',
      'Kaki 3: VCC 5V Referensi ECM (Kabel Kuning/Biru dari soket TPS).',
      'Kaki 2 (Tengah/Wiper): Output Voltase yang disetel multitester ke 0.80V (rentang 0.65V - 0.95V).',
      'Gunakan Multitester digital saat menyetel trimpot sebelum dipasang ke relay.'
    ]
  },
  {
    id: 'power_buck',
    name: 'DC-DC Step-Down Buck Converter Otomotif',
    partNumber: 'LM2596 / Mini-360 Step Down Converter',
    functionDesc: 'Menurunkan tegangan Aki Motor (12V - 14.4V saat spul mengisi) menjadi 5.0V DC bersih dan stabil.',
    voltage: 'Input: 12V Aki Motor | Output: 5.0V DC Regulated',
    pinCount: 4,
    criticalNotes: [
      'Ambil input 12V dari jalur setelah Kunci Kontak (ACC), BUKAN langsung dari kutub aki permanen.',
      'Pasang sekering (Fuse) 1A - 2A pada kabel positif input 12V.',
      'Sertakan kapasitor peredam 100uF + 100nF untuk menyaring lonjakan spike koil busi motor.'
    ]
  }
];

export const WIRING_MATRIX: WiringItem[] = [
  // MPU9250
  {
    id: 'w1',
    subsystem: 'MPU9250',
    fromComponent: 'MPU9250 IMU',
    fromPin: 'VCC',
    toComponent: 'Arduino Uno R3',
    toPin: '5V (atau 3.3V)',
    wireColor: 'Merah',
    wireColorHex: '#ef4444',
    signalType: 'VCC 5V',
    description: 'Daya positif modul sensor gerak'
  },
  {
    id: 'w2',
    subsystem: 'MPU9250',
    fromComponent: 'MPU9250 IMU',
    fromPin: 'GND',
    toComponent: 'Arduino Uno R3',
    toPin: 'GND',
    wireColor: 'Hitam',
    wireColorHex: '#1e293b',
    signalType: 'GND',
    description: 'Ground massa bersama sensor'
  },
  {
    id: 'w3',
    subsystem: 'MPU9250',
    fromComponent: 'MPU9250 IMU',
    fromPin: 'SDA',
    toComponent: 'Arduino Uno R3',
    toPin: 'A4',
    wireColor: 'Biru',
    wireColorHex: '#3b82f6',
    signalType: 'I2C',
    description: 'Jalur data I2C Serial Data MPU9250'
  },
  {
    id: 'w4',
    subsystem: 'MPU9250',
    fromComponent: 'MPU9250 IMU',
    fromPin: 'SCL',
    toComponent: 'Arduino Uno R3',
    toPin: 'A5',
    wireColor: 'Kuning',
    wireColorHex: '#eab308',
    signalType: 'I2C',
    description: 'Jalur detak clock I2C Serial Clock MPU9250'
  },

  // LCD 16x2 DENGAN MODUL I2C BACKPACK (PCF8574 - HANYA 4 KABEL)
  {
    id: 'w5',
    subsystem: 'LCD1602',
    fromComponent: 'LCD 16x2 I2C Backpack',
    fromPin: 'GND',
    toComponent: 'Arduino Uno R3',
    toPin: 'GND',
    wireColor: 'Hitam',
    wireColorHex: '#1e293b',
    signalType: 'GND',
    description: 'Ground massa modul LCD I2C'
  },
  {
    id: 'w6',
    subsystem: 'LCD1602',
    fromComponent: 'LCD 16x2 I2C Backpack',
    fromPin: 'VCC',
    toComponent: 'Arduino Uno R3',
    toPin: '5V (atau Step-Down 5V)',
    wireColor: 'Merah',
    wireColorHex: '#ef4444',
    signalType: 'VCC 5V',
    description: 'Catu daya positif 5V LCD logic & backlight'
  },
  {
    id: 'w7',
    subsystem: 'LCD1602',
    fromComponent: 'LCD 16x2 I2C Backpack',
    fromPin: 'SDA',
    toComponent: 'Arduino Uno R3',
    toPin: 'Pin D4 (LCD SDA Mandiri)',
    wireColor: 'Biru',
    wireColorHex: '#3b82f6',
    signalType: 'I2C',
    description: 'Jalur Serial Data LCD terisolasi (Mencegah latensi pada sensor MPU)'
  },
  {
    id: 'w8',
    subsystem: 'LCD1602',
    fromComponent: 'LCD 16x2 I2C Backpack',
    fromPin: 'SCL',
    toComponent: 'Arduino Uno R3',
    toPin: 'Pin D5 (LCD SCL Mandiri)',
    wireColor: 'Kuning',
    wireColorHex: '#eab308',
    signalType: 'I2C',
    description: 'Jalur Serial Clock LCD terisolasi (Mencegah hang akibat noise busi)'
  },

  // DUAL RELAY & BUZZER
  {
    id: 'w17',
    subsystem: 'RELAY',
    fromComponent: 'Modul Dual Relay',
    fromPin: 'VCC',
    toComponent: 'Power 5V (Step-Down)',
    toPin: '5V Regulated',
    wireColor: 'Merah',
    wireColorHex: '#ef4444',
    signalType: 'VCC 5V',
    description: 'Daya koil relay'
  },
  {
    id: 'w18',
    subsystem: 'RELAY',
    fromComponent: 'Modul Dual Relay',
    fromPin: 'GND',
    toComponent: 'Power / Uno',
    toPin: 'GND Common',
    wireColor: 'Hitam',
    wireColorHex: '#1e293b',
    signalType: 'GND',
    description: 'Massa bersama modul relay'
  },
  {
    id: 'w19',
    subsystem: 'RELAY',
    fromComponent: 'Modul Dual Relay',
    fromPin: 'IN1 (Relay 1)',
    toComponent: 'Arduino Uno R3',
    toPin: 'Pin D6',
    wireColor: 'Kuning/Hijau',
    wireColorHex: '#84cc16',
    signalType: 'DIGITAL IO',
    description: 'Pemicu Relay 1 (Bypass TPS Vario ke 0.8V RPM 2500 saat turunan <= -5°)'
  },
  {
    id: 'w20',
    subsystem: 'RELAY',
    fromComponent: 'Modul Dual Relay',
    fromPin: 'IN2 (Relay 2)',
    toComponent: 'Arduino Uno R3',
    toPin: 'Pin D7',
    wireColor: 'Oranye',
    wireColorHex: '#f97316',
    signalType: 'DIGITAL IO',
    description: 'Pemicu Relay 2 (Mengaktifkan Buzzer peringatan audio)'
  },
  {
    id: 'w21',
    subsystem: 'RELAY',
    fromComponent: 'Modul Dual Relay',
    fromPin: 'Relay 2 (NO)',
    toComponent: 'Piezo Buzzer 5V',
    toPin: 'Kaki Positif (+)',
    wireColor: 'Merah',
    wireColorHex: '#ef4444',
    signalType: 'VCC 5V',
    description: 'Suplai daya buzzer saat relay 2 aktif'
  },

  // TPS VARIO 125 & POTENSIOMETER TRIMPOT
  {
    id: 'w22',
    subsystem: 'TPS_POT',
    fromComponent: 'Potensiometer 10k/5k',
    fromPin: 'Kaki 1 (Kiri)',
    toComponent: 'Soket TPS Vario 125',
    toPin: 'Kabel Hijau/Hitam (GND)',
    wireColor: 'Hijau/Hitam',
    wireColorHex: '#15803d',
    signalType: 'GND',
    description: 'Jalur Ground referensi sensor TPS ECM'
  },
  {
    id: 'w23',
    subsystem: 'TPS_POT',
    fromComponent: 'Potensiometer 10k/5k',
    fromPin: 'Kaki 3 (Kanan)',
    toComponent: 'Soket TPS Vario 125',
    toPin: 'Kabel Kuning/Biru (5V VCC)',
    wireColor: 'Kuning/Biru',
    wireColorHex: '#0284c7',
    signalType: 'VCC 5V',
    description: 'Tegangan referensi 5V konstan dari ECM'
  },
  {
    id: 'w24',
    subsystem: 'TPS_POT',
    fromComponent: 'Potensiometer 10k/5k',
    fromPin: 'Kaki 2 (Wiper Tengah)',
    toComponent: 'Relay 1 Terminal',
    toPin: 'Terminal NO (Normally Open)',
    wireColor: 'Putih/Merah',
    wireColorHex: '#e11d48',
    signalType: 'ANALOG',
    description: 'Voltase target 0.65V - 0.95V (RPM 2500) siap di-bypass saat turunan'
  },
  {
    id: 'w25',
    subsystem: 'TPS_POT',
    fromComponent: 'Sensor TPS Asli (Fisik)',
    fromPin: 'Kabel Kuning/Merah Sinyal',
    toComponent: 'Relay 1 Terminal',
    toPin: 'Terminal NC (Normally Closed)',
    wireColor: 'Kuning/Merah',
    wireColorHex: '#f59e0b',
    signalType: 'ANALOG',
    description: 'Sinyal TPS standar pabrik: mengalir normal saat relay mati (Fail-Safe)'
  },
  {
    id: 'w26',
    subsystem: 'TPS_POT',
    fromComponent: 'Relay 1 Terminal',
    fromPin: 'Terminal COM (Common)',
    toComponent: 'ECU/ECM Honda Vario',
    toPin: 'Kabel Kuning/Merah arah ECM',
    wireColor: 'Kuning/Merah',
    wireColorHex: '#ea580c',
    signalType: 'ANALOG',
    description: 'Jalur masukan sinyal bukaan gas utama ke komputer ECM motor'
  },

  // POWER SUPPLY & STEP DOWN
  {
    id: 'w27',
    subsystem: 'POWER',
    fromComponent: 'Aki Motor 12V',
    fromPin: 'Kunci Kontak (ACC +12V)',
    toComponent: 'Step-Down LM2596 (IN+)',
    toPin: 'via Fuse 1A',
    wireColor: 'Merah Tebal',
    wireColorHex: '#dc2626',
    signalType: '12V BAT',
    description: 'Input 12V dari saklar kontak on/off motor'
  },
  {
    id: 'w28',
    subsystem: 'POWER',
    fromComponent: 'Aki Motor 12V',
    fromPin: 'Negatif Aki (GND Motor)',
    toComponent: 'Step-Down LM2596 (IN-)',
    toPin: 'IN- Common Ground',
    wireColor: 'Hitam Tebal',
    wireColorHex: '#0f172a',
    signalType: 'GND',
    description: 'Massa rangka bodi motor'
  },
  {
    id: 'w29',
    subsystem: 'POWER',
    fromComponent: 'Step-Down LM2596',
    fromPin: 'OUT+ (Disetel ke 5.0V)',
    toComponent: 'Arduino Uno R3 & Relay',
    toPin: 'Pin 5V Arduino & VCC Relay',
    wireColor: 'Merah',
    wireColorHex: '#ef4444',
    signalType: 'VCC 5V',
    description: 'Output 5.0V teregulasi dan stabil bebas lonjakan tegangan'
  },
  {
    id: 'w30',
    subsystem: 'POWER',
    fromComponent: 'Step-Down LM2596',
    fromPin: 'OUT- (GND)',
    toComponent: 'Arduino Uno R3 & Relay',
    toPin: 'Pin GND Arduino & GND Relay',
    wireColor: 'Hitam',
    wireColorHex: '#1e293b',
    signalType: 'GND',
    description: 'Jalur return ground teregulasi'
  }
];

export const TPS_INFO_SECTIONS = {
  hondaVario125: {
    model: 'Honda Vario 125 (eSP / LED / CBS / ISS)',
    idleVoltage: '0.40V - 0.45V',
    fullThrottleVoltage: '4.00V - 4.50V',
    targetBypassVoltage: '0.65V - 0.95V (Disetel ke 0.80V)',
    targetThrottleDegree: '4° - 9°',
    targetRpm: '2500 RPM',
    clutchBehavior: 'Pada 2500 RPM, kampas kopling ganda (centrifugal clutch) mengembang dan mencengkeram mangkok kopling. Saat motor menuruni turunan tanpa digas, kompresi mesin menahan laju roda belakang (Engine Brake CVT aktif).',
    wires: [
      {
        pin: 1,
        color: 'Kuning/Biru (Y/Bu)',
        role: 'VCC 5V Referensi ECM',
        voltage: 'Tegangan konstan 5.0V DC dari regulator ECM'
      },
      {
        pin: 2,
        color: 'Kuning/Merah (Y/R)',
        role: 'Signal Out (Tegangan Dinamis)',
        voltage: '0.4V (Idle) s/d 4.5V (Gas Penuh). Ini yang dibypass ke 0.80V!'
      },
      {
        pin: 3,
        color: 'Hijau/Hitam (G/B)',
        role: 'Ground Sensor ECM',
        voltage: '0.0V (Massa / Sensor Ground)'
      }
    ]
  }
};
