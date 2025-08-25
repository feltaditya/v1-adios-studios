"use client"

import { useState } from "react"
import { Play } from "lucide-react"

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="max-w-4xl mx-auto mb-16 -mt-8">
      <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl overflow-hidden">
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


    </div>
  )
}
