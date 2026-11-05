import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, Eye, RotateCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

// Pre-allocated math objects to ensure zero GC in animation loop
const _targetRotation = new THREE.Euler(0, 0, 0);
const _currentRotation = new THREE.Euler(0, 0, 0);

interface ThreeHeroSceneProps {
  className?: string;
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [materialTheme, setMaterialTheme] = useState<'titanium' | 'amber' | 'cyber'>('amber');
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentView, setCurrentView] = useState<'perspective' | 'top' | 'close'>('perspective');

  // Mutable refs for render loop access without re-instantiating scene
  const paramsRef = useRef({
    explode: 0,
    theme: 'amber',
    autoRotate: true,
    cameraView: 'perspective',
    pointerX: 0,
    pointerY: 0,
  });

  useEffect(() => {
    paramsRef.current.explode = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    paramsRef.current.theme = materialTheme;
  }, [materialTheme]);

  useEffect(() => {
    paramsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    paramsRef.current.cameraView = currentView;
  }, [currentView]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Headless browser check
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x060b13, 12, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 2.8, 7.5);

    // 3. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Warm Key vs Cool Fill)
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.8);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 4;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd0c4b4, 1.2);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 1.4);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    // 5. Build Procedural 8-Part Hardware & Tech Core Model (THREE.Group)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Dynamic material references for theme updates
    const materials = {
      chassis: new THREE.MeshStandardMaterial({
        color: 0x22262b,
        metalness: 0.85,
        roughness: 0.25,
      }),
      copperRing: new THREE.MeshStandardMaterial({
        color: 0xf97316,
        metalness: 0.9,
        roughness: 0.18,
      }),
      coreGem: new THREE.MeshPhysicalMaterial({
        color: 0xff6b2b,
        emissive: 0x331100,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.65,
        ior: 1.52,
        thickness: 1.2,
      }),
      heatsink: new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.7,
        roughness: 0.45,
      }),
      circuits: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.35,
      }),
    };

    // Sub-assembly 1: Beveled Base Chassis
    const baseChassisGeom = new THREE.CylinderGeometry(1.6, 1.8, 0.28, 32);
    const baseChassis = new THREE.Mesh(baseChassisGeom, materials.chassis);
    baseChassis.position.y = -1.1;
    baseChassis.receiveShadow = !isHeadless;
    baseChassis.castShadow = !isHeadless;
    modelGroup.add(baseChassis);

    // Sub-assembly 2: Microcontroller Board Substrate
    const boardGeom = new THREE.BoxGeometry(2.1, 0.08, 2.1);
    const boardMesh = new THREE.Mesh(boardGeom, materials.circuits);
    boardMesh.position.y = -0.85;
    boardMesh.castShadow = !isHeadless;
    modelGroup.add(boardMesh);

    // Sub-assembly 3: Outer Gyroscope Gimbal Ring
    const outerRingGeom = new THREE.TorusGeometry(1.45, 0.065, 16, 64);
    const outerRing = new THREE.Mesh(outerRingGeom, materials.copperRing);
    outerRing.position.y = 0;
    modelGroup.add(outerRing);

    // Sub-assembly 4: Inner Gyroscope Gimbal Ring
    const innerRingGeom = new THREE.TorusGeometry(1.15, 0.055, 16, 64);
    const innerRing = new THREE.Mesh(innerRingGeom, materials.heatsink);
    innerRing.position.y = 0;
    innerRing.rotation.x = Math.PI / 3;
    modelGroup.add(innerRing);

    // Sub-assembly 5: Central Compute Core (Faceted Icosahedron)
    const coreGeom = new THREE.IcosahedronGeometry(0.68, 1);
    const coreMesh = new THREE.Mesh(coreGeom, materials.coreGem);
    coreMesh.position.y = 0;
    coreMesh.castShadow = !isHeadless;
    modelGroup.add(coreMesh);

    // Sub-assembly 6: Heatsink Fin Array (Grouped linear cooling fins)
    const heatsinkGroup = new THREE.Group();
    const finGeom = new THREE.BoxGeometry(0.04, 0.32, 0.7);
    for (let i = -3; i <= 3; i++) {
      const fin = new THREE.Mesh(finGeom, materials.heatsink);
      fin.position.x = i * 0.12;
      fin.castShadow = !isHeadless;
      heatsinkGroup.add(fin);
    }
    heatsinkGroup.position.set(0, -0.6, 0);
    modelGroup.add(heatsinkGroup);

    // Sub-assembly 7: Sensor Antenna & Optical Beacon
    const beaconStemGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
    const beaconStem = new THREE.Mesh(beaconStemGeom, materials.copperRing);
    beaconStem.position.set(0, 0.95, 0);
    const beaconTopGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const beaconTop = new THREE.Mesh(beaconTopGeom, materials.coreGem);
    beaconTop.position.set(0, 1.4, 0);
    const sensorUnit = new THREE.Group();
    sensorUnit.add(beaconStem);
    sensorUnit.add(beaconTop);
    modelGroup.add(sensorUnit);

    // Sub-assembly 8: Contact Grounding Shadow Disc
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
      grad.addColorStop(0, 'rgba(40, 30, 20, 0.45)');
      grad.addColorStop(0.5, 'rgba(40, 30, 20, 0.15)');
      grad.addColorStop(1, 'rgba(40, 30, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.24;
    scene.add(shadowPlane);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Pointer move listener for interactive parallax
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      paramsRef.current.pointerX = x;
      paramsRef.current.pointerY = y;
    };

    container.addEventListener('mousemove', handlePointerMove);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Exponential Damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Theme materials update
      const currentTheme = paramsRef.current.theme;
      if (currentTheme === 'amber') {
        materials.copperRing.color.setHex(0xf97316);
        materials.coreGem.color.setHex(0xff7722);
      } else if (currentTheme === 'titanium') {
        materials.copperRing.color.setHex(0x94a3b8);
        materials.coreGem.color.setHex(0x38bdf8);
      } else {
        materials.copperRing.color.setHex(0x10b981);
        materials.coreGem.color.setHex(0x065f46);
      }

      // Auto rotation & Parallax
      if (paramsRef.current.autoRotate) {
        outerRing.rotation.y += 0.65 * dt;
        innerRing.rotation.x += 0.85 * dt;
        coreMesh.rotation.y += 0.5 * dt;
        coreMesh.rotation.z += 0.3 * dt;
      }

      // Exploded View Layer Separation (smooth damping)
      const targetExplode = paramsRef.current.explode;
      sensorUnit.position.y = THREE.MathUtils.damp(
        sensorUnit.position.y,
        targetExplode * 0.9,
        6,
        dt
      );
      boardMesh.position.y = THREE.MathUtils.damp(
        boardMesh.position.y,
        -0.85 - targetExplode * 0.5,
        6,
        dt
      );
      baseChassis.position.y = THREE.MathUtils.damp(
        baseChassis.position.y,
        -1.1 - targetExplode * 0.8,
        6,
        dt
      );
      heatsinkGroup.position.y = THREE.MathUtils.damp(
        heatsinkGroup.position.y,
        -0.6 - targetExplode * 0.3,
        6,
        dt
      );

      // Camera preset transitions with damping
      const view = paramsRef.current.cameraView;
      let targetCamX = 0;
      let targetCamY = 2.4;
      let targetCamZ = 7.2;

      if (view === 'top') {
        targetCamX = 0;
        targetCamY = 8.5;
        targetCamZ = 0.5;
      } else if (view === 'close') {
        targetCamX = 0;
        targetCamY = 1.0;
        targetCamZ = 4.2;
      }

      // Add gentle pointer parallax to camera
      targetCamX += paramsRef.current.pointerX * 0.8;
      targetCamY += paramsRef.current.pointerY * 0.6;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, dt);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      data-testid="three-hero-viewport"
      className={`relative w-full h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center select-none ${className}`}
    >
      {/* Stable 3D Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Tech Core — Drag to inspect"
      />

      {/* Spec Badge: Top Left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-1.5 shadow-sm text-xs font-mono text-slate-300 flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          <span>Interactive 3D Procedural Hardware Core</span>
        </div>
      </div>

      {/* Sleek Collapsible Bottom Dock (Consolidated, <= 15% Viewport) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[580px]">
        {/* Toggle Collapse Button */}
        <div className="flex justify-center -mb-2 relative z-30">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-slate-900/80 border border-slate-700/70 px-3 py-1 text-[11px] font-medium text-slate-300 rounded-t-lg border-b-0 flex items-center gap-1.5 hover:text-orange-400 focus:outline-none backdrop-blur-md"
            aria-label={isCollapsed ? 'Expand 3D scene controls' : 'Collapse 3D scene controls'}
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Zen Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Floating Control Panel */}
        {!isCollapsed && (
          <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-3 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
            {/* Exploded Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[170px]">
              <Layers className="w-4 h-4 text-orange-400 shrink-0" />
              <label htmlFor="explode-slider" className="text-[11px] font-medium text-slate-300 shrink-0">
                Layer Explode:
              </label>
              <input
                id="explode-slider"
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg bg-slate-700"
                aria-label="Adjust exploded view layer separation"
              />
            </div>

            {/* Material Finish Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Finish:</span>
              <button
                type="button"
                onClick={() => setMaterialTheme('amber')}
                className={`w-5 h-5 rounded-full bg-orange-500 border-2 ${materialTheme === 'amber' ? 'border-white scale-110 shadow-sm' : 'border-slate-600'
                  }`}
                title="Orange Amber Brass"
                aria-label="Orange finish"
              />
              <button
                type="button"
                onClick={() => setMaterialTheme('titanium')}
                className={`w-5 h-5 rounded-full bg-slate-400 border-2 ${materialTheme === 'titanium' ? 'border-white scale-110 shadow-sm' : 'border-slate-600'
                  }`}
                title="Titanium Steel"
                aria-label="Titanium finish"
              />
              <button
                type="button"
                onClick={() => setMaterialTheme('cyber')}
                className={`w-5 h-5 rounded-full bg-emerald-600 border-2 ${materialTheme === 'cyber' ? 'border-white scale-110 shadow-sm' : 'border-slate-600'
                  }`}
                title="Emerald Matrix"
                aria-label="Emerald finish"
              />
            </div>

            {/* View Camera Pills */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentView('perspective')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${currentView === 'perspective' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-semibold' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('top')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${currentView === 'top' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-semibold' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
              >
                Top
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('close')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${currentView === 'close' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-semibold' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
              >
                Core
              </button>
            </div>

            {/* Auto Rotate Toggle */}
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-lg transition-all ${autoRotate ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}
              title={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
              aria-label={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
