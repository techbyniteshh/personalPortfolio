import * as THREE from 'three';
import {
  BOARD_WIDTH,
  BOARD_DEPTH,
  TEX_WIDTH,
  TEX_HEIGHT,
  MOUNTING_HOLES,
  worldToCanvas,
  sizeToCanvas,
} from '../data/arduinoSpecs';

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d')!;
  return [cv, ctx];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generates the high-resolution top PCB solder mask, etched copper traces, gold/silver vias,
 * SMD pads, and crisp white silkscreen matching the reference Arduino UNO R3 image.
 */
export function createPCBTopTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(TEX_WIDTH, TEX_HEIGHT);
  const W = TEX_WIDTH;
  const H = TEX_HEIGHT;

  // 1. Base dark teal substrate / etched isolation color
  ctx.fillStyle = '#004246';
  ctx.fillRect(0, 0, W, H);

  // 2. Large copper pour planes under rich teal solder mask (#006e73)
  ctx.fillStyle = '#006e73';
  ctx.fillRect(24, 24, W - 48, H - 48);

  // Subtle fiberglass weave texture
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // Helper to draw a copper trace in world coordinates (with dark isolation border + lighter teal copper top)
  const drawTraceWorld = (points: Array<[number, number]>, widthUnits = 0.055) => {
    if (points.length < 2) return;
    const pxWidth = (widthUnits / BOARD_WIDTH) * W;

    // Etched dark channel around trace
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#003d41';
    ctx.lineWidth = pxWidth + 6;
    ctx.beginPath();
    points.forEach(([wx, wz], idx) => {
      const { px, py } = worldToCanvas(wx, wz, W, H);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Raised lighter teal copper trace under solder mask
    ctx.strokeStyle = '#158e93';
    ctx.lineWidth = pxWidth;
    ctx.beginPath();
    points.forEach(([wx, wz], idx) => {
      const { px, py } = worldToCanvas(wx, wz, W, H);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  };

  // Helper to draw a plated via in world coordinates
  const drawViaWorld = (wx: number, wz: number, rUnits = 0.042) => {
    const { px, py } = worldToCanvas(wx, wz, W, H);
    const r = (rUnits / BOARD_WIDTH) * W;
    ctx.save();
    // Outer copper pad under mask
    ctx.fillStyle = '#20aeb3';
    ctx.beginPath();
    ctx.arc(px, py, r * 1.45, 0, Math.PI * 2);
    ctx.fill();
    // Exposed tinned/gold ring
    ctx.fillStyle = '#b8c4c8';
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
    // Drill hole center
    ctx.fillStyle = '#00383b';
    ctx.beginPath();
    ctx.arc(px, py, r * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // 3. Draw Realistic Copper Traces matching image.png
  const pPitch = 0.205;

  // Traces from ATMEGA328P bottom pins (z = +0.64) down to Analog In (A0..A5) & Power headers (z = +2.38)
  for (let i = 0; i < 14; i++) {
    const pinX = -0.32 + i * 0.234;
    if (i >= 8) {
      // Right 6 pins route to A0..A5
      const aIdx = i - 8;
      const targetX = 1.62 + aIdx * pPitch;
      drawTraceWorld(
        [
          [pinX, 0.65],
          [pinX, 1.15 + (aIdx % 2) * 0.12],
          [targetX, 1.55],
          [targetX, 2.35],
        ],
        0.048
      );
      drawViaWorld(pinX, 1.15 + (aIdx % 2) * 0.12, 0.032);
    } else {
      // Left 8 pins route to Power rails and middle bus
      const targetX = -0.22 + i * pPitch;
      drawTraceWorld(
        [
          [pinX, 0.65],
          [pinX, 1.05 + (i % 3) * 0.14],
          [targetX, 1.48],
          [targetX, 2.35],
        ],
        0.052
      );
      if (i % 2 === 0) drawViaWorld(pinX, 1.05 + (i % 3) * 0.14, 0.032);
    }
  }

  // Traces from ATMEGA328P top pins (z = -0.12) up across the center logo to Digital pins (z = -2.38)
  for (let i = 0; i < 14; i++) {
    const pinX = -0.32 + i * 0.234;
    const dPinX = i < 6 ? -0.13 + i * pPitch : 1.18 + (i - 6) * pPitch;
    const midZ = -0.45 - (i % 4) * 0.14;
    drawTraceWorld(
      [
        [pinX, -0.12],
        [pinX, midZ],
        [dPinX, midZ - 0.35],
        [dPinX, -2.35],
      ],
      0.044
    );
    if (i % 2 === 1) drawViaWorld(pinX, midZ, 0.03);
  }

  // Traces around Crystal (x = -1.18, z = -0.14), ATmega16U2 (x = -1.08, z = -0.96), and Regulator
  const extraTraces: Array<Array<[number, number]>> = [
    [[-1.65, -0.14], [-1.18, -0.14], [-0.55, -0.14], [-0.32, 0.15]],
    [[-1.85, 0.58], [-1.45, 0.58], [-1.18, 0.46], [-0.65, 0.46]],
    [[-2.35, -0.25], [-1.95, -0.25], [-1.75, -0.65], [-1.35, -0.96]],
    [[-1.08, -0.96], [-0.52, -1.02], [-0.15, -1.02], [0.35, -0.55]],
    [[-1.08, -0.82], [-0.52, -0.82], [-0.12, -0.82], [0.55, -0.35]],
    [[-1.28, 1.48], [-1.28, 0.92], [-0.95, 0.92], [-0.48, 1.48]],
    [[1.45, -1.12], [2.15, -1.12], [2.55, -0.85], [2.85, -0.52]],
    [[-2.55, 0.58], [-2.55, 1.12], [-1.85, 1.12], [-1.28, 1.48]],
    [[-2.15, -1.65], [-1.65, -1.65], [-1.08, -1.25]],
  ];
  extraTraces.forEach((tr) => drawTraceWorld(tr, 0.055));

  // Extra vias scattered realistically across the board like in image.png
  const viaCoords: Array<[number, number]> = [
    [-2.05, -0.62], [-1.85, -0.05], [-1.78, 0.22], [-1.62, 0.88],
    [-0.78, 0.35], [-0.65, 0.65], [-0.45, 0.85], [-0.22, -0.52],
    [0.12, -0.42], [0.48, -0.38], [0.85, -0.45], [1.22, -0.48],
    [1.62, -0.42], [2.02, -0.48], [2.35, -0.78], [2.52, -1.35],
    [1.82, -1.42], [-0.82, -1.68], [-0.58, -1.82], [0.15, 1.35],
    [0.65, 1.42], [1.15, 1.38], [1.75, 1.42], [2.25, 1.42],
  ];
  viaCoords.forEach(([vx, vz]) => drawViaWorld(vx, vz, 0.036));

  // 4. Copper Orange Fiducial Circles (visible at bottom-left (-3.02, +2.38) and top-left (-2.22, -2.35))
  const drawCopperFiducial = (wx: number, wz: number) => {
    const { px, py } = worldToCanvas(wx, wz, W, H);
    ctx.save();
    ctx.fillStyle = '#00484c';
    ctx.beginPath();
    ctx.arc(px, py, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d48b45';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  drawCopperFiducial(-3.04, 2.38);
  drawCopperFiducial(-2.22, -2.38);
  drawCopperFiducial(2.96, -0.05);

  // 5. Mounting Hole Tinned Annular Rings
  MOUNTING_HOLES.forEach(([hx, hz]) => {
    const { px, py } = worldToCanvas(hx, hz, W, H);
    const { pw } = sizeToCanvas(0.24, 0.24, W, H);
    ctx.save();
    ctx.strokeStyle = '#c8d0d4';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(px, py, pw, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#d4a64a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px, py, pw * 1.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // 6. JP2 2x2 Plated Through-Holes (x = -1.42, z = -1.28)
  const jp2Offsets = [
    [-1.51, -1.38],
    [-1.31, -1.38],
    [-1.51, -1.18],
    [-1.31, -1.18],
  ];
  jp2Offsets.forEach(([jx, jz]) => {
    const { px, py } = worldToCanvas(jx, jz, W, H);
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#d4dce0';
    ctx.beginPath();
    ctx.arc(px, py, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#182226';
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. CRISP WHITE SILKSCREEN ARTWORK (Exact match to image.png)
  // ─────────────────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f5fafb';
  ctx.strokeStyle = '#f5fafb';

  // A. Top "DIGITAL (PWM~)" White Ribbon Bar
  {
    const { px: x0, py: y0 } = worldToCanvas(-0.55, -1.76, W, H);
    const { pw, ph } = sizeToCanvas(2.45, 0.21, W, H);
    ctx.save();
    drawRoundedRect(ctx, x0, y0 - ph / 2, pw, ph, 6);
    ctx.fillStyle = '#f5fafb';
    ctx.fill();

    // Cut-out teal text inside ribbon
    ctx.fillStyle = '#007b80';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIGITAL', x0 + 28, y0 + 2);
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('(PWM~)', x0 + 260, y0 + 2);

    // White line extending right from DIGITAL bar toward pin 0
    ctx.strokeStyle = '#f5fafb';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x0 + pw + 8, y0);
    const { px: xEnd } = worldToCanvas(2.68, -1.76, W, H);
    ctx.lineTo(xEnd, y0);
    ctx.stroke();
    ctx.restore();
  }

  // B. Top Digital Pin Labels (AREF, GND white box, 13..8, 7..0, TX->1, RX<-0)
  {
    const topLabelsLeft = ['SCL', 'SDA', 'AREF', 'GND', '13', '12', '~11', '~10', '~9', '8'];
    topLabelsLeft.forEach((label, i) => {
      const wx = -0.95 + i * pPitch;
      const { px, py } = worldToCanvas(wx, -2.02, W, H);
      // Small white tick mark toward header
      ctx.fillStyle = '#f5fafb';
      ctx.fillRect(px - 2, py - 56, 4, 14);

      if (label === 'GND') {
        ctx.save();
        ctx.translate(px, py - 6);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#f5fafb';
        drawRoundedRect(ctx, -38, -18, 82, 36, 4);
        ctx.fill();
        ctx.fillStyle = '#007b80';
        ctx.font = 'bold 26px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GND', 3, 1);
        ctx.restore();
      } else if (label === 'AREF' || label === 'SDA' || label === 'SCL') {
        if (label === 'AREF') {
          ctx.save();
          ctx.translate(px, py - 4);
          ctx.rotate(-Math.PI / 2);
          ctx.fillStyle = '#f5fafb';
          ctx.font = 'bold 25px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AREF', 0, 0);
          ctx.restore();
        }
      } else {
        ctx.save();
        ctx.translate(px, py - 10);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#f5fafb';
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    });

    const topLabelsRight = ['7', '~6', '~5', '4', '~3', '2', 'TX→1', 'RX←0'];
    topLabelsRight.forEach((label, j) => {
      const wx = 1.18 + j * pPitch;
      const { px, py } = worldToCanvas(wx, -2.02, W, H);
      ctx.fillStyle = '#f5fafb';
      ctx.fillRect(px - 2, py - 56, 4, 14);

      ctx.save();
      ctx.translate(px, py - 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#f5fafb';
      ctx.font = label.length > 2 ? 'bold 25px "JetBrains Mono", monospace' : 'bold 28px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  }

  // C. Iconic Arduino Infinity Logo (-)(+) + "ARDUINO" + "UNO" White Badge
  {
    const { px: cx, py: cy } = worldToCanvas(0.32, -1.16, W, H);
    const rRing = 56;
    const ringOffset = 52;

    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 22;

    // Left loop of infinity (-)
    ctx.beginPath();
    ctx.arc(cx - ringOffset, cy, rRing, 0, Math.PI * 2);
    ctx.stroke();

    // Right loop of infinity (+)
    ctx.beginPath();
    ctx.arc(cx + ringOffset, cy, rRing, 0, Math.PI * 2);
    ctx.stroke();

    // Minus sign inside left loop
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - ringOffset - 22, cy - 6, 44, 12);

    // Plus sign inside right loop
    ctx.fillRect(cx + ringOffset - 22, cy - 6, 44, 12);
    ctx.fillRect(cx + ringOffset - 6, cy - 22, 12, 44);

    // Tiny TM next to infinity
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TM', cx + ringOffset + rRing + 8, cy + 42);

    // Bold "ARDUINO" directly below infinity loops
    ctx.font = 'bold 52px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('ARDUINO', cx + 4, cy + rRing + 64);

    // Solid white rounded badge for "UNO" to the right of infinity loops
    const badgeX = cx + ringOffset + rRing + 28;
    const badgeY = cy - 48;
    const badgeW = 248;
    const badgeH = 98;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Cut-out teal "UNO" inside white badge
    ctx.fillStyle = '#007b80';
    ctx.font = 'bold 78px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('UNO', badgeX + badgeW / 2, badgeY + badgeH / 2 + 4);
    ctx.restore();
  }

  // D. LED & Jumper Labels ("JP2", "L", "TX", "RX", "ON", "RESET-EN")
  {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';

    // JP2 vertical label to the left of the 2x2 holes
    const jp2Pos = worldToCanvas(-1.68, -1.28, W, H);
    ctx.save();
    ctx.translate(jp2Pos.px, jp2Pos.py);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('JP2', 0, 0);
    ctx.restore();

    // L, TX, RX labels
    const lPos = worldToCanvas(-0.68, -1.52, W, H);
    ctx.fillText('L', lPos.px - 18, lPos.py + 8);

    const txPos = worldToCanvas(-0.68, -1.02, W, H);
    ctx.fillText('TX', txPos.px - 34, txPos.py + 8);

    const rxPos = worldToCanvas(-0.68, -0.82, W, H);
    ctx.fillText('RX', rxPos.px - 34, rxPos.py + 8);

    // ON label to the right of ON LED
    const onPos = worldToCanvas(2.26, -1.12, W, H);
    ctx.fillText('ON', onPos.px + 10, onPos.py + 10);

    // RESET-EN vertical label
    const rstEn = worldToCanvas(-0.28, -0.18, W, H);
    ctx.save();
    ctx.translate(rstEn.px, rstEn.py);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RESET-EN', 0, 0);
    ctx.restore();

    // Voltage regulator pin numbers 1, 2, 3
    [0.42, 0.58, 0.74].forEach((pz, idx) => {
      const pPos = worldToCanvas(-1.92, pz, W, H);
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(String(idx + 1), pPos.px, pPos.py + 6);
    });
    ctx.restore();
  }

  // E. Bottom "POWER" and "ANALOG IN" White Ribbon Bars & Pin Legends
  {
    // POWER white ribbon bar (x from +0.25 to +1.28, z = +1.72)
    const pwrStart = worldToCanvas(0.18, 1.66, W, H);
    const pwrSize = sizeToCanvas(1.12, 0.21, W, H);
    ctx.save();
    // White line extending left from POWER ribbon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const pwrLineLeft = worldToCanvas(-0.18, 1.66, W, H);
    ctx.moveTo(pwrLineLeft.px, pwrStart.py);
    ctx.lineTo(pwrStart.px, pwrStart.py);
    ctx.stroke();

    drawRoundedRect(ctx, pwrStart.px, pwrStart.py - pwrSize.ph / 2, pwrSize.pw, pwrSize.ph, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = '#007b80';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POWER', pwrStart.px + pwrSize.pw / 2, pwrStart.py + 2);

    // ANALOG IN white ribbon bar (x from +1.55 to +2.68, z = +1.66)
    const anaStart = worldToCanvas(1.52, 1.66, W, H);
    const anaSize = sizeToCanvas(1.18, 0.21, W, H);
    drawRoundedRect(ctx, anaStart.px, anaStart.py - anaSize.ph / 2, anaSize.pw, anaSize.ph, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = '#007b80';
    ctx.font = 'bold 31px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ANALOG IN', anaStart.px + anaSize.pw / 2, anaStart.py + 2);
    ctx.restore();

    // Vertical pin labels above bottom headers (z = +1.96)
    const powerPinLabels = ['', 'IOREF', 'RESET', '3.3V', '5V', 'GND', 'GND', 'Vin'];
    powerPinLabels.forEach((lbl, i) => {
      if (!lbl) return;
      const wx = -0.22 + i * pPitch;
      const { px, py } = worldToCanvas(wx, 1.98, W, H);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl, 0, 0);
      ctx.restore();
    });

    const analogPinLabels = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
    analogPinLabels.forEach((lbl, i) => {
      const wx = 1.62 + i * pPitch;
      const { px, py } = worldToCanvas(wx, 1.98, W, H);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl, 0, 0);
      ctx.restore();
    });

    // Right-side "ARDUINO" vertical silkscreen near right edge (x = +2.92, z = +1.35)
    const rightLogo = worldToCanvas(2.85, 1.32, W, H);
    ctx.save();
    ctx.translate(rightLogo.px, rightLogo.py);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARD', 0, 0);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a grayscale bump/roughness map so the copper traces and silkscreen ink
 * catch realistic studio specular highlights.
 */
export function createPCBBumpTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(1024, 768);
  const W = 1024;
  const H = 768;

  ctx.fillStyle = '#707070';
  ctx.fillRect(0, 0, W, H);

  // Subtle fiberglass micro-grain
  ctx.strokeStyle = '#808080';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }

  // Raised ridges for traces
  ctx.strokeStyle = '#b5b5b5';
  ctx.lineWidth = 5;
  for (let i = 0; i < 14; i++) {
    const px = 420 + i * 34;
    ctx.beginPath();
    ctx.moveTo(px, 380);
    ctx.lineTo(px, 680);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, 320);
    ctx.lineTo(px, 90);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the bottom PCB solder mask and through-hole solder joints texture.
 */
export function createPCBBottomTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(1024, 768);
  ctx.fillStyle = '#006b70';
  ctx.fillRect(0, 0, 1024, 768);

  ctx.fillStyle = '#007d82';
  ctx.fillRect(30, 30, 964, 708);

  // White rear silkscreen panel
  ctx.fillStyle = '#f0f7f8';
  drawRoundedRect(ctx, 520, 180, 380, 260, 16);
  ctx.fill();

  ctx.fillStyle = '#006b70';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ARDUINO UNO', 555, 250);
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('BOARD MODEL UNO R3', 555, 295);
  ctx.fillText('OPEN-SOURCE HARDWARE', 555, 335);
  ctx.fillText('MADE IN ITALY', 555, 375);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the top surface texture of the ATMEGA328P-PU DIP-28 chip:
 * Matte dark charcoal body, two circular mold marks, and upside-down laser markings
 * ("ATMEL 1121 / ATMEGA328P-PU") matching image.png.
 */
export function createAtmega328Texture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(1024, 256);
  ctx.fillStyle = '#25272a';
  ctx.fillRect(0, 0, 1024, 256);

  // Subtle plastic mold grain
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < 800; i++) {
    ctx.fillRect((i * 73) % 1024, (i * 41) % 256, 3, 3);
  }

  // Two circular ejector pin marks (left and right, as seen in image.png)
  const drawMoldCircle = (cx: number, cy: number, r: number) => {
    ctx.save();
    ctx.fillStyle = '#5c594f';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1b1c1e';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  };
  drawMoldCircle(165, 128, 38);
  drawMoldCircle(865, 128, 38);

  // Upside-down laser-etched markings (rotated 180 deg, matching image.png!)
  ctx.save();
  ctx.translate(512, 128);
  ctx.rotate(Math.PI);

  // Tan/gold-grey laser etch color
  ctx.fillStyle = '#8b8574';
  ctx.strokeStyle = '#8b8574';

  // ATMEL stylized logo on left (which appears on right when rotated 180)
  ctx.font = 'italic bold 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AIMEL', -210, 48);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-215, 58);
  ctx.lineTo(-75, 58);
  ctx.stroke();

  // Date code "1121"
  ctx.font = '500 36px "JetBrains Mono", monospace';
  ctx.fillText('1121', 25, 46);

  // Part number "ATMEGA328P-PU"
  ctx.font = '500 38px "JetBrains Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('ATMEGA328P-PU', -205, -24);

  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the top surface texture of the ATmega16U2 QFN-32 chip.
 */
export function createAtmega16U2Texture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(256, 256);
  ctx.fillStyle = '#1f2226';
  ctx.fillRect(0, 0, 256, 256);

  // Pin 1 laser dot at bottom-left
  ctx.fillStyle = '#8d8675';
  ctx.beginPath();
  ctx.arc(42, 214, 14, 0, Math.PI * 2);
  ctx.fill();

  // Vertical laser markings matching image.png
  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#8d8675';
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.fillText('AIMEL', -85, -45);
  ctx.font = '22px "JetBrains Mono", monospace';
  ctx.fillText('MEGA16U2', -85, -12);
  ctx.fillText('0928 PH', -85, 20);
  ctx.fillText('9F3451', -85, 52);
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the top surface texture of the two 47uF 25V SMD aluminum electrolytic capacitors
 * ("80036 / 47 / 25V" with black negative polarity crescent on the right side).
 */
export function createCapacitorTopTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(512, 512);
  const cx = 256;
  const cy = 256;
  const r = 248;

  // Metallic silver/white circular background
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#f4f6f8');
  grad.addColorStop(0.5, '#e2e6ea');
  grad.addColorStop(1, '#cfd5dc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Black negative polarity crescent on the RIGHT side (+X) of the cap, matching image.png
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Right-side black crescent (from x = 355 to 512)
  ctx.fillStyle = '#181a1d';
  ctx.fillRect(356, 0, 160, 512);

  // Text oriented vertically ("80036 / 47 / 25V") reading bottom-to-top to the left of the black crescent
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#181a1d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 58px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('80036', 0, -138);

  ctx.font = 'bold 112px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('47', 0, -42);

  ctx.font = 'bold 88px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('25V', 0, 54);
  ctx.restore();

  // Outer metallic rim ring
  ctx.strokeStyle = '#9aa2aa';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the SOT-223 Voltage Regulator texture ("C5 / FD10").
 */
export function createRegulatorTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(256, 256);
  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 256, 256);

  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#9c9684';
  ctx.font = 'bold 38px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C5', 0, -28);
  ctx.fillText('FD10', 0, 28);
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the SOIC-8 LMV358 Op-Amp texture ("7CTI / R5R").
 */
export function createOpAmpTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(256, 256);
  ctx.fillStyle = '#202328';
  ctx.fillRect(0, 0, 256, 256);

  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#8b8574';
  ctx.font = 'bold 42px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('7CTI', 0, -22);
  ctx.fillText('R5R', 0, 34);
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the M7 Diode top texture ("M7" + cathode band).
 */
export function createDiodeTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(256, 128);
  ctx.fillStyle = '#222528';
  ctx.fillRect(0, 0, 256, 128);

  // Cathode band on left
  ctx.fillStyle = '#7c786c';
  ctx.fillRect(22, 0, 32, 128);

  ctx.save();
  ctx.translate(150, 64);
  ctx.rotate(Math.PI);
  ctx.fillStyle = '#8d8778';
  ctx.font = 'bold 48px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M7', 0, 0);
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the golden resettable polyfuse texture ("8" marking with gold end-bands).
 */
export function createPolyfuseTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(256, 128);
  ctx.fillStyle = '#b9892c';
  ctx.fillRect(0, 0, 256, 128);

  // Darker center band
  ctx.fillStyle = '#2b251c';
  ctx.fillRect(68, 0, 120, 128);

  // Gold "8" inside center band
  ctx.fillStyle = '#d4a644';
  ctx.font = 'bold 76px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('8', 128, 66);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the front side-wall texture of the 8-pin POWER female header
 * ("IOREF, RESET, 3.3V, 5V, GND, GND, Vin" + "POWER" bar), matching image.png.
 */
export function createPowerHeaderSideTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(1024, 256);
  ctx.fillStyle = '#1b1d20';
  ctx.fillRect(0, 0, 1024, 256);

  const labels = ['', 'IOREF', 'RESET', '3.3V', '5V', 'GND', 'GND', 'Vin'];
  const step = 1024 / 8;

  labels.forEach((lbl, i) => {
    if (!lbl) return;
    const cx = step * i + step / 2;

    if (lbl === 'GND') {
      ctx.save();
      ctx.fillStyle = '#d8dee2';
      drawRoundedRect(ctx, cx - 30, 28, 60, 128, 6);
      ctx.fill();
      ctx.translate(cx, 92);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#1b1d20';
      ctx.font = 'bold 34px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GND', 0, 0);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(cx, 92);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#d8dee2';
      ctx.font = 'bold 32px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl, 0, 0);
      ctx.restore();
    }
  });

  // Bottom white "POWER" bar along header base
  ctx.fillStyle = '#d8dee2';
  ctx.fillRect(step * 1.1, 198, step * 6.7, 42);
  ctx.fillStyle = '#1b1d20';
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POWER', step * 4.4, 220);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the front side-wall texture of the 6-pin ANALOG IN female header
 * ("A0, A1, A2, A3, A4, A5" + "ANALOG IN" bar), matching image.png.
 */
export function createAnalogHeaderSideTexture(maxAnisotropy = 8): THREE.CanvasTexture {
  const [cv, ctx] = createCanvas(768, 256);
  ctx.fillStyle = '#1b1d20';
  ctx.fillRect(0, 0, 768, 256);

  const labels = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
  const step = 768 / 6;

  labels.forEach((lbl, i) => {
    const cx = step * i + step / 2;
    ctx.save();
    ctx.translate(cx, 92);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#d8dee2';
    ctx.font = 'bold 42px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lbl, 0, 0);
    ctx.restore();
  });

  // Bottom white "ANALOG IN" bar along header base
  ctx.fillStyle = '#d8dee2';
  ctx.fillRect(24, 198, 720, 42);
  ctx.fillStyle = '#1b1d20';
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ANALOG IN', 384, 220);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}
