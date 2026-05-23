"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mail, ArrowDownCircle, Trophy, Play, Star, ChevronRight } from "lucide-react";
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

  // Preloader counter animation
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
        }, 600);
      }
      setLoadPercent(current);
    }, 45);

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
      <div className="absolute inset-0 noise-overlay opacity-[0.4] pointer-events-none" />

      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest font-display text-white uppercase mb-6">
                JAIVIGENESH
              </h1>
              <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase font-bold">
                {loadPercent}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="w-full flex flex-col relative">
          {/* Header HUD Navigation */}
          <header className="fixed top-0 left-0 right-0 z-40 bg-primary/45 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-accent font-black tracking-wider text-xs font-mono border border-accent/25 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(212,175,55,0.15)]">
                JAIVI #284
              </span>
              <span className="font-extrabold tracking-widest text-[9px] uppercase hidden sm:inline font-display text-white/50">
                GCU Scholar-Athlete
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[10px] font-semibold uppercase tracking-widest text-white/60">
              <button onClick={() => scrollToSection("journey-timeline")} className="hover:text-accent transition-colors">Journey</button>
              <button onClick={() => scrollToSection("statistics")} className="hover:text-accent transition-colors">Stats</button>
              <button onClick={() => scrollToSection("stance-analyzer")} className="hover:text-accent transition-colors">AI Science</button>
              <button onClick={() => scrollToSection("pressure-mode")} className="hover:text-accent transition-colors">Pressure</button>
              <button onClick={() => scrollToSection("gallery")} className="hover:text-accent transition-colors">Reels</button>
            </nav>

            <button
              onClick={toggleGlobalMute}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 transition-all text-[9px] flex items-center gap-1.5 font-mono uppercase tracking-wider"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-accent-red" />
                  <span className="hidden sm:inline">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline">Mute</span>
                </>
              )}
            </button>
          </header>

          {/* HERO SECTION */}
          <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-12 overflow-hidden bg-primary">
            {/* Ambient Background Spotlight glow */}
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent/2 rounded-full filter blur-[150px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full max-w-6xl mx-auto flex-1">
              
              {/* Text Area (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left">
                <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase block mb-3 font-mono">
                  Athletic & Academic Portfolio
                </span>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none uppercase font-display text-white mb-6">
                  POWER.
                  <span className="block text-accent text-glow-accent">PRECISION.</span>
                  JAIVI.
                </h1>

                <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-sm mb-8">
                  An interactive storytelling campaign mapping the physical geometry, academic milestones, and finishing metrics of Bangalore-raised all-rounder Jaivigenesh.
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => scrollToSection("journey-timeline")}
                    className="px-5 py-3 bg-accent hover:bg-accent-hover text-primary font-bold rounded text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-accent/15"
                  >
                    Enter Journey
                  </button>
                  <button
                    onClick={() => scrollToSection("pressure-mode")}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                  >
                    T20 Simulator
                  </button>
                </div>
              </div>

              {/* 3D WebGL Canvas Area (Right) */}
              <div className="lg:col-span-6 flex flex-col justify-center items-center h-[320px] md:h-[420px] relative">
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-secondary/10 border border-white/5">
                  <ThreeCanvas activeView={active3DView} scrollProgress={scrollProgress} />
                </div>
                
                {/* 3D Controller Options bar */}
                <div className="absolute bottom-4 bg-primary/95 border border-white/10 px-3 py-1.5 rounded-full flex gap-1 z-20 backdrop-blur shadow-md">
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
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer" onClick={() => scrollToSection("journey-timeline")}>
              <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Scroll to Explore</span>
              <ArrowDownCircle className="w-4 h-4 text-accent animate-bounce mt-1" />
            </div>
          </section>

          {/* MAIN PAGE LAYOUT SECTION CONTAINERS */}
          <main className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-24 md:gap-32">
            
            {/* SECTION 1: JOURNEY */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">01 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Chronology</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight font-display uppercase">
                THE ACADEMIC & ATHLETIC RISE
              </h2>
              <Timeline />
            </div>

            {/* SECTION 2: STATS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">02 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Metrics</span>
              </div>
              <StatsDashboard />
            </div>

            {/* SECTION 3: STANCE ANALYZER */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">03 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Biomechanical ML</span>
              </div>
              <AIStanceAnalyzer />
            </div>

            {/* SECTION 4: PRESSURE */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">04 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Tension simulator</span>
              </div>
              <PressureMode />
            </div>

            {/* SECTION 5: GALLERY */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">05 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Cinematography</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight font-display uppercase">
                REELS & HIGHLIGHTS
              </h2>
              <Gallery />
            </div>

            {/* SECTION 6: ACHIEVEMENTS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/30 font-mono text-xs md:text-sm font-bold">06 /</span>
                <div className="h-[0.5px] flex-1 bg-white/5" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">Pinnacle</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight font-display uppercase">
                ACHIEVEMENT SHOWCASE
              </h2>
              <Achievements />
            </div>

            {/* SECTION 7: SPONSORSHIP & CONTACT */}
            <div className="flex flex-col gap-12 border-t border-white/5 pt-16" id="sponsorship-contact">
              {/* Sponsorship strip */}
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest font-mono">
                  AFFILIATES & REPRESENTATIONS
                </span>
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-xs font-bold text-white/30 tracking-widest font-display">
                  <span className="hover:text-accent transition-colors duration-300 cursor-pointer">GARDEN CITY GCU</span>
                  <span className="hover:text-accent transition-colors duration-300 cursor-pointer">NBIS MANDUR NETS</span>
                  <span className="hover:text-accent transition-colors duration-300 cursor-pointer">BANGALORE COMBAT CLUB</span>
                  <span className="hover:text-accent transition-colors duration-300 cursor-pointer">WILLOW LABS</span>
                </div>
              </div>

              {/* Motto quote */}
              <div className="text-center py-6 max-w-xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[0.5px] bg-accent/25" />
                <blockquote className="text-sm md:text-lg font-semibold italic text-white/70 leading-relaxed font-display">
                  &ldquo;It&apos;s not about the balls you face on the pitch, but the absolute crease you dominate.&rdquo;
                </blockquote>
                <span className="text-accent text-[9px] font-bold tracking-widest uppercase block mt-3 font-mono text-glow-accent">
                  - JAIVI&apos;S MOTTO
                </span>
              </div>

              {/* Bottom contact split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-12">
                <div>
                  <h3 className="text-lg font-bold font-display tracking-tight uppercase text-white mb-2">
                    JAIVIGENESH.COM
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed max-w-xs mb-6">
                    Interested in collegiate leagues, sponsorships, net matchups, or athletic data reviews? Send an inquiry directly.
                  </p>
                  
                  {/* Signature Logo SVG - JAIVI */}
                  <div className="w-48 h-10 text-accent relative mb-4">
                    <svg viewBox="0 0 200 50" className="w-full h-full fill-none stroke-accent stroke-[1.5]">
                      <path d="M20,40 C40,5 50,45 60,10 T80,40 T100,15 T130,40 T150,5" strokeDasharray="300" strokeDashoffset="0" className="animate-pulse-slow" />
                      <text x="15" y="25" fill="#ffffff" stroke="none" className="text-base font-bold font-mono tracking-widest opacity-95">JAIVIGNESH</text>
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold font-mono">
                    Direct Channel
                  </span>
                  
                  <a
                    href="mailto:athlete@jaivigenesh.com"
                    className="flex items-center gap-3 p-4 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 hover:border-accent/20 rounded-xl transition-all duration-300 group"
                  >
                    <div className="p-2 rounded bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block font-mono">Official Mailbox</span>
                      <span className="text-xs font-bold text-white group-hover:text-accent transition-colors font-mono">athlete@jaivigenesh.com</span>
                    </div>
                  </a>

                  {/* Social media grid */}
                  <div className="flex gap-2">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-white/70 hover:text-white transition-all font-semibold"
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
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-secondary/20 hover:bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-white/70 hover:text-white transition-all font-semibold"
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

          </main>

          {/* FOOTER */}
          <footer className="w-full border-t border-white/5 bg-secondary/40 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[9px] text-white/40 font-mono tracking-wider uppercase gap-4 mt-16">
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
