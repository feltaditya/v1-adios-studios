"use client"

import { useState, memo } from "react"
import { Play } from "lucide-react"

const VideoSection = memo(function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="max-w-4xl mx-auto mb-16 -mt-8 relative">
      <div className="relative aspect-video bg-gradient-to-br from-gray-900/60 via-slate-900/70 to-gray-800/60 backdrop-blur-sm rounded-[22px] overflow-hidden border border-white/10 shadow-2xl">
        {/* Video Placeholder / VSL Container */}
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Video Thumbnail */}
            <div className="absolute inset-0">
              <img
                src="https://img.youtube.com/vi/JWr8Pcdm_wY/maxresdefault.jpg"
                alt="VSL Video Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a specific timestamp thumbnail
                  const target = e.target as HTMLImageElement;
                  target.src = "https://img.youtube.com/vi/JWr8Pcdm_wY/hqdefault.jpg";
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(true)}
              className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {/* YouTube VSL Embed */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/JWr8Pcdm_wY?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1"
              title="VSL"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* CTA Buttons below VSL */}
      <div className="mt-16 mb-32 flex items-center justify-center gap-6">
        {/* Book A Call (rectangular-rounded) */}
        <div className="relative inline-block">
          {/* Subtle background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-blue-500/10 rounded-2xl blur-xl opacity-60"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl blur-lg opacity-40"></div>

          <a
            href="https://calendly.com/feltaditya/discovery-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block bg-black hover:bg-gray-900 text-white px-10 py-5 text-lg md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 hover:border-white/40 overflow-hidden group cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <span className="relative z-10">Book A Call</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl"></div>
          </a>
        </div>

        {/* See Our Work (scroll to portfolio) */}
        <div className="relative inline-block">
          {/* Subtle background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-blue-500/10 rounded-2xl blur-xl opacity-60"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl blur-lg opacity-40"></div>

          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('portfolio');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="relative inline-block bg-black hover:bg-gray-900 text-white px-10 py-5 text-lg md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 hover:border-white/40 overflow-hidden group cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <span className="relative z-10">See Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl"></div>
          </a>
        </div>
      </div>

    </div>
  )
})

export default VideoSection
