"use client";

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/navigation"
import VideoSection from "@/components/video-section"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef, memo, useCallback } from "react"
import { safeWindowAccess, safeDocumentAccess } from "@/lib/client-utils"

// Load showcase sections immediately to avoid scroll-delayed rendering
import ReelShowcase from "@/components/ReelShowcase"
import LongFormShowcase from "@/components/LongFormShowcase"
import Footer from "@/components/Footer"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0); // Start with the first slide
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Stats animation state
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [callsBooked, setCallsBooked] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [watchHours, setWatchHours] = useState(0);
  
  // Typewriter animation state
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  const totalSlides = 17; // Total number of thumbnails

  const navigateCarousel = (direction: 'prev' | 'next') => {
    setIsAutoScrolling(false);
    if (direction === 'prev') {
      setCurrentSlide(prev => prev === 0 ? totalSlides - 1 : prev - 1);
    } else {
      setCurrentSlide(prev => prev === totalSlides - 1 ? 0 : prev + 1);
    }
    // Restart auto-scroll after 3 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  const goToSlide = (index: number) => {
    setIsAutoScrolling(false);
    setCurrentSlide(index);
    // Restart auto-scroll after 3 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  const startAutoScroll = () => {
    console.log('Starting auto-scroll');
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    autoScrollInterval.current = setInterval(() => {
      console.log('Auto-scrolling to next slide');
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isAutoScrolling]);

  // Start auto-scroll immediately when component mounts
  useEffect(() => {
    setIsAutoScrolling(true);
  }, []);

  // 3D Service Card Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = safeDocumentAccess(() => document.querySelector('.services-section'), null);
      if (!servicesSection) return;
      
      const sectionRect = servicesSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
      
      // Apply 3D effect when section is in view or slightly out of view
      if (sectionTop < windowHeight * 1.25 && sectionBottom > -windowHeight * 0.25) {
        const scrollProgress = (windowHeight * 0.75 - sectionTop) / (windowHeight * 0.5);
        const cards = servicesSection.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const cardTop = cardRect.top;
          const cardBottom = cardRect.bottom;
          const cardCenter = (cardTop + cardBottom) / 2;
          const windowCenter = windowHeight / 2;
          
          // Calculate distance from center of window
          const distanceFromCenter = Math.abs(cardCenter - windowCenter);
          const maxDistance = windowHeight / 2;
          const distanceRatio = Math.min(distanceFromCenter / maxDistance, 1);
          
          // Check if card is fully in view (centered in viewport)
          const isCardCentered = distanceFromCenter < windowHeight * 0.2;
          
          // Apply no rotation when card is centered, otherwise apply 3D effect
          if (isCardCentered) {
            // Card is centered in view - make it straight
            (card as HTMLElement).style.transition = 'transform 0.5s ease-out';
            (card as HTMLElement).style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1.02)';
          } else {
            // Card is not centered - apply 3D effect based on scroll position
            // Calculate rotation based on scroll position and distance from center
             // Reduced intensity for more subtle effect
             const rotationX = (scrollProgress * 3) - (distanceRatio * 10);
             const rotationY = (scrollProgress * 2) - (distanceRatio * 6);
             const translateZ = -30 + (scrollProgress * 20) - (distanceRatio * 20);
            
            // Apply transforms with smoother transitions
             (card as HTMLElement).style.transition = 'transform 0.4s ease-out';
             (card as HTMLElement).style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateZ(${translateZ}px) scale(0.98)`;
          }
        });
      }
    };

    // Initial call to set correct transforms
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

  // Services Section Scroll Animation
  useEffect(() => {
    const handleServicesScroll = () => {
      const servicesSection = safeDocumentAccess(() => document.querySelector('.services-section'), null);
      if (!servicesSection) return;
      
      const sectionRect = servicesSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
      
      // Check if services section is in view
      if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        // Animate header elements
        const badge = servicesSection.querySelector('.services-badge');
        const title = servicesSection.querySelector('.services-title');
        const subtitle = servicesSection.querySelector('.services-subtitle');
        
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
        
        // Animate service cards - all together smoothly
        const serviceCards = servicesSection.querySelectorAll('.service-card');
        serviceCards.forEach((card) => {
          (card as HTMLElement).style.opacity = '1';
          (card as HTMLElement).style.transform = 'translateY(0)';
        });
      }
    };

    // Initial call
    handleServicesScroll();
    
    // Add scroll event listener
    safeWindowAccess(() => {
      window.addEventListener('scroll', handleServicesScroll, { passive: true });
    }, undefined);
    
    return () => {
      safeWindowAccess(() => {
        window.removeEventListener('scroll', handleServicesScroll);
      }, undefined);
    };
  }, []);

  // Process Steps Scroll Animation
  useEffect(() => {
    const handleProcessScroll = () => {
      const processSteps = safeDocumentAccess(() => document.querySelectorAll('.process-step'), []);
      const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
      
      processSteps.forEach((step, index) => {
        const stepRect = step.getBoundingClientRect();
        const stepTop = stepRect.top;
        const stepBottom = stepRect.bottom;
        
        // Check if step is in view
        if (stepTop < windowHeight * 0.8 && stepBottom > 0) {
          // Add delay based on step index
          setTimeout(() => {
            (step as HTMLElement).style.opacity = '1';
            (step as HTMLElement).style.transform = 'translateY(0)';
          }, index * 200); // 200ms delay between each step
        }
      });
    };

    // Initial call
    handleProcessScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleProcessScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleProcessScroll);
    };
  }, []);

  // Stats Countdown Animation
  useEffect(() => {
    const animateStats = () => {
      if (statsAnimated) return;
      
      const statsSection = safeDocumentAccess(() => document.querySelector('#stats-section'), null);
      if (!statsSection) return;
      
      const rect = statsSection.getBoundingClientRect();
      const windowHeight = safeWindowAccess(() => window.innerHeight, 0);
      
      // Check if stats section is in view
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        setStatsAnimated(true);
        
        // Animate calls booked (150+) - Ultra fast
        const animateCallsBooked = () => {
          let current = 0;
          const target = 150;
          const increment = target / 10; // 10 frames for ultra fast animation
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCallsBooked(target);
              clearInterval(timer);
            } else {
              setCallsBooked(Math.floor(current));
            }
          }, 4); // Ultra fast ~250fps
        };
        
        // Animate total views (555K+) - Ultra fast
        const animateTotalViews = () => {
          let current = 0;
          const target = 555;
          const increment = target / 10;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setTotalViews(target);
              clearInterval(timer);
            } else {
              setTotalViews(Math.floor(current));
            }
          }, 4);
        };
        
        // Animate watch hours (100,000) - Ultra fast
        const animateWatchHours = () => {
          let current = 0;
          const target = 100000;
          const increment = target / 10;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setWatchHours(target);
              clearInterval(timer);
            } else {
              setWatchHours(Math.floor(current));
            }
          }, 4);
        };
        
        // Start all animations
        animateCallsBooked();
        animateTotalViews();
        animateWatchHours();
      }
    };

    // Initial call
    animateStats();
    
    // Add scroll event listener
    safeWindowAccess(() => {
      window.addEventListener('scroll', animateStats, { passive: true });
    }, undefined);
    
    return () => {
      safeWindowAccess(() => {
        window.removeEventListener('scroll', animateStats);
      }, undefined);
    };
  }, [statsAnimated]);

  // Testimonials Section Scroll Animation
  useEffect(() => {
    const handleTestimonialsScroll = () => {
      const testimonialsSection = document.querySelector('#testimonials');
      if (!testimonialsSection) return;
      
      const sectionRect = testimonialsSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Check if testimonials section is in view
      if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        // Animate header elements
        const badge = testimonialsSection.querySelector('.testimonials-badge');
        const title = testimonialsSection.querySelector('.testimonials-title');
        const subtitle = testimonialsSection.querySelector('.testimonials-subtitle');
        
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
          }, 200);
        }
        
        if (subtitle) {
          setTimeout(() => {
            (subtitle as HTMLElement).style.opacity = '1';
            (subtitle as HTMLElement).style.transform = 'translateY(0)';
          }, 300);
        }
        
        // Animate testimonial cards
        const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
          setTimeout(() => {
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'translateY(0)';
          }, 200 + (index * 50));
        });

        // Animate stats cards
        const statsCards = testimonialsSection.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
          setTimeout(() => {
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'translateY(0)';
          }, 350 + (index * 50));
        });
      }
    };

    // Initial call
    handleTestimonialsScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleTestimonialsScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleTestimonialsScroll);
    };
  }, []);

  // About Us Section Scroll Animation
  useEffect(() => {
    const handleAboutScroll = () => {
      const aboutSection = document.querySelector('#about');
      if (!aboutSection) return;
      
      const sectionRect = aboutSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Check if about section is in view
      if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        // Animate header elements
        const badge = aboutSection.querySelector('.about-badge');
        const title = aboutSection.querySelector('.about-title');
        const subtitle = aboutSection.querySelector('.about-subtitle');
        
        if (badge) {
          setTimeout(() => {
            (badge as HTMLElement).style.opacity = '1';
            (badge as HTMLElement).style.transform = 'translateY(0)';
          }, 50);
        }
        
        if (title) {
          setTimeout(() => {
            (title as HTMLElement).style.opacity = '1';
            (title as HTMLElement).style.transform = 'translateY(0)';
          }, 100);
        }
        
        if (subtitle) {
          setTimeout(() => {
            (subtitle as HTMLElement).style.opacity = '1';
            (subtitle as HTMLElement).style.transform = 'translateY(0)';
          }, 150);
        }
        
        // Animate about card
        const aboutCard = aboutSection.querySelector('.about-card');
        if (aboutCard) {
          setTimeout(() => {
            (aboutCard as HTMLElement).style.opacity = '1';
            (aboutCard as HTMLElement).style.transform = 'translateY(0)';
          }, 100);
        }
      }
    };

    // Initial call
    handleAboutScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleAboutScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleAboutScroll);
    };
  }, []);

  // Process Section Scroll Animation
  useEffect(() => {
    const handleProcessScroll = () => {
      const processSection = document.querySelector('.process-section');
      if (!processSection) return;
      
      const sectionRect = processSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Check if process section is in view
      if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        // Animate header elements
        const badge = processSection.querySelector('.process-badge');
        const title = processSection.querySelector('.process-title');
        const subtitle = processSection.querySelector('.process-subtitle');
        
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
      }
    };

    // Initial call
    handleProcessScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleProcessScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleProcessScroll);
    };
  }, []);

  // Typewriter Animation Completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setTypewriterComplete(true);
    }, 4000); // 3.5s animation + 0.5s delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateCarouselPosition = () => {
      if (carouselRef.current) {
        // Calculate slide width based on responsive breakpoints
        let slidesVisible = 1; // mobile
        const windowWidth = safeWindowAccess(() => window.innerWidth, 0);
        if (windowWidth >= 768) slidesVisible = 2; // tablet
        if (windowWidth >= 1024) slidesVisible = 3; // desktop
        
        const containerWidth = carouselRef.current.offsetWidth;
        const slideWidth = containerWidth / slidesVisible;
        const translateX = -(currentSlide * slideWidth);
        carouselRef.current.style.transform = `translateX(${translateX}px)`;
      }
    };

    updateCarouselPosition();
    
    // Add resize listener
    safeWindowAccess(() => {
      window.addEventListener('resize', updateCarouselPosition);
    }, undefined);
    
    return () => {
      safeWindowAccess(() => {
        window.removeEventListener('resize', updateCarouselPosition);
      }, undefined);
    };
  }, [currentSlide]);

  // Array of all thumbnail images - optimized for performance
  const thumbnails = [
    '/t1.png', '/t2.png', '/t3.png', '/t4.png', '/t5.jpeg', '/t6.jpeg', '/t7.jpeg', '/t8.jpeg', 
    '/t9.jpeg', '/t10.jpeg', '/t11.jpeg', '/t12.jpeg', '/t13.jpeg', '/t14.jpeg', '/t15.jpeg', 
    '/t16.jpg', '/17.png'
  ];

  // Preload critical images
  useEffect(() => {
    const criticalImages = ['/t1.png', '/t2.png', '/t3.png', '/t4.png'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Light preload: only prime first few images
  useEffect(() => {
    const toPreload = thumbnails.slice(0, 6)
    toPreload.forEach(src => {
      const img = new Image()
      img.loading = "eager"
      img.src = src
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white bg-gradient-animate">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-2/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      <Navigation />

      <main className="container mx-auto px-4 py-8 pt-32">
        {/* ADIOS STUDIOS Logo Section - Top left positioning */}
        <div className="absolute top-8 left-35 z-10">
          {/* ADIOS STUDIOS Logo */}
          <div className="flex flex-col items-start">
            <div className="flex items-center rounded-md overflow-hidden shadow-lg border border-gray-600/70">
              {/* Left Section - Black Background */}
              <div className="bg-black px-3 py-2">
                <span className="text-white text-sm font-bold tracking-wide">ADIOS</span>
              </div>
              {/* Right Section - White Background */}
              <div className="bg-white px-3 py-2">
                <span className="text-black text-sm font-bold tracking-wide">STUDIOS</span>
              </div>
            </div>
            {/* Tagline below logo */}
            <div className="mt-2 ml-2 text-white text-xs italic font-light" style={{
              fontFamily: 'Brush Script MT, cursive',
              textShadow: '0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.4)',
              filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))'
            }}>
              Say adios to slow growth
            </div>
          </div>
        </div>

        {/* Hero Section - Blue Theme */}
        <div className="relative text-center max-w-4xl mx-auto mb-16">
          {/* Blue Background Effects */}
          <div className="absolute -inset-20 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-cyan-900/20 rounded-3xl blur-3xl"></div>
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-800/10 via-indigo-800/15 to-cyan-800/10 rounded-2xl blur-2xl"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-blue-400/5 via-transparent to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-urbanist-bold mb-4 leading-tight tracking-wide text-white">
              <div className="animate-slide-up-1"><span className="whitespace-nowrap">We'll Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">10-30 Qualified Calls</span> Every</span></div>
              <div className="animate-slide-up-2 -ml-8"><span className="whitespace-nowrap">Month Using Our YouTube-Hormozi-Engine</span></div>
              <div className="animate-slide-up-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
                (Or You Don't Pay)
              </div>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto animate-summon-rise" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 600, fontStyle: 'italic'}}>
              <span className="whitespace-nowrap -ml-4">In just 60 days, with only 2 hours of raw content / month Add $10K to $25K in your revenue </span><br />
              <span className="whitespace-nowrap">Ideation-Production-Youtube funnel We handle Everything </span>
            </p>
          </div>
        </div>

        {/* Video Section */}
        <VideoSection />

        {/* CTA Button - Top Right Positioned */}
        <div className="fixed top-8 right-8 z-50">
          <a
            href="https://calendly.com/feltaditya/discovery-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg border border-white/20 hover:border-white/60 relative overflow-hidden group cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <span className="relative z-10">Book A Call</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
          </a>
        </div>

        {/* Services Section - Green Theme */}
        <div className="max-w-7xl mx-auto mb-48 services-section relative mt-20">
          {/* Green Background Effects */}
          <div className="absolute -inset-32 bg-gradient-to-br from-emerald-900/15 via-teal-900/20 to-cyan-900/15 rounded-3xl blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-400/10 via-emerald-400/15 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-bl from-teal-400/10 via-emerald-400/15 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-teal-400/10 via-emerald-400/15 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-bl from-emerald-300/5 via-teal-300/10 to-green-300/5 rounded-full blur-2xl"></div>
          
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="services-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              SERVICES
            </div>
            <h2 className="services-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              What services do we offer?
            </h2>
            <p className="services-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              Top Tier packaged into one
            </p>
          </div>
          
          {/* Services Grid - 6 Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ideation & Scripting */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="0" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Ideation & Scripting</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We craft compelling video concepts and write engaging scripts that convert viewers into customers.
                </p>
              </div>
            </div>

            {/* Video Editing */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="1" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Video Editing</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Professional video editing that keeps viewers engaged from start to finish.
                </p>
              </div>
            </div>

            {/* Thumbnail Design */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="2" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Thumbnail Design</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Eye-catching thumbnails that dramatically increase click-through rates.
                </p>
              </div>
            </div>

            {/* Content Strategy & SEO */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="3" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Content Strategy & SEO</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Strategic SEO optimization to ensure your videos rank high in search results.
                </p>
              </div>
            </div>

            {/* YouTube Funnel */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="4" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">YouTube Funnel</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Complete funnel optimization to convert viewers into customers.
                </p>
              </div>
            </div>

            {/* Lead Tracking & Analytics */}
            <div className="service-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 ease-out hover:scale-[1.02] relative overflow-hidden opacity-0" data-index="5" style={{ transform: 'translateY(50px)' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Premium Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lead Tracking & Analytics</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Comprehensive tracking and analytics to measure your success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-7xl mx-auto mb-48 mt-32 relative process-section">
          {/* Background glow effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="process-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              PROCESS
            </div>
            <h2 className="process-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Process</span>
            </h2>
            <p className="process-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              Our 4 step process breakdown for clients
            </p>
          </div>
          
          {/* Process Steps - Desktop Layout */}
          <div className="hidden lg:block relative mb-16 mt-8">
            <div className="grid grid-cols-4 gap-6 relative">
              {/* Step 1: Ideation & Planning */}
              <div className="process-step" data-step="1">
                {/* Number above card */}
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                  {/* Glassy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Premium Graphic */}
                    <div className="mb-6">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        {/* Growth Chart Graphic */}
                        <div className="absolute inset-0 flex items-end justify-center space-x-2 p-4">
                          <div className="w-6 h-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                          <div className="w-6 h-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                          <div className="w-6 h-16 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"></div>
                          <div className="w-6 h-20 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        </div>
                        <div className="absolute top-2 left-2 text-blue-400 text-xs font-bold">Growth</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Ideation & Planning</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Client goes through onboarding, then we hop on a discussion call. We'll give you scripts and ideas. So we expect the raw footages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Production */}
              <div className="process-step" data-step="2">
                {/* Number above card */}
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                  {/* Glassy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Premium Graphic */}
                    <div className="mb-6">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        {/* Video Editing Interface Graphic */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg relative">
                            <div className="w-12 h-6 bg-black/30 rounded flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 text-blue-400 text-xs font-bold">EDITING</div>
                        <div className="absolute bottom-2 right-2 text-cyan-400 text-xs font-bold">LIVE</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Production</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We handle the editing & thumbnail designing. You get revisions and distinct content style for you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Redistribution & Strategy */}
              <div className="process-step" data-step="3">
                {/* Number above card */}
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                  {/* Glassy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Premium Graphic */}
                    <div className="mb-6">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        {/* Line Chart Graphic */}
                        <div className="absolute inset-0 flex items-end justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 60">
                            <path d="M10 50 L25 40 L40 30 L55 20 L70 15 L85 10" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="85" cy="10" r="3" fill="#06b6d4"/>
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6"/>
                                <stop offset="100%" stopColor="#06b6d4"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className="absolute top-2 left-2 text-blue-400 text-xs font-bold">Strategy</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Redistribution & Strategy</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We post with SEO optimized & over multiple platforms with our strategy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: YouTube Funnel & Analytics */}
              <div className="process-step" data-step="4">
                {/* Number above card */}
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                  {/* Glassy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Premium Graphic */}
                    <div className="mb-6">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        {/* Website Funnel Graphic */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 text-blue-400 text-xs font-bold">FUNNEL</div>
                        <div className="absolute bottom-2 right-2 text-cyan-400 text-xs font-bold">10-30</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">YouTube Funnel & Analytics</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We design you a landing page for your service & track all the analytics to book you 10-30 appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Process Steps - Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden mb-16">
            {/* Step 1: Ideation & Planning */}
            <div className="process-step" data-step="1">
              {/* Number above card */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="w-full h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-center space-x-1 p-2">
                        <div className="w-4 h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        <div className="w-4 h-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        <div className="w-4 h-10 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"></div>
                        <div className="w-4 h-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                      </div>
                      <div className="absolute top-1 left-2 text-blue-400 text-xs font-bold">Growth</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Ideation & Planning</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Client goes through onboarding, then we hop on a discussion call. We'll give you scripts and ideas. So we expect the raw footages.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Production */}
            <div className="process-step" data-step="2">
              {/* Number above card */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="w-full h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <div className="w-6 h-4 bg-white/20 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      <div className="absolute top-1 left-2 text-blue-400 text-xs font-bold">RECORDING</div>
                      <div className="absolute bottom-1 right-2 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Production</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We handle the editing & thumbnail designing. You get revisions and distinct content style for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Redistribution & Strategy */}
            <div className="process-step" data-step="3">
              {/* Number above card */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="w-full h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 60">
                          <path d="M10 50 L25 40 L40 30 L55 20 L70 15 L85 10" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="85" cy="10" r="2" fill="#06b6d4"/>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6"/>
                              <stop offset="100%" stopColor="#06b6d4"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="absolute top-1 left-2 text-blue-400 text-xs font-bold">Strategy</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Redistribution & Strategy</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We post with SEO optimized & over multiple platforms with our strategy.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: YouTube Funnel & Analytics */}
            <div className="process-step" data-step="4">
              {/* Number above card */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center bg-gray-900/90 backdrop-blur-sm shadow-lg">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="w-full h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center space-x-1">
                        <div className="w-2 h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        <div className="w-2 h-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        <div className="w-2 h-4 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"></div>
                        <div className="w-2 h-7 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"></div>
                        <div className="w-2 h-9 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"></div>
                      </div>
                      <div className="absolute top-1 left-2 text-blue-400 text-xs font-bold">Analytics</div>
                      <div className="absolute bottom-1 right-2 text-cyan-400 text-xs font-bold">10-30</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">YouTube Funnel & Analytics</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We design you a landing page for your service & track all the analytics to book you 10-30 appointments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Feature Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-700/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">Weekly Calls</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-700/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">Quick Revision</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-700/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">Refund Guarantee</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-700/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">Quick Support</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a
              href="https://calendly.com/feltaditya/discovery-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black hover:bg-gray-900 text-white px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 hover:border-white/40 relative overflow-hidden group cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <span className="relative z-10">Book A Call</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
            </a>
          </div>
        </div>


        {/* Portfolio Section - Galaxy Theme */}
        <div id="portfolio" className="max-w-6xl mx-auto mb-32 mt-32 relative">
          {/* Galaxy Background Effects */}
          <div className="absolute -inset-24 bg-gradient-to-br from-violet-900/20 via-purple-900/25 to-fuchsia-900/20 rounded-3xl blur-3xl"></div>
          <div className="absolute -top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 via-violet-400/20 to-fuchsia-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-bl from-indigo-400/15 via-purple-400/20 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-violet-300/10 via-purple-300/15 to-fuchsia-300/10 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-pink-300/8 via-rose-300/12 to-orange-300/8 rounded-full blur-2xl"></div>
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-6 py-3 rounded-full mb-12 animate-slide-up-1 opacity-0 backdrop-blur-sm font-semibold">
              PORTFOLIO
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up-3 opacity-0">
              Our Finest Thumbnail with CTA, Psychology & Strategic Design
            </p>
          </div>

          {/* Portfolio Carousel */}
          <div className="relative mb-12">
            {/* Left Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            
            {/* Right Fade Effect */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            
            {/* Carousel Container */}
            <div className="flex overflow-hidden relative">
              <div className="flex transition-transform duration-500 ease-in-out" id="portfolio-carousel" ref={carouselRef} style={{ width: `${thumbnails.length * 100}%` }}>
                                {thumbnails.map((thumbnail, index) => (
                  <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-6">
                    <div className={`relative overflow-hidden shadow-lg bg-black group cursor-pointer transition-all duration-300 border-2 ${
                      index === currentSlide ? 'transform scale-105 shadow-2xl shadow-blue-500/20 border-blue-500' : 'transform scale-100 hover:scale-105 border-transparent hover:border-blue-500/50'
                    }`}>
                                            <div className="aspect-video relative">
                        {/* Loading State */}
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        
                        <img 
                          src={thumbnail} 
                          alt={`Portfolio Thumbnail ${index + 1}`} 
                          className="w-full h-full object-contain relative z-10"
                          loading="lazy"
                            onError={(e) => {
                              console.error(`Failed to load image: ${thumbnail}`);
                              const img = e.currentTarget;
                              img.style.display = 'none';
                              const fallback = img.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              console.log(`Successfully loaded: ${thumbnail}`);
                              const img = e.currentTarget;
                              const loader = img.previousElementSibling as HTMLElement;
                              if (loader) loader.style.display = 'none';
                            }}
                          />
                          
                          {/* Fallback for failed images */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center z-20" style={{ display: 'none' }}>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className="text-gray-400 text-sm">Image {index + 1}</p>
                            </div>
                          </div>
                        {/* Portfolio Image Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                          View
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-75 transition-all duration-200 z-10"
              onClick={() => navigateCarousel('prev')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-75 transition-all duration-200 z-10"
              onClick={() => navigateCarousel('next')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
            {thumbnails.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-30'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Portfolio section ends here */}
        </div>

        {/* Reel Showcase Section */}
        <ReelShowcase />

        {/* Long-form Section */}
        <LongFormShowcase />

        {/* Testimonials Section - Galaxy Theme (Portfolio) */}
        <div className="max-w-7xl mx-auto mb-48 mt-32 relative" id="testimonials">
          {/* Galaxy Background Effects - Same as Portfolio */}
          <div className="absolute -inset-24 bg-gradient-to-br from-violet-900/20 via-purple-900/25 to-fuchsia-900/20 rounded-3xl blur-3xl"></div>
          <div className="absolute -top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 via-violet-400/20 to-fuchsia-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-bl from-indigo-400/15 via-purple-400/20 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-violet-300/10 via-purple-300/15 to-fuchsia-300/10 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-pink-300/8 via-rose-300/12 to-orange-300/8 rounded-full blur-2xl"></div>
          
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="testimonials-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              TESTIMONIALS
            </div>
            <h2 className="testimonials-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              What our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">clients</span> say
            </h2>
            <p className="testimonials-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              Real results from real clients
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 - Smith Rees */}
            <div className="testimonial-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden opacity-0" style={{ transform: 'translateY(50px)', transitionDelay: '0ms' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Stars - Centered at top */}
                <div className="flex items-center justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-gray-300 text-base leading-relaxed mb-8 italic text-center font-medium">
                  "Adios studios really helped me to get bunch of clients for my dropshipping mentorship using their systems, Surely give it a try"
                </blockquote>
                
                {/* Client Info */}
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                    <img 
                      src="/smithrees.jpg" 
                      alt="Smith Rees" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-white font-semibold text-base">Smith Rees</h4>
                    <p className="text-gray-400 text-sm">YouTuber • 14.2K Subscribers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Alicia Joseph */}
            <div className="testimonial-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden opacity-0" style={{ transform: 'translateY(50px)', transitionDelay: '200ms' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Stars - Centered at top */}
                <div className="flex items-center justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-gray-300 text-base leading-relaxed mb-8 italic text-center font-medium">
                  "They are pretty good at what they do, For my paid community & mentorship were a game changer"
                </blockquote>
                
                {/* Client Info */}
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                    <img 
                      src="/alicia.jpg" 
                      alt="Alicia Joseph" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-white font-semibold text-base">Alicia Joseph</h4>
                    <p className="text-gray-400 text-sm">YouTuber • 18K Subscribers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Aryan Tripathi */}
            <div className="testimonial-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden opacity-0" style={{ transform: 'translateY(50px)', transitionDelay: '400ms' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Stars - Centered at top */}
                <div className="flex items-center justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-gray-300 text-base leading-relaxed mb-8 italic text-center font-medium">
                  "My marketing agency closed $50K in revenue, thanks to aditya and adios studios for the growth & leads"
                </blockquote>
                
                {/* Client Info */}
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                    <img 
                      src="/Aryan-Tripathi.webp" 
                      alt="Aryan Tripathi" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-white font-semibold text-base">Aryan Tripathi</h4>
                    <p className="text-gray-400 text-sm">Myzer Marketing • 100K+ Subscribers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="stats-card text-center opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)', transitionDelay: '600ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {callsBooked}+
              </div>
              <div className="text-gray-400 text-sm">Calls Booked</div>
            </div>
            <div className="stats-card text-center opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)', transitionDelay: '800ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {totalViews}K+
              </div>
              <div className="text-gray-400 text-sm">Total Views</div>
            </div>
            <div className="stats-card text-center opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)', transitionDelay: '1000ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {watchHours.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Watch Hours</div>
            </div>
          </div>

          {/* Satisfaction Banner */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              With a 100% Satisfaction Rate
            </div>
          </div>
        </div>

        {/* About Us Section - Process Theme */}
        <div className="max-w-6xl mx-auto mb-48 mt-32 relative" id="about">
          {/* Background glow effect - Same as Process */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="about-badge inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-6 py-3 rounded-full mb-12 backdrop-blur-sm font-semibold opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              ABOUT US
            </div>
            <h2 className="about-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Practice</span> what we preach
            </h2>
            <p className="about-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto opacity-0 transition-all duration-700 ease-out" style={{ transform: 'translateY(30px)' }}>
              Work with experts who acquire customers through YouTube
            </p>
          </div>
          
          {/* Single Founder & CEO Card - Centered */}
          <div className="flex justify-center mb-16">
            <div className="about-card bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden max-w-md w-full opacity-0" style={{ transform: 'translateY(50px)', transitionDelay: '400ms' }}>
              {/* Glassy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Profile Picture - Circular */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0 shadow-lg">
                    <img 
                      src="/adityachad.png" 
                      alt="Aditya" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-user.jpg";
                      }}
                    />
                  </div>
                </div>
                
                {/* Name and Title */}
                <div className="text-center mb-4">
                  <h3 className="text-white font-bold text-xl mb-1">Aditya</h3>
                  <p className="text-blue-400 text-sm font-medium">Founder & CEO</p>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 text-center">
                  Aditya is responsible for the overall vision and strategy. His expertise in YouTube marketing and content creation has helped numerous clients scale their businesses through strategic video content.
                </p>
                
                {/* YouTube Channel Link */}
                <div className="text-center">
                  <a
                    href="https://www.youtube.com/channel/UCyyIMc_ndyMDz8Cq8jv9Xug"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white hover:text-blue-400 transition-colors duration-300 text-sm font-medium"
                  >
                    Aditya's Channel
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                </div>
              </div>
            </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="https://calendly.com/feltaditya/discovery-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black hover:bg-gray-900 text-white px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 hover:border-white/40 relative overflow-hidden group cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <span className="relative z-10">Schedule a Meeting</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
            </a>
                  </div>
                </div>
                
        {/* FAQ Section - Blue Theme */}
        <div className="max-w-4xl mx-auto mb-48 mt-32 relative" id="faq">
          {/* Blue Background Effects */}
          <div className="absolute -inset-32 bg-gradient-to-br from-blue-900/15 via-indigo-900/20 to-cyan-900/15 rounded-3xl blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-cyan-400/15 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-bl from-cyan-400/10 via-blue-400/15 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-indigo-400/10 via-blue-400/15 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-bl from-blue-300/5 via-cyan-300/10 to-indigo-300/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-tr from-cyan-300/4 via-blue-300/8 to-indigo-300/4 rounded-full blur-2xl"></div>
          
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Questions</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              We've got the answers
            </p>
                </div>
                
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                onClick={(e) => {
                  const answer = e.currentTarget.nextElementSibling as HTMLElement;
                  const icon = e.currentTarget.querySelector('svg');
                  if (answer && icon) {
                    if (answer.style.display === 'block') {
                      answer.style.display = 'none';
                      icon.style.transform = 'rotate(0deg)';
                    } else {
                      answer.style.display = 'block';
                      icon.style.transform = 'rotate(45deg)';
                    }
                  }
                }}
              >
                <span className="text-blue-300 font-semibold text-lg">What do you offer?</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6h6" />
                  </svg>
                </div>
              </button>
              <div className="px-6 pb-4" style={{ display: 'none' }}>
                <p className="text-gray-300 leading-relaxed">
                  We offer a complete YouTube-to-sales-call system including: Long-form video editing (4-8/month), Shorts editing (12-16/month), Thumbnail design, Ideation & scripting, Content repurposing across platforms, SEO optimization, Funnel setup with landing pages, Analytics & reporting, and a growth system that books 10-15 qualified calls per month.
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                onClick={(e) => {
                  const answer = e.currentTarget.nextElementSibling as HTMLElement;
                  const icon = e.currentTarget.querySelector('svg');
                  if (answer && icon) {
                    if (answer.style.display === 'block') {
                      answer.style.display = 'none';
                      icon.style.transform = 'rotate(0deg)';
                    } else {
                      answer.style.display = 'block';
                      icon.style.transform = 'rotate(45deg)';
                    }
                  }
                }}
              >
                <span className="text-blue-300 font-semibold text-lg">How can we get started?</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6h6" />
                  </svg>
                </div>
              </button>
              <div className="px-6 pb-4" style={{ display: 'none' }}>
                <p className="text-gray-300 leading-relaxed">
                  Getting started is simple: 1) Book a discovery call to discuss your goals, 2) We'll create a custom content strategy for your niche, 3) You provide raw video content (4-8 long-form videos per month), 4) Our team handles everything from editing to publishing and call generation. The entire process is designed to be hands-off for you.
                </p>
                  </div>
                </div>
                
            {/* FAQ 3 */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                onClick={(e) => {
                  const answer = e.currentTarget.nextElementSibling as HTMLElement;
                  const icon = e.currentTarget.querySelector('svg');
                  if (answer && icon) {
                    if (answer.style.display === 'block') {
                      answer.style.display = 'none';
                      icon.style.transform = 'rotate(0deg)';
                    } else {
                      answer.style.display = 'block';
                      icon.style.transform = 'rotate(45deg)';
                    }
                  }
                }}
              >
                <span className="text-blue-300 font-semibold text-lg">What do I have to do on my end?</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6h6" />
                  </svg>
                </div>
              </button>
              <div className="px-6 pb-4" style={{ display: 'none' }}>
                <p className="text-gray-300 leading-relaxed">
                  Your role is minimal: Record 4-8 raw long-form videos per month (2-3 hours total), provide your brand kit and niche information, and show up for your booked calls. We handle everything else - editing, thumbnails, publishing, SEO, funnel setup, and call generation. You just focus on your expertise while we turn it into a sales machine.
                </p>
              </div>
                </div>
                

            {/* FAQ 4 */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                onClick={(e) => {
                  const answer = e.currentTarget.nextElementSibling as HTMLElement;
                  const icon = e.currentTarget.querySelector('svg');
                  if (answer && icon) {
                    if (answer.style.display === 'block') {
                      answer.style.display = 'none';
                      icon.style.transform = 'rotate(0deg)';
                    } else {
                      answer.style.display = 'block';
                      icon.style.transform = 'rotate(45deg)';
                    }
                  }
                }}
              >
                <span className="text-blue-300 font-semibold text-lg">What makes you different from other agencies?</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6h6" />
                  </svg>
                </div>
              </button>
              <div className="px-6 pb-4" style={{ display: 'none' }}>
                <p className="text-gray-300 leading-relaxed">
                  We're not just a video editing service - we're a complete YouTube-to-sales system. While others focus on views, we focus on booked calls and revenue. Our unique approach combines content strategy, SEO optimization, funnel setup, and active lead generation through comments and DMs. We guarantee results or you don't pay.
                </p>
            </div>
          </div>

            {/* FAQ 5 */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                onClick={(e) => {
                  const answer = e.currentTarget.nextElementSibling as HTMLElement;
                  const icon = e.currentTarget.querySelector('svg');
                  if (answer && icon) {
                    if (answer.style.display === 'block') {
                      answer.style.display = 'none';
                      icon.style.transform = 'rotate(0deg)';
                    } else {
                      answer.style.display = 'block';
                      icon.style.transform = 'rotate(45deg)';
                    }
                  }
                }}
              >
                <span className="text-blue-300 font-semibold text-lg">How do you guarantee 10-15 calls per month?</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6h6" />
                  </svg>
                </div>
              </button>
              <div className="px-6 pb-4" style={{ display: 'none' }}>
                <p className="text-gray-300 leading-relaxed">
                  Our system works through multiple channels: SEO-optimized content that ranks and attracts organic traffic, strategic CTAs in videos that drive to your funnel, active monitoring of comments and DMs to engage prospects, and a proven booking system that converts leads to calls. We track everything and optimize continuously to ensure consistent results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Site Footer */}
        <Footer />

        {/* Team Section removed per request */}
      </main>
    </div>
  )
}
