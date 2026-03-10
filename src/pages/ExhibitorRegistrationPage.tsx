import React from 'react';
import { useRouter } from '../components/RouterContext';
export function ExhibitorRegistrationPage() {
  const { navigateTo } = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('booth-selection');
  };
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-deepBlue py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white font-poppins">
            Exhibitor Registration
          </h1>
          <p className="text-gray-300 mt-2 font-inter">
            Join the Agri-Business Trade Fair 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                Company Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                placeholder="Enter company name" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                Contact Person
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                placeholder="Full name" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                Phone Number
              </label>
              <input
                required
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                placeholder="+254..." />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                placeholder="email@example.com" />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Exhibition Category
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white">

              <option value="">Select a category</option>
              <option value="machinery">Machinery</option>
              <option value="crops">Crops</option>
              <option value="animals">Animals</option>
              <option value="food">Food</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Business Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
              placeholder="Briefly describe your products/services...">
            </textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 font-inter text-lg">

              Register Exhibitor
            </button>
          </div>
        </form>
      </div>
    </div>);

}