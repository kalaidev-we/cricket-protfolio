"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart2, Compass, ChevronRight } from "lucide-react";

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

// Custom Counter hook/component for premium count-up effect
function AnimatedCounter({ label, value, suffix = "", decimals = 0, duration = 1500 }: StatItemProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalSteps = 60;
    const stepTime = duration / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const easeProgress = progress * (2 - progress);
      const currentVal = start + (end - start) * easeProgress;
      
      setCount(currentVal);

      if (step >= totalSteps) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="bg-secondary/20 border border-white/5 hover:border-accent/10 rounded-xl p-5 transition-all duration-300 group hover:bg-white/[0.02]">
      <span className="text-white/40 text-[10px] md:text-xs font-semibold tracking-widest uppercase block mb-1">
        {label}
      </span>
      <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display group-hover:text-accent transition-colors duration-300">
        {count.toFixed(decimals)}
        {suffix}
      </span>
    </div>
  );
}

export default function StatsDashboard() {
  const [activeRegion, setActiveRegion] = useState<{
    name: string;
    runs: number;
    percent: string;
    desc: string;
  } | null>(null);

  // Wagon wheel regions data (customized for Jaivigenesh's profile)
  const regions = [
    { id: "third_man", name: "Third Man", runs: 147, percent: "8%", desc: "Deft cuts and backward touches playing behind square on the off-side.", path: "M 100 80 L 150 30 A 70 70 0 0 0 100 10 Z" },
    { id: "covers", name: "Covers & Point", runs: 441, percent: "24%", desc: "Dynamic cover drives and punchy square cuts piercing the off-side field.", path: "M 100 80 L 190 80 A 90 90 0 0 0 150 30 Z" },
    { id: "mid_off", name: "Mid Off", runs: 258, percent: "14%", desc: "Straight punches and lofts driven down the ground off-side.", path: "M 100 80 L 100 170 A 90 90 0 0 0 190 80 Z" },
    { id: "mid_on", name: "Mid On", runs: 221, percent: "12%", desc: "On-drives and straight pushes on the leg-side down the pitch.", path: "M 100 80 L 10 80 A 90 90 0 0 0 100 170 Z" },
    { id: "mid_wicket", name: "Mid Wicket & Cow Corner", runs: 515, percent: "28%", desc: "Wristy flicks off pads, pulls, and sweeps targeting the leg-side fence.", path: "M 100 80 L 50 30 A 90 90 0 0 0 10 80 Z" },
    { id: "fine_leg", name: "Fine Leg / Square Leg", runs: 258, percent: "14%", desc: "Glances off the pads and sweep shots playing behind square on the leg-side.", path: "M 100 80 L 100 10 A 70 70 0 0 0 50 30 Z" }
  ];

  // Performance line chart coordinates (Last 8 University League matches: 42, 68, 114, 55, 87, 98, 73, 91)
  const chartData = [42, 68, 114, 55, 87, 98, 73, 91];
  const chartWidth = 500;
  const chartHeight = 120;
  const padding = 20;

  // Calculate SVG polyline points
  const points = chartData.map((val, index) => {
    const x = padding + (index / (chartData.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((val - 20) / 100) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="bg-secondary/20 p-6 md:p-8 rounded-2xl w-full border border-white/5 relative overflow-hidden" id="statistics">
      {/* Background subtle gold glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/3 rounded-full filter blur-[150px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="text-accent text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 font-mono">
            <BarChart2 className="w-4 h-4" /> Career Analytics
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 font-display">
            STATISTICAL FOCUS
          </h2>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>GCU Sports Records: Live 2026</span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnimatedCounter label="Matches Played" value={48} />
        <AnimatedCounter label="Tournament Runs" value={1840} />
        <AnimatedCounter label="Batting Average" value={42.79} decimals={2} />
        <AnimatedCounter label="Strike Rate" value={141.54} decimals={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INTERACTIVE WAGON WHEEL: Left/Mid Panel */}
        <div className="lg:col-span-6 bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 self-start mb-6 flex items-center gap-1.5 font-mono">
            <Compass className="w-4 h-4 text-accent" /> Interactive Wagon Wheel
          </h3>

          <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center mb-4">
            {/* Field Boundary Circle */}
            <div className="absolute inset-0 border-[0.5px] border-white/15 rounded-full flex items-center justify-center">
              <div className="w-[66%] aspect-square border-[0.5px] border-dashed border-white/15 rounded-full flex items-center justify-center">
                <div className="w-4 h-10 bg-white/5 border border-white/10 rounded-sm" />
              </div>
            </div>

            {/* Interactive SVG Sectors */}
            <svg 
              viewBox="0 0 200 180" 
              className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
              <circle cx="100" cy="80" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              
              {regions.map((reg) => (
                <path
                  key={reg.id}
                  d={reg.path}
                  fill={activeRegion?.name === reg.name ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.005)"}
                  stroke={activeRegion?.name === reg.name ? "#d4af37" : "rgba(255,255,255,0.08)"}
                  strokeWidth={activeRegion?.name === reg.name ? "1.5" : "0.5"}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveRegion(reg)}
                  onMouseLeave={() => setActiveRegion(null)}
                />
              ))}

              <rect x="96" y="65" width="8" height="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" rx="1" />
            </svg>
          </div>

          <div className="w-full text-center mt-2 min-h-[70px] flex flex-col items-center justify-center bg-black/50 border border-white/5 rounded-lg p-3">
            {activeRegion ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <span className="font-bold text-xs text-accent tracking-wider uppercase font-mono">{activeRegion.name}</span>
                  <span className="bg-accent/10 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">{activeRegion.percent} runs</span>
                </div>
                <p className="text-[10px] text-white/60 max-w-sm leading-relaxed">{activeRegion.desc}</p>
                <div className="text-[10px] text-accent font-extrabold mt-1 font-mono">{activeRegion.runs} Runs</div>
              </div>
            ) : (
              <p className="text-[10px] text-white/40 italic leading-relaxed">
                Hover over the sectors of the field to view shot split analytics.
              </p>
            )}
          </div>
        </div>

        {/* RUN TRENDS & ADDITIONAL INSIGHTS: Right Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          {/* Performance line chart */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-4 h-4 text-accent" /> Run Scoring Trend
              </h3>
              <span className="text-[9px] text-white/40 font-mono">Last 8 Tournament Innings</span>
            </div>

            {/* SVG Trend Line Chart */}
            <div className="w-full relative overflow-hidden bg-black/30 rounded-lg p-2 border border-white/5">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Glowing Trend Line */}
                <polyline
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2.5"
                  points={points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                />

                {/* Data Points */}
                {chartData.map((val, index) => {
                  const x = padding + (index / (chartData.length - 1)) * (chartWidth - padding * 2);
                  const y = chartHeight - padding - ((val - 20) / 100) * (chartHeight - padding * 2);
                  return (
                    <g key={index} className="group/dot cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#000000"
                        stroke="#d4af37"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#d4af37"
                        className="opacity-0 group-hover/dot:opacity-15 transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-between text-[8px] text-white/40 font-mono mt-2 px-1">
              <span>Match 1</span>
              <span>Match 3</span>
              <span>Match 5</span>
              <span>GCU Final Match</span>
            </div>
          </div>

          {/* Highlights & Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1 font-mono">High Score</span>
                <span className="text-lg font-bold font-display text-white">114*</span>
              </div>
              <span className="text-[9px] text-accent font-semibold mt-2 flex items-center gap-0.5 font-mono">
                vs Oxford Academy <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1 font-mono">Centuries</span>
                <span className="text-lg font-bold font-display text-white">3</span>
              </div>
              <span className="text-[9px] text-white/40 mt-2 block font-mono">11 Half-Centuries</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1 font-mono">Wickets Taken</span>
                <span className="text-lg font-bold font-display text-white">14</span>
              </div>
              <span className="text-[9px] text-accent font-semibold mt-2 font-mono">Right-arm Off-break</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1 font-mono">Bowling best</span>
                <span className="text-lg font-bold font-display text-white">3 / 24</span>
              </div>
              <span className="text-[9px] text-white/40 mt-2 block font-mono">GCU T20 Series</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
