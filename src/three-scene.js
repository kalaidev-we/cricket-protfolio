import * as THREE from 'three';

class StadiumScene {
  constructor() {
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    
    // Core 3D objects
    this.ballGroup = null;
    this.cricketBall = null;
    this.pitch = null;
    this.wickets = null;
    this.particles = null;

    // Spotlights
    this.spotLight1 = null;
    this.spotLight2 = null;
    this.mouseSpotLight = null;

    // Animation target states for Scroll binding
    // Camera transitions: { px, py, pz, rx, ry, rz }
    this.scrollStates = {
      intro: { x: 0, y: 15, z: 25, rx: -0.4, ry: 0, rz: 0, ballScale: 0, pitchOp: 0.1, particleSpeed: 1.0 },
      origin: { x: 5, y: 8, z: 20, rx: -0.2, ry: 0.3, rz: 0, ballScale: 0, pitchOp: 0.2, particleSpeed: 1.5 },
      school: { x: -8, y: 6, z: 18, rx: -0.1, ry: -0.4, rz: 0, ballScale: 0, pitchOp: 0.2, particleSpeed: 1.2 },
      education: { x: 0, y: 12, z: 22, rx: -0.3, ry: 0, rz: 0, ballScale: 0, pitchOp: 0.1, particleSpeed: 1.0 },
      cricket: { x: 2, y: 1.5, z: 6, rx: -0.1, ry: 0.4, rz: 0, ballScale: 1.3, pitchOp: 1.0, particleSpeed: 0.8 },
      mindset: { x: 0, y: 3, z: 12, rx: -0.15, ry: 0, rz: 0, ballScale: 0.4, pitchOp: 0.4, particleSpeed: 2.5 },
      future: { x: -3, y: 10, z: 20, rx: -0.3, ry: -0.2, rz: 0, ballScale: 0, pitchOp: 0.3, particleSpeed: 1.5 },
      ending: { x: 0, y: 25, z: 15, rx: -0.9, ry: 0, rz: 0, ballScale: 0, pitchOp: 0.1, particleSpeed: 3.0 }
    };

    // Camera current and target coordinates
    this.camPos = new THREE.Vector3(0, 15, 25);
    this.camRot = new THREE.Euler(-0.4, 0, 0);
    this.ballScale = { value: 0 };
    this.pitchOpacity = { value: 0.1 };
    this.particleSpeedMult = { value: 1.0 };
    
    // Mouse drag interaction variables
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.mousePos = new THREE.Vector2(0, 0);
    
    // Clock for timing
    this.clock = new THREE.Clock();
  }

  init(canvasId) {
    this.container = document.getElementById(canvasId);
    if (!this.container) return;

    // Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050816);
    // Add atmospheric fog
    this.scene.fog = new THREE.FogExp2(0x050816, 0.025);

    // Create Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.camPos);
    this.camera.rotation.copy(this.camRot);

    // Create Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup Lighting
    this.setupLighting();

    // Build Environment Components
    this.buildPitch();
    this.buildWickets();
    this.buildCricketBall();
    this.buildParticles();

    // Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.setupMouseEvents();

    // Start Loop
    this.animate();
  }

  setupLighting() {
    // 1. Dim Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0B1220, 0.6);
    this.scene.add(ambientLight);

    // 2. Cyan Floodlight (Left)
    this.spotLight1 = new THREE.SpotLight(0x00C2FF, 8);
    this.spotLight1.position.set(-15, 25, -10);
    this.spotLight1.angle = Math.PI / 4;
    this.spotLight1.penumbra = 0.8;
    this.spotLight1.castShadow = true;
    this.spotLight1.shadow.mapSize.width = 1024;
    this.spotLight1.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight1);

    // 3. Silver Spotlight (Right/Back)
    this.spotLight2 = new THREE.SpotLight(0xC7D2FE, 6);
    this.spotLight2.position.set(15, 20, -5);
    this.spotLight2.angle = Math.PI / 5;
    this.spotLight2.penumbra = 0.7;
    this.spotLight2.castShadow = true;
    this.scene.add(this.spotLight2);

