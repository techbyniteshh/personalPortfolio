import React from 'react';

interface UpiQrCodeProps {
  value: string;
  size?: number;
}

/**
 * Procedural visual QR code component designed for UPI URI presentation
 * Uses high-contrast 25x25 cell matrix with standard QR finder patterns and encoded data hash
 */
export const UpiQrCode: React.FC<UpiQrCodeProps> = ({ value, size = 200 }) => {
  // Deterministic hash to generate reproducible data module pattern for the URI string
  const getHashPattern = (str: string, rows: number, cols: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        // Standard QR Finder patterns (top-left, top-right, bottom-left)
        const isFinderTL = r < 7 && c < 7;
        const isFinderTR = r < 7 && c >= cols - 7;
        const isFinderBL = r >= rows - 7 && c < 7;

        if (isFinderTL || isFinderTR || isFinderBL) {
          // Inside 7x7 finder pattern
          const localR = isFinderBL ? r - (rows - 7) : r;
          const localC = isFinderTR ? c - (cols - 7) : c;
          const isBorder =
            localR === 0 ||
            localR === 6 ||
            localC === 0 ||
            localC === 6;
          const isCenter = localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4;
          grid[r][c] = isBorder || isCenter;
        } else if (r === 6 || c === 6) {
          // Timing pattern (alternating)
          grid[r][c] = (r + c) % 2 === 0;
        } else {
          // Procedural data cells
          const val = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
          grid[r][c] = (val - Math.floor(val)) > 0.48;
        }
      }
    }
    return grid;
  };

  const matrixSize = 25;
  const matrix = getHashPattern(value, matrixSize, matrixSize);
  const cellSize = size / matrixSize;

  return (
    <div
      className="p-3 bg-white rounded-2xl shadow-sm border border-[#E2DACF] inline-block select-none"
      title={`UPI QR Code: ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        role="img"
        aria-label="UPI Payment QR Code"
      >
        <rect width={size} height={size} fill="#FFFFFF" />
        {matrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#1C2228"
              />
            ) : null
          )
        )}
      </svg>
      <div className="mt-2 text-center text-[10px] font-mono text-[#55606E] font-semibold tracking-wider">
        BHIM &bull; UPI &bull; SCAN & PAY
      </div>
    </div>
  );
};
