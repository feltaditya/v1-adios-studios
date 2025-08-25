"use client";

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/navigation"
import VideoSection from "@/components/video-section"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"

// Load showcase sections immediately to avoid scroll-delayed rendering
import ReelShowcase from "@/components/ReelShowcase"
import LongFormShowcase from "@/components/LongFormShowcase"
import Footer from "@/components/Footer"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0); // Start with the first slide
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

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
      const servicesSection = document.querySelector('.services-section');
      if (!servicesSection) return;
      
      const sectionRect = servicesSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateCarouselPosition = () => {
      if (carouselRef.current) {
        // Calculate slide width based on responsive breakpoints
        let slidesVisible = 1; // mobile
        if (window.innerWidth >= 768) slidesVisible = 2; // tablet
        if (window.innerWidth >= 1024) slidesVisible = 3; // desktop
        
        const containerWidth = carouselRef.current.offsetWidth;
        const slideWidth = containerWidth / slidesVisible;
        const translateX = -(currentSlide * slideWidth);
        carouselRef.current.style.transform = `translateX(${translateX}px)`;
      }
    };

    updateCarouselPosition();
    
    // Add resize listener
    window.addEventListener('resize', updateCarouselPosition);
    
    return () => {
      window.removeEventListener('resize', updateCarouselPosition);
    };
  }, [currentSlide]);

  // Array of all thumbnail images
  const thumbnails = [
    '/t1.png', '/t2.png', '/t3.png', '/t4.png', '/t5.jpeg', '/t6.jpeg', '/t7.jpeg', '/t8.jpeg', 
    '/t9.jpeg', '/t10.jpeg', '/t11.jpeg', '/t12.jpeg', '/t13.jpeg', '/t14.jpeg', '/t15.jpeg', 
    '/t16.jpg', '/17.png'
  ];

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

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium font-heading mb-4 leading-tight tracking-wide">
            <div className="animate-slide-up-1">We build and scale your</div>
            <div className="animate-slide-up-2">
              <span className="text-blue-500">YouTube channel</span> for your business
            </div>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto animate-slide-up-3">
            Get high-quality, consistent YouTube content without spending hours creating videos. Grow your audience and close more deals.
          </p>
        </div>

        {/* Video Section */}
        <VideoSection />

        {/* CTA Button */}
        <div className="text-center mb-32">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white w-full sm:w-auto px-6 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/20 border-2 border-blue-400/20 hover:border-blue-400/40 animate-wiggle relative overflow-hidden group"
          >
            <span className="relative z-10">Free 30 mins strategy call with me</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          </Button>
        </div>

        {/* Services Section */}
        <div className="max-w-6xl mx-auto mb-48 services-section relative">
          {/* Background glow effect */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-16 backdrop-blur-sm">
              SERVICES
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium font-heading text-white mb-4 animate-slide-up-2 opacity-0">
              What services do we offer?
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 animate-slide-up-1 opacity-0">
              What exactly do we do?
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up-3 opacity-0">
            Complete YouTube channel management to grow your business
          </p>
          </div>
          
          <div className="mb-12"></div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 perspective-1000">
            {/* Ideation & Scripting */}
            <div className="service-card bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 ease-out transform-style-preserve-3d hover:scale-[1.02]" data-index="0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Ideation & Scripting</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We craft compelling video concepts and write engaging scripts that convert viewers into customers. Our strategic approach ensures every video serves your business goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Editing */}
            <div className="service-card bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 ease-out transform-style-preserve-3d hover:scale-[1.02]" data-index="1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Video Editing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Professional video editing that keeps viewers engaged from start to finish. We transform raw footage into polished, conversion-focused content that builds trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Designing */}
            <div className="service-card bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 ease-out transform-style-preserve-3d hover:scale-[1.02]" data-index="2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Thumbnail Designing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Eye-catching thumbnails that dramatically increase click-through rates. Our designs are optimized for maximum visibility and conversion across all devices.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="service-card bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 ease-out transform-style-preserve-3d hover:scale-[1.02]" data-index="3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">SEO Optimization</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Strategic SEO optimization to ensure your videos rank high in search results. We target the right keywords to attract qualified leads and grow your organic reach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-6xl mx-auto mb-48 mt-32 relative">
          {/* Background glow effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-6 animate-slide-up-1 opacity-0 backdrop-blur-sm">
              PROCESS
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium font-heading text-white mb-4 animate-slide-up-2 opacity-0">
              Our process
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up-3 opacity-0">
              You record videos - we take care of the rest
            </p>
          </div>
          
          <div className="mb-12"></div>

          {/* Desktop Process Flow Diagram (Hidden on Mobile) */}
          <div className="relative mb-16 hidden lg:block">
            {/* Horizontal Progress Bar */}
            <div className="absolute left-0 right-0 top-[60%] transform -translate-y-1/2 z-10">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full relative">
                {/* Progress Bar Dots */}
                <div className="absolute -top-1 left-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="absolute -top-1 right-0 w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* Process Nodes */}
            <div className="flex items-center justify-between relative z-20 px-4">
              {/* Client Node */}
              <div className="flex flex-col items-center animate-slide-up">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">He records</p>
                  <p className="text-white font-medium text-xs">& sends</p>
                </div>
              </div>

              {/* Ideation Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Ideation</p>
                </div>
              </div>

              {/* Scripting Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Scripting</p>
                </div>
              </div>

              {/* Adios Studios Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-3">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <div className="text-center">
                    <p className="text-black font-bold text-xs">ADIOS</p>
                    <p className="text-black font-bold text-xs">STUDIOS</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Thumbnail</p>
                </div>
              </div>

              {/* Video Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-5">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Video</p>
                </div>
              </div>

              {/* Send Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Send</p>
                </div>
              </div>

              {/* YouTube Upload Node */}
              <div className="flex flex-col items-center animate-slide-up-delay-7">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-xs">Upload to</p>
                  <p className="text-white font-medium text-xs">YouTube</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Process Steps - Card Layout (Hidden on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden mb-16">
            {/* Step 1: Onboarding and Strategy */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-3xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Onboarding & Strategy</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  You go through our comprehensive onboarding process and then book a personalized strategy call where we analyze your goals and create a custom action plan.
                </p>
              </div>
            </div>

            {/* Step 2: Ideation and Scripting */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-3xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ideation & Scripting</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  For each new video, we provide you with proven content ideas and professionally written scripts crafted by our expert copywriters to maximize engagement.
                </p>
              </div>
            </div>

            {/* Step 3: Content Production */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-3xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Content Production</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Our team handles professional video editing and eye-catching thumbnail design to ensure your content stands out and converts viewers into customers.
                </p>
              </div>
            </div>

            {/* Step 4: SEO & Algorithm */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-3xl">4</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">SEO & Algorithm</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  We push your videos with our proven KVS strategy and algorithm optimization techniques to maximize reach and drive consistent growth for your channel.
                </p>
              </div>
            </div>
          </div>

          {/* Support & Freebies Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Weekly Support Calls Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Weekly Support Calls</h3>
                <p className="text-gray-300 text-sm">Every 2 weeks for updates & changes</p>
              </div>
            </div>

            {/* Free Strategy Session Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Free Strategy Session</h3>
                <p className="text-gray-300 text-sm">30-minute consultation to plan your growth</p>
              </div>
            </div>

            {/* Content Templates Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Content Templates</h3>
                <p className="text-gray-300 text-sm">Proven templates to speed up creation</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/20 border-2 border-blue-400/20 hover:border-blue-400/40 animate-wiggle relative overflow-hidden group"
            >
              <span className="relative z-10">Book a free 30 min strategy</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </Button>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="max-w-6xl mx-auto mb-32 mt-32 relative">
          {/* Background glow effect */}
          <div className="absolute -top-32 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          {/* Header */}
          <div className="text-center mb-24 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-12 animate-slide-up-1 opacity-0 backdrop-blur-sm">
              PORTFOLIO
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium font-heading text-white mb-4 animate-slide-up-2 opacity-0">
              Portfolio
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up-3 opacity-0">
              Showcasing our best work and results for clients
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

        {/* Site Footer */}
        <Footer />

        {/* Team Section removed per request */}
      </main>
    </div>
  )
}
