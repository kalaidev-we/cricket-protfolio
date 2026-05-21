"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, BarChart2, Compass, ShieldAlert, Award, ChevronRight } from "lucide-react";

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
  const countRef = useRef(0);
  
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
      // Ease out quad formula
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
    <div className="bg-white/5 border border-white/5 hover:border-accent/10 rounded-xl p-5 transition-all duration-300 group hover:bg-white/[0.07]">
      <span className="text-white/40 text-[10px] md:text-xs font-semibold tracking-widest uppercase block mb-1">
        {label}
      </span>
      <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display group-hover:text-accent transition-colors duration-300">
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

  // Wagon wheel regions data
  const regions = [
    { id: "third_man", name: "Third Man", runs: 594, percent: "8%", desc: "Delicate cuts and reverse sweeps playing behind square off-side.", path: "M 100 80 L 150 30 A 70 70 0 0 0 100 10 Z" },
    { id: "covers", name: "Covers & Point", runs: 1780, percent: "24%", desc: "Textbook cover drives and square cuts targeting the off-side gaps.", path: "M 100 80 L 190 80 A 90 90 0 0 0 150 30 Z" },
    { id: "mid_off", name: "Mid Off", runs: 1039, percent: "14%", desc: "Straight punches and lofts driven down the ground off-side.", path: "M 100 80 L 100 170 A 90 90 0 0 0 190 80 Z" },
    { id: "mid_on", name: "Mid On", runs: 890, percent: "12%", desc: "On-drives and straight pushes on the leg-side down the ground.", path: "M 100 80 L 10 80 A 90 90 0 0 0 100 170 Z" },
    { id: "mid_wicket", name: "Mid Wicket & Cow Corner", runs: 2078, percent: "28%", desc: "Aggressive pulls, slog sweeps, and wristy flicks towards the leg-side fence.", path: "M 100 80 L 50 30 A 90 90 0 0 0 10 80 Z" },
    { id: "fine_leg", name: "Fine Leg / Square Leg", runs: 1039, percent: "14%", desc: "Flicks off the pads, glances, and sweeps playing behind square leg-side.", path: "M 100 80 L 100 10 A 70 70 0 0 0 50 30 Z" }
  ];

  // Performance line chart coordinates (simulating last 8 series runs)
  const chartData = [340, 520, 410, 680, 590, 890, 720, 940];
  const chartWidth = 500;
  const chartHeight = 120;
  const padding = 20;

  // Calculate SVG polyline points
  const points = chartData.map((val, index) => {
    const x = padding + (index / (chartData.length - 1)) * (chartWidth - padding * 2);
    // Inverse y coordinate for SVG
    const y = chartHeight - padding - ((val - 200) / 800) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="glassmorphism p-6 md:p-8 rounded-2xl w-full border border-white/5 relative overflow-hidden" id="statistics">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="text-accent text-sm font-semibold tracking-widest uppercase flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Career Analytics
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 font-display">
            STATISTICAL DOMINANCE
          </h2>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Database Last Updated: Live 2026</span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnimatedCounter label="Matches Played" value={142} />
        <AnimatedCounter label="Career Runs" value={7420} />
        <AnimatedCounter label="Batting Average" value={54.55} decimals={2} />
        <AnimatedCounter label="Strike Rate" value={138.45} decimals={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INTERACTIVE WAGON WHEEL: Left/Mid Panel */}
        <div className="lg:col-span-6 bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 self-start mb-6 flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent" /> Interactive Wagon Wheel
          </h3>

          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center mb-4">
            {/* Field Boundary Circle */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-full flex items-center justify-center">
              {/* Inner Circle (30-yard circle) */}
              <div className="w-[66%] aspect-square border border-dashed border-white/10 rounded-full flex items-center justify-center">
                {/* Pitch representation */}
                <div className="w-5 h-12 bg-white/10 border border-white/20 rounded-sm" />
              </div>
            </div>

            {/* Interactive SVG Sectors overlaying the field */}
            <svg 
              viewBox="0 0 200 180" 
              className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(11,15,25,0.8)]"
            >
              {/* Ground markings */}
              <circle cx="100" cy="80" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              
              {/* Sectors */}
              {regions.map((reg) => (
                <path
                  key={reg.id}
                  d={reg.path}
                  fill={activeRegion?.name === reg.name ? "rgba(255, 215, 0, 0.25)" : "rgba(255, 255, 255, 0.02)"}
                  stroke={activeRegion?.name === reg.name ? "#ffd700" : "rgba(255,255,255,0.06)"}
                  strokeWidth={activeRegion?.name === reg.name ? "2" : "1"}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveRegion(reg)}
                  onMouseLeave={() => setActiveRegion(null)}
                />
              ))}

              {/* Pitch representation inside SVG to sit on top */}
              <rect x="96" y="65" width="8" height="30" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" rx="1" />
            </svg>
          </div>

          <div className="w-full text-center mt-2 min-h-[75px] flex flex-col items-center justify-center bg-black/30 border border-white/5 rounded-lg p-3">
            {activeRegion ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <span className="font-bold text-sm text-accent tracking-wide uppercase font-display">{activeRegion.name}</span>
                  <span className="bg-accent/15 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">{activeRegion.percent} runs</span>
                </div>
                <p className="text-[11px] text-white/70 max-w-sm leading-relaxed">{activeRegion.desc}</p>
                <div className="text-[11px] text-accent font-extrabold mt-1 font-mono">{activeRegion.runs} Career Runs</div>
              </div>
            ) : (
              <p className="text-xs text-white/40 italic leading-relaxed">
                Hover over the sectors of the cricket field diagram above to analyze batting shot distribution and run splits.
              </p>
            )}
          </div>
        </div>

        {/* RUN TRENDS & ADDITIONAL INSIGHTS: Right Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          {/* Performance line chart */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" /> Run Scoring Trend
              </h3>
              <span className="text-[10px] text-white/40 font-mono">Last 8 Tournament Series</span>
            </div>

            {/* SVG Trend Line Chart */}
            <div className="w-full relative overflow-hidden bg-black/20 rounded-lg p-2 border border-white/5">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                {/* Horizontal Guide Lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Glowing Trend Line */}
                <polyline
                  fill="none"
                  stroke="#ffd700"
                  strokeWidth="3.5"
                  points={points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                />

                {/* Data Points */}
                {chartData.map((val, index) => {
                  const x = padding + (index / (chartData.length - 1)) * (chartWidth - padding * 2);
                  const y = chartHeight - padding - ((val - 200) / 800) * (chartHeight - padding * 2);
                  return (
                    <g key={index} className="group/dot cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#0b0f19"
                        stroke="#ffd700"
                        strokeWidth="2"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#ffd700"
                        className="opacity-0 group-hover/dot:opacity-20 transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-between text-[9px] text-white/40 font-mono mt-2 px-1">
              <span>2020 Series</span>
              <span>2022 Series</span>
              <span>2024 Series</span>
              <span>Current (2026)</span>
            </div>
          </div>

          {/* Highlights & Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Box 1 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">High Score</span>
                <span className="text-xl font-bold font-display text-white">183*</span>
              </div>
              <span className="text-[10px] text-accent font-medium mt-2 flex items-center gap-0.5">
                vs Australia <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            {/* Box 2 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Centuries</span>
                <span className="text-xl font-bold font-display text-white">18</span>
              </div>
              <span className="text-[10px] text-white/40 mt-2 block">42 Half-Centuries</span>
            </div>
            {/* Box 3 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Wickets Taken</span>
                <span className="text-xl font-bold font-display text-white">52</span>
              </div>
              <span className="text-[10px] text-accent font-medium mt-2">Right-arm Off-break</span>
            </div>
            {/* Box 4 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Wicket splits</span>
                <span className="text-xl font-bold font-display text-white">5 / 18</span>
              </div>
              <span className="text-[10px] text-white/40 mt-2 block">Best bowling figures</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
