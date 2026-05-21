"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, Volume2, VolumeX, AlertTriangle, Play, RotateCcw, ShieldAlert, Award } from "lucide-react";
import AudioEngine from "./AudioEngine";
import confetti from "canvas-confetti";

export default function PressureMode() {
  const [isActive, setIsActive] = useState(false);
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [timeLeft, setTimeLeft] = useState(10.00); // 10 seconds
  const [selectedShot, setSelectedShot] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync mute state with AudioEngine
  useEffect(() => {
    setIsMuted(AudioEngine.getMuteState());
  }, []);

  const handleMuteToggle = () => {
    const muted = AudioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Countdown timer logic
  useEffect(() => {
    if (isActive && gameState === "playing") {
      const interval = 50; // update every 50ms for milliseconds granularity
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.05) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          return Number((prev - 0.05).toFixed(2));
        });
      }, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, gameState]);

  // Handle timeout (user fails to choose in time)
  const handleTimeout = () => {
    AudioEngine.playBatHit();
    // Simulate bowled
    setSelectedShot("TIMEOUT");
    setGameState("result");
    AudioEngine.stopHeartbeat();
    AudioEngine.stopCrowdAmbience();
  };

  const startPressureMode = () => {
    AudioEngine.playSwoosh();
    setIsActive(true);
    setGameState("playing");
    setTimeLeft(10.00);
    setSelectedShot(null);
    AudioEngine.startHeartbeat();
    AudioEngine.startCrowdAmbience();
  };

  const handleShotSelection = (shot: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedShot(shot);
    setGameState("result");

    // Stop intense heartbeat, play bat hit, trigger cinematic outcomes
    AudioEngine.stopHeartbeat();
    AudioEngine.playBatHit();

    if (shot === "helicopter") {
      // Trigger victory confetti!
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ffd700", "#ffffff", "#111827"],
        });
      }, 300);
    } else {
      AudioEngine.stopCrowdAmbience();
    }
  };

  const resetGame = () => {
    AudioEngine.playSwoosh();
    setGameState("intro");
    setIsActive(false);
    setTimeLeft(10.00);
    setSelectedShot(null);
    AudioEngine.stopHeartbeat();
    AudioEngine.stopCrowdAmbience();
  };

  // Get results text and statuses
  const getOutcomeData = () => {
    switch (selectedShot) {
      case "helicopter":
        return {
          title: "INTO THE ORBIT! SIX RUNS!",
          success: true,
          desc: "THWACK! You execute a thunderous Helicopter Shot! The ball meets the sweet spot of the willow, soaring high over deep mid-wicket. It sails clear over the stadium roof! 95,000 spectators explode into a deafening roar. You have won the championship in style!",
          actionText: "Champions Title Unlocked",
        };
      case "cover_drive":
        return {
          title: "STUNNING COVER DRIVE... BUT ONLY FOUR!",
          success: false,
          desc: "CRACK! An elegant, textbook cover-drive. The ball pierces the gap between extra-cover and mid-off. It races across the grass to hit the boundary cushions. 4 runs! A beautiful shot, but you needed 6 off the final delivery. The crowd gasps in heartbreak. Scenario Failed.",
          actionText: "Target Unachieved",
        };
      case "pull":
        return {
          title: "AGGRESSIVE PULL... CAUGHT AT DEEP SQUARE LEG!",
          success: false,
          desc: "WHACK! You roll your wrists over a short delivery, pulling it hard. It hangs high in the floodlit air. The crowd holds its breath. A fielder sprints along the boundary ropes, leaps, and grabs a stunning catch! Out! Scenario Failed.",
          actionText: "Caught Out",
        };
      case "sweep":
        return {
          title: "LBW APPEAL... UMPİRE RAISES THE FINGER!",
          success: false,
          desc: "Swoosh! You drop to one knee, attempting a sweep shot. The ball pitches in line, bypasses the bat, and strikes your front pad. The fielding team yells 'HOWZAT?!' in unison. The umpire slowly raises his finger. LBW! Scenario Failed.",
          actionText: "Leg Before Wicket (LBW)",
        };
      case "TIMEOUT":
      default:
        return {
          title: "STUMPED! BALL CRASHES INTO STUMPS!",
          success: false,
          desc: "Pressure froze your reflexes! You stayed locked in the crease. The bowler slips in a deceptively fast yorker. It slips under your bat and crashes into the middle stump, lighting up the bails. The crowd sighs in disappointment. Scenario Failed.",
          actionText: "Clean Bowled (Time Out)",
        };
    }
  };

  const outcome = getOutcomeData();

  return (
    <section 
      className={`relative w-full rounded-2xl border transition-all duration-700 overflow-hidden ${
        isActive 
          ? "border-accent-red/40 bg-black/95 shadow-[0_0_50px_rgba(255,51,51,0.15)]" 
          : "border-white/5 bg-secondary/40 shadow-xl"
      }`}
      id="pressure-mode"
    >
      {/* Dynamic Ambient Color Rings */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full filter blur-[120px] pointer-events-none transition-all duration-1000 ${
          isActive 
            ? "w-96 h-96 bg-accent-red/10 scale-125" 
            : "w-64 h-64 bg-accent/5"
        }`} 
      />

      {/* Grid Scanline Overlays for Pressure Vibe */}
      {isActive && (
        <>
          <div className="absolute inset-0 noise-overlay opacity-50 pointer-events-none animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-black pointer-events-none" />
          {/* Animated red alert line */}
          <div className="absolute left-0 top-0 w-full h-[2px] bg-accent-red/60 shadow-[0_0_10px_#ff3333] pointer-events-none animate-scanline" />
          {/* Screen vignette */}
          <div className="absolute inset-0 vignette-overlay-red pointer-events-none" />
        </>
      )}

      {/* Header bar */}
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors duration-500 ${isActive ? "bg-accent-red/20 text-accent-red" : "bg-accent/15 text-accent"}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-500 ${isActive ? "text-accent-red text-glow-red" : "text-accent"}`}>
              {isActive ? "Tension Experience Active" : "Interactive Simulation"}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5 font-display">
              THE PRESSURE VALVE
            </h2>
          </div>
        </div>
        <button
          onClick={handleMuteToggle}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Game Stages */}
      <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-center items-center relative z-10">
        {gameState === "intro" && (
          <div className="text-center max-w-xl flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 text-accent mb-4 animate-bounce" />
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2">
              Final Ball. 6 Runs Needed. 95,000 Cheering.
            </h3>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed mb-6">
              Step into the shoes of the national team's finisher. Your heartbeat is echoing. The bowler runs in. You have exactly 10 seconds to read the delivery and choose your stroke. Will you become a legend or succumb to the pressure?
            </p>
            <button
              onClick={startPressureMode}
              className="px-8 py-3.5 bg-accent hover:bg-accent-hover text-primary font-black rounded-lg text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-accent/10 hover:shadow-accent/25 hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-primary" /> Enter Pressure Mode
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full text-center flex flex-col items-center">
            {/* Warning indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-red/20 border border-accent-red/30 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-accent-red rounded-full animate-ping" />
              <span className="text-[10px] text-accent-red font-bold tracking-widest uppercase font-mono">
                Decide Now: Yorker Pitching Outside Off Stump
              </span>
            </div>

            {/* Giant countdown timer */}
            <div className="mb-8 select-none">
              <span className="text-6xl md:text-7xl font-black font-mono tracking-tighter text-glow-red text-accent-red">
                {timeLeft.toFixed(2)}
              </span>
              <span className="text-xs text-white/40 block mt-1 font-mono uppercase tracking-widest">
                Seconds Remaining
              </span>
            </div>

            {/* Shot Choices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
              <button
                onClick={() => handleShotSelection("cover_drive")}
                className="py-4 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent transition-all duration-300 font-bold text-xs uppercase tracking-wider flex flex-col items-center gap-2 group"
              >
                <span className="text-white group-hover:text-accent font-display">Cover Drive</span>
                <span className="text-[9px] text-white/40 group-hover:text-white/60 font-medium">Safe Stroke (Mids)</span>
              </button>
              <button
                onClick={() => handleShotSelection("pull")}
                className="py-4 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent transition-all duration-300 font-bold text-xs uppercase tracking-wider flex flex-col items-center gap-2 group"
              >
                <span className="text-white group-hover:text-accent font-display">Pull Shot</span>
                <span className="text-[9px] text-white/40 group-hover:text-white/60 font-medium">High Risk (Bouncers)</span>
              </button>
              <button
                onClick={() => handleShotSelection("helicopter")}
                className="py-4 px-3 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/15 hover:border-accent transition-all duration-300 font-bold text-xs uppercase tracking-wider flex flex-col items-center gap-2 group shadow-[0_0_15px_rgba(255,215,0,0.05)]"
              >
                <span className="text-accent text-glow-gold font-display">Helicopter Shot</span>
                <span className="text-[9px] text-accent/50 group-hover:text-accent/80 font-medium">Power Hit (Yorkers)</span>
              </button>
              <button
                onClick={() => handleShotSelection("sweep")}
                className="py-4 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent transition-all duration-300 font-bold text-xs uppercase tracking-wider flex flex-col items-center gap-2 group"
              >
                <span className="text-white group-hover:text-accent font-display">Sweep Shot</span>
                <span className="text-[9px] text-white/40 group-hover:text-white/60 font-medium">Low Angle (Spins)</span>
              </button>
            </div>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center max-w-xl flex flex-col items-center animate-fade-in">
            {outcome.success ? (
              <div className="w-12 h-12 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center text-accent mb-4 animate-bounce">
                <Award className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-accent-red/20 border border-accent-red/40 rounded-full flex items-center justify-center text-accent-red mb-4">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
            )}
            
            <h3 className={`text-xl md:text-2xl font-black font-display tracking-tight mb-2 uppercase ${outcome.success ? "text-accent text-glow-gold" : "text-accent-red text-glow-red"}`}>
              {outcome.title}
            </h3>

            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-4 border ${
              outcome.success 
                ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400" 
                : "bg-red-950/50 border-red-500/30 text-red-400"
            }`}>
              {outcome.actionText}
            </span>

            <p className="text-xs md:text-sm text-white/70 leading-relaxed mb-6 border-t border-white/5 pt-4">
              {outcome.desc}
            </p>

            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay Scenario
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
