"use client"

import { useState, memo } from "react"
import { Play } from "lucide-react"

const VideoSection = memo(function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="max-w-4xl mx-auto mb-16 -mt-8 relative">
      {/* Enhanced Background Effects */}
      <div className="absolute -inset-8 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-cyan-900/20 rounded-3xl blur-2xl"></div>
      <div className="absolute -top-4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 via-cyan-400/15 to-indigo-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-bl from-cyan-400/10 via-blue-400/15 to-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative aspect-video bg-gradient-to-br from-gray-900/60 via-slate-900/70 to-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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

      {/* CTA Button below VSL */}
      <div className="text-center mt-12 mb-32">
        <div className="relative inline-block">
          {/* Subtle background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-blue-500/10 rounded-full blur-xl opacity-60"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full blur-lg opacity-40"></div>
          
          <a
            href="https://calendly.com/feltaditya/discovery-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block bg-black hover:bg-gray-900 text-white px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 hover:border-white/40 overflow-hidden group cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <span className="relative z-10">Book A Call</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
          </a>
        </div>
      </div>

    </div>
  )
})

export default VideoSection
