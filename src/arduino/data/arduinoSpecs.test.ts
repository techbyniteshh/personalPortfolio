import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOARD_WIDTH,
  BOARD_DEPTH,
  TEX_WIDTH,
  TEX_HEIGHT,
  worldToCanvas,
  sizeToCanvas,
  calculateExplodedOffset,
  getComponentById,
  filterComponentsByCategory,
  ARDUINO_COMPONENTS,
  CAMERA_PRESETS,
} from './arduinoSpecs.ts';

test('worldToCanvas maps board center (0, 0) to exact texture center', () => {
  const center = worldToCanvas(0, 0);
  assert.equal(center.u, 0.5);
  assert.equal(center.v, 0.5);
  assert.equal(center.px, TEX_WIDTH / 2);
  assert.equal(center.py, TEX_HEIGHT / 2);
});

test('worldToCanvas maps board corners accurately', () => {
  const topLeft = worldToCanvas(-BOARD_WIDTH / 2, -BOARD_DEPTH / 2);
  assert.equal(topLeft.u, 0);
  assert.equal(topLeft.v, 0);
  assert.equal(topLeft.px, 0);
  assert.equal(topLeft.py, 0);

  const bottomRight = worldToCanvas(BOARD_WIDTH / 2, BOARD_DEPTH / 2);
  assert.equal(bottomRight.u, 1);
  assert.equal(bottomRight.v, 1);
  assert.equal(bottomRight.px, TEX_WIDTH);
  assert.equal(bottomRight.py, TEX_HEIGHT);
});

test('sizeToCanvas scales physical 3D dimensions proportionally to texture pixels', () => {
  const full = sizeToCanvas(BOARD_WIDTH, BOARD_DEPTH);
  assert.equal(Math.round(full.pw), TEX_WIDTH);
  assert.equal(Math.round(full.ph), TEX_HEIGHT);
});

test('calculateExplodedOffset clamps factor to [0, 1]', () => {
  assert.equal(calculateExplodedOffset(2.0, 0), 0);
  assert.equal(calculateExplodedOffset(2.0, 0.5), 1.0);
  assert.equal(calculateExplodedOffset(2.0, 1.0), 2.0);
  assert.equal(calculateExplodedOffset(2.0, -0.5), 0);
  assert.equal(calculateExplodedOffset(2.0, 1.8), 2.0);
});

test('component catalog lookup and category filtering work', () => {
  const mcu = getComponentById('atmega328p');
  assert.ok(mcu);
  assert.equal(mcu.designator, 'U1');

  const mcuList = filterComponentsByCategory('mcu');
  assert.equal(mcuList.length, 2);
  assert.equal(filterComponentsByCategory('all').length, ARDUINO_COMPONENTS.length);
  assert.ok(CAMERA_PRESETS.some((p) => p.id === 'reference'));
});
