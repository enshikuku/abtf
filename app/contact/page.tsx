"use client";

import { useRouter } from "next/navigation";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue font-poppins mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-1.5 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            Have questions about the Agri-Business Trade Fair? Get in touch with
            our organizing committee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-deepBlue font-poppins mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gold/10 p-3 rounded-lg mr-4">
                    <MapPinIcon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 font-inter mb-1">
                      Location
                    </h4>
                    <p className="text-gray-600 font-inter">
                      University of Eldoret, Main Campus
                      <br />
                      P.O. Box 1125-30100
                      <br />
                      Eldoret, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-maroon/10 p-3 rounded-lg mr-4">
                    <PhoneIcon className="w-6 h-6 text-maroon" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 font-inter mb-1">
                      Phone
                    </h4>
                    <p className="text-gray-600 font-inter">
                      +254 (0) 123 456 789
                      <br />
                      +254 (0) 987 654 321
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-deepBlue/10 p-3 rounded-lg mr-4">
                    <MailIcon className="w-6 h-6 text-deepBlue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 font-inter mb-1">
                      Email
                    </h4>
                    <p className="text-gray-600 font-inter">
                      tradefair@uoeld.ac.ke
                      <br />
                      info@uoeld.ac.ke
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-deepBlue font-poppins mb-8">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-maroon hover:bg-gold text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 font-inter text-lg shadow-md inline-flex items-center"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
