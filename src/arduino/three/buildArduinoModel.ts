import * as THREE from 'three';
import {
  BOARD_WIDTH,
  BOARD_DEPTH,
  BOARD_THICKNESS,
  MOUNTING_HOLES,
  ARDUINO_COMPONENTS,
  calculateExplodedOffset,
} from '../data/arduinoSpecs';
import {
  createPCBTopTexture,
  createPCBBumpTexture,
  createPCBBottomTexture,
  createAtmega328Texture,
  createAtmega16U2Texture,
  createCapacitorTopTexture,
  createRegulatorTexture,
  createOpAmpTexture,
  createDiodeTexture,
  createPolyfuseTexture,
  createPowerHeaderSideTexture,
  createAnalogHeaderSideTexture,
} from './pcbTextures';

export interface BuiltArduinoModel {
  root: THREE.Group;
  explodableGroups: Map<string, { group: THREE.Object3D; baseY: number; explodeHeight: number }>;
  selectableMeshes: THREE.Object3D[];
  ledMaterials: {
    on: THREE.MeshStandardMaterial;
    l: THREE.MeshStandardMaterial;
    tx: THREE.MeshStandardMaterial;
    rx: THREE.MeshStandardMaterial;
  };
  ledLights: {
    on: THREE.PointLight;
    l: THREE.PointLight;
    tx: THREE.PointLight;
    rx: THREE.PointLight;
  };
  setExplodeFactor: (factor: number) => void;
  setHighlightedComponent: (id: string | null) => void;
  dispose: () => void;
}

/**
 * Creates the exact Arduino UNO R3 stepped right-edge silhouette in 2D shape space (sx = x, sy = -z).
 */
function createArduinoBoardShape(): THREE.Shape {
  const hw = BOARD_WIDTH / 2; // 3.43
  const hd = BOARD_DEPTH / 2; // 2.67
  const s = new THREE.Shape();

  // Start at bottom-left (-hw, -hd) -> corresponds to (x = -3.43, z = +2.67)
  // Remember sy = -z:
  // Top edge is z = -hd -> sy = +hd
  // Bottom edge is z = +hd -> sy = -hd
  s.moveTo(-hw, -hd);
  // Bottom edge to bottom-right before step
  s.lineTo(hw - 0.52, -hd);
  // Step up-right at bottom-right corner
  s.lineTo(hw - 0.34, -hd + 0.18);
  // Go up right side to ICSP tab lower corner
  s.lineTo(hw - 0.34, -0.45);
  // Outward step for right ICSP header tab
  s.lineTo(hw, -0.22);
  s.lineTo(hw, 0.92);
  // Step inward above right ICSP header
  s.lineTo(hw - 0.28, 1.22);
  s.lineTo(hw - 0.28, hd - 0.38);
  // Top-right 45-degree chamfer near RX<-0 pin
  s.lineTo(hw - 0.64, hd);
  // Top edge all the way to top-left
  s.lineTo(-hw, hd);
  // Left edge back down to bottom-left
  s.lineTo(-hw, -hd);

  // Add the 4 mounting holes (in shape space: sx = hx, sy = -hz)
  const holeRadius = 0.155;
  MOUNTING_HOLES.forEach(([hx, hz]) => {
    const holePath = new THREE.Path();
    holePath.absarc(hx, -hz, holeRadius, 0, Math.PI * 2, true);
    s.holes.push(holePath);
  });

  return s;
}

/**
 * Normalizes UVs on a ShapeGeometry so sx in [-BW/2, BW/2] maps to u in [0, 1]
 * and sy in [-BD/2, BD/2] maps to v in [0, 1].
 */
function applyNormalizedBoardUVs(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const sx = pos.getX(i);
    const sy = pos.getY(i);
    uvs[i * 2] = (sx + BOARD_WIDTH / 2) / BOARD_WIDTH;
    uvs[i * 2 + 1] = (sy + BOARD_DEPTH / 2) / BOARD_DEPTH;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
}

