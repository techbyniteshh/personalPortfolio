export type RenderQuality = 'high' | 'balanced' | 'performance';
export type QualityMode = 'auto' | RenderQuality;

export interface QualityConfig {
  pixelRatioCap: number;
  shadowMapSize: number;
  shadowsEnabled: boolean;
  anisotropy: number;
  label: string;
}

export const QUALITY_CONFIGS: Record<RenderQuality, QualityConfig> = {
  high: {
    pixelRatioCap: 1.5,
    shadowMapSize: 1024,
    shadowsEnabled: true,
    anisotropy: 4,
    label: 'High Quality',
  },
  balanced: {
    pixelRatioCap: 1.15,
    shadowMapSize: 512,
    shadowsEnabled: true,
    anisotropy: 2,
    label: 'Balanced',
  },
  performance: {
    pixelRatioCap: 0.9,
    shadowMapSize: 256,
    shadowsEnabled: false,
    anisotropy: 1,
    label: 'Performance (Eco)',
  },
};

export class QualityController {
  private mode: QualityMode;
  private currentQuality: RenderQuality;
  private onQualityChange?: (quality: RenderQuality) => void;

  // Frame timing analysis
  private frameTimes: number[] = [];
  private readonly maxSamples = 60;
  private lastTierChangeTime = 0;
  private readonly downgradeCooldownMs = 3500;
  private readonly upgradeCooldownMs = 6000;

  // Thresholds (ms per frame)
  // 25ms corresponds to ~40 FPS
  private readonly downgradeThresholdMs = 25.0;
  // 14ms corresponds to ~71 FPS
  private readonly upgradeThresholdMs = 14.0;

  constructor(
    initialMode: QualityMode = 'auto',
    onQualityChange?: (quality: RenderQuality) => void
  ) {
    this.mode = initialMode;
    this.currentQuality = initialMode === 'auto' ? 'high' : initialMode;
    this.onQualityChange = onQualityChange;
  }

  public getMode(): QualityMode {
    return this.mode;
  }

  public getActiveQuality(): RenderQuality {
    return this.currentQuality;
  }

  public getConfig(): QualityConfig {
    return QUALITY_CONFIGS[this.currentQuality];
  }

  public setMode(newMode: QualityMode, now = performance.now()): boolean {
    if (this.mode === newMode) return false;
    this.mode = newMode;
    this.frameTimes = [];

    if (newMode !== 'auto') {
      if (this.currentQuality !== newMode) {
        this.currentQuality = newMode;
        this.lastTierChangeTime = now;
        this.onQualityChange?.(this.currentQuality);
        return true;
      }
      return false;
    }

    // Switched to auto: start at high or keep current
    return false;
  }

  public getCalculatedPixelRatio(devicePixelRatio: number): number {
    const dpr = Math.max(1, devicePixelRatio || 1);
    return Math.min(dpr, this.getConfig().pixelRatioCap);
  }

  /**
   * Records the frame render duration and checks if quality adaptation is required.
   * Returns true if a quality tier change occurred.
   */
  public recordFrame(frameDurationMs: number, now = performance.now()): boolean {
    // Only adapt in 'auto' mode
    if (this.mode !== 'auto') return false;

    // Discard anomalies (e.g. background tab wake-up spikes > 250ms)
    if (frameDurationMs > 250 || frameDurationMs <= 0) return false;

    this.frameTimes.push(frameDurationMs);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }

    // Require at least 25 samples before making tier adjustment decisions
    if (this.frameTimes.length < 25) return false;

    const avg =
      this.frameTimes.reduce((acc, t) => acc + t, 0) / this.frameTimes.length;

    const timeSinceLastChange = now - this.lastTierChangeTime;

    // DOWNGRADE CHECK: Sustained frame duration > 25ms (<40 FPS)
    if (avg > this.downgradeThresholdMs && timeSinceLastChange > this.downgradeCooldownMs) {
      if (this.currentQuality === 'high') {
        this.currentQuality = 'balanced';
        this.lastTierChangeTime = now;
        this.frameTimes = [];
        this.onQualityChange?.(this.currentQuality);
        return true;
      } else if (this.currentQuality === 'balanced') {
        this.currentQuality = 'performance';
        this.lastTierChangeTime = now;
        this.frameTimes = [];
        this.onQualityChange?.(this.currentQuality);
        return true;
      }
    }

    // UPGRADE CHECK: Sustained frame duration < 14ms (>71 FPS) with hysteresis & full sample window
    if (
      this.frameTimes.length >= 45 &&
      avg < this.upgradeThresholdMs &&
      timeSinceLastChange > this.upgradeCooldownMs
    ) {
      if (this.currentQuality === 'performance') {
        this.currentQuality = 'balanced';
        this.lastTierChangeTime = now;
        this.frameTimes = [];
        this.onQualityChange?.(this.currentQuality);
        return true;
      } else if (this.currentQuality === 'balanced') {
        this.currentQuality = 'high';
        this.lastTierChangeTime = now;
        this.frameTimes = [];
        this.onQualityChange?.(this.currentQuality);
        return true;
      }
    }

    return false;
  }

  public resetStats(): void {
    this.frameTimes = [];
  }
}

