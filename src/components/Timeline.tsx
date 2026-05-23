"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Trophy, ArrowRight, X, GraduationCap, MapPin } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullStory: string;
  stat: string;
  statLabel: string;
}

export default function Timeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const milestones: Milestone[] = [
    {
      year: "2005",
      title: "VELLORE ORIGINS",
      icon: <MapPin className="w-4.5 h-4.5 text-accent" />,
      shortDesc: "Born in Vellore. Relocated to Bangalore to begin a dynamic childhood journey.",
      fullStory: "Born in historic Vellore in 2005. Shortly after, his family relocated to Bangalore, growing up in the fast-paced, green tech hub. It was on Bangalore's vibrant neighborhood layouts that he first saw cricket played, sparking a lifelong connection to the willow bat.",
      stat: "2005",
      statLabel: "Birth Year"
    },
    {
      year: "2009-2013",
      title: "EARLY INCEPTION",
      icon: <BookOpen className="w-4.5 h-4.5 text-accent" />,
      shortDesc: "Initial schooling at Bettal School (LKG/UKG) and Sri Mithri English School (1st/2nd Std).",
      fullStory: "Began his education at Bettal School in Bangalore for LKG and UKG, then moved to Sri Mithri English School for 1st and 2nd standard. Outside the classroom, he was already captaining street matches with tennis balls, learning the basic dynamics of batting.",
      stat: "4 Years",
      statLabel: "Early Schooling"
    },
    {
      year: "2014-2021",
      title: "NBIS MANDUR NETS",
      icon: <Star className="w-4.5 h-4.5 text-accent" />,
      shortDesc: "Formative school phase at New Baldwin International School Mandur (3rd to 10th Std).",
      fullStory: "Studied from 3rd to 10th standard at the prestigious New Baldwin International School (NBIS) Mandur. This was the launchpad for his competitive cricket. Playing school leagues and attending academy net sessions, he molded his batting stance under floodlights.",
      stat: "8 Years",
      statLabel: "NBIS Mandur Tenure"
    },
    {
      year: "2022-2023",
      title: "ENGINEERING STUDY",
      icon: <GraduationCap className="w-4.5 h-4.5 text-accent" />,
      shortDesc: "Pivoted into engineering studies, bringing analytical precision into his batting mechanics.",
      fullStory: "Following high school, he entered engineering studies. The analytical discipline and physical dynamics studied in engineering gave him a unique perspective on batting. He applied vector math and velocity mechanics to his hand-eye coordination drills.",
      stat: "100%",
      statLabel: "Analytical Focus"
    },
    {
      year: "2024 & BEYOND",
      title: "GARDEN CITY UNIVERSITY",
      icon: <Trophy className="w-4.5 h-4.5 text-accent" />,
      shortDesc: "Studying 4-year BBAB at Garden City University (GCU). Leading university cricket.",
      fullStory: "Currently pursuing a 4-year BBAB degree at Garden City University (GCU) in Bangalore. Blending athletic business strategy with high-performance captaincy, he leads GCU's batting lineup, targeting inter-university cup trophies.",
      stat: "4 Years",
      statLabel: "GCU BBAB Course"
    }
  ];

  return (
    <section className="relative w-full py-6" id="journey-timeline">
      {/* Central Thin Metallic Line (Apple Style) */}
      <div className="absolute left-[31px] md:left-1/2 top-8 bottom-8 w-[0.5px] bg-white/10 -translate-x-1/2 hidden md:block" />
      <div className="absolute left-[31px] top-8 bottom-8 w-[0.5px] bg-white/10 md:hidden" />

      <div className="flex flex-col gap-12 md:gap-20 relative">
        {milestones.map((milestone, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.05 }}
              className={`flex flex-col md:flex-row items-start relative w-full ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Central Minimalist Gold Dot */}
              <div className="absolute left-[31px] md:left-1/2 top-3 -translate-x-1/2 z-20">
                <div className="w-7 h-7 rounded-full bg-primary border-[0.5px] border-accent/40 flex items-center justify-center text-accent hover:border-accent transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
              </div>

              {/* Story Content Block */}
              <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                <div 
                  className="bg-secondary/40 border border-white/5 hover:border-accent/20 p-6 rounded-xl transition-all duration-300 relative group cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent text-base font-bold font-mono tracking-wider">
                      {milestone.year}
                    </span>
                    <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono group-hover:text-accent transition-colors flex items-center gap-0.5">
                      Narrative <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-white mb-2 font-display uppercase">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">
                    {milestone.shortDesc}
                  </p>
                  
                  {/* Small stat badge */}
                  <div className="flex items-baseline gap-1.5 bg-black/40 border border-white/5 rounded-md px-2.5 py-1 w-fit">
                    <span className="text-accent font-bold text-[10px] font-mono">{milestone.stat}</span>
                    <span className="text-[8px] text-white/40 uppercase font-semibold tracking-wider">{milestone.statLabel}</span>
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
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMilestone(null)}
        >
          <div 
            className="bg-secondary border border-white/10 p-6 md:p-8 rounded-xl w-full max-w-lg relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <span className="text-accent text-xl font-bold font-mono tracking-wide">
                {selectedMilestone.year}
              </span>
              <span className="text-white/20 text-xs">•</span>
              <h3 className="text-sm font-bold tracking-tight uppercase font-display text-white">
                {selectedMilestone.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6">
              {selectedMilestone.fullStory}
            </p>

            <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-lg">
              <div>
                <span className="text-[8px] text-white/40 uppercase tracking-widest block mb-0.5">Focus Metric</span>
                <span className="text-lg font-bold text-accent font-mono">{selectedMilestone.stat}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-white/40 uppercase tracking-widest block mb-0.5">Timeline Benchmark</span>
                <span className="text-[10px] font-bold text-white uppercase">{selectedMilestone.statLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
