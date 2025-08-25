"use client"

export default function Footer() {
  return (
    <footer className="relative mt-24 pt-12 pb-16 border-t border-white/10">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Adios Studios. All rights reserved.
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <a href="#portfolio" className="hover:text-white">Portfolio</a>
          <span className="opacity-30">/</span>
          <a href="#reels" className="hover:text-white">Reels</a>
          <span className="opacity-30">/</span>
          <a href="#longform" className="hover:text-white">Longform</a>
        </div>
        <a
          href="#contact"
          className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-blue-300 hover:bg-blue-500/20 transition-colors"
        >
          Get in touch
        </a>
      </div>
    </footer>
  )
}