    // 4. Mouse-reactive spotlight
    this.mouseSpotLight = new THREE.SpotLight(0x00C2FF, 0); // starts off, triggered by mouse
    this.mouseSpotLight.position.set(0, 10, 10);
    this.mouseSpotLight.angle = Math.PI / 8;
    this.mouseSpotLight.penumbra = 0.5;
    this.scene.add(this.mouseSpotLight);
  }

  /**
   * Generates a procedural leather texture on a canvas.
   * Creates deep red skin, leather grain bumpiness, and white thread stitch lines.
   */
  generateLeatherTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base deep red leather
    ctx.fillStyle = '#8B0A1A';
    ctx.fillRect(0, 0, 512, 512);

    // Leather pores/grain (procedural noise)
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 0.5 + Math.random() * 1.0;
      ctx.fillStyle = Math.random() > 0.5 ? '#9E1020' : '#730410';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Midline seam shading
    ctx.fillStyle = '#61020a';
    ctx.fillRect(0, 250, 512, 12);

    // White threads stitches (vertical dashes along horizontal seam)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 8]);
    
    // Top stitch row
    ctx.beginPath();
    ctx.moveTo(0, 246);
    ctx.lineTo(512, 246);
    ctx.stroke();

    // Bottom stitch row
    ctx.beginPath();
    ctx.moveTo(0, 266);
    ctx.lineTo(512, 266);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  /**
   * Generates a procedural leather bump map for texture depth.
   */
  generateLeatherBumpMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Flat grey baseline
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    // Add noise pores (black/white specs)
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? '#909090' : '#707070';
      ctx.fillRect(x, y, 1, 1);
    }

    // Raised seam band (white center is highest bump)
    const grad = ctx.createLinearGradient(0, 244, 0, 268);
    grad.addColorStop(0, '#808080');
    grad.addColorStop(0.5, '#FFFFFF');
    grad.addColorStop(1, '#808080');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 244, 512, 24);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  buildCricketBall() {
    this.ballGroup = new THREE.Group();
    this.scene.add(this.ballGroup);

    // Sphere Geometry (High poly for smooth specular reflection)
    const geometry = new THREE.SphereGeometry(1.2, 64, 64);
    
    const leatherMap = this.generateLeatherTexture();
    const bumpMap = this.generateLeatherBumpMap();

    const material = new THREE.MeshStandardMaterial({
      map: leatherMap,
      bumpMap: bumpMap,
      bumpScale: 0.02,
      roughness: 0.25, // glossy leather shine
      metalness: 0.05,
      clearcoat: 0.4, // shiny lacquered finish
      clearcoatRoughness: 0.1
    });

    this.cricketBall = new THREE.Mesh(geometry, material);
    this.cricketBall.castShadow = true;
    this.cricketBall.receiveShadow = true;
    this.ballGroup.add(this.cricketBall);

    // Physically raised seam ring wrapping around the ball sphere
    const seamGeom = new THREE.TorusGeometry(1.205, 0.02, 16, 100);
    const seamMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.6,
      bumpMap: bumpMap,
      bumpScale: 0.01
    });
    const seamMesh = new THREE.Mesh(seamGeom, seamMat);
    // Align Torus seam to the ball's center seam (rotated on X-axis)
    seamMesh.rotation.x = Math.PI / 2;
    this.ballGroup.add(seamMesh);

    // Position ball group near the crease
    this.ballGroup.position.set(0, 1.25, 2);
    // Apply initial scale
    this.ballGroup.scale.setScalar(this.ballScale.value);
  }

  buildPitch() {
    // 1. Pitch Turf Plane
    const geometry = new THREE.PlaneGeometry(12, 40);
    
    // Procedural grass texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1D5335'; // Deep turf green
    ctx.fillRect(0, 0, 256, 512);
    
    // Add grass blades/noise
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? '#24633F' : '#164329';
      ctx.fillRect(x, y, 1, 3 + Math.random() * 4);
    }
    
    // Draw white crease lines
    ctx.fillStyle = '#FFFFFF';
    // Bowling crease lines
    ctx.fillRect(20, 420, 216, 4); 
    // Popping crease lines
    ctx.fillRect(10, 390, 236, 3);
    
    const pitchTexture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.MeshStandardMaterial({
      map: pitchTexture,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: this.pitchOpacity.value
    });

    this.pitch = new THREE.Mesh(geometry, material);
    this.pitch.rotation.x = -Math.PI / 2;
    this.pitch.position.set(0, 0, -5);
    this.pitch.receiveShadow = true;
    this.scene.add(this.pitch);
  }

  buildWickets() {
    this.wickets = new THREE.Group();
    
    // Wood material
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xC68A4C,
      roughness: 0.4,
      metalness: 0.1
    });

    // 3 Stumps (stump height ~71cm -> scale to ~2.8 units)
    const stumpGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 16);
    
    const spacing = 0.28;
    for (let i = -1; i <= 1; i++) {
      const stump = new THREE.Mesh(stumpGeom, woodMat);
      stump.position.set(i * spacing, 1.2, -10); // place at the end of the pitch
      stump.castShadow = true;
      stump.receiveShadow = true;
      this.wickets.add(stump);
    }

    // Bails on top
    const bailGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.35, 12);
    
    const bail1 = new THREE.Mesh(bailGeom, woodMat);
    bail1.position.set(-0.14, 2.43, -10);
    bail1.rotation.z = Math.PI / 2;
    bail1.castShadow = true;
    this.wickets.add(bail1);

    const bail2 = new THREE.Mesh(bailGeom, woodMat);
    bail2.position.set(0.14, 2.43, -10);
    bail2.rotation.z = Math.PI / 2;
    bail2.castShadow = true;
    this.wickets.add(bail2);

    this.scene.add(this.wickets);
  }

  buildParticles() {
    // 200 floating stars representing dust in the floodlights
    const count = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      // Position spread
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      // Velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.01 - 0.005, // drifting down
        z: (Math.random() - 0.5) * 0.02
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle styling (soft glowing cyan circles)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(0, 194, 255, 1)');
    grad.addColorStop(0.5, 'rgba(0, 194, 255, 0.3)');
    grad.addColorStop(1, 'rgba(0, 194, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const pTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.3,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.particles.userData = { velocities };
    this.scene.add(this.particles);
  }

  setupMouseEvents() {
    // Track mouse coordinates for spotlights & raycast hover
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Let the spotlight match mouse
      if (this.mouseSpotLight) {
        this.mouseSpotLight.position.x = this.mousePos.x * 12;
        this.mouseSpotLight.position.y = 12 + this.mousePos.y * 6;
      }
    });

    // Touch support for drag
    const onDragStart = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onDragMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const deltaMove = {
        x: clientX - this.previousMousePosition.x,
        y: clientY - this.previousMousePosition.y
      };

      // Rotate target values
      this.targetRotation.y += deltaMove.x * 0.007;
      this.targetRotation.x += deltaMove.y * 0.007;

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    // Mouse drag triggers
    window.addEventListener('mousedown', (e) => {
      // Only drag on canvas
      if (e.target.id === 'webgl-canvas' || e.target.closest('#cricket')) {
        onDragStart(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mousemove', (e) => {
      onDragMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch drag triggers
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0 && (e.target.id === 'webgl-canvas' || e.target.closest('#cricket'))) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  /**
   * Triggers a fast ball rotation (spin) representing a bat strike.
   */
  triggerBallSpin() {
    if (!this.cricketBall) return;
    this.targetRotation.y += Math.PI * 4; // spin multiple rounds
    this.targetRotation.x += (Math.random() - 0.5) * Math.PI * 2;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Updates state variables (camera, scale, etc.) dynamically during scroll.
   */
  updateState(activeSection, progress) {
    const currentState = this.scrollStates[activeSection];
    if (!currentState) return;

    // Find next section key
    const sectionKeys = Object.keys(this.scrollStates);
    const currentIndex = sectionKeys.indexOf(activeSection);
    
    let target = currentState;

    // Interpolate towards the next section state based on scroll progress
    if (progress > 0 && currentIndex < sectionKeys.length - 1) {
      const nextKey = sectionKeys[currentIndex + 1];
      const nextState = this.scrollStates[nextKey];
      
      target = {
        x: THREE.MathUtils.lerp(currentState.x, nextState.x, progress),
        y: THREE.MathUtils.lerp(currentState.y, nextState.y, progress),
        z: THREE.MathUtils.lerp(currentState.z, nextState.z, progress),
        rx: THREE.MathUtils.lerp(currentState.rx, nextState.rx, progress),
        ry: THREE.MathUtils.lerp(currentState.ry, nextState.ry, progress),
        rz: THREE.MathUtils.lerp(currentState.rz, nextState.rz, progress),
        ballScale: THREE.MathUtils.lerp(currentState.ballScale, nextState.ballScale, progress),
        pitchOp: THREE.MathUtils.lerp(currentState.pitchOp, nextState.pitchOp, progress),
        particleSpeed: THREE.MathUtils.lerp(currentState.particleSpeed, nextState.particleSpeed, progress)
      };
    }

    // Set camera destination
    this.camPos.set(target.x, target.y, target.z);
    this.camRot.set(target.rx, target.ry, target.rz);
    
    // Set parameters
    this.ballScale.value = target.ballScale;
    this.pitchOpacity.value = target.pitchOp;
    this.particleSpeedMult.value = target.particleSpeed;

    // Flare spotlight intensifies on Cricket and Ending sections
    if (activeSection === 'cricket' || activeSection === 'ending') {
      this.mouseSpotLight.intensity = 15;
    } else {
      this.mouseSpotLight.intensity = THREE.MathUtils.lerp(0, 5, progress);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Smoothly interpolate camera position & rotation
    this.camera.position.lerp(this.camPos, 0.08);
    
    // Slerp-like interpolation for rotation using quaternions
    const targetQuat = new THREE.Quaternion().setFromEuler(this.camRot);
    this.camera.quaternion.slerp(targetQuat, 0.08);

    // 2. Smoothly scale cricket ball
    if (this.ballGroup) {
      const scale = THREE.MathUtils.lerp(this.ballGroup.scale.x, this.ballScale.value, 0.08);
      this.ballGroup.scale.setScalar(scale);

      // Auto-rotation of the cricket ball when not being dragged
      if (!this.isDragging) {
        this.targetRotation.y += 0.005; // slow drift spin
        this.targetRotation.x = Math.sin(time * 0.2) * 0.1; // gentle rock
      }

      // Interpolate rotation dampening
      this.currentRotation.x = THREE.MathUtils.lerp(this.currentRotation.x, this.targetRotation.x, 0.1);
      this.currentRotation.y = THREE.MathUtils.lerp(this.currentRotation.y, this.targetRotation.y, 0.1);

      this.cricketBall.rotation.x = this.currentRotation.x;
      this.cricketBall.rotation.y = this.currentRotation.y;
    }

    // 3. Update pitch opacity
    if (this.pitch && this.pitch.material) {
      this.pitch.material.opacity = THREE.MathUtils.lerp(this.pitch.material.opacity, this.pitchOpacity.value, 0.08);
    }

    // 4. Animate floating floodlight particles
    if (this.particles) {
      const positionAttr = this.particles.geometry.attributes.position;
      const velocities = this.particles.userData.velocities;
      const speed = this.particleSpeedMult.value;

      for (let i = 0; i < positionAttr.count; i++) {
        let x = positionAttr.getX(i);
        let y = positionAttr.getY(i);
        let z = positionAttr.getZ(i);

        // Apply velocities scaled by speed multiplier
        x += velocities[i].x * speed;
        y += velocities[i].y * speed;
        z += velocities[i].z * speed;

        // Reset boundaries if particles drift too far
        if (y < 0) {
          y = 20;
          x = (Math.random() - 0.5) * 40;
          z = (Math.random() - 0.5) * 40;
        }
        if (Math.abs(x) > 20) x = -x;
        if (Math.abs(z) > 20) z = -z;

        positionAttr.setXYZ(i, x, y, z);
      }
      positionAttr.needsUpdate = true;
      
      // Gentle wavy motion
      this.particles.rotation.y = time * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export const stadiumScene = new StadiumScene();
export default stadiumScene;
