"use client"

import { memo, useEffect, useRef, useState } from "react"
import Head from "next/head"

const VideoSection = memo(function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (isPlaying) {
      el.style.willChange = "transform, opacity"
      el.style.transform = "translateZ(0)"
    } else {
      el.style.willChange = "auto"
      el.style.transform = "none"
    }
  }, [isPlaying])

  // No external player API needed for Vimeo in this lite setup

  return (
    <div className="max-w-4xl mx-auto mb-16 -mt-8 relative">
      <Head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.google.com" />
      </Head>
      <div
        ref={containerRef}
        className={`relative aspect-video bg-gradient-to-br from-gray-900/60 via-slate-900/70 to-gray-800/60 ${
          isPlaying ? "backdrop-blur-0" : "backdrop-blur-sm"
        } rounded-md overflow-hidden border border-white/10 shadow-2xl`}
        style={{ contain: "content" }}
      >
        {/* YouTube VSL Embed (lite) - preserves poster, loads player instantly on click */}
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
          {!showPlayer && (
            <button
              type="button"
              aria-label="Play video"
              onClick={() => { setShowPlayer(true); setIsPlaying(true) }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: `center / cover no-repeat url('https://i.ytimg.com/vi/R297c9dftVo/maxresdefault.jpg')` }}
            >
              {/* Fallback gradient overlay and play button */}
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,.35))" }} />
              <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 84, height: 84, borderRadius: 9999, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.15)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
          {showPlayer && (
            <iframe
              id="vsl-player"
              src={"https://www.youtube-nocookie.com/embed/R297c9dftVo?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=0&playsinline=1&fs=0&disablekb=1&cc_load_policy=0"}
              frameBorder={0}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="eager"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          )}
        </div>
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
