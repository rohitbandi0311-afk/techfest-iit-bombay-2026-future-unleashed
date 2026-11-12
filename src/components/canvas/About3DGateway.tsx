import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const About3DGateway: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // Pause rendering when offscreen
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
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 6.2);

    // Studio lighting
    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 3.5);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    const orangeLight = new THREE.DirectionalLight(0xf97316, 2.5);
    orangeLight.position.set(-4, -2, -3);
    scene.add(orangeLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const gatewayGroup = new THREE.Group();
    scene.add(gatewayGroup);

    // Part 1: Outer Hexagonal Ring Frame
    const hexGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    gatewayGroup.add(hexMesh);

    // Part 2: Middle Circular Energy Ring
    const midRingGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
    const midRingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      metalness: 0.8,
    });
    const midRingMesh = new THREE.Mesh(midRingGeo, midRingMat);
    midRingMesh.rotation.x = Math.PI / 4;
    gatewayGroup.add(midRingMesh);

    // Part 3: Inner Rotating Octahedral Core
    const octaGeo = new THREE.OctahedronGeometry(0.85, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: 0xf97316,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: false,
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    gatewayGroup.add(octaMesh);

    // Part 4: Wireframe cage over octahedron
    const octaWireGeo = new THREE.OctahedronGeometry(0.95, 0);
    const octaWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const octaWireMesh = new THREE.Mesh(octaWireGeo, octaWireMat);
    gatewayGroup.add(octaWireMesh);

    // Part 5: Grounded pedestal rings
    const groundRingGeo = new THREE.RingGeometry(1.2, 2.4, 32);
    const groundRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
    groundRing.position.y = -2.1;
    groundRing.rotation.x = Math.PI / 2;
    gatewayGroup.add(groundRing);

    // Pointer interactivity
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.7;
      targetRotX = y * 0.4;
    };
    container.addEventListener('mousemove', handlePointerMove);

    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 6, delta);
      currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 6, delta);

      gatewayGroup.rotation.y = currentRotY + elapsed * 0.35;
      gatewayGroup.rotation.x = currentRotX + Math.sin(elapsed * 0.8) * 0.05;
      gatewayGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;

      // Inner elements independent rotation
      midRingMesh.rotation.z += 0.015;
      octaMesh.rotation.y -= 0.02;
      octaMesh.rotation.x += 0.01;
      octaWireMesh.rotation.y -= 0.02;
      octaWireMesh.rotation.x += 0.01;

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
      container.removeEventListener('mousemove', handlePointerMove);
      if (observer) observer.disconnect();
      cancelAnimationFrame(frameId);

      hexGeo.dispose();
      hexMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
      octaWireGeo.dispose();
      octaWireMat.dispose();
      groundRingGeo.dispose();
      groundRingMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-80 sm:h-96 md:h-[420px] flex items-center justify-center cursor-pointer"
      title="Hover over the Techfest Quantum Gateway"
    />
  );
};
