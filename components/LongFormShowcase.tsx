"use client"

import React, { useEffect } from "react"
import { safeDocumentAccess, safeWindowAccess } from "@/lib/client-utils"
import Script from "next/script"

type Video = { 
  wistiaId: string;
  title?: string; 
  thumb?: string;
  creator?: string;
  creatorPhoto?: string;
  job?: string;
}

// Preconnect hint for faster Vimeo player boot
function PreconnectWistia() {
  useEffect(() => {
    const links: HTMLLinkElement[] = []
    const add = (href: string) => {
      const l = document.createElement('link')
      l.rel = 'preconnect'
      l.href = href
      document.head.appendChild(l)
      links.push(l)
    }
    add('https://fast.wistia.com')
    add('https://embedwistia-a.akamaihd.net')
    return () => {
      links.forEach(l => document.head.removeChild(l))
    }
  }, [])
  return null
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/70 border border-blue-500/20 shadow-2xl backdrop-blur-sm group">
      <div className="absolute inset-0">
        <wistia-player media-id={video.wistiaId} aspect="1.7777777777777777"></wistia-player>
      </div>
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
    { wistiaId: "1kqkfbf2rd", title: "Finance", thumb: "/v1.png", creator: "A. Chowdhary", creatorPhoto: "/A%20chowdhary.jpg", job: "Youtuber" },
    { wistiaId: "k1lbncd739", title: "Community", thumb: "/v2.png", creator: "Ro-connect", creatorPhoto: "/discord.jpg", job: "Discord Server" },
    { wistiaId: "8914b1xoti", title: "SEO", thumb: "/v3.png", creator: "Kevin Durov", creatorPhoto: "/kevin.jpg", job: "VSL" },
    { wistiaId: "7jcncibxqi", title: "Productivity", thumb: "/v4.png", creator: "Wang Wei", creatorPhoto: "/zhang.jpg", job: "Youtuber" },
  ]

  return (
    <section id="longform" className="relative max-w-6xl mx-auto mt-10 mb-40 px-4">
      <PreconnectWistia />
      {/* Wistia scripts for long-form players */}
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/1kqkfbf2rd.js" type="module" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/k1lbncd739.js" type="module" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/8914b1xoti.js" type="module" strategy="afterInteractive" />
      <Script src="https://fast.wistia.com/embed/7jcncibxqi.js" type="module" strategy="afterInteractive" />
      <style jsx global>{`
        wistia-player[media-id='1kqkfbf2rd']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/1kqkfbf2rd/swatch');
          display: block;
          filter: blur(5px);
          padding-top:56.25%;
        }
        wistia-player[media-id='k1lbncd739']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/k1lbncd739/swatch');
          display: block;
          filter: blur(5px);
          padding-top:56.25%;
        }
        wistia-player[media-id='8914b1xoti']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/8914b1xoti/swatch');
          display: block;
          filter: blur(5px);
          padding-top:56.25%;
        }
        wistia-player[media-id='7jcncibxqi']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/7jcncibxqi/swatch');
          display: block;
          filter: blur(5px);
          padding-top:56.25%;
        }
      `}</style>
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
          <div key={`${v.wistiaId}-${i}`} className="video-card relative opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(50px)', transitionDelay: `${i * 200}ms` }}>
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


