"use client"

import React, { useEffect, useState, memo, useCallback } from "react"
import Script from "next/script"
import { safeDocumentAccess, safeWindowAccess } from "@/lib/client-utils"

type Reel = {
  id: string
  title?: string
  thumb?: string // optional custom thumbnail path, e.g. "/reels/reel-1.jpg"
  url: string
  creator?: string
  creatorPhoto?: string
  job?: string
  wistiaId?: string
}

// Memoized ReelCard component for better performance
const ReelCard = memo(function ReelCard({ reel, t }: { reel: Reel; t: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  
  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Play clicked for:', reel.id)
    setIsLoading(true)
    setShowVideo(true)
  }, [reel.id])

  // Extract Vimeo video ID from URL (fallback if not using Wistia)
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  const vimeoId = reel.wistiaId ? null : getVimeoId(reel.url)

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02]">
        {/* Glassy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
        
        <div className="aspect-[9/16] relative z-10">
          {/* Wistia Player (preferred when wistiaId present) */}
          {reel.wistiaId ? (
            <div className="absolute inset-0">
              <wistia-player media-id={reel.wistiaId} aspect="0.5625"></wistia-player>
            </div>
          ) : (
            <>
              {/* Thumbnail Image */}
              {!showVideo && reel.thumb && (
                <img
                  src={reel.thumb}
                  alt={reel.title || `Reel ${reel.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
              )}
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              {/* Vimeo Video Player */}
              {showVideo && vimeoId && (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&controls=1&responsive=1`}
                  title={reel.title || `Reel ${reel.id}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ opacity: isLoading ? 0 : 1 }}
                  onLoad={() => {
                    console.log('Vimeo iframe loaded for:', reel.id)
                    setIsLoading(false)
                  }}
                />
              )}
              {/* Overlay - only show when not playing */}
              {!showVideo && (
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              )}
              {/* Silver Play Button - Top Left */}
              {!showVideo && (
                <button
                  onClick={handlePlay}
                  className="absolute top-3 left-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 z-10"
                >
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Creator Info Below Video */}
      {reel.creator && (
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
            <img 
              src={reel.creatorPhoto || "/placeholder-user.jpg"} 
              alt={reel.creator} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-user.jpg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm">
              {reel.creator}
            </div>
            <div className="text-gray-400 text-xs">
              {reel.job || "Creator"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default function ReelShowcase() {
  // Scroll animation effect - optimized with throttling
  let ticking = false
  
  const handleScroll = useCallback(() => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const reelsSection = safeDocumentAccess(() => document.querySelector('#reels'), null);
        if (!reelsSection) return;
        
        const sectionRect = reelsSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
        
        // Check if reels section is in view
        if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
          // Animate header elements
          const badge = reelsSection.querySelector('.reels-badge');
          const title = reelsSection.querySelector('.reels-title');
          const subtitle = reelsSection.querySelector('.reels-subtitle');
          
          if (badge) {
            setTimeout(() => {
              (badge as HTMLElement).style.opacity = '1';
              (badge as HTMLElement).style.transform = 'translateY(0)';
            }, 200);
          }
          
          if (title) {
            setTimeout(() => {
              (title as HTMLElement).style.opacity = '1';
              (title as HTMLElement).style.transform = 'translateY(0)';
            }, 400);
          }
          
          if (subtitle) {
            setTimeout(() => {
              (subtitle as HTMLElement).style.opacity = '1';
              (subtitle as HTMLElement).style.transform = 'translateY(0)';
            }, 600);
          }
          
          // Animate reel cards
          const reelCards = reelsSection.querySelectorAll('.reel-card');
          reelCards.forEach((card, index) => {
            setTimeout(() => {
              (card as HTMLElement).style.opacity = '1';
              (card as HTMLElement).style.transform = 'translateY(0)';
            }, 800 + (index * 200));
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, []);

  useEffect(() => {

    // Initial call
    handleScroll();
    
    // Add scroll event listener with passive flag
    safeWindowAccess(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, undefined);
    
    return () => {
      safeWindowAccess(() => {
        window.removeEventListener('scroll', handleScroll);
      }, undefined);
    };
  }, []);

  const reels: Reel[] = [
    {
      id: "reel-1",
      title: "Hook & Retain",
      url: "",
      wistiaId: "sb0bjt2xp9",
      creator: "Adam Moore",
      creatorPhoto: "/adam moore.jpg",
      job: "40k+ Views"
    },
    {
      id: "reel-2", 
      title: "Quick Value",
      url: "",
      wistiaId: "r0aabs2o37",
      creator: "Mark Santos",
      creatorPhoto: "/marks santos .jpg",
      job: "98k+ Views"
    },
    {
      id: "reel-3",
      title: "Call to Action", 
      url: "",
      wistiaId: "kkadp7ss22",
      creator: "Adam Moore",
      creatorPhoto: "/adam moore.jpg",
      job: "55k+ Views"
    }
  ]

  return (
    <section id="reels" className="relative max-w-7xl mx-auto mb-48 mt-32 px-4">
      {/* Wistia Player Scripts */}
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/sb0bjt2xp9.js" type="module" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/r0aabs2o37.js" type="module" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/kkadp7ss22.js" type="module" strategy="afterInteractive" />
      <style jsx global>{`
        wistia-player[media-id='sb0bjt2xp9']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/sb0bjt2xp9/swatch');
          display: block;
          filter: blur(5px);
          padding-top:177.78%;
        }
        wistia-player[media-id='r0aabs2o37']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/r0aabs2o37/swatch');
          display: block;
          filter: blur(5px);
          padding-top:177.78%;
        }
        wistia-player[media-id='kkadp7ss22']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/kkadp7ss22/swatch');
          display: block;
          filter: blur(5px);
          padding-top:177.78%;
        }
      `}</style>
      {/* Green Background Effects - Same as Services */}
      <div className="absolute -inset-32 bg-gradient-to-br from-emerald-900/15 via-teal-900/20 to-cyan-900/15 rounded-3xl blur-3xl"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-400/10 via-emerald-400/15 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-bl from-teal-400/10 via-emerald-400/15 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-teal-400/10 via-emerald-400/15 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-bl from-emerald-300/5 via-teal-300/10 to-green-300/5 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="text-center mb-24 relative">
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="reels-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          REELS
        </div>
        <h2 className="reels-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          Short-form Reels
        </h2>
        <p className="reels-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          Crisp, vertical edits designed to hook and retain attention.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 lg:gap-10 flex lg:block overflow-x-auto no-scrollbar -mx-4 px-4 space-x-4 lg:space-x-0 scroll-smooth snap-x snap-mandatory">
        {reels.map((reel, idx) => (
          <div key={reel.id} className="reel-card lg:contents min-w-[240px] sm:min-w-[280px] md:min-w-[320px] snap-center opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(50px)', transitionDelay: `${idx * 200}ms` }}>
            <ReelCard reel={reel} t={idx === 0 ? 1 : idx === 1 ? 2 : 1.5} />
          </div>
        ))}
      </div>

    </section>
  )
}