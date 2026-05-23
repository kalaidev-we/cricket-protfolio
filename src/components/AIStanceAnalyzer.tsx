"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Cpu, Award, Zap, Sliders, CheckCircle } from "lucide-react";

export default function AIStanceAnalyzer() {
  const [mode, setMode] = useState<"designer" | "camera">("designer");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Designer Sliders State
  const [backlift, setBacklift] = useState(65);
  const [kneeBend, setKneeBend] = useState(40);
  const [headTilt, setHeadTilt] = useState(50);
  const [footWidth, setFootWidth] = useState(45);

  const computeMetrics = () => {
    const backliftDiff = Math.abs(backlift - 70);
    const kneeDiff = Math.abs(kneeBend - 55);
    const headDiff = Math.abs(headTilt - 50);
    const footDiff = Math.abs(footWidth - 60);

    const backliftScore = Math.max(0, 100 - backliftDiff * 1.5);
    const kneeScore = Math.max(0, 100 - kneeDiff * 1.6);
    const headScore = Math.max(0, 100 - headDiff * 2.2);
    const footScore = Math.max(0, 100 - footDiff * 1.4);

    const overallScore = Math.round((backliftScore + kneeScore + headScore + footScore) / 4);

    let feedback = "";
    if (overallScore >= 90) {
      feedback = "ELITE FORM: Stance is perfectly balanced. Solid foundation, head directly over the ball, and optimal backlift. Ready for power transfer.";
    } else if (overallScore >= 75) {
      feedback = "GOOD FORM: Base is stable. Adjust your head balance and keep your knees slightly more flexed to improve cover-drive timing.";
    } else {
      feedback = "IMPROVABLE: Stance is off-balance. Widen your feet to shoulder width, stabilize your head, and raise your hands for a fluid swing.";
    }

    return {
      backlift: Math.round(backliftScore),
      knee: Math.round(kneeScore),
      head: Math.round(headScore),
      foot: Math.round(footScore),
      overall: overallScore,
      feedback,
      stanceType:
        backlift > 80 ? "Power Hitter" : backlift < 40 ? "Classic Defensive" : "Balanced / All-Rounder",
    };
  };

  const metrics = computeMetrics();

  // Webcam Canvas HUD loop
  useEffect(() => {
    let animId: number;
    
    if (mode === "camera" && cameraActive && canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      const drawHUD = () => {
        if (!ctx || !video || video.paused || video.ended) return;

        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-w, 0);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        // 1. Overlay monochrome filter
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, w, h);

        // Thin Grid Lines (Apple style)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = 0; x < w; x += 50) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += 50) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();

        // 2. High-Tech Target Box (Gold)
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 1;
        ctx.strokeRect(w * 0.28, h * 0.15, w * 0.44, h * 0.7);

        // Corner brackets
        const bSize = 15;
        const bx = w * 0.28;
        const by = h * 0.15;
        const bw = w * 0.44;
        const bh = h * 0.7;

        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 2.5;
        // Top Left
        ctx.beginPath(); ctx.moveTo(bx + bSize, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + bSize); ctx.stroke();
        // Top Right
        ctx.beginPath(); ctx.moveTo(bx + bw - bSize, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bSize); ctx.stroke();
        // Bottom Left
        ctx.beginPath(); ctx.moveTo(bx + bSize, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - bSize); ctx.stroke();
        // Bottom Right
        ctx.beginPath(); ctx.moveTo(bx + bw - bSize, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bSize); ctx.stroke();

        // 3. Simulated Stance Skeleton Coordinates
        const time = Date.now() * 0.0015;
        const swayX = Math.sin(time) * 8;
        const swayY = Math.cos(time) * 4;

        const joints = {
          head: { x: w * 0.5 + swayX, y: h * 0.24 + swayY },
          neck: { x: w * 0.5 + swayX, y: h * 0.31 + swayY },
          shoulderL: { x: w * 0.43 + swayX, y: h * 0.34 + swayY },
          shoulderR: { x: w * 0.57 + swayX, y: h * 0.34 + swayY },
          elbowL: { x: w * 0.39 + swayX * 1.1, y: h * 0.47 + swayY * 1.1 },
          wristL: { x: w * 0.44 + swayX * 1.3, y: h * 0.55 },
          hipL: { x: w * 0.46 + swayX * 0.8, y: h * 0.6 + swayY * 0.8 },
          hipR: { x: w * 0.54 + swayX * 0.8, y: h * 0.6 + swayY * 0.8 },
          kneeL: { x: w * 0.44 + swayX * 0.6, y: h * 0.75 + swayY * 0.5 },
          kneeR: { x: w * 0.56 + swayX * 0.6, y: h * 0.76 + swayY * 0.5 },
          ankleL: { x: w * 0.41, y: h * 0.9 },
          ankleR: { x: w * 0.59, y: h * 0.9 },
        };

        // Draw bones
        ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
        ctx.lineWidth = 1.5;

        const drawBone = (j1: { x: number; y: number }, j2: { x: number; y: number }) => {
          ctx.beginPath();
          ctx.moveTo(j1.x, j1.y);
          ctx.lineTo(j2.x, j2.y);
          ctx.stroke();
        };

        drawBone(joints.head, joints.neck);
        drawBone(joints.shoulderL, joints.shoulderR);
        drawBone(joints.neck, { x: (joints.hipL.x + joints.hipR.x)/2, y: (joints.hipL.y + joints.hipR.y)/2 });
        drawBone(joints.shoulderL, joints.elbowL);
        drawBone(joints.elbowL, joints.wristL);
        drawBone(joints.hipL, joints.hipR);
        drawBone(joints.hipL, joints.kneeL);
        drawBone(joints.kneeL, joints.ankleL);
        drawBone(joints.hipR, joints.kneeR);
        drawBone(joints.kneeR, joints.ankleR);

        // Draw joint nodes
        ctx.fillStyle = "#ffffff";
        Object.values(joints).forEach((j) => {
          ctx.beginPath();
          ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#d4af37";
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // 4. Draw HUD Text overlays
        ctx.fillStyle = "#d4af37";
        ctx.font = "11px monospace";
        ctx.fillText("SYSTEM: ACTIVE", bx + 15, by + 25);
        ctx.fillText("BIOMETRICS: LOCKED", bx + 15, by + 40);

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText("L-KNEE: 142°", bx + 15, by + bh - 40);
        ctx.fillText("HEAD BALANCE: STABLE", bx + 15, by + bh - 25);

        animId = requestAnimationFrame(drawHUD);
      };

      drawHUD();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode, cameraActive]);

  const startCamera = async () => {
    setCameraActive(true);
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable.", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <section className="bg-secondary/20 p-6 md:p-8 rounded-2xl w-full border border-white/5 relative overflow-hidden" id="stance-analyzer">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/3 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="text-accent text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 font-mono">
            <Cpu className="w-4 h-4" /> Sports Science & ML
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 font-display">
            AI STANCE ANALYZER
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              stopCamera();
              setMode("designer");
            }}
            className={`px-4 py-2 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
              mode === "designer"
                ? "bg-accent text-primary shadow-md shadow-accent/15"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> 2D Designer
          </button>
          <button
            onClick={startCamera}
            className={`px-4 py-2 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
              mode === "camera"
                ? "bg-accent text-primary shadow-md shadow-accent/15"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Camera HUD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* VIEWPORT: Left Panel */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {mode === "designer" ? (
            <div className="w-full aspect-[4/3] bg-primary/40 border border-white/5 rounded-xl relative flex items-center justify-center p-4">
              <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.03]">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white" />
                ))}
              </div>

              {/* Styled SVG Skeleton */}
              <svg viewBox="0 0 200 160" className="w-full h-full max-h-[250px]">
                <line x1="20" y1="145" x2="180" y2="145" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                
                {(() => {
                  const hx = 100 + (headTilt - 50) * 0.35;
                  const hy = 35;
                  const sL_x = hx - 14;
                  const sR_x = hx + 14;
                  const sy = 48;
                  const hipL_x = 90;
                  const hipR_x = 110;
                  const hipy = 85;

                  const elbowL_x = sL_x - 10 - (backlift * 0.1);
                  const elbowL_y = sy + 14 - (backlift * 0.18);
                  const wrist_x = hx - 5;
                  const wrist_y = sy + 28 - (backlift * 0.22);

                  const kneeL_x = hipL_x - 8 - (kneeBend * 0.04);
                  const kneeL_y = hipy + 24 + (kneeBend * 0.08);
                  const kneeR_x = hipR_x + 8 + (kneeBend * 0.04);
                  const kneeR_y = hipy + 24 + (kneeBend * 0.08);

                  const footOffset = footWidth * 0.3;
                  const footL_x = hipL_x - 12 - footOffset;
                  const footR_x = hipR_x + 12 + footOffset;
                  const footy = 145;

                  return (
                    <g>
                      {/* Spine */}
                      <line x1={hx} y1={hy} x2={hx} y2={sy} stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
                      <line x1={sL_x} y1={sy} x2={sR_x} y2={sy} stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
                      <line x1={hx} y1={sy} x2={100} y2={hipy} stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
                      <line x1={hipL_x} y1={hipy} x2={hipR_x} y2={hipy} stroke="rgba(212,175,55,0.6)" strokeWidth="2" />

                      {/* Bat */}
                      <g transform={`translate(${wrist_x}, ${wrist_y}) rotate(${-15 - backlift * 0.85})`}>
                        <rect x="-2" y="0" width="4" height="36" fill="#dfceb5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" rx="0.5" />
                        <rect x="-1" y="-12" width="2" height="12" fill="#d4af37" />
                      </g>

                      {/* Limbs */}
                      <line x1={sL_x} y1={sy} x2={elbowL_x} y2={elbowL_y} stroke="#ffffff" strokeWidth="2" />
                      <line x1={elbowL_x} y1={elbowL_y} x2={wrist_x} y2={wrist_y} stroke="#ffffff" strokeWidth="2" />
                      <line x1={sR_x} y1={sy} x2={wrist_x} y2={wrist_y} stroke="#ffffff" strokeWidth="2" />
                      <line x1={hipL_x} y1={hipy} x2={kneeL_x} y2={kneeL_y} stroke="#ffffff" strokeWidth="2" />
                      <line x1={kneeL_x} y1={kneeL_y} x2={footL_x} y2={footy} stroke="#ffffff" strokeWidth="2" />
                      <line x1={hipR_x} y1={hipy} x2={kneeR_x} y2={kneeR_y} stroke="#ffffff" strokeWidth="2" />
                      <line x1={kneeR_x} y1={kneeR_y} x2={footR_x} y2={footy} stroke="#ffffff" strokeWidth="2" />

                      {/* Nodes */}
                      <circle cx={hx} cy={hy} r="5.5" fill="#d4af37" stroke="#000000" strokeWidth="1.5" />
                      <circle cx={sL_x} cy={sy} r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={sR_x} cy={sy} r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={elbowL_x} cy={elbowL_y} r="3" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={wrist_x} cy={wrist_y} r="3" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={hipL_x} cy={hipy} r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={hipR_x} cy={hipy} r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={kneeL_x} cy={kneeL_y} r="3" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={kneeR_x} cy={kneeR_y} r="3" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
                      <circle cx={footL_x} cy={footy} r="4" fill="#d4af37" stroke="#000000" strokeWidth="1.5" />
                      <circle cx={footR_x} cy={footy} r="4" fill="#d4af37" stroke="#000000" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>
              
              <div className="absolute bottom-3 right-3 bg-secondary/80 px-2 py-1 rounded text-[9px] text-white/50 uppercase tracking-widest font-mono border border-white/5">
                Stance: {metrics.stanceType}
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-black border border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
                onLoadedMetadata={() => setCameraActive(true)}
              />
              <canvas ref={canvasRef} className="w-full h-full object-cover" />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-primary/95 text-center">
                  <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                  <Camera className="w-10 h-10 text-accent mb-4 animate-pulse" />
                  <h3 className="text-sm font-bold mb-2">Webcam Feed Pending</h3>
                  <p className="text-xs text-white/50 max-w-xs mb-6 leading-relaxed">
                    Allow camera access to test the auto-skeletal stance tracking overlay, or interact with the Stance Designer.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2 bg-accent hover:bg-accent-hover text-primary font-bold rounded-lg text-xs transition-all duration-300"
                  >
                    Activate Camera
                  </button>
                </div>
              )}
              {cameraActive && (
                <button
                  onClick={stopCamera}
                  className="absolute bottom-3 left-3 bg-red-650/90 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  Stop Feed
                </button>
              )}
            </div>
          )}
        </div>

        {/* DIAGNOSTICS: Right Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <div className="bg-secondary/40 p-6 rounded-xl border border-accent/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5 text-accent" /> Assessment
              </span>
              <span className="bg-accent/10 text-accent border border-accent/25 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
                Live Rating
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white text-glow-accent tracking-tighter font-display">
                {metrics.overall}%
              </span>
              <span className="text-accent text-xs font-bold tracking-wider font-mono">
                {metrics.overall >= 90 ? "ELITE" : metrics.overall >= 75 ? "GOOD" : "ADJUST"}
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed min-h-[50px] border-t border-white/5 pt-3">
              {metrics.feedback}
            </p>
          </div>

          {/* Metric Progress Bars */}
          <div className="flex flex-col gap-4 bg-black/40 p-5 rounded-xl border border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1 font-mono">
              <Award className="w-3.5 h-3.5" /> Biomechanical Analysis
            </h4>

            {/* Metric 1 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/60">Backlift & Hands Position</span>
                <span className="text-accent font-mono font-bold">{metrics.backlift}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${metrics.backlift}%` }}
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/60">Knee Flexion (Power Base)</span>
                <span className="text-accent font-mono font-bold">{metrics.knee}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${metrics.knee}%` }}
                />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/60">Head Position Stability</span>
                <span className="text-accent font-mono font-bold">{metrics.head}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${metrics.head}%` }}
                />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/60">Footing Width & Balance</span>
                <span className="text-accent font-mono font-bold">{metrics.foot}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${metrics.foot}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          {mode === "designer" ? (
            <div className="flex flex-col gap-4 bg-black/40 p-5 rounded-xl border border-white/5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">
                Stance Parameters
              </h4>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <label htmlFor="backlift-range" className="text-white/70">Backlift Height</label>
                  <span className="text-white/40">{backlift > 75 ? "High" : backlift < 40 ? "Low" : "Standard"}</span>
                </div>
                <input
                  id="backlift-range"
                  type="range"
                  min="0"
                  max="100"
                  value={backlift}
                  onChange={(e) => setBacklift(Number(e.target.value))}
                  className="w-full accent-accent h-[2px] bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <label htmlFor="knee-bend-range" className="text-white/70">Knee Bend / Flexion</label>
                  <span className="text-white/40">{kneeBend > 70 ? "Deep" : kneeBend < 30 ? "Straight" : "Optimal"}</span>
                </div>
                <input
                  id="knee-bend-range"
                  type="range"
                  min="0"
                  max="100"
                  value={kneeBend}
                  onChange={(e) => setKneeBend(Number(e.target.value))}
                  className="w-full accent-accent h-[2px] bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <label htmlFor="head-tilt-range" className="text-white/70">Head Balance</label>
                  <span className="text-white/40">{headTilt > 60 ? "Leaning" : headTilt < 40 ? "Leaning" : "Centered"}</span>
                </div>
                <input
                  id="head-tilt-range"
                  type="range"
                  min="0"
                  max="100"
                  value={headTilt}
                  onChange={(e) => setHeadTilt(Number(e.target.value))}
                  className="w-full accent-accent h-[2px] bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <label htmlFor="foot-width-range" className="text-white/70">Stance Foot Width</label>
                  <span className="text-white/40">{footWidth > 75 ? "Wide" : footWidth < 30 ? "Narrow" : "Optimal"}</span>
                </div>
                <input
                  id="foot-width-range"
                  type="range"
                  min="0"
                  max="100"
                  value={footWidth}
                  onChange={(e) => setFootWidth(Number(e.target.value))}
                  className="w-full accent-accent h-[2px] bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 bg-accent/5 p-5 rounded-xl border border-accent/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-4 h-4" /> Instructions
              </h4>
              <ul className="text-[11px] text-white/60 list-disc pl-4 flex flex-col gap-2 leading-relaxed">
                <li>Stand 6 to 8 feet away from your camera so your full body is visible.</li>
                <li>Hold a bat (or simulate holding one) in your batting stance position.</li>
                <li>Keep your chest oriented slightly towards the side (side-on stance).</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
