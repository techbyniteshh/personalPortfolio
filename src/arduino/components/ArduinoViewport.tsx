import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildArduinoModel, BuiltArduinoModel } from '../three/buildArduinoModel';
import { CAMERA_PRESETS, CameraPreset } from '../data/arduinoSpecs';

export type StudioTheme = 'studio' | 'neumorphic' | 'dark';

interface ArduinoViewportProps {
  activePresetId?: string;
  explodeTarget?: number;
  selectedComponentId?: string | null;
  onSelectComponent?: (id: string | null) => void;
  autoSpin?: boolean;
  powerSim?: boolean;
  theme?: StudioTheme;
  resetTrigger?: number;
  onError?: (error: Error) => void;
}

const THEME_CONFIG: Record<
  StudioTheme,
  { bgHex: number; fogHex: number; shadowOpacity: number }
> = {
  studio: { bgHex: 0xf2f3f5, fogHex: 0xf2f3f5, shadowOpacity: 0.22 },
  neumorphic: { bgHex: 0xdde3ea, fogHex: 0xdde3ea, shadowOpacity: 0.28 },
  dark: { bgHex: 0x15191f, fogHex: 0x15191f, shadowOpacity: 0.48 },
};

// Reusable scratch vectors outside RAF loop (Zero GC allocation)
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _pointerNDC = new THREE.Vector2();

