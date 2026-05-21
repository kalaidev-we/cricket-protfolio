"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mail, Github, Instagram, ArrowDownCircle, Trophy, Play, Star, ChevronRight } from "lucide-react";
import AudioEngine from "@/components/AudioEngine";

// Dynamic import or client components
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

  // preloader counter animation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          // Play subtle entry sound
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
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10"
            >
              <span className="text-accent text-xs font-black tracking-[0.3em] uppercase block mb-3 font-mono">
                NETFLIX ORIGINAL SERIES
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-widest font-display text-white uppercase text-glow-gold mb-8">
                THE CREASE
              </h1>
              
              <div className="w-48 h-[1px] bg-white/10 rounded-full mx-auto relative overflow-hidden mb-3">
                <div 
                  className="h-full bg-accent transition-all duration-100 ease-out" 
                  style={{ width: `${loadPercent}%` }}
                />
              </div>
              
              <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
                Calibrating Biometrics {loadPercent}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="w-full flex flex-col relative">
          {/* Header HUD Navigation */}
          <header className="fixed top-0 left-0 right-0 z-40 bg-primary/60 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-accent font-black tracking-wider text-sm font-mono border border-accent/20 px-2.5 py-1 rounded">
                #284
              </span>
              <span className="font-extrabold tracking-widest text-xs uppercase hidden sm:inline font-display">
                Athlete Profile
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-white/60">
              <button onClick={() => scrollToSection("journey-timeline")} className="hover:text-accent transition-colors">Journey</button>
              <button onClick={() => scrollToSection("statistics")} className="hover:text-accent transition-colors">Stats</button>
              <button onClick={() => scrollToSection("stance-analyzer")} className="hover:text-accent transition-colors">AI Science</button>
              <button onClick={() => scrollToSection("pressure-mode")} className="hover:text-accent transition-colors">Pressure</button>
              <button onClick={() => scrollToSection("gallery")} className="hover:text-accent transition-colors">Reels</button>
            </nav>

            <button
              onClick={toggleGlobalMute}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 transition-all text-xs flex items-center gap-2 font-mono uppercase tracking-wider"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-500" />
                  <span className="hidden sm:inline">Unmute Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-accent" />
                  <span className="hidden sm:inline">Mute Audio</span>
                </>
              )}
            </button>
          </header>

          {/* HERO SECTION */}
          <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-12 overflow-hidden bg-gradient-to-b from-primary via-primary to-secondary/30 border-b border-white/5">
            {/* Ambient Background Spotlight glow */}
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent/5 rounded-full filter blur-[150px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full max-w-7xl mx-auto flex-1">
              
              {/* Text Area (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left">
                <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase block mb-3 font-mono">
                  Nike Athlete Campaign
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase font-display text-white mb-6">
                  POWER.
                  <span className="block text-accent text-glow-gold">PRECISION.</span>
                  LEGACY.
                </h1>

                <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-md mb-8">
                  Step onto the crease with Athlete #284. An immersive sports documentary charting the physical mechanics, career records, and crucial game-winning pressure scenarios of a master cricketer.
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => scrollToSection("journey-timeline")}
                    className="px-6 py-3.5 bg-accent hover:bg-accent-hover text-primary font-black rounded-lg text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-accent/10 hover:shadow-accent/25 hover:scale-[1.02]"
                  >
                    Enter Timeline
                  </button>
                  <button
                    onClick={() => scrollToSection("pressure-mode")}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300"
                  >
                    Simulate Pressure
                  </button>
                </div>
              </div>

              {/* 3D WebGL Canvas Area (Right) */}
              <div className="lg:col-span-6 flex flex-col justify-center items-center h-[350px] md:h-[450px] relative">
                {/* 3D viewport canvas */}
                <div className="w-full h-full relative rounded-2xl overflow-hidden glassmorphism border border-white/5">
                  <ThreeCanvas activeView={active3DView} scrollProgress={scrollProgress} />
                </div>
                
                {/* 3D Controller Options bar */}
                <div className="absolute bottom-4 bg-primary/90 border border-white/15 px-3 py-1.5 rounded-full flex gap-1 z-20 backdrop-blur shadow-md">
                  <button
                    onClick={() => {
                      AudioEngine.playSwoosh();
                      setActive3DView("ball");
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
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
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
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
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Scroll to Explore</span>
              <ArrowDownCircle className="w-5 h-5 text-accent animate-bounce mt-1" />
            </div>
          </section>

          {/* MAIN PAGE LAYOUT SECTION CONTAINERS */}
          <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-24 md:gap-32">
            
            {/* SECTION 1: JOURNEY */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">01 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Chronology</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display uppercase">
                THE ATHLETIC RISE
              </h2>
              <Timeline />
            </div>

            {/* SECTION 2: STATS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">02 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Metrics</span>
              </div>
              <StatsDashboard />
            </div>

            {/* SECTION 3: STANCE ANALYZER */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">03 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Biomechanical ML</span>
              </div>
              <AIStanceAnalyzer />
            </div>

            {/* SECTION 4: PRESSURE */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">04 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Tension simulator</span>
              </div>
              <PressureMode />
            </div>

            {/* SECTION 5: GALLERY */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">05 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Cinematography</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display uppercase">
                REELS & HIGHLIGHTS
              </h2>
              <Gallery />
            </div>

            {/* SECTION 6: ACHIEVEMENTS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-accent/40 font-mono text-sm md:text-base font-bold">06 /</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Pinnacle</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display uppercase">
                ACHIEVEMENT SHOWCASE
              </h2>
              <Achievements />
            </div>

            {/* SECTION 7: SPONSORSHIP & CONTACT */}
            <div className="flex flex-col gap-12 border-t border-white/10 pt-16" id="sponsorship-contact">
              {/* Sponsorship strip */}
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  OFFICIAL BRAND PARTNERS
                </span>
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm font-extrabold text-white/30 tracking-widest font-display">
                  <span className="hover:text-white transition-colors duration-300 cursor-pointer">NIKE PERFORMANCE</span>
                  <span className="hover:text-white transition-colors duration-300 cursor-pointer">BULL STRIKE LAB</span>
                  <span className="hover:text-white transition-colors duration-300 cursor-pointer">WILLOW & CO</span>
                  <span className="hover:text-white transition-colors duration-300 cursor-pointer">RED BULL ATHLETE</span>
                </div>
              </div>

              {/* Motto quote */}
              <div className="text-center py-8 max-w-2xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-accent/20" />
                <blockquote className="text-lg md:text-2xl font-semibold italic text-white/80 leading-relaxed font-display">
                  &ldquo;It&apos;s not about the balls you face on the pitch, but the absolute crease you dominate.&rdquo;
                </blockquote>
                <span className="text-accent text-xs font-bold tracking-widest uppercase block mt-3 font-mono">
                  - THE ATHLETE MOTTO
                </span>
              </div>

              {/* Bottom contact split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-12">
                <div>
                  <h3 className="text-2xl font-black font-display tracking-tight uppercase text-white mb-2">
                    THE LEGEND&apos;S ARENA
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-6">
                    Interested in collaboration, sponsorship opportunities, or media appearances? Send an inquiry or follow on verified channels.
                  </p>
                  
                  {/* Signature Logo SVG */}
                  <div className="w-48 h-12 text-accent relative mb-4">
                    <svg viewBox="0 0 200 50" className="w-full h-full fill-none stroke-accent stroke-[2]">
                      {/* Stylized Signature Curve */}
                      <path d="M10,40 Q40,5 70,30 T130,10 T180,45" strokeDasharray="300" strokeDashoffset="0" className="animate-pulse-slow" />
                      <path d="M30,30 Q90,5 150,30" opacity="0.4" />
                      <text x="15" y="25" fill="#ffffff" stroke="none" className="text-lg font-bold font-mono tracking-widest">ATHLETE</text>
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                    Official Inquiries
                  </span>
                  
                  <a
                    href="mailto:athlete@legendsarena.com"
                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/25 rounded-xl transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-white/50 block">Email Desk</span>
                      <span className="text-sm font-bold text-white group-hover:text-accent transition-colors font-mono">athlete@legendsarena.com</span>
                    </div>
                  </a>

                  {/* Social media grid */}
                  <div className="flex gap-2">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-white/70 hover:text-white transition-all font-semibold"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-white/70 hover:text-white transition-all font-semibold"
                    >
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </main>

          {/* FOOTER */}
          <footer className="w-full border-t border-white/5 bg-secondary/50 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 font-mono tracking-wider uppercase gap-4 mt-16">
            <span>© 2026 THE LEGEND&apos;S ARENA. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Press Kit</a>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
