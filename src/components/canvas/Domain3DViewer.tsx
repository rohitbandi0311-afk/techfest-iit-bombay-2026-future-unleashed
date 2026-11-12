import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Domain3DViewerProps {
  modelType: 'ai' | 'robotics' | 'space' | 'innovation' | 'coding';
  accentColor: string;
  isHovered?: boolean;
}

export const Domain3DViewer: React.FC<Domain3DViewerProps> = ({
  modelType,
  accentColor,
  isHovered = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(isHovered);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Intersection Observer to pause rendering when offscreen
    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    // Studio 3-point lighting
    const primaryColor = new THREE.Color(accentColor);
    const keyLight = new THREE.DirectionalLight(primaryColor, 3.2);
    keyLight.position.set(4, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    // PROCEDURAL MODEL GENERATION ACCORDING TO DOMAIN TYPE (3-8 parts each)
    if (modelType === 'ai') {
      // AI: Neural Synaptic Core with concentric polyhedrons & synaptic nodes
      const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: primaryColor,
        emissiveIntensity: 0.6,
        wireframe: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      modelGroup.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      const centerBallGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const centerBallMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: primaryColor,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.9,
      });
      const centerMesh = new THREE.Mesh(centerBallGeo, centerBallMat);
      modelGroup.add(centerMesh);
      disposables.push(centerBallGeo, centerBallMat);

      // Synaptic floating nodes
      const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      disposables.push(nodeGeo, nodeMat);
      for (let i = 0; i < 8; i++) {
        const phi = (i / 8) * Math.PI * 2;
        const m = new THREE.Mesh(nodeGeo, nodeMat);
        m.position.set(Math.cos(phi) * 1.3, Math.sin(phi * 2) * 0.4, Math.sin(phi) * 1.3);
        modelGroup.add(m);
      }
    } else if (modelType === 'robotics') {
      // Robotics: Mechatronic robotic arm assembly
      const baseGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.25, 24);
      const metalMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const baseMesh = new THREE.Mesh(baseGeo, metalMat);
      baseMesh.position.y = -1.1;
      modelGroup.add(baseMesh);
      disposables.push(baseGeo, metalMat);

      // Hydraulic pivot joint
      const pivotGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const pivotMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: primaryColor,
        emissiveIntensity: 0.5,
      });
      const pivot = new THREE.Mesh(pivotGeo, pivotMat);
      pivot.position.y = -0.7;
      modelGroup.add(pivot);
      disposables.push(pivotGeo, pivotMat);

      // Lower boom arm
      const armGeo = new THREE.BoxGeometry(0.22, 1.1, 0.22);
      const armMesh = new THREE.Mesh(armGeo, metalMat);
      armMesh.position.set(0.2, -0.1, 0);
      armMesh.rotation.z = -0.35;
      modelGroup.add(armMesh);
      disposables.push(armGeo);

      // Claw / End-effector
      const clawBaseGeo = new THREE.BoxGeometry(0.35, 0.15, 0.35);
      const clawMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xf97316,
        emissiveIntensity: 0.3,
        metalness: 0.8,
      });
      const clawBase = new THREE.Mesh(clawBaseGeo, clawMat);
      clawBase.position.set(0.45, 0.65, 0);
      modelGroup.add(clawBase);
      disposables.push(clawBaseGeo, clawMat);

      // Gripper fingers
      const fingerGeo = new THREE.BoxGeometry(0.08, 0.4, 0.08);
      const finger1 = new THREE.Mesh(fingerGeo, metalMat);
      finger1.position.set(0.35, 0.95, 0.12);
      finger1.rotation.z = -0.15;
      const finger2 = new THREE.Mesh(fingerGeo, metalMat);
      finger2.position.set(0.55, 0.95, -0.12);
      finger2.rotation.z = 0.15;
      modelGroup.add(finger1, finger2);
      disposables.push(fingerGeo);
    } else if (modelType === 'space') {
      // Space: Deep-Space Satellite with solar arrays & dish
      const busGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0x0284c7,
        emissiveIntensity: 0.2,
      });
      const bus = new THREE.Mesh(busGeo, busMat);
      modelGroup.add(bus);
      disposables.push(busGeo, busMat);

      // Solar Panel Wings (Left & Right)
      const panelGeo = new THREE.BoxGeometry(1.4, 0.55, 0.04);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
      });
      const leftWing = new THREE.Mesh(panelGeo, panelMat);
      leftWing.position.set(-1.2, 0, 0);
      const rightWing = new THREE.Mesh(panelGeo, panelMat);
      rightWing.position.set(1.2, 0, 0);
      modelGroup.add(leftWing, rightWing);
      disposables.push(panelGeo, panelMat);

      // Parabolic Dish Antenna
      const dishGeo = new THREE.ConeGeometry(0.45, 0.25, 24, 1, true);
      const dishMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.85,
        roughness: 0.25,
      });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.set(0, 0.55, 0.45);
      dish.rotation.x = Math.PI / 3;
      modelGroup.add(dish);
      disposables.push(dishGeo, dishMat);

      // Thruster Bell
      const thrusterGeo = new THREE.ConeGeometry(0.2, 0.3, 16);
      const thrusterMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.7,
      });
      const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
      thruster.position.set(0, -0.55, 0);
      thruster.rotation.x = Math.PI;
      modelGroup.add(thruster);
      disposables.push(thrusterGeo, thrusterMat);
    } else if (modelType === 'innovation') {
      // Innovation: Quantum Tesseract / Nested Crystal Prism
      const outerCubeGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3);
      const outerCubeMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        emissive: primaryColor,
        emissiveIntensity: 0.5,
        wireframe: true,
      });
      const outerCube = new THREE.Mesh(outerCubeGeo, outerCubeMat);
      modelGroup.add(outerCube);
      disposables.push(outerCubeGeo, outerCubeMat);

      const innerPrismGeo = new THREE.OctahedronGeometry(0.7, 0);
      const innerPrismMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x34d399,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.8,
      });
      const innerPrism = new THREE.Mesh(innerPrismGeo, innerPrismMat);
      modelGroup.add(innerPrism);
      disposables.push(innerPrismGeo, innerPrismMat);

      // Quantum orbital ring
      const qRingGeo = new THREE.TorusGeometry(1.1, 0.03, 16, 48);
      const qRingMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
      const qRing = new THREE.Mesh(qRingGeo, qRingMat);
      qRing.rotation.x = Math.PI / 4;
      modelGroup.add(qRing);
      disposables.push(qRingGeo, qRingMat);
    } else {
      // Coding: Cyber Mainframe Matrix Tower
      const towerGeo = new THREE.BoxGeometry(0.8, 1.6, 0.8);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      modelGroup.add(tower);
      disposables.push(towerGeo, towerMat);

      // Server bay illuminated neon slits
      for (let i = 0; i < 5; i++) {
        const slitGeo = new THREE.BoxGeometry(0.82, 0.05, 0.82);
        const slitMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
        const slit = new THREE.Mesh(slitGeo, slitMat);
        slit.position.y = -0.6 + i * 0.3;
        modelGroup.add(slit);
        disposables.push(slitGeo, slitMat);
      }

      // Orbiting binary data ring
      const codeRingGeo = new THREE.TorusGeometry(1.15, 0.03, 12, 36);
      const codeRingMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
      const codeRing = new THREE.Mesh(codeRingGeo, codeRingMat);
      codeRing.rotation.x = Math.PI / 3;
      modelGroup.add(codeRing);
      disposables.push(codeRingGeo, codeRingMat);
    }

    // Interactive pointer reaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };
    container.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      if (!isVisible) return; // Skip work when offscreen

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const speed = isHoveredRef.current ? 1.8 : 0.8;

      // Base auto-spin
      modelGroup.rotation.y += delta * speed;
      modelGroup.rotation.x = THREE.MathUtils.damp(
        modelGroup.rotation.x,
        mouseY * 0.4 + Math.sin(elapsed * 0.8) * 0.1,
        6,
        delta
      );
      modelGroup.rotation.z = THREE.MathUtils.damp(
        modelGroup.rotation.z,
        -mouseX * 0.4,
        6,
        delta
      );

      // Hover scale pop
      const targetScale = isHoveredRef.current ? 1.12 : 1.0;
      modelGroup.scale.setScalar(
        THREE.MathUtils.damp(modelGroup.scale.x, targetScale, 8, delta)
      );

      renderer.render(scene, camera);
    };

    tick();

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
      container.removeEventListener('mousemove', handleMouseMove);
      if (observer) observer.disconnect();
      cancelAnimationFrame(frameId);

      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelType, accentColor]);

  return (
    <div
      ref={mountRef}
      className="w-full h-44 sm:h-52 flex items-center justify-center pointer-events-auto"
    />
  );
};
