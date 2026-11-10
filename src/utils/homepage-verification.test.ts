import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS_DATA } from '../config/portfolio.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

test('PROJECTS_DATA contains the normal Arduino Project card', () => {
  const arduino = PROJECTS_DATA.find((p) => p.id === 'arduino-project');
  assert.ok(arduino, 'Arduino project card must exist in PROJECTS_DATA');
  assert.equal(arduino.name, 'Arduino Project', 'Title must be "Arduino Project"');
  assert.equal(arduino.category, 'IoT & Hardware');
  assert.equal(arduino.status, 'Completed');
  assert.equal(arduino.iconName, 'cpu');
  assert.ok(arduino.description.includes('ATmega328P'));
  assert.ok(arduino.technologies.includes('C++'));
  assert.ok(arduino.technologies.includes('ATmega328P'));
  assert.ok(arduino.technologies.includes('Embedded Systems'));

  // Ensure all previous projects remain intact
  assert.ok(PROJECTS_DATA.some((p) => p.id === 'pyqverse'));
  assert.ok(PROJECTS_DATA.some((p) => p.id === 'sakhibiz'));
  assert.ok(PROJECTS_DATA.some((p) => p.id === 'zerotrace'));
  assert.ok(PROJECTS_DATA.some((p) => p.id === 'iot-railway-detection'));
  assert.equal(PROJECTS_DATA.length, 5);
});

test('Navbar does not contain 3D Arduino link', () => {
  const navbarSource = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.tsx'), 'utf-8');
  assert.equal(
    navbarSource.includes('3D Arduino'),
    false,
    'Navbar must not contain "3D Arduino"'
  );
  assert.equal(
    navbarSource.includes('#arduino-experience'),
    false,
    'Navbar must not link to "#arduino-experience"'
  );

  // Remaining links must exist
  assert.ok(navbarSource.includes('About'));
  assert.ok(navbarSource.includes('Skills'));
  assert.ok(navbarSource.includes('Projects'));
  assert.ok(navbarSource.includes('Education'));
  assert.ok(navbarSource.includes('Certs'));
  assert.ok(navbarSource.includes('Notes'));
});

test('App.tsx does not import or render ArduinoShowcaseSection', () => {
  const appSource = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf-8');
  assert.equal(
    appSource.includes('ArduinoShowcaseSection'),
    false,
    'App.tsx must not import or render ArduinoShowcaseSection'
  );
  assert.equal(
    appSource.includes('arduino-experience'),
    false,
    'App.tsx sectionIds must not contain "arduino-experience"'
  );
  assert.equal(
    appSource.includes('story-chapter-arduino'),
    false,
    'App.tsx must not contain "story-chapter-arduino"'
  );

  // Must preserve remaining sections
  assert.ok(appSource.includes('HeroSection'));
  assert.ok(appSource.includes('AboutSection'));
  assert.ok(appSource.includes('SkillsSection'));
  assert.ok(appSource.includes('ProjectsSection'));
  assert.ok(appSource.includes('EducationSection'));
  assert.ok(appSource.includes('AchievementsSection'));
  assert.ok(appSource.includes('ArticlesSection'));
  assert.ok(appSource.includes('ContactSection'));
  assert.ok(appSource.includes('FuelCreativitySection'));
});

test('index.css does not contain story-chapter-arduino and has sequential z-index', () => {
  const cssSource = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
  assert.equal(
    cssSource.includes('story-chapter-arduino'),
    false,
    'index.css must not contain "story-chapter-arduino"'
  );
  assert.ok(cssSource.includes('.story-chapter-hero'));
  assert.ok(cssSource.includes('.story-chapter-about'));
  assert.ok(cssSource.includes('.story-chapter-skills'));
  assert.ok(cssSource.includes('.story-chapter-projects'));
  assert.ok(cssSource.includes('.story-chapter-education'));
  assert.ok(cssSource.includes('.story-chapter-achievements'));
  assert.ok(cssSource.includes('.story-chapter-articles'));
  assert.ok(cssSource.includes('.story-chapter-contact'));
  assert.ok(cssSource.includes('.story-chapter-fuel'));
});

test('Original Arduino 3D components and assets remain preserved for future routes', () => {
  assert.ok(fs.existsSync(path.join(rootDir, 'src/sections/ArduinoShowcaseSection.tsx')));
  assert.ok(fs.existsSync(path.join(rootDir, 'src/arduino/components/ArduinoViewport.tsx')));
  assert.ok(fs.existsSync(path.join(rootDir, 'src/arduino/three/buildArduinoModel.ts')));
  assert.ok(fs.existsSync(path.join(rootDir, 'src/arduino/three/pcbTextures.ts')));
  assert.ok(fs.existsSync(path.join(rootDir, 'src/arduino/data/arduinoSpecs.ts')));
});
