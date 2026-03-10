import React from 'react';
import { useRouter } from '../components/RouterContext';
import { UploadIcon } from 'lucide-react';
export function SponsorRegistrationPage() {
  const { navigateTo } = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('home');
  };
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-deepBlue py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white font-poppins">
            Sponsor Registration
          </h1>
          <p className="text-gray-300 mt-2 font-inter">
            Partner with University of Eldoret
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                Website
              </label>
              <input
                required
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                placeholder="https://www.example.com" />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Company Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
              placeholder="Describe your company and sponsorship goals...">
            </textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Logo Upload (Required)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-maroon hover:text-gold focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      required />

                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 font-inter text-lg">

              Register as Sponsor
            </button>
          </div>
        </form>
      </div>
    </div>);

}