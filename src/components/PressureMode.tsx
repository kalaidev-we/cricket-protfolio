"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, Volume2, VolumeX, AlertTriangle, Play, RotateCcw, ShieldAlert, Award } from "lucide-react";
import AudioEngine from "./AudioEngine";
import confetti from "canvas-confetti";

export default function PressureMode() {
  const [isActive, setIsActive] = useState(false);
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [timeLeft, setTimeLeft] = useState(10.00);
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
      const interval = 50;
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

  const handleTimeout = () => {
    AudioEngine.playBatHit();
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

    AudioEngine.stopHeartbeat();
    AudioEngine.playBatHit();

    if (shot === "helicopter") {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#ffffff", "#000000"],
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
          ? "border-accent-red/20 bg-black/95 shadow-[0_0_40px_rgba(225,29,72,0.1)]" 
          : "border-white/5 bg-secondary/20 shadow-xl"
      }`}
      id="pressure-mode"
    >
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full filter blur-[120px] pointer-events-none transition-all duration-1000 ${
          isActive 
            ? "w-96 h-96 bg-accent-red/5 scale-125" 
            : "w-64 h-64 bg-accent/3"
        }`} 
      />

      {isActive && (
        <>
          <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
          <div className="absolute left-0 top-0 w-full h-[0.5px] bg-accent-red/50 pointer-events-none animate-scanline" />
          <div className="absolute inset-0 vignette-overlay-red pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors duration-500 ${isActive ? "bg-accent-red/10 text-accent-red" : "bg-accent/10 text-accent"}`}>
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 font-mono ${isActive ? "text-accent-red text-glow-red" : "text-accent"}`}>
              {isActive ? "Tension Experience Active" : "Interactive Simulation"}
            </span>
            <h2 className="text-xl font-bold tracking-tight mt-0.5 font-display">
              THE PRESSURE VALVE
            </h2>
          </div>
        </div>
        <button
          onClick={handleMuteToggle}
          className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Game Stages */}
      <div className="p-6 md:p-8 min-h-[250px] flex flex-col justify-center items-center relative z-10">
        {gameState === "intro" && (
          <div className="text-center max-w-lg flex flex-col items-center">
            <AlertTriangle className="w-10 h-10 text-accent mb-4 animate-bounce" />
            <h3 className="text-sm font-bold tracking-tight text-white mb-2 uppercase font-display">
              Final Ball. 6 Runs Needed. 95,000 Cheering.
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6">
              Step into the shoes of the national team's finisher. Your heartbeat is echoing. The bowler runs in. You have exactly 10 seconds to read the delivery and choose your stroke. Will you become a legend or succumb to the pressure?
            </p>
            <button
              onClick={startPressureMode}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-primary font-bold rounded text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-md shadow-accent/15"
            >
              <Play className="w-3.5 h-3.5 fill-primary" /> Enter Pressure Mode
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full text-center flex flex-col items-center">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-full mb-6">
              <span className="w-1 h-1 bg-accent-red rounded-full animate-ping" />
              <span className="text-[8px] text-accent-red font-bold tracking-widest uppercase font-mono">
                Decide Now: Yorker Pitching Outside Off Stump
              </span>
            </div>

            {/* Giant countdown timer */}
            <div className="mb-6 select-none">
              <span className="text-5xl md:text-6xl font-black font-mono tracking-tighter text-glow-red text-accent-red">
                {timeLeft.toFixed(2)}
              </span>
              <span className="text-[8px] text-white/40 block mt-1 font-mono uppercase tracking-widest">
                Seconds Remaining
              </span>
            </div>

            {/* Shot Choices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl">
              <button
                onClick={() => handleShotSelection("cover_drive")}
                className="py-3 px-2.5 rounded-lg border border-white/5 bg-secondary/40 hover:bg-white/5 hover:border-accent transition-all duration-300 font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1.5 group"
              >
                <span className="text-white group-hover:text-accent font-display">Cover Drive</span>
                <span className="text-[8px] text-white/40 group-hover:text-white/60 font-mono">Safe Stroke</span>
              </button>
              <button
                onClick={() => handleShotSelection("pull")}
                className="py-3 px-2.5 rounded-lg border border-white/5 bg-secondary/40 hover:bg-white/5 hover:border-accent transition-all duration-300 font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1.5 group"
              >
                <span className="text-white group-hover:text-accent font-display">Pull Shot</span>
                <span className="text-[8px] text-white/40 group-hover:text-white/60 font-mono">High Risk</span>
              </button>
              <button
                onClick={() => handleShotSelection("helicopter")}
                className="py-3 px-2.5 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/15 hover:border-accent transition-all duration-300 font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1.5 group"
              >
                <span className="text-accent text-glow-accent font-display">Helicopter</span>
                <span className="text-[8px] text-accent/50 group-hover:text-accent/80 font-mono">Power Hit</span>
              </button>
              <button
                onClick={() => handleShotSelection("sweep")}
                className="py-3 px-2.5 rounded-lg border border-white/5 bg-secondary/40 hover:bg-white/5 hover:border-accent transition-all duration-300 font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1.5 group"
              >
                <span className="text-white group-hover:text-accent font-display">Sweep Shot</span>
                <span className="text-[8px] text-white/40 group-hover:text-white/60 font-mono">Low Angle</span>
              </button>
            </div>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center max-w-lg flex flex-col items-center">
            {outcome.success ? (
              <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center text-accent mb-4 animate-bounce">
                <Award className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-accent-red/10 border border-accent-red/30 rounded-full flex items-center justify-center text-accent-red mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            
            <h3 className={`text-lg md:text-xl font-bold font-display tracking-tight mb-2 uppercase ${outcome.success ? "text-accent text-glow-accent" : "text-accent-red"}`}>
              {outcome.title}
            </h3>

            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-4 border ${
              outcome.success 
                ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 font-mono" 
                : "bg-red-950/20 border-red-500/20 text-red-400 font-mono"
            }`}>
              {outcome.actionText}
            </span>

            <p className="text-xs text-white/60 leading-relaxed mb-6 border-t border-white/5 pt-4">
              {outcome.desc}
            </p>

            <button
              onClick={resetGame}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> Replay Scenario
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
