"use client"

import React, { useEffect, useState } from "react"

type Reel = {
  id: string
  title?: string
  thumb?: string // optional custom thumbnail path, e.g. "/reels/reel-1.jpg"
}

async function fetchVimeoThumb(id: string) {
  const res = await fetch(
    `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`
  )
  if (!res.ok) throw new Error("Failed to fetch thumbnail")
  const data = await res.json()
  const url = data.thumbnail_url as string
  // Try upscaling to 1280 if Vimeo provides size suffix
  return url.replace(/_[0-9]+x[0-9]+\.(jpg|png)$/i, '_1280.$1')
}

// Preconnect hint for faster player boot
function PreconnectVimeo() {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = "https://player.vimeo.com"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])
  return null
}

function ReelCard({ reel, t=0 }: { reel: Reel, t?: number }) {
  const [thumb, setThumb] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  const [iframeReady, setIframeReady] = useState(false)

  useEffect(() => {
    if (reel.thumb) {
      setThumb(reel.thumb)
      return
    }
    fetchVimeoThumb(reel.id).then(setThumb).catch(() => setThumb(null))
  }, [reel.id, reel.thumb])

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black/70 border border-blue-500/20 shadow-2xl backdrop-blur-sm group reel-iframe-wrapper">
      {!isPlaying && (
        <button
          className="absolute inset-0"
          onClick={() => { setIsPlaying(true); setMuted(false) }}
          aria-label={`Play ${reel.title ?? "reel"}`}
        >
          {thumb ? (
            <img
              src={thumb}
              alt={reel.title ?? "Vimeo reel thumbnail"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setThumb(null)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800" />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-6 left-6">
            <div className="h-14 w-14 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center shadow-lg ring-1 ring-white/30 transition-all duration-300 group-hover:scale-105 group-hover:bg-black/50 group-hover:ring-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 translate-x-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {isPlaying && (
        <>
          <iframe
            src={`https://player.vimeo.com/video/${reel.id}?autoplay=1&muted=${muted ? 1 : 0}&loop=1&autopause=0&byline=0&title=0&portrait=0#t=${t}s`}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            ref={iframeRef}
            onLoad={() => {
              setIframeReady(true)
              // initialize time and mute state
              try {
                const w = iframeRef.current?.contentWindow
                if (w) {
                  w.postMessage(JSON.stringify({ method: 'setCurrentTime', value: t }), '*')
                  w.postMessage(JSON.stringify({ method: 'setMuted', value: muted }), '*')
                  w.postMessage(JSON.stringify({ method: 'play' }), '*')
                }
              } catch {}
            }}
          />
          {!iframeReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {/* Mute/Unmute */}
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
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M15.54 8.46a.75.75 0 1 1 1.06 1.06L13.06 13l3.54 3.54a.75.75 0 1 1-1.06 1.06L12 14.06l-3.54 3.54a.75.75 0 1 1-1.06-1.06L10.94 13 7.4 9.46a.75.75 0 1 1 1.06-1.06L12 11.94l3.54-3.48z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
              </svg>
            )}
          </button>

          {/* Play/Pause center control */}
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
            className="absolute inset-0 flex items-center justify-center text-white"
            aria-label={paused ? 'Play' : 'Pause'}
          >
            <div className="h-12 w-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
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

export default function ReelShowcase() {
  const reels: Reel[] = [
    // Thumbnails are placed directly under /public as per your screenshot
    { id: "1110083380", title: "Reel 1", thumb: "/reel 1.png" },
    // Middle reel uses reel3 thumbnail
    { id: "1110083131", title: "Reel 2", thumb: "/reel3 th.png" },
    // Rightmost reel uses reel2 thumbnail
    { id: "1110083257", title: "Reel 3", thumb: "/reel2 th.png" },
  ]

  return (
    <section id="reels" className="relative max-w-6xl mx-auto mt-32 mb-40 px-4">
      <PreconnectVimeo />
      {/* background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="text-center mb-16 relative">
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl" />
        <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-6 backdrop-blur-sm">
          REELS
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium font-heading text-white mb-3">
          Short-form Reels
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Crisp, vertical edits designed to hook and retain attention.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 lg:gap-10 flex lg:block overflow-x-auto no-scrollbar -mx-4 px-4 space-x-4 lg:space-x-0 scroll-smooth snap-x snap-mandatory">
        {reels.map((reel, idx) => (
          <div key={reel.id} className="lg:contents min-w-[240px] sm:min-w-[280px] md:min-w-[320px] snap-center">
            {/* Start each reel a bit ahead to avoid static/opening frames */}
            <ReelCard reel={reel} t={idx === 0 ? 1 : idx === 1 ? 2 : 1.5} />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="#portfolio"
          className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-blue-300 hover:bg-blue-500/20 transition-colors"
        >
          View all reels
        </a>
      </div>
    </section>
  )
}
