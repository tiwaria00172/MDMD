// ===================== PRO-ERGO SPORT EDITION — NEURA 3D =====================
(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;
  const wrap = document.getElementById('canvas-wrap');
  const W = wrap.clientWidth, H = wrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0.5, 6.0);

  // ==================== LIGHTING ====================
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.position.set(5, 8, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); scene.add(key);
  const fill = new THREE.DirectionalLight(0x6699cc, 0.5);
  fill.position.set(-5, 3, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x2244aa, 0.35);
  rim.position.set(0, -3, -5); scene.add(rim);
  const topSpot = new THREE.PointLight(0x4488ff, 0.35, 14);
  topSpot.position.set(0, 5, 0); scene.add(topSpot);
  const underGlow = new THREE.PointLight(0x2E86FF, 0.2, 8);
  underGlow.position.set(0, -2, 2); scene.add(underGlow);

  // ==================== MATERIALS ====================
  // Main band — charcoal sport-mesh fabric
  const bandFabricMat = new THREE.MeshStandardMaterial({
    color: 0x2a2d34, roughness: 0.88, metalness: 0.02
  });
  // Inner lining — darker, silicone grip
  const innerLiningMat = new THREE.MeshStandardMaterial({
    color: 0x1a1c22, roughness: 0.95, metalness: 0.0
  });
  // TPE bridge — semi-rigid, slightly glossy
  const tpeBridgeMat = new THREE.MeshStandardMaterial({
    color: 0x222630, roughness: 0.7, metalness: 0.08
  });
  // Brain Pod — matte soft-touch PC/ABS
  const podMat = new THREE.MeshStandardMaterial({
    color: 0x1c1f28, roughness: 0.72, metalness: 0.12
  });
  // Pod accent
  const podAccentMat = new THREE.MeshStandardMaterial({
    color: 0x282c38, roughness: 0.6, metalness: 0.15
  });
  // Electrode — polished silver
  const electrodeMat = new THREE.MeshStandardMaterial({
    color: 0xd0d4e0, roughness: 0.12, metalness: 0.95
  });
  // Electrode ring
  const electrodeRingMat = new THREE.MeshStandardMaterial({
    color: 0xe0e4f0, roughness: 0.08, metalness: 0.98
  });
  // Blue accent / LED
  const accentBlueMat = new THREE.MeshStandardMaterial({
    color: 0x2E86FF, roughness: 0.3, metalness: 0.4,
    emissive: 0x0055BB, emissiveIntensity: 0.6
  });
  // LED strip light pipe
  const ledStripMat = new THREE.MeshStandardMaterial({
    color: 0x00C48C, roughness: 0.2, metalness: 0.3,
    emissive: 0x00C48C, emissiveIntensity: 1.0,
    transparent: true, opacity: 0.85
  });
  // Battery casing
  const batteryMat = new THREE.MeshStandardMaterial({
    color: 0x20232a, roughness: 0.78, metalness: 0.1
  });
  // USB-C metallic
  const usbMat = new THREE.MeshStandardMaterial({
    color: 0x8890a0, roughness: 0.25, metalness: 0.85
  });
  // Magnetic clasp
  const claspMat = new THREE.MeshStandardMaterial({
    color: 0x888ea0, roughness: 0.3, metalness: 0.7
  });
  // Mesh texture lines (for fabric detail)
  const meshLineMat = new THREE.MeshStandardMaterial({
    color: 0x343842, roughness: 0.85, metalness: 0.02
  });

  const group = new THREE.Group();
  scene.add(group);

  // ==================== A. MAIN SPORT-MESH BAND ====================
  // Full-circle headband (wider, ~40mm = 0.20 in scene units)
  const bandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.0, 0.0, 0.0),
    new THREE.Vector3(-2.6, 0.15, -0.8),
    new THREE.Vector3(-1.8, 0.45, -1.5),
    new THREE.Vector3(-0.8, 0.70, -1.8),
    new THREE.Vector3(0.0, 0.80, -1.85),
    new THREE.Vector3(0.8, 0.70, -1.8),
    new THREE.Vector3(1.8, 0.45, -1.5),
    new THREE.Vector3(2.6, 0.15, -0.8),
    new THREE.Vector3(3.0, 0.0, 0.0),
  ], false);

  // Outer band — wide and sporty
  const bandShape = new THREE.Shape();
  bandShape.moveTo(-0.10, -0.10);
  bandShape.lineTo(0.10, -0.10);
  bandShape.quadraticCurveTo(0.12, -0.10, 0.12, -0.08);
  bandShape.lineTo(0.12, 0.08);
  bandShape.quadraticCurveTo(0.12, 0.10, 0.10, 0.10);
  bandShape.lineTo(-0.10, 0.10);
  bandShape.quadraticCurveTo(-0.12, 0.10, -0.12, 0.08);
  bandShape.lineTo(-0.12, -0.08);
  bandShape.quadraticCurveTo(-0.12, -0.10, -0.10, -0.10);
  const bandGeo = new THREE.ExtrudeGeometry(bandShape, {
    steps: 100, bevelEnabled: false, extrudePath: bandCurve
  });
  const bandMesh = new THREE.Mesh(bandGeo, bandFabricMat);
  bandMesh.castShadow = true; bandMesh.receiveShadow = true;
  group.add(bandMesh);

  // Inner lining layer
  const innerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.92, 0.0, 0.02),
    new THREE.Vector3(-2.52, 0.15, -0.76),
    new THREE.Vector3(-1.74, 0.45, -1.44),
    new THREE.Vector3(-0.78, 0.70, -1.74),
    new THREE.Vector3(0.0, 0.78, -1.79),
    new THREE.Vector3(0.78, 0.70, -1.74),
    new THREE.Vector3(1.74, 0.45, -1.44),
    new THREE.Vector3(2.52, 0.15, -0.76),
    new THREE.Vector3(2.92, 0.0, 0.02),
  ], false);
  const innerShape = new THREE.Shape();
  innerShape.moveTo(-0.08, -0.07);
  innerShape.lineTo(0.08, -0.07);
  innerShape.lineTo(0.08, -0.02);
  innerShape.lineTo(-0.08, -0.02);
  innerShape.closePath();
  const innerGeo = new THREE.ExtrudeGeometry(innerShape, {
    steps: 80, bevelEnabled: false, extrudePath: innerCurve
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerLiningMat);
  group.add(innerMesh);

  // Fabric mesh texture lines on outer band
  for (let i = 0; i < 18; i++) {
    const t = (i + 1) / 19;
    const pt = bandCurve.getPoint(t);
    const tangent = bandCurve.getTangent(t);
    const lineGeo = new THREE.BoxGeometry(0.005, 0.19, 0.25);
    const lineMesh = new THREE.Mesh(lineGeo, meshLineMat);
    lineMesh.position.copy(pt);
    lineMesh.lookAt(pt.clone().add(tangent));
    group.add(lineMesh);
  }

  // Silicone micro-dots on inner surface
  for (let i = 0; i < 30; i++) {
    const t = (i + 1) / 31;
    const pt = innerCurve.getPoint(t);
    const dotGeo = new THREE.SphereGeometry(0.008, 6, 6);
    const dotMesh = new THREE.Mesh(dotGeo, innerLiningMat);
    dotMesh.position.set(pt.x, pt.y - 0.06, pt.z);
    group.add(dotMesh);
  }

  // ==================== B. FRONTAL SENSOR ARRAY ====================
  // TPE Bridge — curved to forehead radius
  const bridgeCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.55, 0.76, -1.84),
    new THREE.Vector3(0.0, 0.82, -1.90),
    new THREE.Vector3(0.55, 0.76, -1.84)
  );
  const bridgeShape = new THREE.Shape();
  bridgeShape.moveTo(-0.04, -0.06);
  bridgeShape.lineTo(0.04, -0.06);
  bridgeShape.lineTo(0.04, 0.03);
  bridgeShape.lineTo(-0.04, 0.03);
  bridgeShape.closePath();
  const bridgeGeo = new THREE.ExtrudeGeometry(bridgeShape, {
    steps: 30, bevelEnabled: false, extrudePath: bridgeCurve
  });
  const bridgeMesh = new THREE.Mesh(bridgeGeo, tpeBridgeMat);
  group.add(bridgeMesh);

  // 3 Spring-loaded electrodes (Fp1, Fpz, Fp2)
  const electrodePositions = [
    { x: -0.30, label: 'Fp1' },
    { x: 0.0, label: 'Fpz' },
    { x: 0.30, label: 'Fp2' }
  ];
  electrodePositions.forEach((ep) => {
    const t = (ep.x + 0.55) / 1.1;
    const pt = bridgeCurve.getPoint(t);

    // Electrode housing (cylindrical)
    const housingGeo = new THREE.CylinderGeometry(0.055, 0.06, 0.04, 20);
    const housingMesh = new THREE.Mesh(housingGeo, tpeBridgeMat);
    housingMesh.rotation.x = Math.PI / 2;
    housingMesh.position.set(pt.x, pt.y - 0.04, pt.z - 0.03);
    group.add(housingMesh);

    // Spring casing
    const springGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.025, 12);
    const springMesh = new THREE.Mesh(springGeo, new THREE.MeshStandardMaterial({
      color: 0x666677, roughness: 0.4, metalness: 0.6
    }));
    springMesh.rotation.x = Math.PI / 2;
    springMesh.position.set(pt.x, pt.y - 0.04, pt.z - 0.05);
    group.add(springMesh);

    // Polished electrode pin (protruding contact)
    const pinGeo = new THREE.CylinderGeometry(0.035, 0.038, 0.025, 20);
    const pinMesh = new THREE.Mesh(pinGeo, electrodeMat);
    pinMesh.rotation.x = Math.PI / 2;
    pinMesh.position.set(pt.x, pt.y - 0.04, pt.z - 0.07);
    pinMesh.castShadow = true;
    group.add(pinMesh);

    // Electrode accent ring
    const ringGeo = new THREE.TorusGeometry(0.042, 0.005, 8, 24);
    const ringMesh = new THREE.Mesh(ringGeo, electrodeRingMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(pt.x, pt.y - 0.04, pt.z - 0.065);
    group.add(ringMesh);

    // Contact tip dot
    const tipGeo = new THREE.SphereGeometry(0.012, 10, 10);
    const tipMesh = new THREE.Mesh(tipGeo, electrodeMat);
    tipMesh.position.set(pt.x, pt.y - 0.04, pt.z - 0.085);
    group.add(tipMesh);
  });

  // Haptic motor behind Fpz (center electrode)
  const hapticGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.012, 16);
  const hapticMat = new THREE.MeshStandardMaterial({
    color: 0x444455, roughness: 0.5, metalness: 0.3
  });
  const hapticMesh = new THREE.Mesh(hapticGeo, hapticMat);
  hapticMesh.rotation.x = Math.PI / 2;
  hapticMesh.position.set(0.0, 0.78, -1.76);
  group.add(hapticMesh);

  // ==================== C. BRAIN POD (Right Temple) ====================
  const podCenter = bandCurve.getPoint(0.88); // right temple area
  const podGroup = new THREE.Group();
  podGroup.position.copy(podCenter);
  podGroup.position.y += 0.02;
  podGroup.rotation.y = -0.65;
  podGroup.rotation.x = 0.1;

  // Pebble-shaped pod body — rounded box
  const podBodyGeo = new THREE.BoxGeometry(0.62, 0.30, 0.12);
  // Manually smooth edges with a slight bevel look
  const podBody = new THREE.Mesh(podBodyGeo, podMat);
  podBody.castShadow = true;
  podGroup.add(podBody);

  // Pod top cap (rounded)
  const podCapGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.62, 16);
  const podCap = new THREE.Mesh(podCapGeo, podMat);
  podCap.rotation.z = Math.PI / 2;
  podCap.position.set(0, 0.0, 0.0);
  podCap.scale.set(1, 0.4, 0.8);
  podGroup.add(podCap);

  // Pod accent trim line
  const podTrimGeo = new THREE.BoxGeometry(0.58, 0.015, 0.125);
  const podTrim = new THREE.Mesh(podTrimGeo, accentBlueMat);
  podTrim.position.set(0, 0.12, 0);
  podGroup.add(podTrim);

  // LED Light Pipe strip (thin diffusion strip on outer face)
  const ledGeo = new THREE.BoxGeometry(0.40, 0.018, 0.005);
  const ledStrip = new THREE.Mesh(ledGeo, ledStripMat);
  ledStrip.position.set(0, 0.05, 0.063);
  podGroup.add(ledStrip);

  // LED glow backing
  const ledGlowGeo = new THREE.BoxGeometry(0.42, 0.030, 0.008);
  const ledGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00C48C, transparent: true, opacity: 0.15
  });
  const ledGlow = new THREE.Mesh(ledGlowGeo, ledGlowMat);
  ledGlow.position.set(0, 0.05, 0.067);
  podGroup.add(ledGlow);

  // Recessed power button (bottom edge)
  const btnGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12);
  const btnMat = new THREE.MeshStandardMaterial({
    color: 0x555566, roughness: 0.4, metalness: 0.5
  });
  const btnMesh = new THREE.Mesh(btnGeo, btnMat);
  btnMesh.rotation.x = Math.PI / 2;
  btnMesh.position.set(0.15, -0.15, 0.055);
  podGroup.add(btnMesh);
  // Button recess
  const btnRecessGeo = new THREE.CylinderGeometry(0.030, 0.030, 0.006, 12);
  const btnRecess = new THREE.Mesh(btnRecessGeo, new THREE.MeshStandardMaterial({
    color: 0x111118, roughness: 0.8
  }));
  btnRecess.rotation.x = Math.PI / 2;
  btnRecess.position.set(0.15, -0.15, 0.050);
  podGroup.add(btnRecess);

  // USB-C port (rear edge)
  const usbBodyGeo = new THREE.BoxGeometry(0.10, 0.042, 0.025);
  const usbBody = new THREE.Mesh(usbBodyGeo, usbMat);
  usbBody.position.set(-0.30, -0.05, 0);
  podGroup.add(usbBody);
  // USB-C inner slot
  const usbSlotGeo = new THREE.BoxGeometry(0.065, 0.022, 0.008);
  const usbSlot = new THREE.Mesh(usbSlotGeo, new THREE.MeshStandardMaterial({
    color: 0x0a0a15, roughness: 0.5, metalness: 0.3
  }));
  usbSlot.position.set(-0.312, -0.05, 0);
  podGroup.add(usbSlot);
  // Silicone dust cover (slightly ajar)
  const dustCoverGeo = new THREE.BoxGeometry(0.12, 0.055, 0.010);
  const dustCoverMat = new THREE.MeshStandardMaterial({
    color: 0x2a2d38, roughness: 0.92, metalness: 0.0
  });
  const dustCover = new THREE.Mesh(dustCoverGeo, dustCoverMat);
  dustCover.position.set(-0.315, -0.05, 0.012);
  dustCover.rotation.y = 0.15;
  podGroup.add(dustCover);

  // Snap-fit cradle line (where pod meets the band fabric)
  const cradleGeo = new THREE.BoxGeometry(0.64, 0.005, 0.14);
  const cradleMesh = new THREE.Mesh(cradleGeo, meshLineMat);
  cradleMesh.position.set(0, -0.155, 0);
  podGroup.add(cradleMesh);

  // Internal PCBA hint (visible through a small window)
  const windowGeo = new THREE.BoxGeometry(0.14, 0.08, 0.003);
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x0A1420, roughness: 0.3, metalness: 0.2,
    transparent: true, opacity: 0.7
  });
  const windowMesh = new THREE.Mesh(windowGeo, windowMat);
  windowMesh.position.set(-0.10, 0.02, 0.064);
  podGroup.add(windowMesh);
  // IC chip visible through window
  const icGeo = new THREE.BoxGeometry(0.06, 0.04, 0.004);
  const icMat = new THREE.MeshStandardMaterial({
    color: 0x0e1218, roughness: 0.3, metalness: 0.5
  });
  const icMesh = new THREE.Mesh(icGeo, icMat);
  icMesh.position.set(-0.10, 0.02, 0.060);
  podGroup.add(icMesh);

  group.add(podGroup);

  // ==================== D. BATTERY COUNTERWEIGHT (Left Temple) ====================
  const batCenter = bandCurve.getPoint(0.12); // left temple
  const batGroup = new THREE.Group();
  batGroup.position.copy(batCenter);
  batGroup.position.y += 0.02;
  batGroup.rotation.y = 0.65;
  batGroup.rotation.x = 0.1;

  // Slim curved battery pack
  const batBodyGeo = new THREE.BoxGeometry(0.50, 0.22, 0.08);
  const batBody = new THREE.Mesh(batBodyGeo, batteryMat);
  batBody.castShadow = true;
  batGroup.add(batBody);

  // Battery cap roundness
  const batCapGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.50, 16);
  const batCap = new THREE.Mesh(batCapGeo, batteryMat);
  batCap.rotation.z = Math.PI / 2;
  batCap.scale.set(1, 0.35, 0.73);
  batGroup.add(batCap);

  // Battery indicator dots (4 LEDs)
  for (let i = 0; i < 4; i++) {
    const bDotGeo = new THREE.SphereGeometry(0.010, 8, 8);
    const bDotMat = new THREE.MeshStandardMaterial({
      color: i < 3 ? 0x00C48C : 0x333340,
      emissive: i < 3 ? 0x00C48C : 0x000000,
      emissiveIntensity: i < 3 ? 0.6 : 0,
      roughness: 0.3
    });
    const bDot = new THREE.Mesh(bDotGeo, bDotMat);
    bDot.position.set(-0.12 + i * 0.06, 0.08, 0.042);
    batGroup.add(bDot);
  }

  // "1200mAh" label area (subtle indent)
  const labelGeo = new THREE.BoxGeometry(0.20, 0.04, 0.003);
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0x2a2e38, roughness: 0.7, metalness: 0.1
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.set(0.05, -0.05, 0.042);
  batGroup.add(labelMesh);

  group.add(batGroup);

  // ==================== E. MAGNETIC CLASP (Back) ====================
  const backPt = bandCurve.getPoint(0.0); // back of head (start)
  const claspGroup = new THREE.Group();
  claspGroup.position.set(backPt.x, backPt.y, backPt.z);

  // Two magnetic halves
  [-0.08, 0.08].forEach(offset => {
    const halfGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.10, 12);
    const halfMesh = new THREE.Mesh(halfGeo, claspMat);
    halfMesh.rotation.z = Math.PI / 2;
    halfMesh.position.set(offset, 0, 0);
    claspGroup.add(halfMesh);
  });
  // Clasp accent ring
  const claspRingGeo = new THREE.TorusGeometry(0.065, 0.008, 8, 24);
  const claspRing = new THREE.Mesh(claspRingGeo, accentBlueMat);
  claspRing.rotation.y = Math.PI / 2;
  claspGroup.add(claspRing);

  group.add(claspGroup);

  // ==================== F. INTERNAL WIRING RIBBONS ====================
  // Silver-ink traces visible as subtle lines through fabric
  const wireCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.30, 0.74, -1.82),
    new THREE.Vector3(-1.2, 0.55, -1.55),
    new THREE.Vector3(-2.0, 0.35, -1.2),
    bandCurve.getPoint(0.12),
  ], false);
  const wireGeo1 = new THREE.TubeGeometry(wireCurve1, 20, 0.006, 4, false);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x445566, roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.5
  });
  group.add(new THREE.Mesh(wireGeo1, wireMat));

  const wireCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.30, 0.74, -1.82),
    new THREE.Vector3(1.2, 0.55, -1.55),
    new THREE.Vector3(2.0, 0.35, -1.2),
    bandCurve.getPoint(0.88),
  ], false);
  const wireGeo2 = new THREE.TubeGeometry(wireCurve2, 20, 0.006, 4, false);
  group.add(new THREE.Mesh(wireGeo2, wireMat));

  // ==================== POSITION GROUP ====================
  group.position.y = -0.15;
  group.rotation.x = 0.2;

  // ==================== INTERACTION ====================
  let isDragging = false, lastX = 0, lastY = 0;
  let rotX = 0.2, rotY = 0;

  canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotY += (e.clientX - lastX) * 0.008;
    rotX += (e.clientY - lastY) * 0.004;
    rotX = Math.max(-0.7, Math.min(1.0, rotX));
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('touchstart', e => { isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    rotY += (e.touches[0].clientX - lastX) * 0.008;
    rotX += (e.touches[0].clientY - lastY) * 0.004;
    rotX = Math.max(-0.7, Math.min(1.0, rotX));
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  });
  canvas.addEventListener('wheel', e => {
    camera.position.z = Math.max(3.5, Math.min(10, camera.position.z + e.deltaY * 0.005));
    e.preventDefault();
  }, { passive: false });

  // ==================== ANIMATION LOOP ====================
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    if (!isDragging) rotY += 0.003;
    group.rotation.y = rotY;
    group.rotation.x = rotX;

    // LED strip pulse (Solid Green = Focus mode)
    ledStripMat.emissiveIntensity = 0.7 + Math.sin(t * 1.5) * 0.3;
    ledGlowMat.opacity = 0.10 + Math.sin(t * 1.5) * 0.08;

    // Blue accent gentle pulse
    accentBlueMat.emissiveIntensity = 0.4 + Math.sin(t * 1.2) * 0.2;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const W2 = wrap.clientWidth, H2 = wrap.clientHeight;
    camera.aspect = W2 / H2; camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });
})();
