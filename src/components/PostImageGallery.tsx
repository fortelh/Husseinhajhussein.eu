"use client";

import { useState } from "react";
import { Layers, X, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";

interface PostImageGalleryProps {
  images: string[];
}

export default function PostImageGallery({ images }: PostImageGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Tracks the index of the image currently featured in the center card
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const hiddenCount = total - 3;

  // Compute indices for the 3 visible stack cards based on the active center index
  const leftIndex = (currentIndex - 1 + total) % total;
  const rightIndex = (currentIndex + 1) % total;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="space-y-4 px-4">
      {/* Three-Card Stacked Preview Container with Interactive Arrows */}
      {!isExpanded && (
        <div 
          className="relative h-72 w-full max-w-lg mx-auto flex items-center justify-center cursor-pointer group py-4" 
          onClick={() => {
            // Clicking the card itself opens the lightbox at the current center image
            setLightboxIndex(currentIndex);
          }}
        >
          {/* Left Background Card (Previous Image) */}
          {total >= 2 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(leftIndex);
              }}
              className="absolute bottom-2 left-2 w-[55%] h-52 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-md transform -rotate-6 opacity-75 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 overflow-hidden z-0"
              title="Click to center this picture"
            >
              <img src={images[leftIndex]} alt="" className="w-full h-full object-cover filter brightness-90" />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm rounded text-[9px] font-mono text-cyan-400">
                #{leftIndex + 1}
              </div>
            </div>
          )}

          {/* Right Background Card (Next Image) */}
          {total >= 3 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(rightIndex);
              }}
              className="absolute bottom-2 right-2 w-[55%] h-52 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-md transform rotate-6 opacity-75 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 overflow-hidden z-0"
              title="Click to center this picture"
            >
              <img src={images[rightIndex]} alt="" className="w-full h-full object-cover filter brightness-90" />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm rounded text-[9px] font-mono text-cyan-400">
                #{rightIndex + 1}
              </div>
            </div>
          )}

          {/* Main Middle Front Card (Current Active Image) */}
          <div className="absolute top-2 w-[65%] h-56 bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden z-20">
            <img src={images[currentIndex]} alt="Post media primary" className="w-full h-full object-cover" />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm rounded text-[10px] font-mono text-cyan-400 border border-slate-800">
              #{currentIndex + 1}
            </div>

            {/* "+X More" Corner Badge */}
            {total > 3 && (
              <div className="absolute top-2 right-2 z-30">
                <div className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 rounded-full shadow-lg flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span className="text-white font-bold text-[11px] font-mono">+{hiddenCount} More</span>
                </div>
              </div>
            )}
          </div>

          {/* Directional Arrows (Shift Carousel Left / Right) */}
          {total > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-950/90 hover:bg-slate-900 backdrop-blur-md border border-cyan-500/40 rounded-full text-cyan-400 shadow-xl transition-all cursor-pointer hover:scale-110"
                title="Previous picture"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-950/90 hover:bg-slate-900 backdrop-blur-md border border-cyan-500/40 rounded-full text-cyan-400 shadow-xl transition-all cursor-pointer hover:scale-110"
                title="Next picture"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Expanded Grid View */}
      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 animate-fadeIn">
          {images.map((imgUrl, index) => (
            <div 
              key={index}
              onClick={() => setLightboxIndex(index)}
              className="relative h-40 cursor-pointer overflow-hidden rounded-xl border border-slate-800 group shadow-lg"
            >
              <img 
                src={imgUrl} 
                alt={`Post media ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm rounded text-[10px] font-mono text-cyan-400 border border-slate-800">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collapse / Expand Button */}
      {total > 3 && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-md"
          >
            {isExpanded ? "Show Less ↑" : `View All (${total} pictures) ↓`}
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] flex items-center justify-center">
            <img 
              src={images[lightboxIndex]} 
              alt="Fullscreen view" 
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
            />

            {/* Lightbox Navigation Buttons */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : total - 1))}
                  className="absolute left-4 md:left-[-60px] p-2.5 bg-slate-900/90 border border-slate-800 rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev! < total - 1 ? prev! + 1 : 0))}
                  className="absolute right-4 md:right-[-60px] p-2.5 bg-slate-900/90 border border-slate-800 rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          <div className="absolute bottom-6 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            Picture {lightboxIndex + 1} of {total}
          </div>
        </div>
      )}
    </div>
  );
}