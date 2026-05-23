"use client";

import React, { useState } from "react";
import { Play, ZoomIn, Film, Image as ImageIcon, X } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: "match" | "training" | "legacy";
  type: "video" | "image";
  url: string;
  duration?: string;
  date: string;
  description: string;
}

export default function Gallery() {
  const [filter, setFilter] = useState<"all" | "match" | "training" | "legacy">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    {
      id: 1,
      title: "Cover Drive Analysis",
      category: "match",
      type: "video",
      url: "https://images.unsplash.com/photo-1531415080290-bc98513989f4?auto=format&fit=crop&q=80&w=800",
      duration: "0:45",
      date: "Nov 2025",
      description: "Analyzing the perfect elbow extension and weight transfer during a cover drive against a 145km/h delivery."
    },
    {
      id: 2,
      title: "Morning Nets Grind",
      category: "training",
      type: "video",
      url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800",
      duration: "1:20",
      date: "Feb 2026",
      description: "Behind the scenes of the grueling morning fitness regimen and hand-eye coordination drills."
    },
    {
      id: 3,
      title: "The Winning Boundary",
      category: "match",
      type: "image",
      url: "https://images.unsplash.com/photo-1629285483773-6b5cde2171d7?auto=format&fit=crop&q=80&w=800",
      date: "Dec 2025",
      description: "Raising the bat to acknowledge the crowd after securing the final match of the Tri-Series with a boundary."
    },
    {
      id: 4,
      title: "Stitch & Seam Focus",
      category: "legacy",
      type: "image",
      url: "https://images.unsplash.com/photo-1593341606579-7e90d290c079?auto=format&fit=crop&q=80&w=800",
      date: "Jan 2026",
      description: "Macro details of the custom match-grade cricket ball used for athletic biomechanical reviews."
    },
    {
      id: 5,
      title: "Stadium Floodlights",
      category: "legacy",
      type: "image",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      date: "Oct 2025",
      description: "An empty stadium minutes before gates open, capturing the electric anticipation of professional cricket."
    },
    {
      id: 6,
      title: "Explosive Strength Drills",
      category: "training",
      type: "video",
      url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
      duration: "0:58",
      date: "Mar 2026",
      description: "Squats, plyometrics, and core workouts designed to enhance bat speed and explosive runs between wickets."
    }
  ];

  const filteredItems = filter === "all" ? items : items.filter(item => item.category === filter);

  return (
    <section className="w-full" id="gallery">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(["all", "match", "training", "legacy"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all duration-300 font-mono border ${
              filter === cat
                ? "bg-accent text-primary border-accent shadow-md shadow-accent/15"
                : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/5"
            }`}
          >
            {cat === "all" ? "All Reels" : cat === "match" ? "Match Action" : cat === "training" ? "Nets & Gym" : "Equipment"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-accent/20 transition-all duration-500 shadow-md"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
            
            <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider font-mono">
              {item.type === "video" ? (
                <>
                  <Film className="w-3 h-3 text-accent" />
                  <span>{item.duration}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3 h-3 text-accent" />
                  <span>Photo</span>
                </>
              )}
            </div>

            {/* Title Info */}
            <div className="absolute bottom-4 left-4 right-4 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-accent text-[8px] font-bold uppercase tracking-widest font-mono">
                {item.category}
              </span>
              <h3 className="text-white text-sm font-bold tracking-tight font-display mt-0.5 uppercase">
                {item.title}
              </h3>
              <p className="text-[9px] text-white/50 truncate mt-1 group-hover:text-white/70 transition-colors">
                {item.description}
              </p>
            </div>

            {/* Hover floating Play/Zoom */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-accent/95 flex items-center justify-center text-primary shadow-md scale-75 group-hover:scale-100 transition-transform duration-500">
                {item.type === "video" ? (
                  <Play className="w-4 h-4 fill-primary ml-0.5" />
                ) : (
                  <ZoomIn className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-secondary border border-white/10 p-4 md:p-6 rounded-xl w-full max-w-2xl relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded transition-all z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Media Block */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-4 border border-white/5 shadow-inner">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              
              {selectedItem.type === "video" ? (
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                  <div className="m-auto w-14 h-14 rounded-full bg-accent/95 flex items-center justify-center text-primary shadow-md cursor-pointer hover:scale-105 transition-all">
                    <Play className="w-5 h-5 fill-primary ml-0.5" />
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <span className="text-[9px] font-mono text-white/60">0:00</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="w-1/3 h-full bg-accent rounded-full" />
                    </div>
                    <span className="text-[9px] font-mono text-white/60">{selectedItem.duration}</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              )}
            </div>

            {/* Description */}
            <div className="px-1.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest font-mono">
                  {selectedItem.category}
                </span>
                <span className="text-white/20 text-xs font-mono">•</span>
                <span className="text-white/40 text-[9px] font-mono">{selectedItem.date}</span>
              </div>
              <h3 className="text-white text-base font-bold tracking-tight uppercase font-display mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
