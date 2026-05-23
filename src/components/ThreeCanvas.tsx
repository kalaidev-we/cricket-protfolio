"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  activeView?: "ball" | "bat" | "both";
  scrollProgress?: number; // 0 to 1
}

export default function ThreeCanvas({ activeView = "ball", scrollProgress = 0 }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Group for rotation and animation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 5. Procedural 3D Cricket Ball
    const ballGroup = new THREE.Group();
    
    // Leather sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x8b0825, // Deep crimson leather
      roughness: 0.22,
      metalness: 0.08,
      bumpScale: 0.05,
    });
    // Add procedural leather grain texture using a simple canvas bump map
    const canvasGrain = document.createElement("canvas");
    canvasGrain.width = 128;
    canvasGrain.height = 128;
    const ctxGrain = canvasGrain.getContext("2d");
    if (ctxGrain) {
      ctxGrain.fillStyle = "#808080";
      ctxGrain.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 1000; i++) {
        const val = Math.floor(Math.random() * 60) + 100;
        ctxGrain.fillStyle = `rgb(${val},${val},${val})`;
        ctxGrain.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
      }
      const grainTex = new THREE.CanvasTexture(canvasGrain);
      grainTex.wrapS = THREE.RepeatWrapping;
      grainTex.wrapT = THREE.RepeatWrapping;
      grainTex.repeat.set(4, 4);
      ballMat.bumpMap = grainTex;
      ballMat.bumpScale = 0.005;
    }
    const ballMesh = new THREE.Mesh(sphereGeo, ballMat);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    ballGroup.add(ballMesh);

    // Ball Seam (Equatorial stitching)
    const seamGroup = new THREE.Group();
    const stitchCount = 80;
    const seamRadius = 1.205;
    for (let i = 0; i < stitchCount; i++) {
      const angle = (i / stitchCount) * Math.PI * 2;
      const x = Math.cos(angle) * seamRadius;
      const y = Math.sin(angle) * seamRadius;

      // Small box for each stitch
      const stitchGeo = new THREE.BoxGeometry(0.04, 0.06, 0.03);
      const stitchMat = new THREE.MeshStandardMaterial({
        color: 0xeae2c9, // Pale thread color
        roughness: 0.8,
      });
      const stitch = new THREE.Mesh(stitchGeo, stitchMat);
      stitch.position.set(x, y, 0);
      stitch.rotation.z = angle + Math.PI / 2;
      stitch.rotation.x = (i % 2 === 0 ? 1 : -1) * 0.25;
      seamGroup.add(stitch);
    }
    ballGroup.add(seamGroup);
    
    // Add seam ridge (raised leather lip)
    const ridgeGeo = new THREE.TorusGeometry(1.2, 0.02, 8, 100);
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: 0x6a0218,
      roughness: 0.35,
    });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.rotation.y = Math.PI / 2;
    ballGroup.add(ridge);

    modelGroup.add(ballGroup);

    // 6. Procedural 3D Cricket Bat
    const batGroup = new THREE.Group();
    
    // Wood Blade
    const bladeGeo = new THREE.BoxGeometry(0.6, 2.8, 0.25);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xdfceb5, // English willow blade
      roughness: 0.35,
      metalness: 0.05,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.castShadow = true;
    blade.receiveShadow = true;
    batGroup.add(blade);

    // Rubber Handle (wrapping cylinder)
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f10, // Matte black handle grip
      roughness: 0.7,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = 2.0;
    handle.castShadow = true;
    batGroup.add(handle);

    // Handle Grip Wrap ridges (procedural toruses along the handle)
    for (let i = 0; i < 12; i++) {
      const ringGeo = new THREE.TorusGeometry(0.082, 0.015, 8, 16);
      const ring = new THREE.Mesh(ringGeo, handleMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.45 + i * 0.09;
      batGroup.add(ring);
    }

    // Champagne Gold highlight ring at bottom of handle
    const ringAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold grip band
      roughness: 0.45,
    });
    const accentRingGeo = new THREE.TorusGeometry(0.085, 0.02, 8, 16);
    const accentRing = new THREE.Mesh(accentRingGeo, ringAccentMat);
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.y = 1.4;
    batGroup.add(accentRing);

    // Move center of batGroup down so it rotates around the center of mass
    batGroup.position.y = -0.5;
    modelGroup.add(batGroup);

    // 7. Ambient Gold Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 15;
      particlePositions[i + 1] = (Math.random() - 0.5) * 15;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37, // Champagne Gold dust
      size: 0.035,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 8. Lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Key Spotlight (Studio White) from top right
    const whiteSpotlight = new THREE.SpotLight(0xffffff, 25, 20, Math.PI / 6, 0.5, 1);
    whiteSpotlight.position.set(4, 5, 4);
    whiteSpotlight.castShadow = true;
    scene.add(whiteSpotlight);

    // Rim Spotlight (Champagne Gold) from top-back left
    const goldSpotlight = new THREE.SpotLight(0xd4af37, 20, 25, Math.PI / 5, 0.2, 1);
    goldSpotlight.position.set(-5, 4, -4);
    goldSpotlight.castShadow = true;
    scene.add(goldSpotlight);

    // Front fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // 9. Interactive mouse offsets
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth) - 0.5;
      targetMouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Layout management based on activeView
      if (activeView === "ball") {
        ballGroup.visible = true;
        batGroup.visible = false;
        
        ballGroup.rotation.y = elapsedTime * 0.15 + scrollProgress * Math.PI * 4;
        ballGroup.rotation.x = scrollProgress * Math.PI + mouseY * 0.4;
        ballGroup.rotation.z = mouseX * 0.4;
        
        ballGroup.position.set(0, 0, 0);
        camera.position.set(0, 0, 5.5);
      } else if (activeView === "bat") {
        ballGroup.visible = false;
        batGroup.visible = true;

        batGroup.rotation.y = elapsedTime * 0.2 + scrollProgress * Math.PI * 2 + mouseX * 0.7;
        batGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.04 + mouseY * 0.25;
        batGroup.rotation.x = 0.1 + scrollProgress * 0.5;

        batGroup.position.set(0, 0, 0);
        camera.position.set(0, 0, 6.5);
      } else {
        ballGroup.visible = true;
        batGroup.visible = true;

        ballGroup.position.set(-1.8, 0, 0);
        ballGroup.rotation.y = elapsedTime * 0.25 + scrollProgress * Math.PI * 3;
        ballGroup.rotation.x = mouseY * 0.3;

        batGroup.position.set(1.5, -0.2, 0);
        batGroup.rotation.y = elapsedTime * 0.15 + scrollProgress * Math.PI + mouseX * 0.4;
        batGroup.rotation.z = -0.2 + mouseY * 0.15;

        camera.position.set(0, 0, 7.5);
      }

      // Rotate particles slightly for background float effect
      dustParticles.rotation.y = elapsedTime * 0.015;
      dustParticles.rotation.x = elapsedTime * 0.008;

      // Animate spotlights
      whiteSpotlight.intensity = 25 + Math.sin(elapsedTime * 1.5) * 3;
      goldSpotlight.intensity = 20 + Math.cos(elapsedTime * 2.0) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      sphereGeo.dispose();
      ballMat.dispose();
      ridgeGeo.dispose();
      ridgeMat.dispose();
      bladeGeo.dispose();
      bladeMat.dispose();
      handleGeo.dispose();
      handleMat.dispose();
      ringAccentMat.dispose();
      accentRingGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [activeView, scrollProgress, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-transparent">
      <canvas ref={canvasRef} className="w-full h-full block touch-none pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}
