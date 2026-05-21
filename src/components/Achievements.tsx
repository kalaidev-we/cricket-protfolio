"use client";

import React from "react";
import { Trophy, Star, ShieldCheck, Award, Calendar, CheckCircle2 } from "lucide-react";

interface AchievementItem {
  title: string;
  icon: React.ReactNode;
  awarder: string;
  year: string;
  citation: string;
  metric: string;
}

export default function Achievements() {
  const achievements: AchievementItem[] = [
    {
      title: "National Cap Selection",
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      awarder: "International Cricket Board",
      year: "2023",
      citation: "Presented with Cap #284 at Lord's Cricket Ground, marking entry into elite international test cricket.",
      metric: "Test Cap #284"
    },
    {
      title: "Player of the Tournament (MVP)",
      icon: <Trophy className="w-8 h-8 text-accent" />,
      awarder: "Tri-Series Committee",
      year: "2024",
      citation: "Awarded MVP for scoring 482 runs in 5 matches, including 2 centuries, leading the team to a series sweep.",
      metric: "Tri-Series MVP"
    },
    {
      title: "Golden Bat Award",
      icon: <Award className="w-8 h-8 text-accent" />,
      awarder: "Premier League Governing Council",
      year: "2025",
      citation: "Awarded for scoring the highest individual runs (860 runs) in the franchise league season at a strike rate of 152.4.",
      metric: "860 Runs (PL-18)"
    },
    {
      title: "Fastest Century Record",
      icon: <Star className="w-8 h-8 text-accent" />,
      awarder: "Domestic Cricket Association",
      year: "2021",
      citation: "Broke the state record by scoring a century off just 41 balls, hitting 9 sixes and 8 boundaries.",
      metric: "100 Off 41 Balls"
    }
  ];

  return (
    <section className="w-full" id="achievements">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach, idx) => (
          <div
            key={idx}
            className="glassmorphism p-6 rounded-xl border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500 relative group overflow-hidden flex flex-col md:flex-row gap-5 items-start"
          >
            {/* Background design */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 rounded-full filter blur-xl group-hover:bg-accent/10 transition-colors" />

            {/* Glowing Icon Block */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-accent group-hover:border-accent/40 group-hover:scale-105 transition-all duration-500 flex items-center justify-center relative">
              {ach.icon}
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-xl border border-accent/20 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>

            {/* Content Details */}
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest font-mono">
                    {ach.awarder}
                  </span>
                  <span className="text-white/40 text-[10px] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ach.year}
                  </span>
                </div>
                <h3 className="text-white text-base font-extrabold tracking-tight font-display uppercase group-hover:text-accent transition-colors duration-300">
                  {ach.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mt-2 pb-4 border-b border-white/5">
                  {ach.citation}
                </p>
              </div>

              {/* Status citation bottom */}
              <div className="flex items-center gap-2 mt-4 text-[11px] text-white/80 font-bold uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Verified Metric: <span className="text-accent text-glow-gold">{ach.metric}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
