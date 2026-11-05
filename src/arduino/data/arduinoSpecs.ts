export interface ComponentSpec {
  id: string;
  designator: string;
  name: string;
  category: 'mcu' | 'power' | 'connector' | 'passive' | 'io';
  packageType: string;
  summary: string;
  specs: Record<string, string>;
  position: [number, number, number]; // Board local X, Y, Z
  explodeHeight: number;
  cameraOffset: [number, number, number];
}

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// 1 unit = 10 mm
export const BOARD_WIDTH = 6.86;  // 68.6 mm
export const BOARD_DEPTH = 5.34;  // 53.4 mm
export const BOARD_THICKNESS = 0.16; // 1.6 mm
export const TEX_WIDTH = 2048;
export const TEX_HEIGHT = 1536;

/**
 * Converts board 3D world coordinates (x in [-BOARD_WIDTH/2, BOARD_WIDTH/2], z in [-BOARD_DEPTH/2, BOARD_DEPTH/2])
 * into normalized UV coordinates [u, v] in [0, 1] and 2D canvas pixel coordinates [px, py].
 */
export function worldToCanvas(
  x: number,
  z: number,
  width = TEX_WIDTH,
  height = TEX_HEIGHT
): { u: number; v: number; px: number; py: number } {
  const u = (x + BOARD_WIDTH / 2) / BOARD_WIDTH;
  const v = (z + BOARD_DEPTH / 2) / BOARD_DEPTH;
  return {
    u: Math.max(0, Math.min(1, u)),
    v: Math.max(0, Math.min(1, v)),
    px: u * width,
    py: v * height,
  };
}

/**
 * Converts a physical board dimension in 3D units to canvas pixels along X or Z.
 */
export function sizeToCanvas(
  dx: number,
  dz: number,
  width = TEX_WIDTH,
  height = TEX_HEIGHT
): { pw: number; ph: number } {
  return {
    pw: (dx / BOARD_WIDTH) * width,
    ph: (dz / BOARD_DEPTH) * height,
  };
}

/**
 * Calculates smoothed exploded-view Y offset for a component given normalized explosion factor [0, 1].
 */
export function calculateExplodedOffset(explodeHeight: number, factor: number): number {
  const clamped = Math.max(0, Math.min(1, factor));
  return explodeHeight * clamped;
}

export const MOUNTING_HOLES: Array<[number, number]> = [
  [-BOARD_WIDTH / 2 + 1.40, -BOARD_DEPTH / 2 + 0.28], // Top-left near ICSP1
  [-BOARD_WIDTH / 2 + 1.52, BOARD_DEPTH / 2 - 0.28],  // Bottom-left between DC Jack and Power header
  [BOARD_WIDTH / 2 - 0.62, -BOARD_DEPTH / 2 + 1.42],  // Upper-right near digital 8 / ICSP
  [BOARD_WIDTH / 2 - 0.62, BOARD_DEPTH / 2 - 0.72],   // Lower-right above A5
];

// Camera presets — 'reference' matches the exact perspective and framing of image.png
export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'reference',
    label: 'Reference Angle',
    position: [-0.48, 7.25, 6.05],
    target: [-0.32, 0.02, 0.08],
    fov: 35,
  },
  {
    id: 'top',
    label: 'Top Silkscreen',
    position: [0.0, 8.2, 0.01],
    target: [0.0, 0.0, 0.0],
    fov: 34,
  },
  {
    id: 'mcu',
    label: 'ATmega328P Macro',
    position: [1.35, 3.1, 2.65],
    target: [1.15, 0.25, 0.32],
    fov: 30,
  },
  {
    id: 'power',
    label: 'USB & Power Stage',
    position: [-3.6, 3.4, 2.8],
    target: [-1.65, 0.25, 0.45],
    fov: 32,
  },
  {
    id: 'isometric',
    label: 'Studio Isometric',
    position: [4.8, 4.4, 5.2],
    target: [0.0, 0.1, 0.0],
    fov: 34,
  },
];

