import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../services/soundFx';
import { Zap, RotateCw, Eye, Sparkles } from 'lucide-react';

interface Hero3DCanvasProps {
  onInteract?: () => void;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [coreMode, setCoreMode] = useState<'quantum' | 'dyson' | 'singularity'>('quantum');
  const [isSurging, setIsSurging] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  // Mutable refs to pass into the continuous animation loop without re-triggering useEffect
  const modeRef = useRef<'quantum' | 'dyson' | 'singularity'>('quantum');
  const surgeRef = useRef<number>(0);
  const speedRef = useRef<number>(1);
  const wireframeRef = useRef<boolean>(false);

  useEffect(() => {
    modeRef.current = coreMode;
  }, [coreMode]);

  useEffect(() => {
    speedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    wireframeRef.current = wireframeMode;
  }, [wireframeMode]);

  const triggerSurge = () => {
    setIsSurging(true);
    surgeRef.current = 1.0;
    soundFx.playEnergySurge();
    if (onInteract) onInteract();
    setTimeout(() => {
      setIsSurging(false);
    }, 1200);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Renderer setup with high color fidelity & ACES tone mapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // 4. Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0x06b6d4, 3.5);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    // Cool fill light
    const fillLight = new THREE.DirectionalLight(0x3b82f6, 2.2);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    // Orange accent backlight / rim light
    const rimLight = new THREE.PointLight(0xf97316, 4.0, 15);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // Ambient hemisphere light
    const hemiLight = new THREE.HemisphereLight(0x0891b2, 0x020617, 1.0);
    scene.add(hemiLight);

    // 6. BUILD PROCEDURAL 3D ENERGY CORE (Composite 8-part THREE.Group)
    const masterCoreGroup = new THREE.Group();
    scene.add(masterCoreGroup);

    // Part 1: Central Glowing Crystalline Geode
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
    masterCoreGroup.add(innerCoreMesh);

    // Part 2: Inner Wireframe Lattice Shell
    const wireGeo = new THREE.IcosahedronGeometry(1.35, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterCoreGroup.add(wireMesh);

    // Part 3: Gyroscopic Gimbal Ring 1 (Horizontal Cyber Ring)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.07, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    masterCoreGroup.add(ring1Mesh);

    // Part 4: Gyroscopic Gimbal Ring 2 (Vertical Angled Ring)
    const ring2Geo = new THREE.TorusGeometry(2.5, 0.05, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0xf97316,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 3;
    ring2Mesh.rotation.y = Math.PI / 6;
    masterCoreGroup.add(ring2Mesh);

    // Part 5: Gyroscopic Outer Ring 3 with Segmented Teeth
    const ring3Geo = new THREE.TorusGeometry(2.9, 0.04, 16, 90);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x0e7490,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.3,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = -Math.PI / 4;
    ring3Mesh.rotation.z = Math.PI / 5;
    masterCoreGroup.add(ring3Mesh);

    // Part 6: Segmented Floating Dyson Shards (8 orbiting plates)
    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.BoxGeometry(0.35, 0.08, 0.6);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const shardCount = 8;
    const shardRadius = 1.9;
    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const shardMesh = new THREE.Mesh(shardGeo, shardMat);
      shardMesh.position.set(Math.cos(angle) * shardRadius, 0, Math.sin(angle) * shardRadius);
      shardMesh.rotation.y = -angle;
      shardsGroup.add(shardMesh);
    }
    masterCoreGroup.add(shardsGroup);

    // Part 7: Orbiting Quantum Data Shards (tetrahedrons)
    const quantumGroup = new THREE.Group();
    const tetraGeo = new THREE.TetrahedronGeometry(0.18);
    const tetraMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xfb923c,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.2,
    });
    const tetraCount = 6;
    const tetras: THREE.Mesh[] = [];
    for (let i = 0; i < tetraCount; i++) {
      const m = new THREE.Mesh(tetraGeo, tetraMat);
      quantumGroup.add(m);
      tetras.push(m);
    }
    masterCoreGroup.add(quantumGroup);

    // Part 8: Procedural Cosmic Particle Ring
    const particleCount = isSoftwareGl ? 450 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pDist = 2.4 + Math.random() * 2.8;
      const pY = (Math.random() - 0.5) * 1.4;

