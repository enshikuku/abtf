import React from 'react';
import {
  TractorIcon,
  SproutIcon,
  PawPrintIcon,
  FactoryIcon } from
'lucide-react';
import { useRouter } from './RouterContext';
export function ExhibitionCategories() {
  const { navigateTo } = useRouter();
  const categories = [
  {
    title: 'Agricultural Machinery',
    description:
    'Explore the latest tractors, harvesters, irrigation systems, and smart farming equipment.',
    icon: <TractorIcon className="h-10 w-10 text-white" />,
    color: 'bg-deepBlue'
  },
  {
    title: 'Crops and Seeds',
    description:
    'Discover high-yield seed varieties, fertilizers, pest control, and innovative crop management.',
    icon: <SproutIcon className="h-10 w-10 text-white" />,
    color: 'bg-deepBlue'
  },
  {
    title: 'Livestock & Animal Production',
    description:
    'Learn about animal health, nutrition, breeding technologies, and dairy processing.',
    icon: <PawPrintIcon className="h-10 w-10 text-white" />,
    color: 'bg-deepBlue'
  },
  {
    title: 'Food & Agro-processing',
    description:
    'Value addition technologies, packaging solutions, and post-harvest management systems.',
    icon: <FactoryIcon className="h-10 w-10 text-white" />,
    color: 'bg-deepBlue'
  }];

  return (
    <section id="exhibitors" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-4">
            Exhibition Categories
          </h2>
          <div className="w-24 h-1.5 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            Discover a wide range of agricultural products, services, and
            innovations across our specialized exhibition zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) =>
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">

              <div
              className={`${category.color} p-6 flex justify-center items-center transition-colors duration-300`}>

                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-deepBlue font-poppins mb-3 text-center">
                  {category.title}
                </h3>
                <p className="text-gray-600 font-inter text-center mb-6 flex-grow">
                  {category.description}
                </p>
                <button
                onClick={() => navigateTo('booth-selection')}
                className="w-full py-2.5 rounded-md text-white font-medium transition-colors duration-300 bg-maroon hover:bg-gold">

                  View Booths
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}