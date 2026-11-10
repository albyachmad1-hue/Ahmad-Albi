export const ARDUINO_SKETCH_INO = `/**
 * ============================================================================
 * COPYRIGHT (C) 2026 ACHDIFA TECH - ALL RIGHTS RESERVED
 * PUSAT INOVASI REKAYASA SISTEM MEKATRONIKA & KESELAMATAN OTOMOTIF
 * ============================================================================
 * SISTEM OTOMATIS CVT ENGINE BRAKE MOTOR TURUNAN (HONDA VARIO 125 & MATIC)
 * ARDUINO UNO R3, SENSOR MPU9250 (COMPLEMENTARY FILTER 98% / 2%)
 * LCD 16X2 I2C BACKPACK DENGAN PEMISAHAN TERMINAL MANDIRI (PIN D4 & D5)
 * DUAL RELAY TPS BYPASS (PIN D6) & BUZZER ALARM (PIN D7)
 * ============================================================================
 * 
 * JAWABAN REKAYASA TEKNIK: APAKAH PARALEL A4 & A5 AKAN MENGGANGGU ARDUINO?
 * ----------------------------------------------------------------------------
 * YA, PADA SEPEDA MOTOR SANGAT BERPOTENSI MENGGANGGU KARENA 3 ALASAN UTAMA:
 * 1. TRAFFIC / LATENCY BOTTLENECK:
 *    - MPU9250 membutuhkan pembacaan cepat (50Hz - 100Hz) agar integrasi gyro (dt)
 *      presisi dan Complementary Filter mampu memotong getaran mesin CVT.
 *    - Menulis teks ke LCD 16x2 via I2C PCF8574 sangat lambat (membutuhkan pulsa EN
 *      berulang kali). Jika berada di jalur yang sama, siklus baca sensor akan 
 *      tertunda (ter-delay hingga 10-15ms), menyebabkan pembacaan sudut jitter/lag!
 * 2. NOISE INDUKSI BUSI / KOIL PENGAPIAN (I2C BUS LOCKUP):
 *    - Kabel LCD ditarik panjang dari bawah jok/dek menuju setang kemudi (dashboard).
 *      Kabel panjang ini bertindak sebagai antena yang menangkap noise elektromagnetik
 *      tegangan tinggi dari koil busi. Jika bus I2C digabung, noise pada kabel LCD
 *      bisa mengunci (freeze) modul I2C hardware ATmega328P, mematikan sensor MPU!
 * 3. BEBAN PULL-UP PARALEL:
 *    - MPU9250 memiliki pull-up internal 4.7k ke 3.3V/5V.
 *    - Modul I2C LCD memiliki pull-up internal 4.7k ke 5V.
 *      Jika diparalel, resistansi turun ke ~2.3k, membebani kapasitas arus sink Arduino.
 * 
 * SOLUSI TERBAIK (PEMISAHAN TERMINAL MANDIRI / DUAL INDEPENDENT BUS):
 * ----------------------------------------------------------------------------
 * 1. TERMINAL A4 (SDA) & A5 (SCL) -> 100% KHUSUS SENSOR MPU9250
 *    - Menggunakan Hardware TWI I2C murni berkecepatan tinggi (400 kHz Fast Mode).
 *    - Dilengkapi proteksi Wire.setWireTimeout(3000, true) agar bebas freeze.
 * 2. TERMINAL D4 (SDA) & D5 (SCL) -> 100% KHUSUS DISPLAY LCD 16X2 I2C
 *    - Menggunakan jalur komunikasi terisolasi via Software I2C / Soft-Wire.
 *    - Delay pengiriman teks LCD sama sekali TIDAK MENGGANGGU loop pembacaan MPU9250!
 * 3. TERMINAL D6 -> RELAY 1 (TPS BYPASS 2500 RPM)
 * 4. TERMINAL D7 -> RELAY 2 (BUZZER WARNING BEEP)
 * 
 * RUMUS & LOGIKA KESELAMATAN:
 * - Grade Kemiringan: G (%) = tan(pitch_radian) * 100
 * - Perlambatan Dasar (Datar, v=40 km/j, S=200m): a = v^2 / (2 * S) = 0.31 m/s^2
 * - Jalan Menurun: a_rem = a_dasar + (g * G)  [g = 9.81 m/s^2]
 * - Jarak Berhenti Ideal: S = v^2 / [254 * (f - G)]
 * - Ambang Batas: Pitch <= -5.0 deg -> RELAY ON (RPM 2500, CVT Mengunci)
 * ============================================================================
 */

#include <Wire.h>
#include <MPU9250_WE.h>

// ----------------------------------------------------------------------------
// 1. DEFINISI PIN TERMINAL ARDUINO UNO R3
// ----------------------------------------------------------------------------
// TERMINAL KHUSUS LCD 16X2 I2C (Terpisah dari Sensor MPU untuk mencegah gangguan)
const int PIN_LCD_SDA      = 4;  // Pin D4 Uno -> Pin SDA Modul I2C LCD
const int PIN_LCD_SCL      = 5;  // Pin D5 Uno -> Pin SCL Modul I2C LCD
#define LCD_I2C_ADDR 0x27        // Alamat I2C PCF8574 LCD (0x27 atau 0x3F)

// TERMINAL OUTPUT RELAY
const int PIN_RELAY_TPS    = 6;  // Pin D6 Uno -> IN1 Relay TPS Bypass 2500 RPM
const int PIN_RELAY_BUZZER = 7;  // Pin D7 Uno -> IN2 Relay Buzzer Peringatan

// TERMINAL KHUSUS SENSOR MPU9250 (Hardware I2C pada Pin A4 & A5)
// SDA_MPU -> Pin A4 Arduino Uno
// SCL_MPU -> Pin A5 Arduino Uno
#define MPU9250_ADDR 0x68
MPU9250_WE myMPU9250 = MPU9250_WE(MPU9250_ADDR);

// Logika Relay (Active-LOW untuk modul optocoupler)
const int RELAY_ON  = LOW;
const int RELAY_OFF = HIGH;

// ----------------------------------------------------------------------------
// 2. DRIVER MANDIRI LCD I2C TERISOLASI (PIN D4 & PIN D5)
//    Bekerja tanpa memblokir bus hardware A4/A5 sensor MPU!
// ----------------------------------------------------------------------------
class SoftI2C_LCD {
private:
  uint8_t _addr;
  uint8_t _backlightVal;

  void i2c_start() {
    digitalWrite(PIN_LCD_SDA, HIGH);
    digitalWrite(PIN_LCD_SCL, HIGH);
    delayMicroseconds(4);
    digitalWrite(PIN_LCD_SDA, LOW);
    delayMicroseconds(4);
    digitalWrite(PIN_LCD_SCL, LOW);
  }

  void i2c_stop() {
    digitalWrite(PIN_LCD_SDA, LOW);
    delayMicroseconds(4);
    digitalWrite(PIN_LCD_SCL, HIGH);
    delayMicroseconds(4);
    digitalWrite(PIN_LCD_SDA, HIGH);
    delayMicroseconds(4);
  }

  bool i2c_write_byte(uint8_t data) {
    for (uint8_t i = 0; i < 8; i++) {
      digitalWrite(PIN_LCD_SDA, (data & 0x80) ? HIGH : LOW);
      data <<= 1;
      delayMicroseconds(2);
      digitalWrite(PIN_LCD_SCL, HIGH);
      delayMicroseconds(4);
      digitalWrite(PIN_LCD_SCL, LOW);
      delayMicroseconds(2);
    }
    // Baca ACK
    pinMode(PIN_LCD_SDA, INPUT_PULLUP);
    digitalWrite(PIN_LCD_SCL, HIGH);
    delayMicroseconds(4);
    bool ack = (digitalRead(PIN_LCD_SDA) == LOW);
    digitalWrite(PIN_LCD_SCL, LOW);
    pinMode(PIN_LCD_SDA, OUTPUT);
    return ack;
  }

  void write_expander(uint8_t data) {
    i2c_start();
    i2c_write_byte(_addr << 1);
    i2c_write_byte(data | _backlightVal);
    i2c_stop();
  }

  void pulse_enable(uint8_t data) {
    write_expander(data | 0x04); // EN = 1
    delayMicroseconds(2);
    write_expander(data & ~0x04); // EN = 0
    delayMicroseconds(30);
  }

  void write_nibble(uint8_t nibble, uint8_t mode) {
    uint8_t val = (nibble & 0xF0) | mode;
    write_expander(val);
    pulse_enable(val);
  }

  void send_byte(uint8_t value, uint8_t mode) {
    write_nibble(value & 0xF0, mode);
    write_nibble((value << 4) & 0xF0, mode);
  }

public:
  SoftI2C_LCD(uint8_t addr) : _addr(addr), _backlightVal(0x08) {}

  void init() {
    pinMode(PIN_LCD_SDA, OUTPUT);
    pinMode(PIN_LCD_SCL, OUTPUT);
    digitalWrite(PIN_LCD_SDA, HIGH);
    digitalWrite(PIN_LCD_SCL, HIGH);
    delay(50);

    // Inisialisasi 4-bit mode HD44780
    write_nibble(0x30, 0);
    delayMicroseconds(4500);
    write_nibble(0x30, 0);
    delayMicroseconds(4500);
    write_nibble(0x30, 0);
    delayMicroseconds(150);
    write_nibble(0x20, 0); // 4-bit mode

    command(0x28); // 2 baris, font 5x8
    command(0x0C); // Display ON, cursor OFF
    command(0x06); // Entry mode auto increment
    clear();
  }

  void command(uint8_t value) {
    send_byte(value, 0x00); // RS = 0
  }

  void write(uint8_t value) {
    send_byte(value, 0x01); // RS = 1
  }

  void clear() {
    command(0x01);
    delayMicroseconds(2000);
  }

  void setCursor(uint8_t col, uint8_t row) {
    uint8_t row_offsets[] = { 0x00, 0x40 };
    command(0x80 | (col + row_offsets[row]));
  }

  void print(const char* str) {
    while (*str) {
      write(*str++);
    }
  }

  void print(float val, int precision = 1) {
    char buf[10];
    dtostrf(val, 4, precision, buf);
    print(buf);
  }

  void createChar(uint8_t location, uint8_t charmap[]) {
    location &= 0x7;
    command(0x40 | (location << 3));
    for (int i = 0; i < 8; i++) {
      write(charmap[i]);
    }
  }

  void backlight(bool on = true) {
    _backlightVal = on ? 0x08 : 0x00;
    write_expander(0x00);
  }
};

// Objek LCD Mandiri pada Pin D4 & D5
SoftI2C_LCD lcd(LCD_I2C_ADDR);

// ----------------------------------------------------------------------------
// 3. PARAMETER FILTER KOMPLEMENTER & FISIKA TURUNAN
// ----------------------------------------------------------------------------
const float ALPHA = 0.98; // 98% Gyro + 2% Accel
const float THRESHOLD_PITCH_ON   = -5.0; // Ambang aktif (Pitch <= -5.0 derajat)
const float THRESHOLD_PITCH_OFF  = -3.5; // Histeresis mati (Pitch > -3.5 derajat)
const unsigned long DEBOUNCE_TIME_MS = 300; // Debounce sasis 300ms

float pitchAngle = 0.0;
float gradePercent = 0.0;

// Kasus spesifik: Kecepatan 40 km/jam, Jarak pengereman 200 meter
const float V_KMH   = 40.0;
const float V_MS    = 11.11; // 40 km/j dalam m/s
const float S_DIST  = 200.0; // meter
const float G_ACCEL = 9.81;  // m/s^2
const float F_TIRE  = 0.35;  // Koefisien aspal kering

float a_dasar = 0.31;  // v^2 / (2 * S) = 11.11^2 / (2 * 200) = 0.31 m/s^2
float g_dorong = 0.0;  // Gaya dorong gravitasi = g * G
float a_rem = 0.31;    // Total rem yang dibutuhkan = a_dasar + (g * G)

unsigned long prevTime = 0;
unsigned long declineStartTime = 0;
bool isDebouncing = false;
bool relayState = false;

unsigned long lastLcdUpdate = 0;
const unsigned long LCD_INTERVAL_MS = 150; // Update LCD setiap 150ms non-blocking

// Simbol Derajat (°)
byte degreeChar[8] = {
  B00110, B01001, B01001, B00110, B00000, B00000, B00000, B00000
};

// ----------------------------------------------------------------------------
// 4. SETUP SISTEM
// ----------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);

  // Inisialisasi Relay
  pinMode(PIN_RELAY_TPS, OUTPUT);
  pinMode(PIN_RELAY_BUZZER, OUTPUT);
  digitalWrite(PIN_RELAY_TPS, RELAY_OFF);
  digitalWrite(PIN_RELAY_BUZZER, RELAY_OFF);

  // Inisialisasi LCD Mandiri (Pin D4 SDA, Pin D5 SCL)
  lcd.init();
  lcd.backlight(true);
  lcd.createChar(0, degreeChar);
  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("ACHDIFA TECH");
  lcd.setCursor(0, 1);
  lcd.print("DUAL BUS UNO R3");
  delay(1200);

  // Inisialisasi Hardware TWI I2C Khusus Sensor MPU9250 (Pin A4 & Pin A5)
  Wire.begin();
  Wire.setClock(400000); // 400 kHz Fast-Mode untuk pembacaan sudut gyro cepat

  // Proteksi I2C Timeout pada Arduino Uno (Mencegah hang saat terjadi noise busi)
  #if defined(WIRE_HAS_TIMEOUT)
    Wire.setWireTimeout(3000, true); // Timeout 3ms dengan auto-reset bus
  #endif

  if (!myMPU9250.init()) {
    Serial.println(F("[ERROR] Sensor MPU9250 tidak terdeteksi di Terminal A4/A5!"));
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("ERR: MPU SENSOR!");
    lcd.setCursor(0, 1);
    lcd.print("CEK PIN A4 & A5");
    while (1) {
      digitalWrite(PIN_RELAY_BUZZER, RELAY_ON);
      delay(200);
      digitalWrite(PIN_RELAY_BUZZER, RELAY_OFF);
      delay(800);
    }
  }

  // Kalibrasi Nol Otomatis (Sepeda motor harus berhenti tenang di jalan datar)
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("KALIBRASI MPU...");
  lcd.setCursor(0, 1);
  lcd.print("JANGAN GERAKKAN!");
  delay(800);

  myMPU9250.autoOffsets();
  myMPU9250.enableGyrDLPF();
  myMPU9250.setGyrDLPF(MPU9250_DLPF_6); // Filter harmonik mesin CVT
  myMPU9250.setSampleRateDivider(5);
  myMPU9250.setGyrRange(MPU9250_GYRO_RANGE_250);
  myMPU9250.setAccRange(MPU9250_ACC_RANGE_2G);

  xyzFloat accRaw = myMPU9250.getGValues();
  pitchAngle = atan2(-accRaw.x, sqrt(accRaw.y * accRaw.y + accRaw.z * accRaw.z)) * 180.0 / PI;

  a_dasar = (V_MS * V_MS) / (2.0 * S_DIST); // 0.31 m/s^2

  prevTime = millis();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SISTEM SIAP!");
  lcd.setCursor(0, 1);
  lcd.print("D4:LCD | A4:MPU");
  delay(1200);
  lcd.clear();
}

// ----------------------------------------------------------------------------
// 5. LOOP UTAMA (BEBAS INTERFERENSI DATA)
// ----------------------------------------------------------------------------
void loop() {
  unsigned long currentTime = millis();
  float dt = (currentTime - prevTime) / 1000.0;
  prevTime = currentTime;

  if (dt <= 0.0 || dt > 0.2) dt = 0.01;

  // 1. Baca Sensor MPU9250 dari Bus Hardware Cepat (A4 & A5)
  xyzFloat gyr = myMPU9250.getGyrValues();
  xyzFloat acc = myMPU9250.getGValues();

  float gyroPitchRate = gyr.y;
  float accelPitch = atan2(-acc.x, sqrt(acc.y * acc.y + acc.z * acc.z)) * 180.0 / PI;

  // 2. Complementary Filter: 98% Gyro + 2% Accel
  pitchAngle = ALPHA * (pitchAngle + gyroPitchRate * dt) + (1.0 - ALPHA) * accelPitch;

  // 3. Konversi Kemiringan: Grade (%) = tan(pitch_radian) * 100
  float pitchRadian = pitchAngle * PI / 180.0;
  gradePercent = tan(pitchRadian) * 100.0;

  // 4. Hitung Fisika Pengereman Turunan
  float g_desimal = (pitchAngle < 0.0) ? (abs(gradePercent) / 100.0) : 0.0;
  g_dorong = G_ACCEL * g_desimal;
  a_rem = a_dasar + g_dorong;

  // 5. Logika Histeresis & Debounce Relay Engine Brake
  if (pitchAngle <= THRESHOLD_PITCH_ON) {
    if (!isDebouncing && !relayState) {
      isDebouncing = true;
      declineStartTime = currentTime;
    } else if (isDebouncing && !relayState) {
      if (currentTime - declineStartTime >= DEBOUNCE_TIME_MS) {
        relayState = true;
        isDebouncing = false;
        // AKTIFKAN RELAY 1 (D6) & RELAY 2 (D7)
        digitalWrite(PIN_RELAY_TPS, RELAY_ON);
        digitalWrite(PIN_RELAY_BUZZER, RELAY_ON);

        Serial.print(F("[CVT BRAKE ON] Pitch: "));
        Serial.print(pitchAngle, 1);
        Serial.print(F(" deg ("));
        Serial.print(gradePercent, 1);
        Serial.print(F("%) | a_rem: "));
        Serial.print(a_rem, 2);
        Serial.println(F(" m/s^2 -> RELAY ON (RPM 2500)"));
      }
    }
  } else if (pitchAngle > THRESHOLD_PITCH_OFF) {
    isDebouncing = false;
    if (relayState) {
      relayState = false;
      digitalWrite(PIN_RELAY_TPS, RELAY_OFF);
      digitalWrite(PIN_RELAY_BUZZER, RELAY_OFF);
      Serial.println(F("[CVT BRAKE OFF] Pitch > -3.5 deg -> RELAY OFF (NORMAL IDLE)"));
    }
  } else {
    isDebouncing = false;
  }

  // 6. Refresh LCD pada Terminal Terpisah (D4 & D5) secara Non-Blocking
  if (currentTime - lastLcdUpdate >= LCD_INTERVAL_MS) {
    lastLcdUpdate = currentTime;
    updateLcdDisplay();
  }

  delay(10);
}

// ----------------------------------------------------------------------------
// 6. FUNGSI TAMPILAN LCD 16X2 (TERMINAL D4 & D5)
// ----------------------------------------------------------------------------
void updateLcdDisplay() {
  // BARIS 1: Menampilkan Derajat & Persentase Kemiringan
  // Format: "P:-05.0° G:-8.7% " (16 Karakter Pas)
  lcd.setCursor(0, 0);
  lcd.print("P:");
  if (pitchAngle >= 0.0) lcd.print("+");
  lcd.print(pitchAngle, 1);
  lcd.write(0); // Karakter derajat °
  lcd.print(" G:");
  if (gradePercent >= 0.0) lcd.print("+");
  lcd.print(gradePercent, 1);
  lcd.print("%  ");

  // BARIS 2: Status Relay & Keterangan RPM 2500
  // Format: "RELAY ON:2500RPM" atau "RELAY OFF:NORMAL"
  lcd.setCursor(0, 1);
  if (relayState) {
    lcd.print("RELAY ON:2500RPM");
  } else {
    lcd.print("RELAY OFF:NORMAL");
  }
}
`;