      particlePositions[i * 3] = Math.cos(pAngle) * pDist;
      particlePositions[i * 3 + 1] = pY;
      particlePositions[i * 3 + 2] = Math.sin(pAngle) * pDist;

      // Color variation between neon cyan and orange/blue
      const isOrange = Math.random() > 0.75;
      if (isOrange) {
        particleColors[i * 3] = 0.98;
        particleColors[i * 3 + 1] = 0.45;
        particleColors[i * 3 + 2] = 0.08;
      } else {
        particleColors[i * 3] = 0.02;
        particleColors[i * 3 + 1] = 0.71;
        particleColors[i * 3 + 2] = 0.83;
      }
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    masterCoreGroup.add(particlesMesh);

    // Part 9: Holographic Floor Projection / Contact Grounding Ring
    const floorGeo = new THREE.RingGeometry(1.6, 3.4, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -2.4;
    floorMesh.rotation.x = Math.PI / 2;
    masterCoreGroup.add(floorMesh);

    // Interactive Drag Orbit Variables
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.005;

      // Limit pitch
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    let targetCamZ = 7.5;
    let currentCamZ = 7.5;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCamZ += e.deltaY * 0.006;
      targetCamZ = Math.max(4.2, Math.min(10.5, targetCamZ));
    };

    const canvasDom = renderer.domElement;
    canvasDom.style.touchAction = 'none';
    canvasDom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvasDom.addEventListener('wheel', onWheel, { passive: false });