function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, 'rgba(10, 18, 24, 0.65)');
  grad.addColorStop(0.55, 'rgba(10, 18, 24, 0.22)');
  grad.addColorStop(1, 'rgba(10, 18, 24, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

export const ArduinoViewport: React.FC<ArduinoViewportProps> = ({
  activePresetId = 'reference',
  explodeTarget = 0,
  selectedComponentId = null,
  onSelectComponent = () => {},
  autoSpin = false,
  powerSim = true,
  theme = 'dark',
  resetTrigger = 0,
  onError,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Mutable state refs for RAF loop without tearing down WebGL context
  const stateRef = useRef({
    explodeCurrent: 0,
    explodeTarget,
    autoSpin,
    powerSim,
    selectedComponentId,
    onSelectComponent,
    transitioningPreset: false,
    needsRender: true,
    desiredCamPos: new THREE.Vector3(...CAMERA_PRESETS[0].position),
    desiredTarget: new THREE.Vector3(...CAMERA_PRESETS[0].target),
  });

  const sceneObjectsRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    model?: BuiltArduinoModel;
    contactShadowMat?: THREE.MeshBasicMaterial;
  }>({});

  // Sync props to ref
  useEffect(() => {
    stateRef.current.explodeTarget = explodeTarget;
    stateRef.current.needsRender = true;
  }, [explodeTarget]);

  useEffect(() => {
    stateRef.current.autoSpin = autoSpin;
    stateRef.current.needsRender = true;
  }, [autoSpin]);

  useEffect(() => {
    stateRef.current.powerSim = powerSim;
    stateRef.current.needsRender = true;
  }, [powerSim]);

  useEffect(() => {
    stateRef.current.selectedComponentId = selectedComponentId;
    stateRef.current.onSelectComponent = onSelectComponent;
    sceneObjectsRef.current.model?.setHighlightedComponent(selectedComponentId);
    stateRef.current.needsRender = true;
  }, [selectedComponentId, onSelectComponent]);

  // Apply camera preset transitions smoothly
  useEffect(() => {
    const preset: CameraPreset =
      CAMERA_PRESETS.find((p) => p.id === activePresetId) || CAMERA_PRESETS[0];
    stateRef.current.desiredCamPos.set(...preset.position);
    stateRef.current.desiredTarget.set(...preset.target);
    stateRef.current.transitioningPreset = true;
    stateRef.current.needsRender = true;
    if (sceneObjectsRef.current.camera) {
      sceneObjectsRef.current.camera.fov = preset.fov;
      sceneObjectsRef.current.camera.updateProjectionMatrix();
    }
  }, [activePresetId, resetTrigger]);

  // Apply theme changes to scene background & contact shadow
  useEffect(() => {
    const { scene, renderer, contactShadowMat } = sceneObjectsRef.current;
    const cfg = THEME_CONFIG[theme] || THEME_CONFIG.dark;
    if (scene && renderer) {
      scene.background = new THREE.Color(cfg.bgHex);
      scene.fog = new THREE.Fog(cfg.fogHex, 18, 38);
      renderer.setClearColor(cfg.bgHex, 1);
    }
    if (contactShadowMat) {
      contactShadowMat.opacity = cfg.shadowOpacity;
    }
    stateRef.current.needsRender = true;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    let controls: OrbitControls | undefined;
    let envTexture: THREE.Texture | undefined;
    let arduinoModel: BuiltArduinoModel | undefined;
    let contactShadowGeo: THREE.PlaneGeometry | undefined;
    let contactShadowMat: THREE.MeshBasicMaterial | undefined;
    let contactShadowTex: THREE.CanvasTexture | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let rafId = 0;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    const initialThemeCfg = THEME_CONFIG[theme] || THEME_CONFIG.dark;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(
        isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      );
      renderer.shadowMap.enabled = !isHeadless;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(initialThemeCfg.bgHex, 1);
      renderer.setSize(width, height);
      renderer.domElement.setAttribute('data-testid', 'arduino-webgl-canvas');
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(initialThemeCfg.bgHex);
      scene.fog = new THREE.Fog(initialThemeCfg.fogHex, 18, 38);

      // Studio Environment Reflections (RoomEnvironment + PMREMGenerator)
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      // Camera initialized at the exact Reference Photo angle
      const refPreset = CAMERA_PRESETS[0];
      camera = new THREE.PerspectiveCamera(
        refPreset.fov,
        width / height,
        0.1,
        100
      );
      camera.position.set(...refPreset.position);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(...refPreset.target);
      controls.enableDamping = !isHeadless;
      controls.dampingFactor = 0.08;
      controls.minDistance = 2.4;
      controls.maxDistance = 16.0;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.update();

      const stopPresetTransition = () => {
        stateRef.current.transitioningPreset = false;
        stateRef.current.needsRender = true;
      };
      const onControlsChange = () => {
        stateRef.current.needsRender = true;
      };
      controls.addEventListener('start', stopPresetTransition);
      controls.addEventListener('change', onControlsChange);

      // ─── STUDIO 3-POINT LIGHTING RIG (Warm Key + Cool Hemisphere Fill + Rim) ───
      const hemiLight = new THREE.HemisphereLight(0xf4f8ff, 0x8ea0b2, 0.95);
      hemiLight.position.set(0, 12, 0);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.1);
      keyLight.position.set(5.5, 11.5, 6.5);
      keyLight.castShadow = !isHeadless;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.left = -5.5;
      keyLight.shadow.camera.right = 5.5;
      keyLight.shadow.camera.top = 5.5;
      keyLight.shadow.camera.bottom = -5.5;
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.75);
      fillLight.position.set(-7.0, 6.0, -4.0);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xe0f7fa, 0.6);
      rimLight.position.set(0.0, 4.0, -8.5);
      scene.add(rimLight);

      // ─── BUILD ARDUINO UNO R3 3D MODEL ────────────────────────────────────────
      const maxAniso = isHeadless ? 1 : renderer.capabilities.getMaxAnisotropy() || 4;
      arduinoModel = buildArduinoModel(maxAniso);
      scene.add(arduinoModel.root);

      // ─── GROUND CONTACT SHADOW PLANE ──────────────────────────────────────────
      contactShadowTex = createRadialContactShadowTexture();
      contactShadowGeo = new THREE.PlaneGeometry(9.6, 7.6);
      contactShadowMat = new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: initialThemeCfg.shadowOpacity,
        depthWrite: false,
      });
      const contactShadowMesh = new THREE.Mesh(contactShadowGeo, contactShadowMat);
      contactShadowMesh.rotation.x = -Math.PI / 2;
      contactShadowMesh.position.set(0, -0.42, 0.15);
      scene.add(contactShadowMesh);

      sceneObjectsRef.current = {
        renderer,
        scene,
        camera,
        controls,
        model: arduinoModel,
        contactShadowMat,
      };

      // Initial synchronous render
      renderer.render(scene, camera);
    } catch (initErr: any) {
      console.warn('Three.js / WebGL initialization encountered an issue:', initErr);
      if (onError) {
        onError(initErr instanceof Error ? initErr : new Error(String(initErr)));
      }
      return;
    }

    // ─── INTERACTIVE RAYCASTING FOR COMPONENT SELECTION ──────────────────────
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y
      );
      if (dist > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNDC, camera);
      const hits = raycaster.intersectObjects(arduinoModel.selectableMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.componentId as string | undefined;
        if (hitId) {
          stateRef.current.onSelectComponent(
            stateRef.current.selectedComponentId === hitId ? null : hitId
          );
          return;
        }
      }
    };

    if (renderer?.domElement) {
      renderer.domElement.addEventListener('pointerdown', handlePointerDown);
      renderer.domElement.addEventListener('pointerup', handlePointerUp);
    }

    // ─── RESIZE OBSERVER ──────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer || !camera || !scene) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const aspect = w / h;
      camera.aspect = aspect;
      const baseFov =
        CAMERA_PRESETS.find((p) => p.id === stateRef.current.selectedComponentId)?.fov || 35;
      // On narrow portrait mobile viewports, scale vertical FOV so horizontal board fits cleanly
      camera.fov = aspect < 1 ? Math.min(68, baseFov / Math.max(0.52, aspect * 0.92)) : baseFov;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      stateRef.current.needsRender = true;
      renderer.render(scene, camera);
    };
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // ─── ANIMATION LOOP ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!renderer || !camera || !scene || !arduinoModel) return;
      rafId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const s = stateRef.current;

      let activeMotion = false;

      // 1. Exponential damping for Exploded View factor
      if (Math.abs(s.explodeTarget - s.explodeCurrent) > 0.001) {
        s.explodeCurrent = isHeadless
          ? s.explodeTarget
          : THREE.MathUtils.damp(s.explodeCurrent, s.explodeTarget, 8, dt);
        arduinoModel.setExplodeFactor(s.explodeCurrent);
        activeMotion = true;
      }

      // 2. Smooth camera preset interpolation
      if (s.transitioningPreset) {
        _targetCameraPos.copy(s.desiredCamPos);
        _targetLookAt.copy(s.desiredTarget);
        if (isHeadless) {
          camera.position.copy(_targetCameraPos);
          controls.target.copy(_targetLookAt);
          s.transitioningPreset = false;
        } else {
          const dampAlpha = 1 - Math.exp(-7.5 * dt);
          camera.position.lerp(_targetCameraPos, dampAlpha);
          controls.target.lerp(_targetLookAt, dampAlpha);
          if (
            camera.position.distanceTo(_targetCameraPos) < 0.015 &&
            controls.target.distanceTo(_targetLookAt) < 0.015
          ) {
            camera.position.copy(_targetCameraPos);
            controls.target.copy(_targetLookAt);
            s.transitioningPreset = false;
          }
        }
        activeMotion = true;
      } else if (s.autoSpin) {
        const angle = 0.45 * dt;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = camera.position.x - controls.target.x;
        const dz = camera.position.z - controls.target.z;
        camera.position.x = controls.target.x + dx * cos - dz * sin;
        camera.position.z = controls.target.z + dx * sin + dz * cos;
        activeMotion = true;
      }

      // 3. LED Power & Serial Activity Simulation
      if (s.powerSim) {
        arduinoModel.ledMaterials.on.emissiveIntensity = 1.6;
        arduinoModel.ledLights.on.intensity = 0.4;

        const lPulse = Math.sin(elapsed * Math.PI * 2) > 0 ? 1.3 : 0.12;
        arduinoModel.ledMaterials.l.emissiveIntensity = lPulse;
        arduinoModel.ledLights.l.intensity = lPulse * 0.22;

        const txBurst = Math.sin(elapsed * 19.0) * Math.sin(elapsed * 3.7) > 0.25 ? 1.4 : 0.08;
        const rxBurst = Math.cos(elapsed * 23.0) * Math.sin(elapsed * 4.3) > 0.3 ? 1.4 : 0.08;
        arduinoModel.ledMaterials.tx.emissiveIntensity = txBurst;
        arduinoModel.ledMaterials.rx.emissiveIntensity = rxBurst;
        arduinoModel.ledLights.tx.intensity = txBurst * 0.18;
        arduinoModel.ledLights.rx.intensity = rxBurst * 0.18;
        activeMotion = true;
      } else if (s.needsRender) {
        arduinoModel.ledMaterials.on.emissiveIntensity = 0.85;
        arduinoModel.ledMaterials.l.emissiveIntensity = 0.65;
        arduinoModel.ledMaterials.tx.emissiveIntensity = 0.55;
        arduinoModel.ledMaterials.rx.emissiveIntensity = 0.55;
        arduinoModel.ledLights.on.intensity = 0.15;
        arduinoModel.ledLights.l.intensity = 0.1;
        arduinoModel.ledLights.tx.intensity = 0.08;
        arduinoModel.ledLights.rx.intensity = 0.08;
      }

      // In headless mode, skip rendering when static so Playwright screenshots never stall
      if (isHeadless && !activeMotion && !s.needsRender) {
        return;
      }

      s.needsRender = false;
      controls.update();
      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      if (controls) {
        controls.removeEventListener('start', stopPresetTransition);
        controls.removeEventListener('change', onControlsChange);
        controls.dispose();
      }
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        renderer.domElement.removeEventListener('pointerup', handlePointerUp);
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
      arduinoModel?.dispose();
      contactShadowGeo?.dispose();
      contactShadowMat?.dispose();
      contactShadowTex?.dispose();
      envTexture?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative select-none cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Arduino UNO R3 Model Viewport"
    />
  );
};