export function buildArduinoModel(maxAnisotropy = 8): BuiltArduinoModel {
  const root = new THREE.Group();
  const explodableGroups = new Map<
    string,
    { group: THREE.Object3D; baseY: number; explodeHeight: number }
  >();
  const selectableMeshes: THREE.Object3D[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    texturesToDispose.push(t);
    return t;
  };

  const registerComponentGroup = (id: string, group: THREE.Object3D) => {
    const spec = ARDUINO_COMPONENTS.find((c) => c.id === id);
    const explodeHeight = spec ? spec.explodeHeight : 1.0;
    explodableGroups.set(id, {
      group,
      baseY: group.position.y,
      explodeHeight,
    });
    group.userData.componentId = id;
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData.componentId = id;
        selectableMeshes.push(child);
      }
    });
  };

  // ─── SHARED PBR MATERIALS ───────────────────────────────────────────────────
  const mPCBEdge = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x00585c,
      roughness: 0.55,
      metalness: 0.08,
    })
  );

  const pcbTopTex = trackTex(createPCBTopTexture(maxAnisotropy));
  const pcbBumpTex = trackTex(createPCBBumpTexture(maxAnisotropy));
  const pcbBotTex = trackTex(createPCBBottomTexture(maxAnisotropy));

  const mPCBTop = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: pcbTopTex,
      bumpMap: pcbBumpTex,
      bumpScale: 0.008,
      roughness: 0.34,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );

  const mPCBBot = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: pcbBotTex,
      roughness: 0.35,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );

  const mBrushedSteel = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd4dade,
      roughness: 0.24,
      metalness: 0.92,
      anisotropy: 0.65,
      clearcoat: 0.15,
    })
  );

  const mShinySolder = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8ec,
      roughness: 0.14,
      metalness: 0.96,
    })
  );

  const mICLeadSilver = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc8d0d6,
      roughness: 0.25,
      metalness: 0.88,
    })
  );

  const mGoldPin = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd8b048,
      roughness: 0.18,
      metalness: 0.94,
    })
  );

  const mDarkHeaderPlastic = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x181a1d,
      roughness: 0.68,
      metalness: 0.06,
    })
  );

  const mSocketPlastic = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x202327,
      roughness: 0.62,
      metalness: 0.08,
    })
  );

  const mMatteBlackPlastic = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x16181b,
      roughness: 0.75,
      metalness: 0.05,
    })
  );

  const mICBodyDark = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x23262a,
      roughness: 0.52,
      metalness: 0.1,
    })
  );

  const mCavityBlack = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x050607,
      roughness: 0.9,
      metalness: 0.0,
    })
  );

  const mCeramicTan = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x9c7a54,
      roughness: 0.42,
      metalness: 0.08,
    })
  );

  const mCeramicDarkBrown = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x5c4632,
      roughness: 0.45,
      metalness: 0.1,
    })
  );

  const mResistorBlack = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1a1d22,
      roughness: 0.48,
      metalness: 0.12,
    })
  );

  const Y0 = BOARD_THICKNESS / 2; // +0.08

  // ─── 1. PCB SUBSTRATE & SILKSCREEN FACES ────────────────────────────────────
  {
    const pcbShape = createArduinoBoardShape();
    const extrudeGeo = trackGeo(
      new THREE.ExtrudeGeometry(pcbShape, {
        depth: BOARD_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 2,
      })
    );
    extrudeGeo.rotateX(-Math.PI / 2);
    extrudeGeo.translate(0, -BOARD_THICKNESS / 2, 0);

    const pcbMesh = new THREE.Mesh(extrudeGeo, mPCBEdge);
    pcbMesh.castShadow = true;
    pcbMesh.receiveShadow = true;
    root.add(pcbMesh);

    // Top textured face matching exact board silhouette & holes
    const topGeo = trackGeo(new THREE.ShapeGeometry(pcbShape));
    applyNormalizedBoardUVs(topGeo);
    topGeo.rotateX(-Math.PI / 2);
    const topMesh = new THREE.Mesh(topGeo, mPCBTop);
    topMesh.position.y = Y0 + 0.013;
    topMesh.receiveShadow = true;
    root.add(topMesh);

    // Bottom textured face
    const botGeo = trackGeo(new THREE.ShapeGeometry(pcbShape));
    applyNormalizedBoardUVs(botGeo);
    botGeo.rotateX(Math.PI / 2);
    const botMesh = new THREE.Mesh(botGeo, mPCBBot);
    botMesh.position.y = -Y0 - 0.013;
    botMesh.receiveShadow = true;
    root.add(botMesh);

    // Metallic inner barrels for the 4 mounting holes
    const holeBarrelGeo = trackGeo(
      new THREE.CylinderGeometry(0.158, 0.158, BOARD_THICKNESS + 0.028, 24, 1, true)
    );
    const mHoleBarrel = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc8d2d6,
        roughness: 0.25,
        metalness: 0.9,
        side: THREE.DoubleSide,
      })
    );
    MOUNTING_HOLES.forEach(([hx, hz]) => {
      const barrel = new THREE.Mesh(holeBarrelGeo, mHoleBarrel);
      barrel.position.set(hx, 0, hz);
      root.add(barrel);
    });
  }

  // ─── 2. USB TYPE-B CONNECTOR (TOP-LEFT OVERHANGING) ─────────────────────────
  {
    const usbGroup = new THREE.Group();
    usbGroup.position.set(-2.85, Y0, -1.18);

    // Main brushed steel outer shield (1.58 x 1.06 x 1.22)
    const shieldW = 1.58;
    const shieldH = 1.06;
    const shieldD = 1.22;
    const shieldBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(shieldW, shieldH, shieldD)),
      mBrushedSteel
    );
    shieldBody.position.set(0, shieldH / 2, 0);
    shieldBody.castShadow = true;
    shieldBody.receiveShadow = true;
    usbGroup.add(shieldBody);

    // Top brushed dark gunmetal plate insert with silver rim (matching image.png!)
    const topPlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(shieldW - 0.12, 0.015, shieldD - 0.12)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x454b52,
          roughness: 0.36,
          metalness: 0.82,
        })
      )
    );
    topPlate.position.set(0, shieldH + 0.004, 0);
    usbGroup.add(topPlate);

    // Diagonal fold seam lines on the right face of the USB shield (matching image.png!)
    const seamGeo = trackGeo(new THREE.BoxGeometry(0.018, 0.72, 0.022));
    [-1, 1].forEach((dir) => {
      const seam = new THREE.Mesh(seamGeo, mCavityBlack);
      seam.position.set(shieldW / 2 + 0.002, shieldH / 2, dir * 0.28);
      seam.rotation.x = dir * 0.52;
      usbGroup.add(seam);
    });

    // Left-facing USB Type-B port opening cavity
    const portOpening = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.08, 0.78, 0.86)),
      mCavityBlack
    );
    portOpening.position.set(-shieldW / 2 + 0.02, shieldH / 2, 0);
    usbGroup.add(portOpening);

    // Inner tongue inside USB port
    const tongue = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.65, 0.32, 0.46)),
      mMatteBlackPlastic
    );
    tongue.position.set(-0.42, shieldH / 2, 0);
    usbGroup.add(tongue);

    // 4 gold contact strips inside USB port
    const usbPinGeo = trackGeo(new THREE.BoxGeometry(0.55, 0.03, 0.05));
    for (let i = 0; i < 4; i++) {
      const pin = new THREE.Mesh(usbPinGeo, mGoldPin);
      pin.position.set(-0.44, shieldH / 2 + (i < 2 ? 0.17 : -0.17), (i % 2 === 0 ? -1 : 1) * 0.12);
      usbGroup.add(pin);
    }

    // Bottom solder mounting tabs + shiny 3D solder fillets on PCB (visible around USB base in image.png)
    const solderDomeGeo = trackGeo(new THREE.SphereGeometry(0.11, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2));
    [
      [0.35, 0.65],
      [-0.25, 0.65],
      [0.35, -0.65],
      [-0.25, -0.65],
    ].forEach(([sx, sz]) => {
      const dome = new THREE.Mesh(solderDomeGeo, mShinySolder);
      dome.scale.set(1.3, 0.65, 1.0);
      dome.position.set(sx, 0.01, sz);
      usbGroup.add(dome);
    });

    root.add(usbGroup);
    registerComponentGroup('usb_b', usbGroup);
  }

  // ─── 3. DC BARREL POWER JACK (BOTTOM-LEFT OVERHANGING) ──────────────────────
  {
    const dcGroup = new THREE.Group();
    dcGroup.position.set(-2.82, Y0, 1.52);

    // Front rectangular housing block overhanging the left PCB edge
    const frontBlock = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.68, 1.12, 1.06)),
      mMatteBlackPlastic
    );
    frontBlock.position.set(-0.58, 0.56, 0);
    frontBlock.castShadow = true;
    frontBlock.receiveShadow = true;
    dcGroup.add(frontBlock);

    // Cylindrical main barrel body extending rightward onto the board
    const barrelCyl = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.51, 0.51, 1.24, 32)),
      mMatteBlackPlastic
    );
    barrelCyl.rotation.z = Math.PI / 2;
    barrelCyl.position.set(0.18, 0.56, 0);
    barrelCyl.castShadow = true;
    barrelCyl.receiveShadow = true;
    dcGroup.add(barrelCyl);

    // Lower rectangular cradle under the cylinder
    const cradle = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.18, 0.42, 0.96)),
      mMatteBlackPlastic
    );
    cradle.position.set(0.14, 0.21, 0);
    dcGroup.add(cradle);

    // Left circular socket bore + inner silver center pin
    const bore = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24)),
      mCavityBlack
    );
    bore.rotation.z = Math.PI / 2;
    bore.position.set(-0.88, 0.58, 0);
    dcGroup.add(bore);

    const centerPin = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.75, 16)),
      mBrushedSteel
    );
    centerPin.rotation.z = Math.PI / 2;
    centerPin.position.set(-0.58, 0.58, 0);
    dcGroup.add(centerPin);

    // Signature Rear & Side Metal Solder Tabs + Large Shiny 3D Solder Fillets (prominent in image.png!)
    // 1. Rear vertical metal tab + curved solder fillet at right end of DC jack (x = +0.82)
    const rearTab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.06, 0.52, 0.26)),
      mBrushedSteel
    );
    rearTab.position.set(0.81, 0.28, 0);
    dcGroup.add(rearTab);

    const rearSolderPad = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.26, 0.08, 24)),
      mShinySolder
    );
    rearSolderPad.scale.set(0.85, 1, 1.35);
    rearSolderPad.position.set(0.86, 0.04, 0);
    dcGroup.add(rearSolderPad);

    const rearSolderFillet = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.18, 0.36, 20)),
      mShinySolder
    );
    rearSolderFillet.position.set(0.84, 0.18, 0);
    dcGroup.add(rearSolderFillet);

    // 2. Bottom-side metal tab + solder pad (visible at bottom-left of DC jack in image.png)
    const sideTab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.28, 0.26, 0.14)),
      mBrushedSteel
    );
    sideTab.position.set(0.24, 0.13, 0.55);
    dcGroup.add(sideTab);

    const sideSolderPad = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.23, 0.08, 24)),
      mShinySolder
    );
    sideSolderPad.position.set(0.24, 0.04, 0.62);
    dcGroup.add(sideSolderPad);

    root.add(dcGroup);
    registerComponentGroup('dc_jack', dcGroup);
  }

  // ─── 4. 28-PIN DIP SOCKET + ATMEGA328P-PU MICROCONTROLLER ───────────────────
  const mcuCenterX = 1.18;
  const mcuCenterZ = 0.26;
  const dipPinPitch = 0.234; // 14 pins span 13 * 0.234 = 3.042 units
  const dipRowHalfZ = 0.38;

  // 4A. 28-Pin Black Plastic DIP Socket (sits flush on PCB)
  {
    const socketGroup = new THREE.Group();
    socketGroup.position.set(mcuCenterX, Y0, mcuCenterZ);

    const sockW = 3.42;
    const sockH = 0.22;
    const sockD = 0.88;

    // Outer frame rails (top & bottom rows)
    const railGeo = trackGeo(new THREE.BoxGeometry(sockW, sockH, 0.24));
    [-0.32, 0.32].forEach((rz) => {
      const rail = new THREE.Mesh(railGeo, mSocketPlastic);
      rail.position.set(0, sockH / 2, rz);
      rail.castShadow = true;
      rail.receiveShadow = true;
      socketGroup.add(rail);
    });

    // Cross-bars connecting the two socket rails (creating the recessed pockets seen on real DIP sockets)
    const crossGeo = trackGeo(new THREE.BoxGeometry(0.18, sockH - 0.03, sockD - 0.1));
    [-1.62, -0.82, 0, 0.82, 1.62].forEach((cx) => {
      const cross = new THREE.Mesh(crossGeo, mSocketPlastic);
      cross.position.set(cx, (sockH - 0.03) / 2, 0);
      socketGroup.add(cross);
    });

    // 28 Metallic Socket Contact Clips & PCB Solder Pads
    const clipGeo = trackGeo(new THREE.BoxGeometry(0.095, 0.18, 0.11));
    const padGeo = trackGeo(new THREE.CylinderGeometry(0.065, 0.075, 0.025, 12));
    for (let i = 0; i < 14; i++) {
      const px = -1.521 + i * dipPinPitch;
      [-1, 1].forEach((side) => {
        const clip = new THREE.Mesh(clipGeo, mICLeadSilver);
        clip.position.set(px, 0.13, side * dipRowHalfZ);
        socketGroup.add(clip);

        const pad = new THREE.Mesh(padGeo, mShinySolder);
        pad.position.set(px, 0.012, side * (dipRowHalfZ + 0.04));
        socketGroup.add(pad);
      });
    }

    root.add(socketGroup);
    registerComponentGroup('dip_socket', socketGroup);
  }

  // 4B. ATMEGA328P-PU 28-Pin DIP IC (plugged into the socket)
  {
    const mcuGroup = new THREE.Group();
    mcuGroup.position.set(mcuCenterX, Y0 + 0.22, mcuCenterZ);

    const icW = 3.36;
    const icH = 0.26;
    const icD = 0.66;

    // Main dark molded epoxy body
    const icBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(icW, icH, icD)),
      mICBodyDark
    );
    icBody.position.set(0, icH / 2, 0);
    icBody.castShadow = true;
    icBody.receiveShadow = true;
    mcuGroup.add(icBody);

    // Top laser-marked face ("ATMEL 1121 / ATMEGA328P-PU" + two mold ejector circles)
    const mcuTopTex = trackTex(createAtmega328Texture(maxAnisotropy));
    const mcuTopMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: mcuTopTex,
        roughness: 0.48,
        metalness: 0.08,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const topPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(icW - 0.04, icD - 0.04)),
      mcuTopMat
    );
    topPlane.rotation.x = -Math.PI / 2;
    topPlane.position.set(0, icH + 0.002, 0);
    mcuGroup.add(topPlane);

    // Pin-1 orientation half-moon notch on the RIGHT end of the ATMEGA328P-PU (matching image.png!)
    const notchMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.11, 0.11, icH + 0.006, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x181a1d, roughness: 0.75 }))
    );
    notchMesh.position.set(icW / 2 - 0.01, icH / 2, 0);
    mcuGroup.add(notchMesh);

    // 28 Realistic Bent Silver DIP IC Leads (14 on front row, 14 on back row)
    const shoulderGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.045, 0.09));
    const upperLegGeo = trackGeo(new THREE.BoxGeometry(0.105, 0.16, 0.035));
    const lowerPinGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.14, 0.03));

    for (let i = 0; i < 14; i++) {
      const px = -1.521 + i * dipPinPitch;
      [-1, 1].forEach((side) => {
        // Horizontal shoulder emerging from mid-body
        const shoulder = new THREE.Mesh(shoulderGeo, mICLeadSilver);
        shoulder.position.set(px, icH * 0.48, side * (icD / 2 + 0.035));
        mcuGroup.add(shoulder);

        // Vertical wide upper leg bending down into socket
        const upperLeg = new THREE.Mesh(upperLegGeo, mICLeadSilver);
        upperLeg.position.set(px, icH * 0.15, side * dipRowHalfZ);
        upperLeg.castShadow = true;
        mcuGroup.add(upperLeg);

        // Narrower lower pin tip inserting into socket clip
        const lowerPin = new THREE.Mesh(lowerPinGeo, mICLeadSilver);
        lowerPin.position.set(px, -0.05, side * dipRowHalfZ);
        mcuGroup.add(lowerPin);
      });
    }

    root.add(mcuGroup);
    registerComponentGroup('atmega328p', mcuGroup);
  }

  // ─── 5. TWO SILVER SMD ELECTROLYTIC CAPACITORS ("80036 / 47 / 25V") ─────────
  {
    const capsGroup = new THREE.Group();
    capsGroup.position.set(0, Y0, 0);

    const capTopTex = trackTex(createCapacitorTopTexture(maxAnisotropy));
    const mCapTop = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: capTopTex,
        roughness: 0.24,
        metalness: 0.65,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );

    const mAluminumCan = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xdce2e6,
        roughness: 0.2,
        metalness: 0.92,
        anisotropy: 0.6,
        clearcoat: 0.2,
      })
    );

    const capPositions: Array<[number, number]> = [
      [-1.28, 1.48],
      [-0.48, 1.48],
    ];

    capPositions.forEach(([cx, cz]) => {
      const singleCap = new THREE.Group();
      singleCap.position.set(cx, 0, cz);

      // Black square SMD plastic base seat (0.68 x 0.10 x 0.68)
      const baseSeat = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.68, 0.1, 0.68)),
        mMatteBlackPlastic
      );
      baseSeat.position.y = 0.05;
      baseSeat.castShadow = true;
      baseSeat.receiveShadow = true;
      singleCap.add(baseSeat);

      // Silver SMD solder pads protruding from front/back of base
      [-0.36, 0.36].forEach((pz) => {
        const pad = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.24, 0.04, 0.12)),
          mShinySolder
        );
        pad.position.set(0, 0.02, pz);
        singleCap.add(pad);
      });

      // Cylindrical brushed aluminum can body with upper crimp ring via LatheGeometry
      const lathePoints = [
        new THREE.Vector2(0.0, 0.1),
        new THREE.Vector2(0.315, 0.1),
        new THREE.Vector2(0.315, 0.52),
        new THREE.Vector2(0.295, 0.55), // Crimp neck groove
        new THREE.Vector2(0.315, 0.58),
        new THREE.Vector2(0.315, 0.68),
        new THREE.Vector2(0.29, 0.7),
        new THREE.Vector2(0.0, 0.7),
      ];
      const canGeo = trackGeo(new THREE.LatheGeometry(lathePoints, 32));
      const canMesh = new THREE.Mesh(canGeo, mAluminumCan);
      canMesh.castShadow = true;
      canMesh.receiveShadow = true;
      singleCap.add(canMesh);

      // Printed top disc ("80036 / 47 / 25V" + black polarity crescent)
      const topDisc = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(0.295, 32)),
        mCapTop
      );
      topDisc.rotation.x = -Math.PI / 2;
      topDisc.position.y = 0.702;
      singleCap.add(topDisc);

      capsGroup.add(singleCap);
    });

    root.add(capsGroup);
    registerComponentGroup('caps_47uf', capsGroup);
  }

  // ─── 6. 16MHz HC-49/S STADIUM METAL CAN CRYSTAL OSCILLATOR ──────────────────
  {
    const xtalGroup = new THREE.Group();
    xtalGroup.position.set(-1.18, Y0, -0.14);

    // Helper for stadium/pill 2D shape
    const makeStadiumShape = (length: number, width: number) => {
      const r = width / 2;
      const straight = (length - width) / 2;
      const sh = new THREE.Shape();
      sh.moveTo(-straight, -r);
      sh.lineTo(straight, -r);
      sh.absarc(straight, 0, r, -Math.PI / 2, Math.PI / 2, false);
      sh.lineTo(-straight, r);
      sh.absarc(-straight, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
      return sh;
    };

    // Bottom solder pad & flared metal skirt flange
    const skirtGeo = trackGeo(
      new THREE.ExtrudeGeometry(makeStadiumShape(1.06, 0.46), {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.015,
        bevelSegments: 2,
      })
    );
    skirtGeo.rotateX(-Math.PI / 2);
    const skirtMesh = new THREE.Mesh(skirtGeo, mShinySolder);
    skirtMesh.position.y = 0.01;
    xtalGroup.add(skirtMesh);

    // Main brushed nickel-steel crystal can
    const canGeo = trackGeo(
      new THREE.ExtrudeGeometry(makeStadiumShape(0.96, 0.38), {
        depth: 0.24,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 3,
      })
    );
    canGeo.rotateX(-Math.PI / 2);
    const canMesh = new THREE.Mesh(canGeo, mBrushedSteel);
    canMesh.position.y = 0.05;
    canMesh.castShadow = true;
    canMesh.receiveShadow = true;
    xtalGroup.add(canMesh);

    root.add(xtalGroup);
    registerComponentGroup('crystal_16mhz', xtalGroup);
  }

  // ─── 7. ATMEGA16U2 QFN-32 USB-TO-SERIAL CHIP ───────────────────────────────
  {
    const u3Group = new THREE.Group();
    u3Group.position.set(-1.08, Y0, -0.96);

    const qfnSize = 0.48;
    const qfnH = 0.1;
    const body = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(qfnSize, qfnH, qfnSize)),
      mICBodyDark
    );
    body.position.y = qfnH / 2;
    body.castShadow = true;
    u3Group.add(body);

    const u3Tex = trackTex(createAtmega16U2Texture(maxAnisotropy));
    const u3Top = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(qfnSize - 0.02, qfnSize - 0.02)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: u3Tex,
          roughness: 0.45,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
      )
    );
    u3Top.rotation.x = -Math.PI / 2;
    u3Top.position.y = qfnH + 0.002;
    u3Group.add(u3Top);

    // 32 QFN micro-leads (8 per side)
    const leadGeoH = trackGeo(new THREE.BoxGeometry(0.028, 0.035, 0.07));
    const leadGeoV = trackGeo(new THREE.BoxGeometry(0.07, 0.035, 0.028));
    for (let i = 0; i < 8; i++) {
      const offset = -0.19 + i * 0.054;
      [-1, 1].forEach((s) => {
        const p1 = new THREE.Mesh(leadGeoH, mShinySolder);
        p1.position.set(offset, 0.02, s * (qfnSize / 2 + 0.025));
        u3Group.add(p1);

        const p2 = new THREE.Mesh(leadGeoV, mShinySolder);
        p2.position.set(s * (qfnSize / 2 + 0.025), 0.02, offset);
        u3Group.add(p2);
      });
    }

    root.add(u3Group);
    registerComponentGroup('atmega16u2', u3Group);
  }

  // ─── 8. SOT-223 5V REGULATOR ("C5 FD10"), LMV358 OP-AMP ("7CTI R5R"), POLYFUSE ("8"), M7 DIODE ──
  // 8A. 5V Regulator (U2: C5 FD10 at x = -2.32, z = +0.58)
  {
    const vregGroup = new THREE.Group();
    vregGroup.position.set(-2.32, Y0, 0.58);

    const bodyW = 0.36;
    const bodyH = 0.14;
    const bodyD = 0.62;
    const body = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(bodyW, bodyH, bodyD)),
      mICBodyDark
    );
    body.position.y = bodyH / 2;
    body.castShadow = true;
    vregGroup.add(body);

    const regTex = trackTex(createRegulatorTexture(maxAnisotropy));
    const topFace = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(bodyW - 0.02, bodyD - 0.02)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: regTex,
          roughness: 0.45,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
      )
    );
    topFace.rotation.x = -Math.PI / 2;
    topFace.position.y = bodyH + 0.002;
    vregGroup.add(topFace);

    // Large silver heatsink tab on the left (-X)
    const tab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.18, 0.04, 0.38)),
      mShinySolder
    );
    tab.position.set(-bodyW / 2 - 0.07, 0.02, 0);
    vregGroup.add(tab);

    // 3 gull-wing pins on the right (+X)
    [-0.19, 0, 0.19].forEach((lz) => {
      const leg = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.18, 0.045, 0.075)),
        mShinySolder
      );
      leg.position.set(bodyW / 2 + 0.07, 0.025, lz);
      vregGroup.add(leg);
    });

    root.add(vregGroup);
    registerComponentGroup('vreg_5v', vregGroup);
  }

  // 8B. LMV358 Op-Amp ("7CTI R5R" at x = -1.18, z = +0.46) + SOT-23-5 ("LPFG")
  {
    const opampGroup = new THREE.Group();
    opampGroup.position.set(-1.18, Y0, 0.46);

    const oaW = 0.32;
    const oaH = 0.11;
    const oaD = 0.34;
    const body = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(oaW, oaH, oaD)),
      mICBodyDark
    );
    body.position.y = oaH / 2;
    body.castShadow = true;
    opampGroup.add(body);

    const oaTex = trackTex(createOpAmpTexture(maxAnisotropy));
    const top = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(oaW - 0.02, oaD - 0.02)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: oaTex,
          roughness: 0.45,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
      )
    );
    top.rotation.x = -Math.PI / 2;
    top.position.y = oaH + 0.002;
    opampGroup.add(top);

    // 8 SOIC gull-wing pins (4 left, 4 right)
    for (let i = 0; i < 4; i++) {
      const pz = -0.11 + i * 0.073;
      [-1, 1].forEach((side) => {
        const pin = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.11, 0.035, 0.038)),
          mShinySolder
        );
        pin.position.set(side * (oaW / 2 + 0.045), 0.02, pz);
        opampGroup.add(pin);
      });
    }

    // Nearby LPFG SOT-23-5 transistor (x = -0.92, z = +0.88 -> relative (+0.26, +0.42))
    const lpfg = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.18, 0.08, 0.24)),
      mICBodyDark
    );
    lpfg.position.set(0.24, 0.04, 0.44);
    opampGroup.add(lpfg);
    [-0.07, 0.07].forEach((pz) => {
      const pL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.03, 0.04)), mShinySolder);
      pL.position.set(0.24 - 0.11, 0.015, 0.44 + pz);
      opampGroup.add(pL);
    });
    [-0.08, 0, 0.08].forEach((pz) => {
      const pR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.03, 0.04)), mShinySolder);
      pR.position.set(0.24 + 0.11, 0.015, 0.44 + pz);
      opampGroup.add(pR);
    });

    root.add(opampGroup);
    registerComponentGroup('opamp_lmv358', opampGroup);
  }

  // 8C. Golden Resettable Polyfuse ("8" at x = -2.55, z = -0.25) + 340S SOT-23 + M7 Diode
  {
    const pfGroup = new THREE.Group();
    pfGroup.position.set(-2.55, Y0, -0.25);

    const pfW = 0.28;
    const pfH = 0.09;
    const pfD = 0.42;
    const pfBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(pfW, pfH, pfD)),
      mGoldPin
    );
    pfBody.position.y = pfH / 2;
    pfBody.castShadow = true;
    pfGroup.add(pfBody);

    const pfTex = trackTex(createPolyfuseTexture(maxAnisotropy));
    const pfTop = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(pfD - 0.02, pfW - 0.02)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: pfTex,
          roughness: 0.32,
          metalness: 0.4,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
      )
    );
    pfTop.rotation.x = -Math.PI / 2;
    pfTop.rotation.z = Math.PI / 2;
    pfTop.position.y = pfH + 0.002;
    pfGroup.add(pfTop);

    // Adjacent 340S SOT-23 transistor (at relative +0.36, 0.02)
    const sotBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.15, 0.075, 0.24)),
      mICBodyDark
    );
    sotBody.position.set(0.36, 0.038, 0.02);
    pfGroup.add(sotBody);

    // M7 Reverse-Protection Diode below left capacitor (at world x = -0.96, z = +2.22 -> relative (+1.59, +2.47))
    const dW = 0.44;
    const dH = 0.14;
    const dD = 0.28;
    const diodeMesh = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(dW, dH, dD)),
      mICBodyDark
    );
    diodeMesh.position.set(1.59, dH / 2, 2.47);
    diodeMesh.castShadow = true;
    pfGroup.add(diodeMesh);

    const diodeTex = trackTex(createDiodeTexture(maxAnisotropy));
    const diodeTop = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(dW - 0.02, dD - 0.02)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: diodeTex,
          roughness: 0.48,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
      )
    );
    diodeTop.rotation.x = -Math.PI / 2;
    diodeTop.position.set(1.59, dH + 0.002, 2.47);
    pfGroup.add(diodeTop);

    // Silver SMD end pads for M7 diode
    [-0.26, 0.26].forEach((dx) => {
      const dPad = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.12, 0.04, 0.22)),
        mShinySolder
      );
      dPad.position.set(1.59 + dx, 0.02, 2.47);
      pfGroup.add(dPad);
    });

    root.add(pfGroup);
    registerComponentGroup('polyfuse', pfGroup);
  }

  // ─── 9. FEMALE PIN HEADER BANKS (TOP 10+8, BOTTOM 8+6 WITH PRINTED SIDE WALLS) ──
  const headerPitch = 0.205;
  const headerH = 0.66;
  const headerD = 0.24;

  function buildFemaleHeaderStrip(
    count: number,
    firstPinX: number,
    zPos: number,
    frontSideTex?: THREE.CanvasTexture
  ): THREE.Group {
    const strip = new THREE.Group();
    const totalW = count * headerPitch + 0.04;
    const centerX = firstPinX + ((count - 1) * headerPitch) / 2;
    strip.position.set(centerX, 0, zPos);

    // Main black plastic body
    const bodyGeo = trackGeo(new THREE.BoxGeometry(totalW, headerH, headerD));
    const bodyMesh = new THREE.Mesh(bodyGeo, mDarkHeaderPlastic);
    bodyMesh.position.y = headerH / 2;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    strip.add(bodyMesh);

    // Optional printed front-wall label texture (used on bottom POWER & ANALOG IN headers in image.png)
    if (frontSideTex) {
      const sidePlane = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(totalW - 0.02, headerH - 0.04)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: frontSideTex,
            roughness: 0.55,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
          })
        )
      );
      sidePlane.position.set(0, headerH / 2, headerD / 2 + 0.002);
      strip.add(sidePlane);
    }

    // Recessed square socket cavities + inner metallic contact fork for each pin
    const cavityGeo = trackGeo(new THREE.BoxGeometry(0.115, 0.08, 0.115));
    const contactGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.04, 0.055));

    for (let i = 0; i < count; i++) {
      const localX = (i - (count - 1) / 2) * headerPitch;
      const cav = new THREE.Mesh(cavityGeo, mCavityBlack);
      cav.position.set(localX, headerH - 0.035, 0);
      strip.add(cav);

      const contact = new THREE.Mesh(contactGeo, mICLeadSilver);
      contact.position.set(localX, headerH - 0.06, 0);
      strip.add(contact);
    }

    return strip;
  }

  // Top Digital Female Headers (10-pin left + 8-pin right)
  {
    const topHeadersGroup = new THREE.Group();
    topHeadersGroup.position.set(0, Y0, 0);
    topHeadersGroup.add(buildFemaleHeaderStrip(10, -0.95, -2.38));
    topHeadersGroup.add(buildFemaleHeaderStrip(8, 1.18, -2.38));
    root.add(topHeadersGroup);
    registerComponentGroup('headers_digital', topHeadersGroup);
  }

  // Bottom Power (8-pin) & Analog In (6-pin) Female Headers with front-wall white markings
  {
    const botHeadersGroup = new THREE.Group();
    botHeadersGroup.position.set(0, Y0, 0);
    const pwrSideTex = trackTex(createPowerHeaderSideTexture(maxAnisotropy));
    const anaSideTex = trackTex(createAnalogHeaderSideTexture(maxAnisotropy));

    botHeadersGroup.add(buildFemaleHeaderStrip(8, -0.22, 2.38, pwrSideTex));
    botHeadersGroup.add(buildFemaleHeaderStrip(6, 1.62, 2.38, anaSideTex));
    root.add(botHeadersGroup);
    registerComponentGroup('headers_bottom', botHeadersGroup);
  }

  // ─── 10. DUAL 2x3 ICSP MALE PIN HEADERS ─────────────────────────────────────
  {
    const icspGroup = new THREE.Group();
    icspGroup.position.set(0, Y0, 0);

    const buildICSPBlock = (cx: number, cz: number, rotate90 = false) => {
      const g = new THREE.Group();
      g.position.set(cx, 0, cz);
      if (rotate90) g.rotation.y = Math.PI / 2;

      // 2x3 scalloped black plastic base
      const base = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.44, 0.18, 0.64)),
        mDarkHeaderPlastic
      );
      base.position.y = 0.09;
      base.castShadow = true;
      g.add(base);

      // 6 square metallic pins with beveled tips
      const pinShaftGeo = trackGeo(new THREE.BoxGeometry(0.052, 0.58, 0.052));
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          const pin = new THREE.Mesh(pinShaftGeo, mICLeadSilver);
          pin.position.set((c - 0.5) * 0.2, 0.34, (r - 1) * 0.2);
          pin.castShadow = true;
          g.add(pin);
        }
      }
      return g;
    };

    // Top-left ICSP1 header above JP2 (x = -1.42, z = -1.88)
    icspGroup.add(buildICSPBlock(-1.42, -1.88, false));
    // Right-edge ICSP header above ATMEGA328P right end (x = +2.85, z = -0.52)
    icspGroup.add(buildICSPBlock(2.85, -0.52, false));

    root.add(icspGroup);
    registerComponentGroup('icsp_headers', icspGroup);
  }

  // ─── 11. SMD LEDS (ON, L, TX, RX) & PASSIVE SMD NETWORKS ───────────────────
  const mLedOn = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4ff33,
      emissive: 0x66cc00,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    })
  );
  const mLedL = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffcc22,
      emissive: 0xff9900,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  );
  const mLedTx = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffcc22,
      emissive: 0xffaa00,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    })
  );
  const mLedRx = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffcc22,
      emissive: 0xffaa00,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    })
  );

  const buildSmdLed = (x: number, z: number, lensMat: THREE.MeshStandardMaterial) => {
    const g = new THREE.Group();
    g.position.set(x, Y0, z);
    // Silver end terminals
    [-0.08, 0.08].forEach((dx) => {
      const term = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.055, 0.045, 0.095)),
        mShinySolder
      );
      term.position.set(dx, 0.022, 0);
      g.add(term);
    });
    // Translucent yellow-amber/green emitter dome
    const lens = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.11, 0.065, 0.09)),
      lensMat
    );
    lens.position.set(0, 0.035, 0);
    g.add(lens);
    root.add(g);
  };

  buildSmdLed(2.12, -1.12, mLedOn);   // ON LED
  buildSmdLed(-0.52, -1.52, mLedL);   // Pin 13 L LED
  buildSmdLed(-0.52, -1.02, mLedTx);  // TX LED
  buildSmdLed(-0.52, -0.82, mLedRx);  // RX LED

  const lightOn = new THREE.PointLight(0x88ff22, 0.35, 1.4);
  lightOn.position.set(2.12, Y0 + 0.22, -1.12);
  root.add(lightOn);

  const lightL = new THREE.PointLight(0xffaa00, 0.25, 1.2);
  lightL.position.set(-0.52, Y0 + 0.22, -1.52);
  root.add(lightL);

  const lightTx = new THREE.PointLight(0xffaa00, 0.2, 1.0);
  lightTx.position.set(-0.52, Y0 + 0.22, -1.02);
  root.add(lightTx);

  const lightRx = new THREE.PointLight(0xffaa00, 0.2, 1.0);
  lightRx.position.set(-0.52, Y0 + 0.22, -0.82);
  root.add(lightRx);

  // 4-Element SMD Resistor Arrays ("102" packs visible in image.png)
  const buildResistorPack = (x: number, z: number) => {
    const g = new THREE.Group();
    g.position.set(x, Y0, z);
    const body = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.14, 0.055, 0.28)),
      mResistorBlack
    );
    body.position.y = 0.028;
    g.add(body);
    for (let i = 0; i < 4; i++) {
      const pz = -0.105 + i * 0.07;
      [-0.075, 0.075].forEach((px) => {
        const leg = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.035, 0.05, 0.038)),
          mShinySolder
        );
        leg.position.set(px, 0.025, pz);
        g.add(leg);
      });
    }
    root.add(g);
  };

  buildResistorPack(-1.88, -1.12); // Left of JP2
  buildResistorPack(-0.52, -1.28); // Between L and TX LEDs
  buildResistorPack(-0.52, 0.12);  // Left of ATMEGA328P pin 1
  buildResistorPack(2.12, -0.88);  // Below ON LED

  // Small SMD 0805 / 0603 MLCC Capacitors & Resistors scattered in exact positions from image.png
  const smdPassives: Array<[number, number, boolean, boolean]> = [
    // [x, z, rotate90, isCapacitor]
    [-1.88, -1.62, false, true],
    [-1.88, -1.42, false, true],
    [-1.88, -0.82, false, true],
    [-1.72, -0.45, true, true],
    [-1.45, -0.45, true, true],
    [-0.82, -0.45, true, true],
    [-0.52, -0.62, false, true],
    [-0.52, -0.45, false, true],
    [-0.52, -0.18, false, false], // RESET-EN bridge
    [-1.38, 0.88, false, true],
    [-0.68, 0.88, false, true],
    [0.62, 1.18, false, true],
    [2.38, -0.62, true, true],
    [1.82, -0.62, true, true],
    [-2.02, -2.25, false, true],
  ];

  const capBodyGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.06, 0.08));
  const capTermGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.062, 0.082));

  smdPassives.forEach(([sx, sz, rot90, isCap], idx) => {
    const g = new THREE.Group();
    g.position.set(sx, Y0, sz);
    if (rot90) g.rotation.y = Math.PI / 2;

    const mat = isCap ? (idx % 2 === 0 ? mCeramicTan : mCeramicDarkBrown) : mResistorBlack;
    const body = new THREE.Mesh(capBodyGeo, mat);
    body.position.y = 0.03;
    g.add(body);

    [-0.065, 0.065].forEach((dx) => {
      const term = new THREE.Mesh(capTermGeo, mShinySolder);
      term.position.set(dx, 0.031, 0);
      g.add(term);
    });

    root.add(g);
  });

  // ─── INTERACTIVE EXPLODED VIEW & HIGHLIGHTING API ───────────────────────────
  const setExplodeFactor = (factor: number) => {
    explodableGroups.forEach(({ group, baseY, explodeHeight }) => {
      group.position.y = baseY + calculateExplodedOffset(explodeHeight, factor);
    });
  };

  let currentHighlightedId: string | null = null;
  const originalEmissives = new Map<THREE.MeshStandardMaterial, { hex: number; intensity: number }>();

  const setHighlightedComponent = (id: string | null) => {
    if (currentHighlightedId === id) return;
    // Restore previous
    originalEmissives.forEach((orig, mat) => {
      mat.emissive.setHex(orig.hex);
      mat.emissiveIntensity = orig.intensity;
    });
    originalEmissives.clear();
    currentHighlightedId = id;

    if (!id) return;
    const entry = explodableGroups.get(id);
    if (!entry) return;

    entry.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissive && !originalEmissives.has(mat)) {
          originalEmissives.set(mat, {
            hex: mat.emissive.getHex(),
            intensity: mat.emissiveIntensity,
          });
          mat.emissive.setHex(0x007c82);
          mat.emissiveIntensity = 0.35;
        }
      }
    });
  };

  const dispose = () => {
    geometriesToDispose.forEach((g) => g.dispose());
    materialsToDispose.forEach((m) => m.dispose());
    texturesToDispose.forEach((t) => t.dispose());
  };

  return {
    root,
    explodableGroups,
    selectableMeshes,
    ledMaterials: {
      on: mLedOn,
      l: mLedL,
      tx: mLedTx,
      rx: mLedRx,
    },
    ledLights: {
      on: lightOn,
      l: lightL,
      tx: lightTx,
      rx: lightRx,
    },
    setExplodeFactor,
    setHighlightedComponent,
    dispose,
  };
}
