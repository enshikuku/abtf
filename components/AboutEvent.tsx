import { CheckCircle2Icon } from "lucide-react";

export function AboutEvent() {
  const highlights = [
    "Agricultural innovation showcase",
    "Machinery and equipment demonstrations",
    "Crop and livestock exhibitions",
    "Agribusiness networking and partnerships",
    "Expert panel discussions and workshops",
    "Student research presentations",
  ];

  return (
    <section id="about-event" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-6">
              About the Trade Fair
            </h2>
            <div className="w-20 h-1.5 bg-gold mb-8"></div>

            <p className="text-lg text-gray-700 font-inter mb-6 leading-relaxed">
              The University of Eldoret Agri-Business Trade Fair is a premier
              annual event that brings together industry leaders, farmers,
              researchers, and students to showcase the latest advancements in
              agricultural technology and business practices.
            </p>

            <p className="text-lg text-gray-700 font-inter mb-8 leading-relaxed">
              Our mission is to bridge the gap between academic research and
              practical farming applications, fostering an environment where
              innovation thrives and sustainable agricultural solutions are
              developed for the future.
            </p>

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2Icon className="h-6 w-6 text-maroon mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium font-inter">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="text-maroon font-semibold hover:text-gold transition-colors flex items-center group">
                Download Event Brochure
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gold/10 rounded-2xl transform rotate-3"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Agricultural exhibition"
              className="relative rounded-2xl shadow-xl w-full h-[500px] object-cover"
            />

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -left-8 bg-deepBlue text-white p-6 rounded-xl shadow-2xl border border-white/10 hidden md:block">
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-gold font-poppins">
                    50+
                  </p>
                  <p className="text-sm text-gray-300 font-inter">Exhibitors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gold font-poppins">
                    10k+
                  </p>
                  <p className="text-sm text-gray-300 font-inter">Attendees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
