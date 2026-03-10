import React from 'react';
import { useRouter } from '../components/RouterContext';
export function BoothSelectionPage() {
  const { navigateTo } = useRouter();
  const sections = [
  {
    name: 'Machinery Booths',
    prefix: 'M',
    count: 8,
    price: 'KES 100,000'
  },
  {
    name: 'Crops Booths',
    prefix: 'C',
    count: 12,
    price: 'KES 50,000'
  },
  {
    name: 'Animal Booths',
    prefix: 'A',
    count: 10,
    price: 'KES 60,000'
  },
  {
    name: 'Food Booths',
    prefix: 'F',
    count: 12,
    price: 'KES 40,000'
  },
  {
    name: 'Sponsor Booths',
    prefix: 'S',
    count: 6,
    price: 'Included'
  }];

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
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-deepBlue font-poppins mb-4">
            Booth Selection
          </h1>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto mb-8">
            Select your preferred exhibition space from the available sections
            below.
          </p>

          <div className="flex justify-center items-center gap-6 bg-white py-4 px-8 rounded-full shadow-sm inline-flex border border-gray-200">
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

        <div className="space-y-16">
          {sections.map((section) =>
          <div
            key={section.name}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">

              <h2 className="text-2xl font-bold text-deepBlue font-poppins mb-6 pb-4 border-b border-gray-100">
                {section.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from(
                {
                  length: section.count
                },
                (_, i) => {
                  const id = `${section.prefix}-${(i + 1).toString().padStart(2, '0')}`;
                  let status = 'Available';
                  if (i % 4 === 0) status = 'Booked';else
                  if (i % 5 === 0) status = 'Reserved';
                  return (
                    <div
                      key={id}
                      className={`p-5 rounded-xl border-2 flex flex-col h-full ${status === 'Available' ? 'border-gray-200 hover:border-maroon hover:shadow-lg transition-all' : 'border-gray-100 bg-gray-50 opacity-75'}`}>

                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="font-bold text-deepBlue font-poppins text-xl block">
                              {id}
                            </span>
                            <span className="text-sm text-gray-500 font-inter">
                              {section.name.replace(' Booths', '')}
                            </span>
                          </div>
                          <span
                          className={`w-3 h-3 rounded-full ${getStatusDot(status)}`}>
                        </span>
                        </div>

                        <div className="mb-6">
                          <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${getStatusColor(status)}`}>

                            {status}
                          </span>
                          <p className="text-lg font-bold text-gray-800 font-inter">
                            {section.price}
                          </p>
                        </div>

                        <div className="mt-auto">
                          {status === 'Available' ?
                        <button
                          onClick={() => navigateTo('invoice-preview')}
                          className="w-full bg-maroon hover:bg-gold text-white font-semibold py-2.5 rounded-lg transition-colors duration-300">

                              Reserve Booth
                            </button> :

                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed">

                              Unavailable
                            </button>
                        }
                        </div>
                      </div>);

                }
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}