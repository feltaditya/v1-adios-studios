"use client"

import { memo } from "react"
import Script from "next/script"

const VideoSection = memo(function VideoSection() {
  return (
    <div className="max-w-4xl mx-auto mb-16 -mt-8 relative">
      <div className="relative aspect-video bg-gradient-to-br from-gray-900/60 via-slate-900/70 to-gray-800/60 backdrop-blur-sm rounded-md overflow-hidden border border-white/10 shadow-2xl">
        {/* Wistia VSL Embed */}
        <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
        <Script src="https://fast.wistia.com/embed/5vd2rgc3se.js" type="module" strategy="afterInteractive" />
        <style jsx global>{`
          wistia-player[media-id='5vd2rgc3se']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/5vd2rgc3se/swatch');
            display: block;
            filter: blur(5px);
            padding-top:56.25%;
          }
        `}</style>
        <div className="absolute inset-0">
          <wistia-player media-id="5vd2rgc3se" aspect="1.7777777777777777"></wistia-player>
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
