"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mail, ArrowDownCircle, Trophy, Play, Star, ChevronRight, Compass } from "lucide-react";
import AudioEngine from "@/components/AudioEngine";

// Client-side components
import ThreeCanvas from "@/components/ThreeCanvas";
import Timeline from "@/components/Timeline";
import StatsDashboard from "@/components/StatsDashboard";
import AIStanceAnalyzer from "@/components/AIStanceAnalyzer";
import PressureMode from "@/components/PressureMode";
import Gallery from "@/components/Gallery";
import Achievements from "@/components/Achievements";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [active3DView, setActive3DView] = useState<"ball" | "bat">("ball");
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Mouse reactive cursor glow state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Preloader counter animation (Apple cinematic loading feel)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          AudioEngine.playSwoosh();
        }, 650);
      }
      setLoadPercent(current);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Track scroll position to feed into 3D rotations
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse coordinates for background cursor glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Sync mute state
  useEffect(() => {
    setIsMuted(AudioEngine.getMuteState());
  }, []);

  const toggleGlobalMute = () => {
    const state = AudioEngine.toggleMute();
    setIsMuted(state);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-primary text-white selection:bg-accent selection:text-primary overflow-x-hidden font-sans">
      {/* Nothing.tech Style Background Noise */}
      <div className="absolute inset-0 noise-overlay opacity-[0.4] pointer-events-none z-10" />

      {/* Apple-style Cursor Glow micro-interaction */}
      <div 
        className="fixed w-[280px] h-[280px] bg-accent/4 rounded-full filter blur-[80px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 hidden md:block transition-all duration-300 ease-out"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest font-display text-white uppercase mb-2">
                JAIVIGENESH
              </h1>
              <div className="text-accent/60 font-mono text-[9px] tracking-[0.25em] uppercase mb-6 font-bold">
                CALIBRATING METRICS
              </div>
              <div className="text-accent font-mono text-[11px] tracking-[0.25em] uppercase font-bold text-glow-accent">
                {loadPercent}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="w-full flex flex-col relative z-20">
          
          {/* Header Navigation: Minimal floating navbar with blur effect */}
          <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-secondary/40 backdrop-blur-md border border-white/5 py-2.5 px-6 rounded-full flex gap-6 md:gap-12 items-center transition-all duration-300 w-[90%] max-w-[620px] justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2">
              <span className="text-accent font-black tracking-wider text-[10px] font-mono border border-accent/20 px-2 py-0.5 rounded">
                JAIVI #284
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-4 md:gap-6 text-[9px] font-bold uppercase tracking-widest text-white/50">
              <button onClick={() => scrollToSection("beginning")} className="hover:text-accent transition-colors">Beginning</button>
              <button onClick={() => scrollToSection("grind")} className="hover:text-accent transition-colors">Grind</button>
              <button onClick={() => scrollToSection("moments")} className="hover:text-accent transition-colors">Moments</button>
              <button onClick={() => scrollToSection("statistics")} className="hover:text-accent transition-colors">Stats</button>
              <button onClick={() => scrollToSection("achievements")} className="hover:text-accent transition-colors">Achievements</button>
              <button onClick={() => scrollToSection("future")} className="hover:text-accent transition-colors">Future</button>
            </nav>

            <button
              onClick={toggleGlobalMute}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 transition-all text-[8px] flex items-center gap-1 font-mono uppercase tracking-wider"
              title="Toggle Audio Experience"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-accent-red" />
              ) : (
                <Volume2 className="w-3 h-3 text-accent" />
              )}
            </button>
          </header>

          {/* HERO SECTION: Full-screen cinematic intro */}
          <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-12 overflow-hidden bg-primary border-b border-white/5">
            {/* Ambient Background Spotlight glow */}
            <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-accent/2 rounded-full filter blur-[150px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full max-w-6xl mx-auto flex-1">
              
              {/* Text Area (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left">
                <span className="text-accent text-[9px] font-bold tracking-[0.3em] uppercase block mb-3 font-mono">
                  Every run. Every scar. Every dream.
                </span>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase font-display text-white mb-6">
                  More Than
                  <span className="block text-accent text-glow-accent">A Cricketer.</span>
                </h1>

                <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-md mb-8">
                  An immersive journey through passion, discipline, pressure and legacy.
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => scrollToSection("beginning")}
                    className="px-5 py-3 bg-accent hover:bg-accent-hover text-primary font-bold rounded text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-accent/15 hover:scale-[1.01]"
                  >
                    Explore The Story
                  </button>
                </div>
              </div>

              {/* 3D WebGL Canvas Area (Right) */}
              <div className="lg:col-span-6 flex flex-col justify-center items-center h-[320px] md:h-[420px] relative">
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-secondary/10 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <ThreeCanvas activeView={active3DView} scrollProgress={scrollProgress} />
                </div>
                
                {/* 3D Controller Options bar */}
                <div className="absolute bottom-4 bg-primary/95 border border-white/10 px-3 py-1 rounded-full flex gap-1 z-20 backdrop-blur shadow-md">
                  <button
                    onClick={() => {
                      AudioEngine.playSwoosh();
                      setActive3DView("ball");
                    }}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      active3DView === "ball" ? "bg-accent text-primary" : "text-white/60 hover:text-white"
                    }`}
                  >
                    Leather Ball
                  </button>
                  <button
                    onClick={() => {
                      AudioEngine.playSwoosh();
                      setActive3DView("bat");
                    }}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      active3DView === "bat" ? "bg-accent text-primary" : "text-white/60 hover:text-white"
                    }`}
                  >
                    Willow Bat
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer" onClick={() => scrollToSection("beginning")}>
              <span className="text-[8px] uppercase font-mono tracking-widest text-white/40">Scroll to Explore</span>
              <ArrowDownCircle className="w-4 h-4 text-accent animate-bounce mt-1" />
            </div>
          </section>

          {/* MAIN PAGE STORYTELLING SECTIONS */}
          <main className="w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col py-12 gap-16 md:gap-24">
            
            {/* CHAPTER I: THE BEGINNING (Origins) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 border-b border-white/5 px-6 md:px-12 rounded-2xl bg-gradient-to-b from-primary via-black/60 to-primary overflow-hidden" id="beginning">
              {/* Tunnel atmosphere vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_90%)] pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-accent/0 via-accent/10 to-accent/0" />
              
              <div className="relative z-10 flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">01 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Origins</span>
              </div>
              
              <div className="relative z-10 max-w-xl mb-4">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter I</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  THE BEGINNING
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Every story has a foundation. Born in Vellore, raised under the canopy of Bangalore, childhood dreams started taking shape. Studying at Bettal and Sri Mithri English School, a tennis ball was the first window to the crease.
                </p>
              </div>

              <div className="relative z-10">
                <Timeline phase="beginning" />
              </div>
            </section>

            {/* CHAPTER II: THE GRIND (Preparation) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 border-b border-white/5 px-6 md:px-12 rounded-2xl bg-secondary/10 overflow-hidden" id="grind">
              {/* Soft spotlight reveal background effect */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-accent-light/3 rounded-full filter blur-[120px] pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">02 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Preparation</span>
              </div>

              <div className="max-w-xl mb-4 relative z-10">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter II</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  THE GRIND
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Discipline is forged in the silence of nets. The school matches at New Baldwin Mandur, the mathematical focus during engineering, and the daily sports management routines of a 4-year BBAB degree at Garden City University. Constant analysis, stance reviews, and the sweat behind the scenes.
                </p>
              </div>

              <div className="relative z-10">
                <Timeline phase="grind" />
              </div>
              
              <div className="mt-8 w-full relative z-10">
                <div className="text-center mb-6">
                  <span className="text-[9px] text-accent/50 uppercase tracking-widest font-mono font-bold">Biomechanical Evaluation</span>
                  <h3 className="text-lg font-bold font-display uppercase text-white mt-1">Stance Analysis Engine</h3>
                </div>
                <AIStanceAnalyzer />
              </div>
            </section>

            {/* CHAPTER III: MATCH MOMENTS (Tension) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 border-b border-white/5 px-6 md:px-12 rounded-2xl overflow-hidden" id="moments">
              {/* Stadium crowd flash effects background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-black/40 to-primary/80 pointer-events-none" />
              {/* Subtle ambient light flash animation simulated in CSS */}
              <div className="absolute inset-0 bg-white/[0.01] mix-blend-overlay pointer-events-none animate-pulse-slow" />
              
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">03 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Tension</span>
              </div>

              <div className="max-w-xl mb-4 relative z-10">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter III</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  MATCH MOMENTS
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  The crease at the final ball. 95,000 heartbeats. When reflexes must bypass thought. Step up to face the ultimate test.
                </p>
              </div>

              <div className="relative z-10 w-full">
                <PressureMode />
              </div>
            </section>

            {/* CHAPTER IV: STATISTICS (Analytics) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 border-b border-white/5 px-6 md:px-12 rounded-2xl bg-secondary/5 overflow-hidden" id="statistics">
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">04 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Analytics</span>
              </div>

              <div className="max-w-xl mb-4 relative z-10">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter IV</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  STATISTICS
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Data-driven dominance. An overview of tournament runs, batting averages, strike rates, and split-second scoring patterns.
                </p>
              </div>

              <div className="relative z-10 w-full">
                <StatsDashboard />
              </div>
            </section>

            {/* CHAPTER V: ACHIEVEMENTS (Legacy) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 border-b border-white/5 px-6 md:px-12 rounded-2xl overflow-hidden" id="achievements">
              {/* Premium luxury background gradient with soft light reflections */}
              <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-accent/2 rounded-full filter blur-[120px] pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">05 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Legacy</span>
              </div>

              <div className="max-w-xl mb-4 relative z-10">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter V</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  ACHIEVEMENTS
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Honoring the milestones. From early junior merit citations in Vellore to captaincy records and tournament MVPs.
                </p>
              </div>

              <div className="relative z-10 w-full">
                <Achievements />
              </div>
            </section>

            {/* CHAPTER VI: FUTURE VISION (Vision) */}
            <section className="relative py-20 md:py-28 flex flex-col gap-8 px-6 md:px-12 rounded-2xl overflow-hidden" id="future">
              {/* Empty stadium spotlight ambient feel */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-light/[0.015] rounded-full filter blur-[130px] pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">06 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-mono">Vision</span>
              </div>

              <div className="max-w-xl mb-4 relative z-10">
                <span className="text-accent/80 text-[10px] font-mono tracking-widest uppercase block mb-1">Chapter VI</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display uppercase mb-4">
                  FUTURE VISION
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                  Aspirations beyond the crease. Developing computer-vision stance tracking tools, entering professional tests leagues, and merging sports management with modern analytics.
                </p>
              </div>

              <div className="relative z-10 w-full">
                <Gallery />
              </div>

              {/* Bottom Quote & Contact links */}
              <div className="flex flex-col gap-12 mt-16 border-t border-white/5 pt-16 relative z-10">
                
                {/* Motto quote */}
                <div className="text-center py-6 max-w-xl mx-auto relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[0.5px] bg-accent/20" />
                  <blockquote className="text-sm md:text-base font-semibold italic text-white/80 leading-relaxed font-display">
                    &ldquo;It&apos;s not about the balls you face on the pitch, but the absolute crease you dominate.&rdquo;
                  </blockquote>
                  <span className="text-accent text-[9px] font-bold tracking-widest uppercase block mt-3 font-mono text-glow-accent">
                    - JAIVI&apos;S MOTTO
                  </span>
                </div>

                {/* Sponsorship Partners */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-white/30 text-[8px] font-bold uppercase tracking-widest font-mono">
                    AFFILIATED CAMPAIGNS
                  </span>
                  <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-[10px] font-extrabold text-white/30 tracking-widest font-display">
                    <span className="hover:text-accent transition-colors cursor-pointer">GARDEN CITY GCU</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">NBIS MANDUR NETS</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">BANGALORE COMBAT CLUB</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">WILLOW LABS</span>
                  </div>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-12">
                  <div>
                    <h3 className="text-base font-bold font-display tracking-tight uppercase text-white mb-2">
                      JAIVIGENESH.COM
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-xs mb-4">
                      Interested in collegiate leagues, sponsorships, net matchups, or athletic data reviews? Send an inquiry directly.
                    </p>
                    
                    {/* Signature Logo SVG */}
                    <div className="w-48 h-10 text-accent relative">
                      <svg viewBox="0 0 200 50" className="w-full h-full fill-none stroke-accent stroke-[1.5]">
                        <path d="M20,40 C40,5 50,45 60,10 T80,40 T100,15 T130,40 T150,5" strokeDasharray="300" strokeDashoffset="0" className="animate-pulse-slow" />
                        <text x="15" y="25" fill="#ffffff" stroke="none" className="text-base font-bold font-mono tracking-widest opacity-95">JAIVI</text>
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href="mailto:athlete@jaivigenesh.com"
                      className="flex items-center gap-3 p-4 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 hover:border-accent/20 rounded-xl transition-all duration-300 group animate-fade-in"
                    >
                      <div className="p-2 rounded bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 block font-mono">Official Mailbox</span>
                        <span className="text-xs font-bold text-white group-hover:text-accent transition-colors font-mono">athlete@jaivigenesh.com</span>
                      </div>
                    </a>

                    <div className="flex gap-2">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 rounded-lg text-[9px] text-white/70 hover:text-white transition-all font-semibold"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        GitHub
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 rounded-lg text-[9px] text-white/70 hover:text-white transition-all font-semibold"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>

          {/* FOOTER */}
          <footer className="w-full border-t border-white/5 bg-secondary/30 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[9px] text-white/40 font-mono tracking-wider uppercase gap-4 mt-12">
            <span>© 2026 JAIVIGENESH. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">GCU Sports Desk</a>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
