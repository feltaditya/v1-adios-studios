import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full py-6">
      <div className="flex justify-center">
        <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/20 shadow-2xl py-4 px-8 max-w-2xl">
          <div className="flex items-center justify-between">
            {/* Personal Branding Card */}
            <div className="flex items-center gap-3">
              {/* Circular Profile Picture with White Outline */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shadow-lg">
                  <img 
                    src="/adityachad.png" 
                    alt="Aditya" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      e.currentTarget.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
              </div>
              
              {/* Name */}
              <div className="flex flex-col">
                <div className="text-white font-bold text-base tracking-wide">
                  Aditya | Adios Studios
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 ml-8">
              <a href="#portfolio" className="text-gray-200 hover:text-white transition-all duration-300 font-medium text-sm no-underline px-4 py-2 rounded-full hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:border hover:border-white/20">
                Portfolio
              </a>
              <a href="#testimonials" className="text-gray-200 hover:text-white transition-all duration-300 font-medium text-sm no-underline px-4 py-2 rounded-full hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:border hover:border-white/20">
                Testimonials
              </a>
              <a href="#about" className="text-gray-200 hover:text-white transition-all duration-300 font-medium text-sm no-underline px-4 py-2 rounded-full hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:border hover:border-white/20">
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
