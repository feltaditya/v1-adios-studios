"use client"

import React, { useEffect, useMemo, useState, memo, useCallback } from "react"
import { safeDocumentAccess, safeWindowAccess } from "@/lib/client-utils"

type Video = { 
  id: string; 
  title?: string; 
  thumb?: string;
  creator?: string;
  creatorPhoto?: string;
  job?: string;
}

// Preconnect hint for faster Vimeo player boot
function PreconnectVimeo() {
  useEffect(() => {
    const link = safeDocumentAccess(() => {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = "https://player.vimeo.com"
      document.head.appendChild(link)
      return link
    }, null);
    
    return () => { 
      if (link) {
        safeDocumentAccess(() => {
          document.head.removeChild(link)
        }, undefined);
      }
    }
  }, [])
  return null
}

function VideoCard({ video }: { video: Video }) {
  const [play, setPlay] = useState(false)
  const iframeSrc = useMemo(
    () => `https://player.vimeo.com/video/${video.id}?autoplay=1&muted=0&loop=0&byline=0&title=0&portrait=0`,
    [video.id]
  )
  const [muted, setMuted] = useState(false)
  const [paused, setPaused] = useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  const [thumb, setThumb] = useState<string | null>(video.thumb ?? null)
  useEffect(() => {
    if (video.thumb) { setThumb(video.thumb); return }
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${video.id}`)
      .then(r => r.json())
      .then(d => {
        const url = (d.thumbnail_url as string) || null
        setThumb(url ? url.replace(/_[0-9]+x[0-9]+\.(jpg|png)$/i, '_1280.$1') : null)
      })
      .catch(() => setThumb(null))
  }, [video.id, video.thumb])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/70 border border-blue-500/20 shadow-2xl backdrop-blur-sm group">
      {!play && (
        <button
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setPlay(true)}
          aria-label={`Play ${video.title ?? "video"}`}
        >
          {thumb ? (
            <img src={thumb} alt={video.title ?? 'Video thumbnail'} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" onError={() => setThumb(null)} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
          )}
                     <div className="relative z-10 h-16 w-16 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center shadow-lg ring-1 ring-white/30 transition-all duration-300 group-hover:scale-105 group-hover:bg-black/50 group-hover:ring-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
      {play && (
        <iframe
          src={iframeSrc}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          ref={iframeRef}
        />
      )}

      {play && (
        <>
          {/* Controls */}
          <button
            onClick={() => {
              const next = !muted
              setMuted(next)
              try {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ method: 'setMuted', value: next }),
                  '*'
                )
              } catch {}
            }}
            className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80 transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.54 8.46a.75.75 0 1 1 1.06 1.06L13.06 13l3.54 3.54a.75.75 0 1 1-1.06 1.06L12 14.06l-3.54 3.54a.75.75 0 1 1-1.06-1.06L10.94 13 7.4 9.46a.75.75 0 1 1 1.06-1.06L12 11.94l3.54-3.48z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"/></svg>
            )}
          </button>
          <button
            onClick={() => {
              const next = !paused
              setPaused(next)
              try {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ method: next ? 'pause' : 'play' }),
                  '*'
                )
              } catch {}
            }}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={paused ? 'Play' : 'Pause'}
          >
            <div className="h-12 w-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white">
              {paused ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5"><path d="M8 5v14l11-7z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M10 5h2v14h-2zM14 5h2v14h-2z"/></svg>
              )}
            </div>
          </button>
        </>
      )}

    </div>
  )
}

export default function LongFormShowcase() {
  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const longformSection = safeDocumentAccess(() => document.querySelector('#longform'), null);
      if (!longformSection) return;
      
      const sectionRect = longformSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
      
      // Check if longform section is in view
      if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        // Animate header elements
        const badge = longformSection.querySelector('.longform-badge');
        const title = longformSection.querySelector('.longform-title');
        const subtitle = longformSection.querySelector('.longform-subtitle');
        
        if (badge) {
          setTimeout(() => {
            (badge as HTMLElement).style.opacity = '1';
            (badge as HTMLElement).style.transform = 'translateY(0)';
          }, 100);
        }
        
        if (title) {
          setTimeout(() => {
            (title as HTMLElement).style.opacity = '1';
            (title as HTMLElement).style.transform = 'translateY(0)';
          }, 180);
        }
        
        if (subtitle) {
          setTimeout(() => {
            (subtitle as HTMLElement).style.opacity = '1';
            (subtitle as HTMLElement).style.transform = 'translateY(0)';
          }, 260);
        }
        
        // Animate video cards
        const videoCards = longformSection.querySelectorAll('.video-card');
        videoCards.forEach((card, index) => {
          setTimeout(() => {
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'translateY(0)';
          }, 800 + (index * 200));
        });
      }
    };

    // Initial call
    handleScroll();
    
    // Add scroll event listener
    safeWindowAccess(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, undefined);
    
    return () => {
      safeWindowAccess(() => {
        window.removeEventListener('scroll', handleScroll);
      }, undefined);
    };
  }, []);

  const videos: Video[] = [
    { 
      id: "1110221227", 
      title: "Finance", 
      thumb: "/v1.png",
      creator: "A. Chowdhary",
      creatorPhoto: "/A%20chowdhary.jpg",
      job: "Youtuber"
    },
    { 
      id: "1110220089", 
      title: "Community", 
      thumb: "/v2.png",
      creator: "Ro-connect",
      creatorPhoto: "/discord.jpg",
      job: "Discord Server"
    },
    { 
      id: "1110220012", 
      title: "SEO", 
      thumb: "/v3.png",
      creator: "Kevin Durov",
      creatorPhoto: "/kevin.jpg",
      job: "VSL"
    },
    { 
      id: "1110216237", 
      title: "Productivity", 
      thumb: "/v4.png",
      creator: "Wang Wei",
      creatorPhoto: "/zhang.jpg",
      job: "Youtuber"
    },
  ]

  return (
    <section id="longform" className="relative max-w-6xl mx-auto mt-10 mb-40 px-4">
      <PreconnectVimeo />
      {/* Green Theme Background Effects */}
      <div className="absolute -inset-20 bg-gradient-to-br from-emerald-900/15 via-teal-900/20 to-green-900/15 rounded-3xl blur-3xl" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-green-400/12 via-emerald-400/18 to-teal-400/12 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-gradient-to-bl from-teal-400/12 via-emerald-400/18 to-green-400/12 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      <div className="pointer-events-none absolute top-1/4 right-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-300/8 via-teal-300/12 to-green-300/8 blur-2xl" />

      <div className="text-center mb-12 relative">
        <div className="longform-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-6 backdrop-blur-sm opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          LONGFORM
        </div>
        <h2 className="longform-title text-3xl md:text-4xl lg:text-5xl font-medium font-heading text-white mb-3 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          Long-form Videos
        </h2>
        <p className="longform-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
          High-production storytelling designed to convert and retain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {videos.map((v, i) => (
          <div key={`${v.id}-${i}`} className="video-card relative opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(50px)', transitionDelay: `${i * 200}ms` }}>
            <span className="absolute z-10 top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/5 border border-white/20 text-white/80 backdrop-blur">
              {v.title}
            </span>
            <VideoCard video={v} />
            
            {/* Creator Info Below Video */}
            {v.creator && (
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                  <img 
                    src={v.creatorPhoto || "/placeholder-user.jpg"} 
                    alt={v.creator} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">
                    {v.creator}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {v.job || "Creator"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}


