import React from 'react';
import { useRouter } from './RouterContext';
export function BoothSelection() {
  const { navigateTo } = useRouter();
  // Generate dummy booth data
  const booths = Array.from(
    {
      length: 24
    },
    (_, i) => {
      const id = `A-${(i + 1).toString().padStart(2, '0')}`;
      let status: 'Available' | 'Reserved' | 'Booked';
      let price = 'KES 50,000';
      if (i % 5 === 0) status = 'Booked';else
      if (i % 7 === 0) status = 'Reserved';else
      status = 'Available';
      if (i === 0 || i === 5 || i === 18 || i === 23) {
        price = 'KES 75,000';
      }
      return {
        id,
        status,
        price
      };
    }
  );
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Reserved':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Booked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Reserved':
        return 'bg-orange-500';
      case 'Booked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return (
    <section id="booths" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-4">
            Booth Selection Preview
          </h2>
          <div className="w-24 h-1.5 bg-maroon mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto mb-8">
            Reserve your exhibition space today. Prime locations are allocated
            on a first-come, first-served basis.
          </p>

          <div className="flex justify-center items-center gap-6 mb-12">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-700">
                Available
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-700">
                Reserved
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-700">Booked</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-deepBlue font-poppins">
              Main Exhibition Hall
            </h3>
            <span className="text-sm text-gray-500 font-inter">
              Entrance &rarr;
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {booths.map((booth) =>
            <div
              key={booth.id}
              className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 flex flex-col h-32
                  ${booth.status === 'Available' ? 'bg-white border-gray-200' : ''}
                  ${booth.status === 'Reserved' ? 'bg-orange-50/50 border-orange-200' : ''}
                  ${booth.status === 'Booked' ? 'bg-gray-50 border-gray-200 opacity-60' : ''}
                `}>

                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-deepBlue font-poppins text-lg">
                    {booth.id}
                  </span>
                  <span
                  className={`w-2.5 h-2.5 rounded-full ${getStatusDot(booth.status)}`}>
                </span>
                </div>

                <div className="mt-auto">
                  <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${getStatusColor(booth.status)}`}>

                    {booth.status}
                  </span>
                  {booth.status !== 'Booked' &&
                <p className="text-sm font-semibold text-gray-700 font-inter">
                      {booth.price}
                    </p>
                }
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigateTo('booth-selection')}
              className="bg-maroon hover:bg-gold text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md">

              View All Booths & Book
            </button>
          </div>
        </div>
      </div>
    </section>);

}