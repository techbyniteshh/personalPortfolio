import test from 'node:test';
import assert from 'node:assert/strict';
import { QualityController, QUALITY_CONFIGS } from './qualityController.ts';

test('QualityController initializes correctly with defaults', () => {
  const qc = new QualityController('auto');
  assert.equal(qc.getMode(), 'auto');
  assert.equal(qc.getActiveQuality(), 'high');
  assert.equal(qc.getConfig().pixelRatioCap, 1.5);
  assert.equal(qc.getConfig().shadowsEnabled, true);
});

test('QualityController manual mode locks quality', () => {
  const qc = new QualityController('performance');
  assert.equal(qc.getMode(), 'performance');
  assert.equal(qc.getActiveQuality(), 'performance');
  assert.equal(qc.getConfig().shadowsEnabled, false);
  assert.equal(qc.getConfig().pixelRatioCap, 0.9);

  // Even with many fast frames, it should not adapt in manual mode
  for (let i = 0; i < 60; i++) {
    const changed = qc.recordFrame(5.0, 10000 + i * 16);
    assert.equal(changed, false);
  }
  assert.equal(qc.getActiveQuality(), 'performance');
});

test('QualityController downgrades from high to balanced on sustained low FPS', () => {
  let notifiedTier = '';
  const qc = new QualityController('auto', (q) => {
    notifiedTier = q;
  });

  // Feed 24 frames of 30ms (>25ms threshold) - not enough samples yet (<25)
  for (let i = 0; i < 24; i++) {
    const changed = qc.recordFrame(30.0, 5000 + i * 16);
    assert.equal(changed, false);
  }

  // 25th frame reaches sample threshold, cooldown passes
  const changed = qc.recordFrame(30.0, 10000);
  assert.equal(changed, true);
  assert.equal(qc.getActiveQuality(), 'balanced');
  assert.equal(notifiedTier, 'balanced');
  assert.equal(qc.getConfig().shadowMapSize, 512);
});

test('QualityController downgrades from balanced to performance', () => {
  const qc = new QualityController('auto');
  // First downgrade to balanced at t = 5000
  for (let i = 0; i < 30; i++) {
    qc.recordFrame(32.0, 5000 + i * 16);
  }
  assert.equal(qc.getActiveQuality(), 'balanced');

  // Cooldown is 3500ms. If another spike occurs before cooldown, no downgrade yet
  for (let i = 0; i < 30; i++) {
    const changed = qc.recordFrame(35.0, 6000 + i * 16);
    assert.equal(changed, false);
  }
  assert.equal(qc.getActiveQuality(), 'balanced');

  // After cooldown passes (t = 10000), downgrades to performance
  for (let i = 0; i < 30; i++) {
    qc.recordFrame(35.0, 10000 + i * 16);
  }
  assert.equal(qc.getActiveQuality(), 'performance');
  assert.equal(qc.getConfig().shadowsEnabled, false);
});

test('QualityController upgrades from performance to balanced with hysteresis', () => {
  const qc = new QualityController('auto');
  // Force to performance
  qc.setMode('performance', 1000);
  qc.setMode('auto', 1000);
  // Simulate downgrade to performance
  for (let i = 0; i < 30; i++) qc.recordFrame(35.0, 5000 + i * 16);
  for (let i = 0; i < 30; i++) qc.recordFrame(35.0, 10000 + i * 16);
  assert.equal(qc.getActiveQuality(), 'performance');

  // Now simulate high performance (<14ms, e.g. 8ms). Upgrade cooldown is 6000ms.
  // Feed frames of 8.0ms at t >= 18000. It should upgrade to balanced once the rolling average crosses under 14ms.
  let upgraded = false;
  for (let i = 0; i < 60; i++) {
    const changed = qc.recordFrame(8.0, 18000 + i * 16);
    if (changed) {
      upgraded = true;
      break;
    }
  }

  assert.equal(upgraded, true);
  assert.equal(qc.getActiveQuality(), 'balanced');
});

test('QualityController calculates DPR accurately per tier', () => {
  const qc = new QualityController('high');
  // High capped at 1.5
  assert.equal(qc.getCalculatedPixelRatio(1.0), 1.0);
  assert.equal(qc.getCalculatedPixelRatio(2.0), 1.5);
  assert.equal(qc.getCalculatedPixelRatio(3.0), 1.5);

  qc.setMode('balanced');
  // Balanced capped at 1.15
  assert.equal(qc.getCalculatedPixelRatio(1.0), 1.0);
  assert.equal(qc.getCalculatedPixelRatio(1.5), 1.15);
  assert.equal(qc.getCalculatedPixelRatio(2.0), 1.15);

  qc.setMode('performance');
  // Performance capped at 0.9
  assert.equal(qc.getCalculatedPixelRatio(1.0), 0.9);
  assert.equal(qc.getCalculatedPixelRatio(2.0), 0.9);
});
