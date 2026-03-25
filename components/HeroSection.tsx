"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { homepageHeroSlides } from "@/lib/site-images";

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % homepageHeroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[80vh] flex items-center pt-20"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {homepageHeroSlides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            style={{ objectPosition: slide.objectPosition || "center" }}
          />
        ))}
        <div className="absolute inset-0 bg-deepBlue/85 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-4xl">
          <div className="inline-block bg-gold/20 border border-gold/50 text-gold px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
            ANNUAL EVENT 2026
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-poppins leading-tight mb-6">
            University of Eldoret <br />
            <span className="text-gold">Agri-Business Trade Fair</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 font-inter italic mb-10 max-w-2xl">
            &ldquo;Transforming Agriculture Through Innovation&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <div className="flex items-center text-white bg-white/10 px-5 py-3 rounded-lg backdrop-blur-sm border border-white/20">
              <CalendarIcon className="h-6 w-6 text-gold mr-3" />
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                  Date
                </p>
                <p className="font-medium">September 24-26, 2026</p>
              </div>
            </div>

            <div className="flex items-center text-white bg-white/10 px-5 py-3 rounded-lg backdrop-blur-sm border border-white/20">
              <MapPinIcon className="h-6 w-6 text-gold mr-3" />
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                  Location
                </p>
                <p className="font-medium">
                  University of Eldoret, Main Campus
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register-exhibitor"
              className="bg-maroon hover:bg-gold text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg text-lg flex items-center justify-center"
            >
              Register as Exhibitor
            </Link>
            <Link
              href="/register-sponsor"
              className="bg-maroon hover:bg-gold text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg text-lg flex items-center justify-center"
            >
              Become a Sponsor
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2" aria-label="Hero slides">
            {homepageHeroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-gold" : "w-2.5 bg-white/60"
                  }`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
