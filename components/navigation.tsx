import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="w-full bg-black py-6">
      <div className="flex justify-center">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-600/70 shadow-2xl py-4 px-12 max-w-4xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {/* ADIOS STUDIO Style Logo */}
              <div className="flex items-center border border-blue-500 rounded-md overflow-hidden shadow-lg">
                {/* Left Section - Black Background */}
                <div className="bg-black px-2 py-1.5">
                  <span className="text-white text-xs font-bold tracking-wide">ADIOS</span>
                </div>
                {/* Right Section - White Background */}
                <div className="bg-white px-2 py-1.5">
                  <span className="text-black text-xs font-bold tracking-wide">STUDIOS</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 ml-8">
              <a href="#portfolio" className="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/80">
                Portfolio
              </a>
              <a href="#reviews" className="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/80">
                Reviews
              </a>
              <a href="#about" className="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/80">
                About Us
              </a>
              <a href="#faqs" className="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/80">
                FAQs
              </a>
            </div>

            {/* CTA Button */}
            <Button className="bg-black text-white border-2 border-white hover:bg-blue-500 hover:border-blue-500 px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-xl">
              Book a call
              <span className="text-white group-hover:text-white">→</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
