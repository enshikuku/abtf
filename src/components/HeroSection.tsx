import React from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from './RouterContext';
export function HeroSection() {
  const { navigateTo } = useRouter();
  return (
    <section
      id="home"
      className="relative min-h-[80vh] flex items-center pt-20">

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
          'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
        }}>

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
            "Transforming Agriculture Through Innovation"
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
            <button
              onClick={() => navigateTo('exhibitor-registration')}
              className="bg-maroon hover:bg-gold text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg text-lg flex items-center justify-center">

              Register as Exhibitor
            </button>
            <button
              onClick={() => navigateTo('sponsor-registration')}
              className="bg-maroon hover:bg-gold text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg text-lg flex items-center justify-center">

              Become a Sponsor
            </button>
          </div>
        </div>
      </div>
    </section>);

}