    canvasDom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Continuous Animation Loop with Skill Pacing
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Exponential damping for manual orbit & zoom
      currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 8, delta);
      currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 8, delta);
      currentCamZ = THREE.MathUtils.damp(currentCamZ, targetCamZ, 6, delta);
      camera.position.z = currentCamZ;

      // Surge damping
      if (surgeRef.current > 0.001) {
        surgeRef.current = THREE.MathUtils.damp(surgeRef.current, 0, 3, delta);
      } else {
        surgeRef.current = 0;
      }

      const effectiveSpeed = speedRef.current;
      const surgeBonus = surgeRef.current * 3.5;

      // Rotate master core with drag & idle motion
      masterCoreGroup.rotation.y = currentRotY + elapsed * 0.25 * effectiveSpeed;
      masterCoreGroup.rotation.x = currentRotX + Math.sin(elapsed * 0.8) * 0.04;

      // Inner geode pulsing
      const pulseScale = 1.0 + Math.sin(elapsed * 3.5) * 0.06 + surgeRef.current * 0.45;
      innerCoreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      wireMesh.scale.set(pulseScale * 1.08, pulseScale * 1.08, pulseScale * 1.08);

      // Gimbal rings independent revolutions
      ring1Mesh.rotation.z += (0.015 * effectiveSpeed + surgeBonus * 0.05);
      ring2Mesh.rotation.y -= (0.02 * effectiveSpeed + surgeBonus * 0.06);
      ring3Mesh.rotation.x += (0.012 * effectiveSpeed + surgeBonus * 0.04);

      // Dyson shards orbit & radial displacement during surge
      const currentShardRadius = 1.9 + surgeRef.current * 0.8;
      for (let i = 0; i < shardCount; i++) {
        const child = shardsGroup.children[i];
        if (child) {
          const angle = (i / shardCount) * Math.PI * 2 + elapsed * 0.4 * effectiveSpeed;
          child.position.x = Math.cos(angle) * currentShardRadius;
          child.position.z = Math.sin(angle) * currentShardRadius;
          child.rotation.y = -angle + Math.sin(elapsed * 2 + i) * 0.2;
        }
      }

      // Orbiting quantum shards
      for (let i = 0; i < tetraCount; i++) {
        const t = tetras[i];
        if (t) {
          const orbitSpeed = (0.7 + i * 0.2) * effectiveSpeed;
          const theta = elapsed * orbitSpeed + (i * Math.PI) / 3;
          const phi = Math.sin(elapsed * 0.8 + i) * 0.6;
          const rad = 2.4 + Math.cos(elapsed * 1.5 + i) * 0.3 + surgeRef.current * 0.9;
          t.position.x = Math.cos(theta) * Math.cos(phi) * rad;
          t.position.y = Math.sin(phi) * rad;
          t.position.z = Math.sin(theta) * Math.cos(phi) * rad;
          t.rotation.x += 0.03;
          t.rotation.y += 0.04;
        }
      }

      // Particles rotation
      particlesMesh.rotation.y = -elapsed * 0.08 * effectiveSpeed;

      // Handle Wireframe switch
      innerMat.wireframe = wireframeRef.current;
      ring1Mat.wireframe = wireframeRef.current;
      ring2Mat.wireframe = wireframeRef.current;

      // Mode specific colors
      const currentMode = modeRef.current;
      if (currentMode === 'singularity') {
        innerMat.color.setHex(0x18181b);
        innerMat.emissive.setHex(0xf97316);
        ring2Mat.emissive.setHex(0xfb923c);
      } else if (currentMode === 'dyson') {
        innerMat.color.setHex(0x064e3b);
        innerMat.emissive.setHex(0x10b981);
        ring2Mat.emissive.setHex(0x34d399);
      } else {
        innerMat.color.setHex(0x0284c7);
        innerMat.emissive.setHex(0x06b6d4);
        ring2Mat.emissive.setHex(0xf97316);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasDom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvasDom.removeEventListener('wheel', onWheel);
      canvasDom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      // Clean disposal
      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      tetraGeo.dispose();
      tetraMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[650px] lg:h-[720px] flex items-center justify-center select-none">
      {/* Three.js Isolated Canvas Mount or Fallback */}
      {webglSupported ? (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Click and drag to rotate the Future Unleashed Energy Core"
        />
      ) : (
        /* Graceful 2D Hologram Fallback for Unsupported WebGL environments */
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
            {/* Pulsing Concentric Rings */}
            <div className={`absolute inset-0 rounded-full border border-cyan-500/40 animate-spin ${isSurging ? 'scale-110 border-orange-400' : ''}`} style={{ animationDuration: '18s' }} />
            <div className="absolute inset-6 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }} />
            <div className="absolute inset-14 rounded-full border border-orange-500/40 animate-pulse" />
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${coreMode === 'singularity' ? 'from-orange-600 to-amber-400' : coreMode === 'dyson' ? 'from-emerald-600 to-teal-400' : 'from-cyan-500 to-blue-600'} flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all ${isSurging ? 'scale-125' : ''}`}>
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              SIMULATED VECTOR CORE // COMPATIBILITY MODE
            </span>
          </div>
        </div>
      )}

      {/* Floating Interactive 3D Control Capsule (Unified bottom-center dock obeying skill rules) */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl">
        <div className="bg-[#030712]/90 border border-cyan-500/30 rounded-2xl p-2.5 md:p-3 shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-wrap items-center justify-between gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setCoreMode('quantum');
                soundFx.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-rajdhani font-semibold rounded-lg transition-colors ${
                coreMode === 'quantum'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quantum Core
            </button>
            <button
              onClick={() => {
                setCoreMode('dyson');
                soundFx.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-rajdhani font-semibold rounded-lg transition-colors ${
                coreMode === 'dyson'
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dyson Grid
            </button>
            <button
              onClick={() => {
                setCoreMode('singularity');
                soundFx.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-rajdhani font-semibold rounded-lg transition-colors ${
                coreMode === 'singularity'
                  ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Singularity
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Surge Trigger */}
            <button
              onClick={triggerSurge}
              disabled={isSurging}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-rajdhani font-bold transition-all ${
                isSurging
                  ? 'bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.8)] scale-95'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400'
              }`}
              title="Release full energy flux burst"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSurging ? 'SURGING...' : 'UNLEASH PULSE'}</span>
            </button>

            {/* Wireframe Toggle */}
            <button
              onClick={() => {
                setWireframeMode(!wireframeMode);
                soundFx.playClick();
              }}
              className={`p-1.5 rounded-xl border text-xs transition-colors ${
                wireframeMode
                  ? 'bg-cyan-500 text-black border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Hologram Wireframe"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Speed Toggle */}
            <button
              onClick={() => {
                const nextSpeed = rotationSpeed === 1 ? 2 : rotationSpeed === 2 ? 0.4 : 1;
                setRotationSpeed(nextSpeed);
                soundFx.playClick();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono hover:text-white"
              title="Toggle Rotation Speed"
            >
              <RotateCw className="w-3 h-3 text-cyan-400" />
              <span>{rotationSpeed}x</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Orbit Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/20 text-[11px] font-rajdhani text-cyan-400/90 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Interactive 3D Core • Drag to Orbit</span>
        </div>
      </div>
    </div>
  );
};
