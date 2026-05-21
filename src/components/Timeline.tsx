"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Star, Trophy, Target, ArrowRight, X } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullStory: string;
  stat: string;
  statLabel: string;
  imageAlt: string;
}

export default function Timeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const milestones: Milestone[] = [
    {
      year: "2012",
      title: "THE SPARK",
      icon: <BookOpen className="w-5 h-5" />,
      shortDesc: "Picking up a tennis ball and a makeshift willow bat on the streets of Mumbai at age 8.",
      fullStory: "Every legend starts with a spark. In the narrow alleys of Mumbai, under the scorching heat, playing street cricket with a heavy tennis ball. Facing bowlers twice his age, he developed rapid reflexes and a signature wristy flick. It was here that he discovered his passion for the crease and vowed to play for his country.",
      stat: "Age 8",
      statLabel: "First Innings Played",
      imageAlt: "Childhood cricket"
    },
    {
      year: "2016",
      title: "THE CRUCIBLE",
      icon: <Calendar className="w-5 h-5" />,
      shortDesc: "Enrolling in a premier academy. 4:30 AM mornings, 500 throwdowns a day.",
      fullStory: "Under the watchful eye of rigorous coaches, the streets were replaced by turf wickets. His days started before sunrise, traveling two hours to train. Facing 500 throwdowns a session, learning to leave the ball outside off, and conditioning his body for long, grueling innings. It was a crucible of sweat, blisters, and mental fortitude.",
      stat: "10,000+",
      statLabel: "Practice Hours Logged",
      imageAlt: "Training nets"
    },
    {
      year: "2020",
      title: "THE BREAKTHROUGH",
      icon: <Star className="w-5 h-5" />,
      shortDesc: "A record-breaking double century in the U-19 state championship. Professional contract signed.",
      fullStory: "The hard work bore fruit in the State Championship. Walking out at 40/3, he batted for seven hours, scoring a masterclass 202* that caught the eyes of national selectors. It led to his first franchise contract in the Premier League, introducing him to the high-pressure world of floodlit stadiums.",
      stat: "202*",
      statLabel: "Highest Under-19 Score",
      imageAlt: "U-19 Tournament"
    },
    {
      year: "2023",
      title: "THE APEX DEBUT",
      icon: <Trophy className="w-5 h-5" />,
      shortDesc: "Century on National Team debut vs England. Named MVP of the Tri-Series.",
      fullStory: "Walking out to represent the national team in front of a packed stadium of 90,000 screaming fans. He scored a century on debut (114 off 92 balls), calming his nerves with elegant cover drives and a match-winning helicopter shot in the final over. It solidified his place in the middle-order as a modern-day finisher.",
      stat: "114",
      statLabel: "Runs on National Debut",
      imageAlt: "National Cap Presentation"
    },
    {
      year: "2026 & BEYOND",
      title: "FUTURE HORIZONS",
      icon: <Target className="w-5 h-5" />,
      shortDesc: "Targeting the World Championship captaincy and pioneering AI sports analytics.",
      fullStory: "The journey does not stop here. As a senior batsman, the goal is to lead the country to a World Championship victory. Off the pitch, he is partnering with technology labs to integrate webcam-based computer vision pose analysis, making elite-level coaching accessible to kids in rural areas.",
      stat: "#1",
      statLabel: "Target ICC Ranking",
      imageAlt: "Future goals"
    }
  ];

  return (
    <section className="relative w-full py-10" id="journey-timeline">
      {/* Dynamic line connecting steps */}
      <div className="absolute left-[31px] md:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-accent/40 via-accent to-accent/20 -translate-x-1/2 hidden md:block" />
      <div className="absolute left-[31px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-accent/40 via-accent to-accent/20 md:hidden" />

      <div className="flex flex-col gap-12 md:gap-24 relative">
        {milestones.map((milestone, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className={`flex flex-col md:flex-row items-start relative w-full ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Central Glowing Icon Node */}
              <div className="absolute left-[31px] md:left-1/2 top-2 -translate-x-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-accent flex items-center justify-center text-accent shadow-[0_0_12px_rgba(255,215,0,0.4)] animate-pulse-slow">
                  {milestone.icon}
                </div>
              </div>

              {/* Story Content Block */}
              <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                <div className="glassmorphism p-6 rounded-xl border border-white/5 hover:border-accent/20 transition-all duration-300 relative group cursor-pointer hover:bg-white/[0.04]"
                     onClick={() => setSelectedMilestone(milestone)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent text-lg font-black font-mono tracking-wide text-glow-gold">
                      {milestone.year}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono group-hover:text-accent transition-colors">
                      Read Story <ArrowRight className="inline w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                  <h3 className="text-md md:text-lg font-black tracking-tight text-white mb-2 font-display uppercase">
                    {milestone.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed mb-4">
                    {milestone.shortDesc}
                  </p>
                  
                  {/* Small stat badge */}
                  <div className="flex items-baseline gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 w-fit">
                    <span className="text-accent font-black text-xs font-mono">{milestone.stat}</span>
                    <span className="text-[9px] text-white/40 uppercase font-semibold tracking-wider">{milestone.statLabel}</span>
                  </div>
                </div>
              </div>

              {/* Spacing node for desktop alignment */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          );
        })}
      </div>

      {/* Narrative Overlay Modal (Click-to-Expand Story) */}
      {selectedMilestone && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMilestone(null)}
        >
          <div 
            className="glassmorphism-gold p-6 md:p-8 rounded-2xl w-full max-w-xl border border-accent/20 relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background design */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/5 rounded-full filter blur-[80px] pointer-events-none" />

            <button 
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent text-2xl font-black font-mono tracking-wide text-glow-gold">
                {selectedMilestone.year}
              </span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              <h3 className="text-md md:text-lg font-bold tracking-tight uppercase font-display text-white">
                {selectedMilestone.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6 border-y border-white/5 py-4">
              {selectedMilestone.fullStory}
            </p>

            <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Key Metric</span>
                <span className="text-2xl font-black text-accent font-mono text-glow-gold">{selectedMilestone.stat}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Metric Label</span>
                <span className="text-xs font-bold text-white uppercase">{selectedMilestone.statLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
