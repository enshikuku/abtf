import React from 'react';
import { useRouter } from './RouterContext';
export function RegistrationCTA() {
  const { navigateTo } = useRouter();
  return (
    <section className="relative py-20 bg-deepBlue overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse">

              <path
                d="M0 40L40 0H20L0 20M40 40V20L20 40"
                stroke="currentColor"
                strokeWidth="2"
                fill="none" />

            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid-pattern)"
            className="text-gold" />

        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white font-poppins mb-6">
          Become Part of the{' '}
          <span className="text-gold">Agri-Business Trade Fair</span>
        </h2>

        <p className="text-xl text-gray-300 font-inter mb-10 max-w-3xl mx-auto">
          Join thousands of industry professionals, researchers, and farmers in
          shaping the future of agriculture in Kenya and beyond.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigateTo('exhibitor-registration')}
            className="bg-maroon hover:bg-gold text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1">

            Register as Exhibitor
          </button>
          <button
            onClick={() => navigateTo('sponsor-registration')}
            className="bg-maroon hover:bg-gold text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1">

            Become a Sponsor
          </button>
        </div>
      </div>
    </section>);

}