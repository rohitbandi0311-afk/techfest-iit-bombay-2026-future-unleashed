import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundFx } from '../../services/soundFx';
import {
  Layers,
  Sun,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Camera,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { LabCoreMode, LabLightingTheme, LabRenderMode } from '../../types/techfest';

export const Interactive3DLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [activeModel, setActiveModel] = useState<LabCoreMode>('core');
  const [lightingTheme, setLightingTheme] = useState<LabLightingTheme>('neon-cyan');
  const [renderMode, setRenderMode] = useState<LabRenderMode>('pbr');
  const [explodedAmount, setExplodedAmount] = useState<number>(0);
  const [cameraView, setCameraView] = useState<'orbit' | 'front' | 'top' | 'close'>('orbit');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Mutable refs for render loop
  const modelRef = useRef<LabCoreMode>('core');
  const lightingRef = useRef<LabLightingTheme>('neon-cyan');
  const renderModeRef = useRef<LabRenderMode>('pbr');
  const explodedRef = useRef<number>(0);
  const cameraViewRef = useRef<'orbit' | 'front' | 'top' | 'close'>('orbit');
  const speedRef = useRef<number>(1);

  useEffect(() => {
    modelRef.current = activeModel;
  }, [activeModel]);
  useEffect(() => {
    lightingRef.current = lightingTheme;
  }, [lightingTheme]);
  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);
  useEffect(() => {
    explodedRef.current = explodedAmount;
  }, [explodedAmount]);
  useEffect(() => {
    cameraViewRef.current = cameraView;
  }, [cameraView]);
  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
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
    const height = container.clientHeight || 550;

    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

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
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7.5);

    // Studio Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0x06b6d4, 3.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3b82f6, 2.0);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf97316, 3.5, 12);
    rimLight.position.set(0, -2, 4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 1.2);
    scene.add(ambientLight);

    // Root Master Group
    const labMasterGroup = new THREE.Group();
    scene.add(labMasterGroup);

    // MODEL 1: Core Singularity
    const coreModelGroup = new THREE.Group();
    const coreIcoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreIcoMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.15,
    });
    const coreIco = new THREE.Mesh(coreIcoGeo, coreIcoMat);
    coreModelGroup.add(coreIco);

    const coreRing1Geo = new THREE.TorusGeometry(2.0, 0.08, 16, 64);
    const coreRing1Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.2,
    });
    const coreRing1 = new THREE.Mesh(coreRing1Geo, coreRing1Mat);
    coreModelGroup.add(coreRing1);

    const coreRing2Geo = new THREE.TorusGeometry(2.4, 0.06, 16, 64);
    const coreRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0xf97316,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
    });
    const coreRing2 = new THREE.Mesh(coreRing2Geo, coreRing2Mat);
    coreRing2.rotation.x = Math.PI / 3;
    coreModelGroup.add(coreRing2);

    // MODEL 2: Deep-Space Probe
    const probeModelGroup = new THREE.Group();
    const probeBodyGeo = new THREE.CylinderGeometry(0.7, 0.8, 1.8, 20);
    const probeBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const probeBody = new THREE.Mesh(probeBodyGeo, probeBodyMat);
    probeModelGroup.add(probeBody);

    const solarGeo = new THREE.BoxGeometry(2.0, 0.6, 0.05);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.8,
    });
    const solarLeft = new THREE.Mesh(solarGeo, solarMat);
    solarLeft.position.set(-1.6, 0, 0);
    const solarRight = new THREE.Mesh(solarGeo, solarMat);
    solarRight.position.set(1.6, 0, 0);
    probeModelGroup.add(solarLeft, solarRight);

    const dishGeo = new THREE.ConeGeometry(0.65, 0.35, 24, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 1.1, 0.4);
    dish.rotation.x = Math.PI / 3;
    probeModelGroup.add(dish);

    // MODEL 3: Mecha-Biped Kinematics
    const mechaModelGroup = new THREE.Group();
    const mechaTorsoGeo = new THREE.BoxGeometry(1.2, 1.4, 0.8);
    const mechaMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xf97316,
      emissiveIntensity: 0.2,
    });
    const mechaTorso = new THREE.Mesh(mechaTorsoGeo, mechaMat);
    mechaModelGroup.add(mechaTorso);

    const mechaVisorGeo = new THREE.BoxGeometry(0.9, 0.2, 0.2);
    const mechaVisorMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const mechaVisor = new THREE.Mesh(mechaVisorGeo, mechaVisorMat);
    mechaVisor.position.set(0, 0.35, 0.42);
    mechaModelGroup.add(mechaVisor);

    const hipGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.6, 16);
    hipGeo.rotateZ(Math.PI / 2);
    const hip = new THREE.Mesh(hipGeo, mechaMat);
    hip.position.y = -0.8;
    mechaModelGroup.add(hip);

    // MODEL 4: Quantum Hypercube
    const hyperModelGroup = new THREE.Group();
    const hyperOuterGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const hyperOuterMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const hyperOuter = new THREE.Mesh(hyperOuterGeo, hyperOuterMat);
    hyperModelGroup.add(hyperOuter);

    const hyperInnerGeo = new THREE.OctahedronGeometry(1.0, 0);
    const hyperInnerMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x34d399,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const hyperInner = new THREE.Mesh(hyperInnerGeo, hyperInnerMat);
    hyperModelGroup.add(hyperInner);

    labMasterGroup.add(coreModelGroup);
    labMasterGroup.add(probeModelGroup);
    labMasterGroup.add(mechaModelGroup);
    labMasterGroup.add(hyperModelGroup);

    // Holographic Ground Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // Manual Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      targetRotY += dx * 0.007;
      targetRotX += dy * 0.005;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const currentSpeed = speedRef.current;

      currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 8, delta);
      currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 8, delta);

      // Active Model Visibility
      const currentModelName = modelRef.current;
      coreModelGroup.visible = currentModelName === 'core';
      probeModelGroup.visible = currentModelName === 'satellite';
      mechaModelGroup.visible = currentModelName === 'robotics';
      hyperModelGroup.visible = currentModelName === 'quantum' || currentModelName === 'mainframe';

      // Lighting updates
      const currentLight = lightingRef.current;
      if (currentLight === 'neon-cyan') {
        keyLight.color.setHex(0x06b6d4);
        rimLight.color.setHex(0xf97316);
      } else if (currentLight === 'solar-orange') {
        keyLight.color.setHex(0xf97316);
        rimLight.color.setHex(0xeab308);
      } else if (currentLight === 'plasma-purple') {
        keyLight.color.setHex(0xa855f7);
        rimLight.color.setHex(0x06b6d4);
      } else {
        keyLight.color.setHex(0x10b981);
        rimLight.color.setHex(0x06b6d4);
      }

      // Render mode / wireframe
      const isWire = renderModeRef.current === 'wireframe';
      coreIcoMat.wireframe = isWire;
      probeBodyMat.wireframe = isWire;
      mechaMat.wireframe = isWire;

      // Exploded view displacement
      const explodeFactor = explodedRef.current;
      coreRing1.position.z = THREE.MathUtils.damp(coreRing1.position.z, explodeFactor * 1.5, 6, delta);
      coreRing2.position.y = THREE.MathUtils.damp(coreRing2.position.y, explodeFactor * 1.5, 6, delta);
      solarLeft.position.x = THREE.MathUtils.damp(solarLeft.position.x, -1.6 - explodeFactor * 2.0, 6, delta);
      solarRight.position.x = THREE.MathUtils.damp(solarRight.position.x, 1.6 + explodeFactor * 2.0, 6, delta);
      dish.position.z = THREE.MathUtils.damp(dish.position.z, 0.4 + explodeFactor * 1.8, 6, delta);

      // Rotations
      labMasterGroup.rotation.y = currentRotY + elapsed * 0.2 * currentSpeed;
      labMasterGroup.rotation.x = currentRotX;

      coreRing1.rotation.z += 0.01 * currentSpeed;
      coreRing2.rotation.y -= 0.015 * currentSpeed;
      hyperOuter.rotation.x += 0.008 * currentSpeed;
      hyperOuter.rotation.y += 0.012 * currentSpeed;
      hyperInner.rotation.y -= 0.015 * currentSpeed;

      // Camera view transition
      const targetCamPos = new THREE.Vector3();
      const currentView = cameraViewRef.current;
      if (currentView === 'front') {
        targetCamPos.set(0, 0, 6.0);
      } else if (currentView === 'top') {
        targetCamPos.set(0, 7.0, 0.1);
      } else if (currentView === 'close') {
        targetCamPos.set(0, 0.5, 3.8);
      } else {
        targetCamPos.set(0, 1.5, 7.5);
      }
      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const runLoop = () => {
      frameId = requestAnimationFrame(runLoop);
      if (isVisible) {
        tick();
      }
    };
    runLoop();

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
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (observer) observer.disconnect();
      cancelAnimationFrame(frameId);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[680px] bg-gradient-to-b from-[#020617] via-[#030712] to-[#020617] rounded-3xl border border-cyan-500/20 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between">
      {/* Top Spec Badges */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#030712]/80 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-orbitron text-xs text-cyan-300 font-bold tracking-wider">
            TECHFEST 3D HOLO-DECK v2.6
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#030712]/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400">
          <span>MODEL: {activeModel.toUpperCase()}</span>
          <span>•</span>
          <span>DISP: {Math.round(explodedAmount * 100)}%</span>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive Holo-Deck: Drag to inspect model"
      />

      {/* THREE.JS SKILL DIRECTIVE: UNIFIED COLLAPSIBLE BOTTOM DOCK */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300">
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center -mb-2 relative z-30">
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              soundFx.playClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#030712] border border-cyan-500/40 rounded-t-lg text-[11px] font-rajdhani uppercase tracking-wider text-cyan-300 hover:text-white"
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isCollapsed ? 'Show 3D Controls' : 'Zen Cinema Mode'}</span>
          </button>
        </div>

        {/* Collapsible Panel */}
        {!isCollapsed && (
          <div className="bg-[#030712]/95 border border-cyan-500/30 rounded-2xl p-3 md:p-4 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col gap-3">
            {/* Top row: Model selector tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-rajdhani text-slate-400 uppercase font-semibold mr-1">
                  Model:
                </span>
                {[
                  { id: 'core', label: 'Energy Core' },
                  { id: 'satellite', label: 'Space Probe' },
                  { id: 'robotics', label: 'Robo Kinematics' },
                  { id: 'quantum', label: 'Tesseract Prism' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveModel(item.id as LabCoreMode);
                      soundFx.playClick();
                    }}
                    className={`px-2.5 py-1 text-xs font-rajdhani font-semibold rounded-lg transition-colors ${
                      activeModel === item.id
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Camera Views */}
              <div className="flex items-center gap-1 ml-auto">
                <Camera className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                {(['orbit', 'front', 'top', 'close'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setCameraView(v);
                      soundFx.playClick();
                    }}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded capitalize ${
                      cameraView === v
                        ? 'bg-orange-500 text-black font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: Exploded view slider, Lighting themes & Render modes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Exploded Slider */}
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <Layers className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-xs font-rajdhani text-slate-300 font-semibold shrink-0">
                  Exploded Assembly:
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explodedAmount}
                  onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] font-mono text-cyan-400 w-8 text-right">
                  {Math.round(explodedAmount * 100)}%
                </span>
              </div>

              {/* Lighting Preset Swatches */}
              <div className="flex items-center justify-between gap-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-rajdhani text-slate-300 font-semibold">Lighting:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'neon-cyan', color: '#06b6d4', title: 'Neon Cyan' },
                    { id: 'solar-orange', color: '#f97316', title: 'Solar Flare' },
                    { id: 'plasma-purple', color: '#a855f7', title: 'Cyber Violet' },
                    { id: 'matrix-green', color: '#10b981', title: 'Matrix Green' },
                  ].map((light) => (
                    <button
                      key={light.id}
                      onClick={() => {
                        setLightingTheme(light.id as LabLightingTheme);
                        soundFx.playClick();
                      }}
                      title={light.title}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        lightingTheme === light.id
                          ? 'scale-125 border-white shadow-[0_0_10px_currentColor]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: light.color, color: light.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Shading & Speed Controls */}
              <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setRenderMode(renderMode === 'wireframe' ? 'pbr' : 'wireframe');
                      soundFx.playClick();
                    }}
                    className={`px-2.5 py-1 text-xs font-rajdhani font-semibold rounded-lg transition-colors ${
                      renderMode === 'wireframe'
                        ? 'bg-cyan-500 text-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {renderMode === 'wireframe' ? 'Wireframe ON' : 'PBR Solid'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono text-slate-400">Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeedMultiplier(s);
                        soundFx.playClick();
                      }}
                      className={`px-1.5 py-0.5 text-[11px] font-mono rounded ${
                        speedMultiplier === s
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
