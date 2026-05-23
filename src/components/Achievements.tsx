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
      title: "NBIS Mandur Captaincy",
      icon: <ShieldCheck className="w-6 h-6 text-accent" />,
      awarder: "New Baldwin International School",
      year: "2019-2020",
      citation: "Selected to captain the junior division squad at New Baldwin International School Mandur, leading the team in inter-school tournaments.",
      metric: "NBIS Team Captain"
    },
    {
      title: "Garden City University MVP",
      icon: <Trophy className="w-6 h-6 text-accent" />,
      awarder: "GCU Sports Board",
      year: "2025",
      citation: "Awarded Player of the Tournament (MVP) in the Garden City inter-university championship for aggregate batting score and finishing strikes.",
      metric: "GCU Tournament MVP"
    },
    {
      title: "Bangalore Junior Division Gold",
      icon: <Award className="w-6 h-6 text-accent" />,
      awarder: "Bangalore Cricket Club Association",
      year: "2023",
      citation: "Recognized as the best middle-order batsman in the regional Under-19 tournament with a tournament strike rate of 142.0.",
      metric: "U-19 Strike Award"
    },
    {
      title: "Vellore Junior Talent Merit",
      icon: <Star className="w-6 h-6 text-accent" />,
      awarder: "Vellore Cricket Federation",
      year: "2018",
      citation: "Presented with the Young Hopeful certificate during a summer academy camp in his native town of Vellore.",
      metric: "Summer Camp Merit"
    }
  ];

  return (
    <section className="w-full" id="achievements">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach, idx) => (
          <div
            key={idx}
            className="bg-secondary/40 p-6 rounded-xl border border-white/5 hover:border-accent/20 transition-all duration-300 relative group overflow-hidden flex flex-col sm:flex-row gap-5 items-start"
          >
            {/* Glowing Icon Block */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 text-accent group-hover:border-accent/40 transition-all duration-300 flex items-center justify-center flex-shrink-0">
              {ach.icon}
            </div>

            {/* Content Details */}
            <div className="flex-1 flex flex-col justify-between h-full w-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] text-accent font-bold uppercase tracking-widest font-mono">
                    {ach.awarder}
                  </span>
                  <span className="text-white/40 text-[9px] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ach.year}
                  </span>
                </div>
                <h3 className="text-white text-sm font-bold tracking-tight font-display uppercase group-hover:text-accent transition-colors duration-300">
                  {ach.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mt-2 pb-3 border-b border-white/5">
                  {ach.citation}
                </p>
              </div>

              {/* Status citation bottom */}
              <div className="flex items-center gap-1.5 mt-3 text-[10px] text-white/70 font-semibold uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span>Verified Benchmark: <span className="text-accent text-glow-accent">{ach.metric}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
