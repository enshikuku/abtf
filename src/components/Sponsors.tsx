import React from 'react';
export function Sponsors() {
  return (
    <section id="sponsors" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-4">
            Our Sponsors & Partners
          </h2>
          <div className="w-24 h-1.5 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            We are grateful for the support of our industry partners who make
            this event possible.
          </p>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gold font-poppins mb-8">
            Gold Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) =>
            <div
              key={`gold-${i}`}
              className="w-64 h-32 bg-gray-50 border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow">

                <div className="text-gray-400 font-inter font-medium text-lg">
                  Logo Placeholder
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-center text-gray-400 font-poppins mb-8">
            Silver Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) =>
            <div
              key={`silver-${i}`}
              className="w-48 h-24 bg-gray-50 border border-gray-100 rounded-lg shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow">

                <div className="text-gray-400 font-inter font-medium text-sm">
                  Logo Placeholder
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bronze Sponsors */}
        <div>
          <h3 className="text-lg font-bold text-center text-orange-700 font-poppins mb-8">
            Bronze Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) =>
            <div
              key={`bronze-${i}`}
              className="w-36 h-20 bg-gray-50 border border-gray-100 rounded-lg shadow-sm flex items-center justify-center p-3 hover:shadow-md transition-shadow">

                <div className="text-gray-400 font-inter font-medium text-xs">
                  Logo Placeholder
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="bg-transparent border-2 border-deepBlue text-deepBlue hover:bg-deepBlue hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Become a Sponsor
          </button>
        </div>
      </div>
    </section>);

}