export const ARDUINO_COMPONENTS: ComponentSpec[] = [
  {
    id: 'atmega328p',
    designator: 'U1',
    name: 'ATMEGA328P-PU Microcontroller',
    category: 'mcu',
    packageType: '28-Pin PDIP (Socketed)',
    summary: 'High-performance 8-bit AVR RISC microcontroller with 32KB ISP Flash, mounted in a removable 28-pin dual-in-line socket.',
    specs: {
      Architecture: '8-bit AVR RISC',
      'Clock Speed': '16 MHz',
      'Flash Memory': '32 KB (0.5 KB Bootloader)',
      SRAM: '2 KB',
      EEPROM: '1 KB',
      'Operating Voltage': '5.0 V',
      'Date Code': 'ATMEL 1121',
    },
    position: [1.18, 0.35, 0.26],
    explodeHeight: 1.85,
    cameraOffset: [1.2, 2.8, 2.5],
  },
  {
    id: 'dip_socket',
    designator: 'XU1',
    name: '28-Pin DIP IC Socket',
    category: 'connector',
    packageType: 'Through-Hole 0.3" Pitch',
    summary: 'Precision dual-wipe tin-plated phosphor bronze contact socket allowing tool-free replacement of the ATmega328P.',
    specs: {
      Positions: '28 (2 × 14)',
      'Row Spacing': '7.62 mm (0.300")',
      'Pin Pitch': '2.54 mm (0.100")',
      'Contact Plating': 'Matte Tin over Nickel',
      Insulator: 'Glass-filled PBT (UL94V-0)',
    },
    position: [1.18, 0.16, 0.26],
    explodeHeight: 0.75,
    cameraOffset: [1.2, 2.8, 2.5],
  },
  {
    id: 'atmega16u2',
    designator: 'U3',
    name: 'ATmega16U2 USB-to-Serial Bridge',
    category: 'mcu',
    packageType: '32-Lead QFN / TQFP (5×5 mm)',
    summary: 'Dedicated USB 2.0 full-speed microcontroller programmed as a CDC serial converter between the USB Type-B port and ATmega328P UART.',
    specs: {
      Function: 'USB-to-TTL Serial Bridge',
      'Flash Memory': '16 KB',
      Marking: 'MEGA16U2 0928 PH 9F3451',
      Interface: 'USB 2.0 Full Speed (12 Mbps)',
      Crystal: '16 MHz Shared/Ceramic',
    },
    position: [-1.08, 0.14, -0.96],
    explodeHeight: 1.15,
    cameraOffset: [-1.1, 2.4, -0.1],
  },
  {
    id: 'usb_b',
    designator: 'X1',
    name: 'USB Type-B Receptacle',
    category: 'connector',
    packageType: 'Through-Hole Right-Angle Shielded',
    summary: 'Full-size USB Type-B female connector providing 5V USB bus power, firmware upload, and serial communication.',
    specs: {
      Standard: 'USB 2.0 Type-B Female',
      Contacts: '4 Gold-Plated Pins',
      Shielding: 'Stamped Nickel-Plated Steel',
      'Max Current': '500 mA (Polyfuse Protected)',
    },
    position: [-2.85, 0.56, -1.18],
    explodeHeight: 1.05,
    cameraOffset: [-3.4, 2.8, 0.2],
  },
  {
    id: 'dc_jack',
    designator: 'J1',
    name: 'DC Barrel Power Jack (2.1×5.5mm)',
    category: 'connector',
    packageType: 'Through-Hole Right-Angle High-Current',
    summary: 'External regulated or unregulated DC input jack (center-positive) feeding the onboard M7 reverse-protection diode and 5V LDO regulator.',
    specs: {
      'Pin Diameter': '2.1 mm Center Positive',
      'Barrel Outer': '5.5 mm',
      'Input Range': '7 V – 12 V (Recommended)',
      'Abs Limits': '6 V – 20 V',
      Termination: '3 Heavy-Duty Solder Tabs',
    },
    position: [-2.82, 0.58, 1.52],
    explodeHeight: 0.95,
    cameraOffset: [-3.5, 2.7, 2.6],
  },
  {
    id: 'caps_47uf',
    designator: 'C1 / C2',
    name: '47µF 25V SMD Electrolytic Capacitors',
    category: 'passive',
    packageType: 'SMD Aluminum Can (6.3×7.7 mm)',
    summary: 'Dual low-ESR surface-mount aluminum electrolytic bulk decoupling capacitors smoothing the VIN and +5V power rails.',
    specs: {
      Capacitance: '47 µF ±20%',
      'Voltage Rating': '25 V DC',
      'Lot Code': '80036',
      Configuration: 'VIN Input & +5V Output Bulk Filter',
    },
    position: [-0.88, 0.42, 1.48],
    explodeHeight: 1.35,
    cameraOffset: [-0.9, 2.5, 2.7],
  },
  {
    id: 'crystal_16mhz',
    designator: 'Y1',
    name: '16.000 MHz Quartz Crystal Oscillator',
    category: 'passive',
    packageType: 'HC-49/S SMD Metal Can',
    summary: 'Precision 16 MHz fundamental-mode quartz crystal reference clock driving the USB interface and timing subsystem.',
    specs: {
      Frequency: '16.000 MHz',
      Tolerance: '±30 ppm',
      'Load Capacitance': '18 pF',
      Enclosure: 'Hermetic Seam-Welded Nickel Can',
    },
    position: [-1.18, 0.22, -0.14],
    explodeHeight: 1.25,
    cameraOffset: [-1.2, 2.4, 1.1],
  },
  {
    id: 'vreg_5v',
    designator: 'U2',
    name: 'NCP1117ST50T3G 5V LDO Regulator',
    category: 'power',
    packageType: 'SOT-223 (4-Lead)',
    summary: 'Low-dropout linear voltage regulator stepping down external VIN (7–12V) to a regulated +5.0V rail up to 1.0A.',
    specs: {
      'Output Voltage': '5.0 V ±1%',
      'Max Output Current': '1.0 A',
      'Dropout Voltage': '1.2 V @ 800mA',
      'Package Marking': 'C5 FD10',
    },
    position: [-2.32, 0.16, 0.58],
    explodeHeight: 1.1,
    cameraOffset: [-2.3, 2.3, 1.8],
  },
  {
    id: 'opamp_lmv358',
    designator: 'U5',
    name: 'LMV358IDGKR Dual Rail-to-Rail Op-Amp',
    category: 'power',
    packageType: 'SOIC-8 / VSSOP-8',
    summary: 'Comparator and buffer IC managing automatic power source selection between USB (+5V) and external VIN/DC jack, plus driving the Pin 13 LED.',
    specs: {
      Marking: '7CTI R5R',
      Channels: 'Dual Operational Amplifier',
      Function: 'Auto Power Switching & L-LED Buffer',
      Supply: '2.7 V – 5.5 V',
    },
    position: [-1.18, 0.14, 0.46],
    explodeHeight: 1.15,
    cameraOffset: [-1.2, 2.3, 1.6],
  },
  {
    id: 'polyfuse',
    designator: 'F1',
    name: '500mA PPTC Resettable Polyfuse',
    category: 'power',
    packageType: 'SMD 1812 Gold-Cap',
    summary: 'Polymer positive temperature coefficient (PPTC) resettable fuse protecting the host computer USB port from overcurrent (>500mA).',
    specs: {
      'Hold Current': '500 mA',
      'Trip Current': '1.0 A',
      Marking: '8 (Gold Body)',
      Reset: 'Automatic Thermal Recovery',
    },
    position: [-2.55, 0.13, -0.25],
    explodeHeight: 1.0,
    cameraOffset: [-2.5, 2.3, 0.8],
  },
  {
    id: 'headers_digital',
    designator: 'J_DIG',
    name: 'Digital I/O & PWM Female Headers (D0–D13)',
    category: 'io',
    packageType: '2.54mm Pitch (10-Pin + 8-Pin)',
    summary: 'Standard 0.1" female header banks exposing Digital Pins 0–13 (6 hardware PWM channels), AREF, GND, and I2C (SDA/SCL).',
    specs: {
      'Digital Pins': '14 (D0 – D13)',
      'PWM Channels': '6 (Pins 3, 5, 6, 9, 10, 11)',
      'UART Pins': 'D0 (RX), D1 (TX)',
      'Pin Current': '20 mA Recommended (40 mA Max)',
    },
    position: [0.45, 0.42, -2.38],
    explodeHeight: 1.45,
    cameraOffset: [0.45, 3.2, -0.5],
  },
  {
    id: 'headers_bottom',
    designator: 'J_PWR / J_ANA',
    name: 'Power & Analog In Female Headers (A0–A5)',
    category: 'io',
    packageType: '2.54mm Pitch (8-Pin + 6-Pin)',
    summary: '8-position Power header (IOREF, RESET, 3.3V, 5V, GND, Vin) and 6-position 10-bit SAR ADC Analog Input header (A0–A5).',
    specs: {
      'Analog Inputs': '6 Channels (A0 – A5)',
      'ADC Resolution': '10-bit (0 – 1023 steps)',
      'Power Rails': '3.3V (150mA), 5V, GND ×2, Vin',
      Control: 'IOREF, RESET',
    },
    position: [0.85, 0.42, 2.38],
    explodeHeight: 1.45,
    cameraOffset: [0.85, 3.0, 4.0],
  },
  {
    id: 'icsp_headers',
    designator: 'ICSP / ICSP1',
    name: 'Dual 2×3 ICSP Programming Headers',
    category: 'io',
    packageType: '2×3 Male Shrouded/Unshrouded Pin Header',
    summary: 'In-Circuit Serial Programming (SPI: MISO, MOSI, SCK, RESET, VCC, GND) headers for direct bootloader flashing of both ATmega328P and ATmega16U2.',
    specs: {
      Protocol: 'SPI / AVR ISP',
      Pinout: 'MISO, +5V, SCK, MOSI, RESET, GND',
      Targets: 'ICSP (ATmega328P) & ICSP1 (ATmega16U2)',
    },
    position: [2.85, 0.38, -0.52],
    explodeHeight: 1.35,
    cameraOffset: [2.8, 2.6, 1.2],
  },
];

export function getComponentById(id: string | null): ComponentSpec | undefined {
  if (!id) return undefined;
  return ARDUINO_COMPONENTS.find((c) => c.id === id);
}

export function filterComponentsByCategory(category: ComponentSpec['category'] | 'all'): ComponentSpec[] {
  if (category === 'all') return ARDUINO_COMPONENTS;
  return ARDUINO_COMPONENTS.filter((c) => c.category === category);
}
