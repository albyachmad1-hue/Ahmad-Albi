export interface SimulationState {
  pitchAngle: number; // in degrees (-30 to +30)
  gyroNoise: number;
  accelNoise: number;
  filteredPitch: number;
  isEngineBrakeActive: boolean;
  tpsVoltage: number; // in Volts
  engineRpm: number;
  audioMuted: boolean;
  trimpotVoltage: number; // 0.65 - 0.95V, default 0.80V
  thresholdAngle: number; // default -5.0 deg
  hysteresisOffset: number; // default 1.5 deg (turns off at -3.5 deg)
  debounceDelayMs: number; // default 300 ms
}

export interface WiringItem {
  id: string;
  subsystem: 'MPU9250' | 'LCD1602' | 'RELAY' | 'TPS_POT' | 'POWER';
  fromComponent: string;
  fromPin: string;
  toComponent: string;
  toPin: string;
  wireColor: string;
  wireColorHex: string;
  signalType: 'VCC 5V' | 'VCC 3.3V' | 'GND' | 'I2C' | 'DIGITAL IO' | 'ANALOG' | '12V BAT';
  description: string;
}

export interface ComponentDetail {
  id: string;
  name: string;
  partNumber: string;
  functionDesc: string;
  voltage: string;
  pinCount: number;
  criticalNotes: string[];
}
