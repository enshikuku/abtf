import React from 'react';
import { BookOpenIcon, FlaskConicalIcon, UsersIcon } from 'lucide-react';
export function AboutUniversity() {
  return (
    <section id="about-university" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-deepBlue/5 rounded-2xl transform -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="University Campus"
              className="relative rounded-2xl shadow-xl w-full h-[500px] object-cover" />

            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/University_of_Eldoret_logo.png/220px-University_of_Eldoret_logo.png"
                alt="UoE Logo"
                className="h-16 w-auto object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} />

            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-6">
              About University of Eldoret
            </h2>
            <div className="w-20 h-1.5 bg-maroon mb-8"></div>

            <p className="text-lg text-gray-700 font-inter mb-8 leading-relaxed">
              The University of Eldoret is a premier institution of higher
              learning in Kenya, renowned for its excellence in agriculture,
              science, and technology. We are committed to generating and
              disseminating knowledge that transforms lives and communities.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-deepBlue/10 rounded-lg flex items-center justify-center">
                    <FlaskConicalIcon className="h-6 w-6 text-deepBlue" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-deepBlue font-poppins mb-2">
                    Agricultural Research
                  </h3>
                  <p className="text-gray-600 font-inter">
                    Pioneering research in crop science, soil health, and
                    sustainable farming practices to ensure food security.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="h-6 w-6 text-maroon" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-deepBlue font-poppins mb-2">
                    Innovation & Technology
                  </h3>
                  <p className="text-gray-600 font-inter">
                    Developing smart agricultural technologies and agribusiness
                    models for the modern farmer.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-deepBlue font-poppins mb-2">
                    Community Engagement
                  </h3>
                  <p className="text-gray-600 font-inter">
                    Directly impacting local farming communities through
                    extension services and knowledge transfer programs.
                  </p>
                </div>
              </div>
            </div>

            <button className="bg-deepBlue hover:bg-maroon text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md">
              Visit University Website
            </button>
          </div>
        </div>
      </div>
    </section>);

}