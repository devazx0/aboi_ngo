"use client";

import { useState, useEffect, useCallback, useRef, ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface HeroSlide {
  src: string;
  alt: string;
  badge?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: "/assets/standing_in_front_of_mosque.png",
    alt: "Community in front of Central Mosque Cotonou",
    badge: "Religious & Social Cohesion",
  },
  {
    src: "/assets/sharing_rice.png",
    alt: "Food distribution drive providing rice to families",
    badge: "Solidarity & Food Security",
  },
  {
    src: "/assets/water_tank.png",
    alt: "Clean water tank project in local village",
    badge: "Health & Environmental Sustainability",
  },
  {
    src: "/assets/prayer_2.png",
    alt: "Community gathering and prayer for peace",
    badge: "Spiritual Unity & Peace",
  },
  {
    src: "/assets/woman_with_food.png",
    alt: "Empowering women and assisting vulnerable families",
    badge: "Waqf & Community Empowerment",
  },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number; // in milliseconds
  children: ReactNode;
}

export function HeroSlider({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
  children,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, autoPlayInterval, nextSlide]);

  // Touch Swipe Handlers for mobile responsiveness
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-surface-dim select-none group focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Hero Carousel"
    >
      {/* Background Image Slides */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu ${
                isActive
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-105"
              }`}
              style={{
                transitionProperty: "opacity, transform",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                quality={90}
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
              {/* Multiplex Overlay Gradients for Optimum Contrast & Readability */}
              <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-primary/40 to-primary/60 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
            </div>
          );
        })}
      </div>

      {/* Slide Badge Pill (Top-right or centered above text) */}
      {slides[currentIndex]?.badge && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-surface-container-lowest bg-primary-container/80 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            {slides[currentIndex].badge}
          </span>
        </div>
      )}

      {/* Hero Content (Passed from page.tsx) */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Previous / Next Arrow Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/30 hover:bg-primary-container text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all transform hover:scale-110 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary-container"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/30 hover:bg-primary-container text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all transform hover:scale-110 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary-container"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Pagination Indicators & Auto-play Pause Toggle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-xl">
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="text-white/80 hover:text-white transition-colors focus:outline-none p-1"
        >
          {isPlaying && !isHovered ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden focus:outline-none ${
                  isActive
                    ? "w-8 bg-secondary-container"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              >
                {isActive && isPlaying && !isHovered && (
                  <span
                    className="absolute inset-0 bg-white/60 origin-left"
                    style={{
                      animation: `hero-progress ${autoPlayInterval}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono font-medium text-white/80 pl-1">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>
    </section>
  );
}
